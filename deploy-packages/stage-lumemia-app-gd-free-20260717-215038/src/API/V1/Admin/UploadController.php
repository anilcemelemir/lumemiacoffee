<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Admin;

use Lumemia\Http\Request;
use Lumemia\Http\Response;
use Lumemia\Media\ImageProcessor;
use Lumemia\Media\VideoProcessor;
use Throwable;

/**
 * Authenticated upload endpoints. Routes mounted under /api/v1/admin/uploads/*.
 *
 *   POST /api/v1/admin/uploads/image  (multipart/form-data; field "file"; opt "aspect"=1:1, "prefix")
 *   POST /api/v1/admin/uploads/video  (multipart/form-data; field "file"; opt "prefix")
 */
final class UploadController
{
    private string $uploadsDir;

    public function __construct(?string $uploadsDir = null)
    {
        $this->uploadsDir = $uploadsDir ?? $this->defaultUploadsDir();
    }

    public function image(Request $r): ?array
    {
        try {
            $file = $_FILES['file'] ?? null;
            if (!is_array($file)) {
                Response::error('Missing "file" field.', 400);
                return null;
            }

            $aspect = null;
            $rawAspect = (string) ($_POST['aspect'] ?? '');
            if ($rawAspect !== '' && preg_match('/^(\d+)\s*:\s*(\d+)$/', $rawAspect, $m)) {
                $aspect = [(int) $m[1], (int) $m[2]];
            }
            $prefix = (string) ($_POST['prefix'] ?? 'img');

            $processor = new ImageProcessor($this->uploadsDir);
            $options = ['aspect' => $aspect, 'prefix' => $prefix];
            $result = (string) ($_POST['processing'] ?? '') === 'browser-v1'
                ? $processor->storePreparedWebp($file, $options)
                : $processor->process($file, $options);

            return [
                'status' => 'ok',
                'data'   => $result,
            ];
        } catch (Throwable $e) {
            Response::error($e->getMessage(), 422);
            return null;
        }
    }

    public function video(Request $r): ?array
    {
        try {
            $file = $_FILES['file'] ?? null;
            if (!is_array($file)) {
                Response::error('Missing "file" field.', 400);
                return null;
            }
            $prefix    = (string) ($_POST['prefix'] ?? 'vid');
            $processor = new VideoProcessor($this->uploadsDir);
            $result    = $processor->process($file, $prefix);

            return [
                'status' => 'ok',
                'data'   => $result,
            ];
        } catch (Throwable $e) {
            Response::error($e->getMessage(), 422);
            return null;
        }
    }

    private function defaultUploadsDir(): string
    {
        $configured = trim((string) (getenv('LUMEMIA_UPLOADS_DIR') ?: ''));
        if ($configured !== '') {
            return $configured;
        }

        $appRoot = dirname(__DIR__, 4);
        $accountPublicHtml = dirname($appRoot) . '/public_html';
        if (is_dir($accountPublicHtml)) {
            return $accountPublicHtml . '/uploads';
        }

        return $appRoot . '/public/uploads';
    }
}
