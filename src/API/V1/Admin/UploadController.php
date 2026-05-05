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
        $this->uploadsDir = $uploadsDir ?? dirname(__DIR__, 4) . '/public/uploads';
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
            $result    = $processor->process($file, ['aspect' => $aspect, 'prefix' => $prefix]);

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
}
