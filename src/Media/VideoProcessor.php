<?php

declare(strict_types=1);

namespace Lumemia\Media;

use RuntimeException;

/**
 * Stores short looping product videos (cinemagraph style) without re-encoding.
 * Validation only: extension, mime, size cap.
 */
final class VideoProcessor
{
    public const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

    /** @var list<string> */
    private const ALLOWED_MIMES = ['video/mp4', 'video/webm', 'video/quicktime'];
    /** @var list<string> */
    private const ALLOWED_EXTS  = ['mp4', 'webm', 'mov'];

    public function __construct(private readonly string $uploadsDir) {}

    /**
     * @param array{name:string,type:string,tmp_name:string,error:int,size:int} $file
     * @return array{filename:string, url:string, bytes:int}
     */
    public function process(array $file, string $prefix = 'vid'): array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new RuntimeException('Upload failed (error code ' . ($file['error'] ?? -1) . ').');
        }
        $size = (int) ($file['size'] ?? 0);
        if ($size <= 0 || $size > self::MAX_BYTES) {
            throw new RuntimeException('Video must be > 0 and ≤ 10 MB.');
        }

        $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        $ext = $ext === 'qt' ? 'mov' : $ext;
        if (!in_array($ext, self::ALLOWED_EXTS, true)) {
            throw new RuntimeException('Unsupported video extension.');
        }

        $mime = strtolower((string) ($file['type'] ?? ''));
        if ($mime !== '' && !in_array($mime, self::ALLOWED_MIMES, true)) {
            throw new RuntimeException('Unsupported video MIME type.');
        }

        $prefix   = preg_replace('/[^a-z0-9_-]/i', '', $prefix) ?: 'vid';
        $name     = sprintf('%s_%s_%s.%s', $prefix, date('Ymd_His'), bin2hex(random_bytes(4)), $ext);
        $fullPath = rtrim($this->uploadsDir, '/\\') . DIRECTORY_SEPARATOR . $name;

        if (!is_dir(dirname($fullPath)) && !mkdir($dir = dirname($fullPath), 0775, true) && !is_dir($dir)) {
            throw new RuntimeException('Could not create uploads directory.');
        }

        if (!@move_uploaded_file($file['tmp_name'], $fullPath)) {
            // Fallback for non-HTTP test fixtures
            if (!@rename($file['tmp_name'], $fullPath)) {
                throw new RuntimeException('Failed to persist uploaded video.');
            }
        }

        return [
            'filename' => $name,
            'url'      => '/uploads/' . $name,
            'bytes'    => filesize($fullPath) ?: 0,
        ];
    }
}
