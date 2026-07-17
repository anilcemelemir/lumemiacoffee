<?php

declare(strict_types=1);

namespace Lumemia\Media;

use RuntimeException;

/**
 * Image processing and prepared-WebP storage service.
 *
 * - Auto-converts every image to WebP (quality 82).
 * - Optionally smart-crops to a target aspect ratio (center crop) so 1:1
 *   thumbnails never look stretched.
 * - Otherwise resizes proportionally so width never exceeds $maxWidth.
 *
 * Returns the on-disk filename written under $uploadsDir.
 */
final class ImageProcessor
{
    public const QUALITY = 82;

    public function __construct(
        private readonly string $uploadsDir,
        private readonly int $maxWidth = 1600,
    ) {}

    /**
     * @param array{name:string,type:string,tmp_name:string,error:int,size:int} $file
     * @param array{aspect?: array{int,int}|null, prefix?: string} $opts
     * @return array{filename:string, url:string, width:int, height:int, bytes:int}
     */
    public function process(array $file, array $opts = []): array
    {
        $this->assertUpload($file);
        $mime = $this->detectMime($file['tmp_name']);
        $this->assertGdAvailable($mime);

        $src = $this->loadImage($file['tmp_name'], $mime);
        [$origW, $origH] = [imagesx($src), imagesy($src)];

        $aspect = $opts['aspect'] ?? null;
        if (is_array($aspect) && count($aspect) === 2 && $aspect[0] > 0 && $aspect[1] > 0) {
            $dst = $this->centerCrop($src, $origW, $origH, $aspect[0], $aspect[1]);
        } else {
            $dst = $this->fitWidth($src, $origW, $origH, $this->maxWidth);
        }
        imagedestroy($src);

        $prefix   = preg_replace('/[^a-z0-9_-]/i', '', (string) ($opts['prefix'] ?? 'img')) ?: 'img';
        $name     = sprintf('%s_%s_%s.webp', $prefix, date('Ymd_His'), bin2hex(random_bytes(4)));
        $fullPath = rtrim($this->uploadsDir, '/\\') . DIRECTORY_SEPARATOR . $name;

        if (!is_dir(dirname($fullPath)) && !mkdir($dir = dirname($fullPath), 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Could not create uploads directory.');
        }

        if (!imagewebp($dst, $fullPath, self::QUALITY)) {
            imagedestroy($dst);
            throw new RuntimeException('Failed to encode WebP.');
        }
        $w = imagesx($dst);
        $h = imagesy($dst);
        imagedestroy($dst);

        return [
            'filename' => $name,
            'url'      => '/uploads/' . $name,
            'width'    => $w,
            'height'   => $h,
            'bytes'    => filesize($fullPath) ?: 0,
        ];
    }

    /**
     * Stores a browser-processed WebP without invoking GD.
     *
     * @param array{name:string,type:string,tmp_name:string,error:int,size:int} $file
     * @param array{aspect?: array{int,int}|null, prefix?: string} $opts
     * @return array{filename:string, url:string, width:int, height:int, bytes:int}
     */
    public function storePreparedWebp(array $file, array $opts = []): array
    {
        $this->assertUpload($file);
        $mime = $this->detectMime($file['tmp_name']);
        if ($mime !== 'image/webp') {
            throw new RuntimeException('Browser-processed image must be a WebP file.');
        }

        $info = @getimagesize($file['tmp_name']);
        if (!is_array($info) || !isset($info[0], $info[1])) {
            throw new RuntimeException('Prepared WebP dimensions could not be read.');
        }

        $width = (int) $info[0];
        $height = (int) $info[1];
        if ($width < 1 || $height < 1 || $width > $this->maxWidth) {
            throw new RuntimeException('Prepared WebP dimensions are outside the allowed range.');
        }

        $aspect = $opts['aspect'] ?? null;
        if (is_array($aspect) && count($aspect) === 2 && $aspect[0] > 0 && $aspect[1] > 0) {
            $expectedHeight = (int) round($width / ($aspect[0] / $aspect[1]));
            if (abs($height - $expectedHeight) > 1) {
                throw new RuntimeException('Prepared WebP does not match the requested crop ratio.');
            }
        }

        $prefix = preg_replace('/[^a-z0-9_-]/i', '', (string) ($opts['prefix'] ?? 'img')) ?: 'img';
        $name = sprintf('%s_%s_%s.webp', $prefix, date('Ymd_His'), bin2hex(random_bytes(4)));
        $fullPath = rtrim($this->uploadsDir, '/\\') . DIRECTORY_SEPARATOR . $name;
        $directory = dirname($fullPath);

        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('Could not create uploads directory.');
        }

        $tmpPath = (string) $file['tmp_name'];
        $stored = is_uploaded_file($tmpPath)
            ? move_uploaded_file($tmpPath, $fullPath)
            : @rename($tmpPath, $fullPath);

        if (!$stored) {
            throw new RuntimeException('Prepared WebP could not be stored.');
        }

        @chmod($fullPath, 0644);

        return [
            'filename' => $name,
            'url'      => '/uploads/' . $name,
            'width'    => $width,
            'height'   => $height,
            'bytes'    => filesize($fullPath) ?: 0,
        ];
    }

