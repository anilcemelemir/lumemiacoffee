<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Admin;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;

/**
 * Admin controller for SEO & Analytics settings.
 *
 * GET  /api/v1/admin/seo   → list all settings
 * PUT  /api/v1/admin/seo   → bulk-update settings
 */
final class SeoController
{
    /** GET /api/v1/admin/seo */
    public function index(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT `key`, `value`, updated_at FROM seo_settings ORDER BY `key` ASC'
        )->fetchAll();

        return [
            'status' => 'ok',
            'data'   => array_map(static fn(array $row): array => [
                'key'        => $row['key'],
                'value'      => $row['value'],
                'updated_at' => $row['updated_at'],
            ], $rows),
        ];
    }

    /** PUT /api/v1/admin/seo   body: { items: [{ key, value }, ...] } */
    public function bulkUpdate(Request $r): ?array
    {
        $items = $r->body['items'] ?? null;
        if (!is_array($items) || $items === []) {
            Response::error('Güncellenecek ayar gönderilmedi.', 422);
            return null;
        }

        $pdo  = Database::pdo();
        $stmt = $pdo->prepare(
            'INSERT INTO seo_settings (`key`, `value`)
                  VALUES (:k, :v)
             ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)'
        );

        $count = 0;
        $pdo->beginTransaction();
        try {
            foreach ($items as $item) {
                if (!is_array($item) || !isset($item['key'])) {
                    continue;
                }
                $key   = (string) $item['key'];
                $value = isset($item['value']) ? (string) $item['value'] : null;

                $stmt->execute([':k' => $key, ':v' => $value]);
                $count++;
            }
            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            Response::error('SEO ayarları güncellenemedi.', 500, ['detail' => $e->getMessage()]);
            return null;
        }

        return ['status' => 'ok', 'message' => "$count SEO ayarı güncellendi.", 'count' => $count];
    }
}
