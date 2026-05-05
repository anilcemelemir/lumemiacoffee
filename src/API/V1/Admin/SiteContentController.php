<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Admin;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;
use Lumemia\Support\HtmlSanitizer;

final class SiteContentController
{
    /** GET /api/v1/admin/content */
    public function index(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT `key`, value_tr, `group`, label, updated_at
               FROM site_content
              ORDER BY `group` ASC, `key` ASC'
        )->fetchAll();

        return [
            'status' => 'ok',
            'data'   => array_map(static fn (array $c): array => [
                'key'        => $c['key'],
                'value'      => $c['value_tr'],
                'group'      => $c['group'],
                'label'      => $c['label'],
                'updated_at' => $c['updated_at'],
            ], $rows),
        ];
    }

    /** PUT /api/v1/admin/content   body: { items: [{ key, value }, ...] } */
    public function bulkUpdate(Request $r): ?array
    {
        $items = $r->body['items'] ?? null;
        if (!is_array($items) || $items === []) {
            Response::error('Güncellenecek içerik gönderilmedi.', 422);
            return null;
        }

        $pdo  = Database::pdo();
        $stmt = $pdo->prepare(
            'INSERT INTO site_content (`key`, value_tr, `group`, label)
                  VALUES (:k, :v, :g, :l)
             ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr)'
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

                // Sanitize HTML for any rich-text key (suffix `_html`).
                if ($value !== null && str_ends_with($key, '_html')) {
                    $value = HtmlSanitizer::clean($value);
                }

                $stmt->execute([
                    ':k' => $key,
                    ':v' => $value,
                    ':g' => (string) ($item['group'] ?? 'general'),
                    ':l' => isset($item['label']) ? (string) $item['label'] : null,
                ]);
                $count++;
            }
            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            Response::error('İçerik güncellenemedi.', 500, ['detail' => $e->getMessage()]);
            return null;
        }

        return ['status' => 'ok', 'message' => "$count içerik güncellendi.", 'count' => $count];
    }

    /** DELETE /api/v1/admin/content/{key} */
    public function delete(Request $r): ?array
    {
        $key = (string) ($r->params['key'] ?? '');
        if ($key === '') {
            Response::error('Anahtar gerekli.', 422);
            return null;
        }
        $stmt = Database::pdo()->prepare('DELETE FROM site_content WHERE `key` = :k');
        $stmt->execute([':k' => $key]);
        if ($stmt->rowCount() === 0) {
            Response::error('İçerik bulunamadı.', 404);
            return null;
        }
        return ['status' => 'ok', 'message' => 'İçerik silindi.'];
    }
}