    /**
     * Resize source so width === $targetWidth (only when smaller is needed),
     * preserving aspect ratio. Returns a new GD resource.
     */
    private function fitWidth(\GdImage $src, int $w, int $h, int $targetWidth): \GdImage
    {
        if ($w <= $targetWidth) {
            // Re-render anyway so output is a cleanly truecolor canvas.
            $copy = imagecreatetruecolor($w, $h);
            $this->preserveTransparency($copy);
            imagecopy($copy, $src, 0, 0, 0, 0, $w, $h);
            return $copy;
        }
        $newW = $targetWidth;
        $newH = (int) round($h * ($targetWidth / $w));
        $dst  = imagecreatetruecolor($newW, $newH);
        $this->preserveTransparency($dst);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $w, $h);
        return $dst;
    }

    /**
     * Smart center-crop so the source fills the target aspect ratio without distortion.
     * Output width is capped at $this->maxWidth.
     */
    private function centerCrop(\GdImage $src, int $w, int $h, int $aspectW, int $aspectH): \GdImage
    {
        $targetRatio = $aspectW / $aspectH;
        $srcRatio    = $w / $h;

        if ($srcRatio > $targetRatio) {
            // Source is too wide → crop sides
            $cropH = $h;
            $cropW = (int) round($h * $targetRatio);
            $cropX = (int) round(($w - $cropW) / 2);
            $cropY = 0;
        } else {
            // Source is too tall → crop top/bottom
            $cropW = $w;
            $cropH = (int) round($w / $targetRatio);
            $cropX = 0;
            $cropY = (int) round(($h - $cropH) / 2);
        }

        $outW = min($cropW, $this->maxWidth);
        $outH = (int) round($outW / $targetRatio);
        $dst  = imagecreatetruecolor($outW, $outH);
        $this->preserveTransparency($dst);
        imagecopyresampled($dst, $src, 0, 0, $cropX, $cropY, $outW, $outH, $cropW, $cropH);
        return $dst;
    }

    private function preserveTransparency(\GdImage $img): void
    {
        imagealphablending($img, false);
        imagesavealpha($img, true);
        $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
        if ($transparent !== false) {
            imagefilledrectangle($img, 0, 0, imagesx($img) - 1, imagesy($img) - 1, $transparent);
        }
        imagealphablending($img, true);
    }

    private function loadImage(string $path, string $mime): \GdImage
    {
        $mime = strtolower($mime);
        $img  = match (true) {
            ($mime === 'image/jpeg' || $mime === 'image/jpg') && \function_exists('imagecreatefromjpeg') => @\imagecreatefromjpeg($path),
            $mime === 'image/png' && \function_exists('imagecreatefrompng')                              => @\imagecreatefrompng($path),
            $mime === 'image/webp' && \function_exists('imagecreatefromwebp')                            => @\imagecreatefromwebp($path),
            $mime === 'image/gif' && \function_exists('imagecreatefromgif')                              => @\imagecreatefromgif($path),
            default                                                                                    => false,
        };
        if (!$img instanceof \GdImage && \function_exists('imagecreatefromstring')) {
            // Fall back to extension sniffing
            $img = @\imagecreatefromstring((string) file_get_contents($path));
        }
        if (!$img instanceof \GdImage) {
            throw new RuntimeException(
                'Image could not be decoded. Detected MIME: ' . $mime . '. ' . $this->gdDiagnostics()
            );
        }
        return $img;
    }

    private function detectMime(string $path): string
    {
        $info = @getimagesize($path);
        if (is_array($info) && isset($info['mime'])) {
            return strtolower((string) $info['mime']);
        }

        if (\function_exists('finfo_open')) {
            $finfo = @finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo !== false) {
                $mime = @finfo_file($finfo, $path);
                @finfo_close($finfo);
                if (is_string($mime) && $mime !== '') {
                    return strtolower($mime);
                }
            }
        }

        throw new RuntimeException('Unsupported or corrupt image.');
    }

    private function assertGdAvailable(string $mime): void
    {
        if (!\extension_loaded('gd')) {
            throw new RuntimeException('PHP GD extension is not loaded.');
        }
        if (!\function_exists('imagewebp')) {
            throw new RuntimeException('PHP GD WebP output support is not enabled.');
        }

        $needs = match (true) {
            $mime === 'image/jpeg' || $mime === 'image/jpg' => 'imagecreatefromjpeg',
            $mime === 'image/png'                           => 'imagecreatefrompng',
            $mime === 'image/webp'                          => 'imagecreatefromwebp',
            $mime === 'image/gif'                           => 'imagecreatefromgif',
            default                                         => null,
        };

        if ($needs === null || !\function_exists($needs)) {
            throw new RuntimeException('PHP GD does not support this image type. Detected MIME: ' . $mime . '. ' . $this->gdDiagnostics());
        }
    }

    private function gdDiagnostics(): string
    {
        return sprintf(
            'GD loaded: %s; jpeg: %s; png: %s; webp read: %s; webp write: %s; imagecreatefromstring: %s.',
            \extension_loaded('gd') ? 'yes' : 'no',
            \function_exists('imagecreatefromjpeg') ? 'yes' : 'no',
            \function_exists('imagecreatefrompng') ? 'yes' : 'no',
            \function_exists('imagecreatefromwebp') ? 'yes' : 'no',
            \function_exists('imagewebp') ? 'yes' : 'no',
            \function_exists('imagecreatefromstring') ? 'yes' : 'no',
        );
    }

    /** @param array{error:int,size:int,tmp_name:string,type:string} $file */
    private function assertUpload(array $file): void
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new RuntimeException('Upload failed (error code ' . ($file['error'] ?? -1) . ').');
        }
        if (!is_uploaded_file($file['tmp_name']) && !is_file($file['tmp_name'])) {
            throw new RuntimeException('Temp file is missing.');
        }
        if (($file['size'] ?? 0) > 16 * 1024 * 1024) {
            throw new RuntimeException('Image exceeds 16 MB.');
        }
        $allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array(strtolower($file['type'] ?? ''), $allowed, true)) {
            // Probe via getimagesize as a defensive fallback
            $info = @getimagesize($file['tmp_name']);
            if (!$info || !in_array(strtolower((string) $info['mime']), $allowed, true)) {
                throw new RuntimeException('Unsupported image type.');
            }
        }
    }
}
