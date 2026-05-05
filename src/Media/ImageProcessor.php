<?php

declare(strict_types=1);

namespace Lumemia\Media;

use RuntimeException;

/**
 * Image processing service backed by GD.
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

        $src = $this->loadImage($file['tmp_name'], $file['type']);
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
            $mime === 'image/jpeg' || $mime === 'image/jpg' => @imagecreatefromjpeg($path),
            $mime === 'image/png'                            => @imagecreatefrompng($path),
            $mime === 'image/webp'                           => @imagecreatefromwebp($path),
            $mime === 'image/gif'                            => @imagecreatefromgif($path),
            default                                          => false,
        };
        if (!$img instanceof \GdImage) {
            // Fall back to extension sniffing
            $img = @imagecreatefromstring((string) file_get_contents($path));
        }
        if (!$img instanceof \GdImage) {
            throw new RuntimeException('Unsupported or corrupt image.');
        }
        return $img;
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
