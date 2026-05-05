<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Admin;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;

final class AppearanceController
{
    /** GET /api/v1/admin/appearance */
    public function index(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT `key`, `value`, `kind`, `group`, label, sort_order, updated_at
               FROM appearance_settings
              ORDER BY `group` ASC, sort_order ASC'
        )->fetchAll();

        return ['status' => 'ok', 'data' => $rows];
    }

    /** PUT /api/v1/admin/appearance  body: { items: [{ key, value }, ...] } */
    public function bulkUpdate(Request $r): ?array
    {
        $items = $r->body['items'] ?? null;
        if (!is_array($items) || $items === []) {
            Response::error('Güncellenecek ayar gönderilmedi.', 422);
            return null;
        }

        $pdo  = Database::pdo();
        $stmt = $pdo->prepare(
            'UPDATE appearance_settings SET `value` = :v WHERE `key` = :k'
        );

        $count = 0;
        $pdo->beginTransaction();
        try {
            foreach ($items as $item) {
                if (!is_array($item) || !isset($item['key'], $item['value'])) {
                    continue;
                }
                $key   = (string) $item['key'];
                $value = trim((string) $item['value']);
                if ($value === '') {
                    continue;
                }
                $stmt->execute([':k' => $key, ':v' => $value]);
                if ($stmt->rowCount() > 0) {
                    $count++;
                }
            }
            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            Response::error('Görünüm güncellenemedi.', 500, ['detail' => $e->getMessage()]);
            return null;
        }

        return ['status' => 'ok', 'message' => "$count ayar güncellendi.", 'count' => $count];
    }
}
