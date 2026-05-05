<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Controllers;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use PDO;

final class MenuController
{
    /**
     * GET /api/v1/menu
     *
     * Returns all available products grouped by category in a nested
     * structure suitable for direct rendering on web or mobile clients.
     */
    public function __invoke(Request $request): array
    {
        $pdo = Database::pdo();

        $categories = $pdo->query(
            'SELECT id, name, slug, sort_order
               FROM categories
              ORDER BY sort_order ASC, name ASC'
        )->fetchAll();

        $products = $pdo->query(
            "SELECT id, category_id, name, slug, description,
                    CAST(price AS DECIMAL(10,2)) AS price,
                    currency, image_url, video_url, is_featured, sort_order
               FROM products
              WHERE is_available = 1
              ORDER BY is_featured DESC, sort_order ASC, name ASC"
        )->fetchAll();

        // Group products by category id
        $grouped = [];
        foreach ($products as $p) {
            $cid = (int) $p['category_id'];
            unset($p['category_id']);

            $p['id']          = (int) $p['id'];
            $p['price']       = (float) $p['price'];
            $p['is_featured'] = (bool) $p['is_featured'];

            $grouped[$cid][] = $p;
        }

        $payload = array_map(static function (array $cat) use ($grouped): array {
            $cid = (int) $cat['id'];
            return [
                'id'       => $cid,
                'name'     => $cat['name'],
                'slug'     => $cat['slug'],
                'products' => $grouped[$cid] ?? [],
            ];
        }, $categories);

        return [
            'status'     => 'ok',
            'count'      => array_sum(array_map(static fn (array $c): int => count($c['products']), $payload)),
            'categories' => $payload,
        ];
    }
}
