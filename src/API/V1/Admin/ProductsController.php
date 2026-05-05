<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Admin;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;
use Lumemia\Support\Slug;
use PDOException;

final class ProductsController
{
    /** GET /api/v1/admin/products */
    public function index(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT p.id, p.category_id, c.name AS category_name,
                    p.name, p.slug, p.description,
                    CAST(p.price AS DECIMAL(10,2)) AS price, p.currency,
                    p.image_url, p.video_url,
                    p.is_available, p.is_featured, p.sort_order,
                    p.created_at, p.updated_at
               FROM products p
               JOIN categories c ON c.id = p.category_id
              ORDER BY c.sort_order ASC, p.is_featured DESC, p.sort_order ASC, p.name ASC'
        )->fetchAll();

        return [
            'status' => 'ok',
            'data'   => array_map(static fn (array $p): array => [
                'id'            => (int) $p['id'],
                'category_id'   => (int) $p['category_id'],
                'category_name' => $p['category_name'],
                'name'          => $p['name'],
                'slug'          => $p['slug'],
                'description'   => $p['description'],
                'price'         => (float) $p['price'],
                'currency'      => $p['currency'],
                'image_url'     => $p['image_url'],
                'video_url'     => $p['video_url'],
                'is_available'  => (bool) $p['is_available'],
                'is_featured'   => (bool) $p['is_featured'],
                'sort_order'    => (int) $p['sort_order'],
                'created_at'    => $p['created_at'],
                'updated_at'    => $p['updated_at'],
            ], $rows),
        ];
    }

    /** POST /api/v1/admin/products */
    public function create(Request $r): ?array
    {
        $b = $r->body ?? [];
        $name        = trim((string) ($b['name'] ?? ''));
        $categoryId  = (int) ($b['category_id'] ?? 0);

        if ($name === '' || $categoryId <= 0) {
            Response::error('Ürün adı ve kategori zorunludur.', 422);
            return null;
        }

        $payload = $this->buildPayload($b, $name);
        $payload[':cat'] = $categoryId;

        try {
            $pdo = Database::pdo();
            $sql = 'INSERT INTO products
                    (category_id, name, slug, description, price, currency, image_url, video_url, is_available, is_featured, sort_order)
                    VALUES (:cat, :name, :slug, :desc, :price, :cur, :img, :vid, :avail, :feat, :sort)';
            $pdo->prepare($sql)->execute($payload);
            return ['status' => 'ok', 'message' => 'Ürün eklendi.', 'id' => (int) $pdo->lastInsertId()];
        } catch (PDOException $e) {
            Response::error('Ürün eklenemedi (slug benzersiz olmalı).', 409, ['detail' => $e->getMessage()]);
            return null;
        }
    }

    /** PUT /api/v1/admin/products/{id} */
    public function update(Request $r): ?array
    {
        $id = (int) ($r->params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Geçersiz ürün.', 404);
            return null;
        }

        $b = $r->body ?? [];
        $fields = [];
        $vals   = [':id' => $id];

        $map = [
            'category_id'  => [':cat',   fn ($v) => (int) $v],
            'name'         => [':name',  fn ($v) => (string) $v],
            'slug'         => [':slug',  fn ($v) => Slug::make((string) $v)],
            'description'  => [':desc',  fn ($v) => $v === null ? null : (string) $v],
            'price'        => [':price', fn ($v) => (float) $v],
            'currency'     => [':cur',   fn ($v) => strtoupper(substr((string) $v, 0, 3))],
            'image_url'    => [':img',   fn ($v) => $v === null ? null : (string) $v],
            'video_url'    => [':vid',   fn ($v) => $v === null || $v === '' ? null : (string) $v],
            'is_available' => [':avail', fn ($v) => (int) (bool) $v],
            'is_featured'  => [':feat',  fn ($v) => (int) (bool) $v],
            'sort_order'   => [':sort',  fn ($v) => (int) $v],
        ];

        $colMap = [
            'category_id' => 'category_id', 'name' => 'name', 'slug' => 'slug',
            'description' => 'description', 'price' => 'price', 'currency' => 'currency',
            'image_url' => 'image_url', 'video_url' => 'video_url',
            'is_available' => 'is_available', 'is_featured' => 'is_featured',
            'sort_order' => 'sort_order',
        ];

        foreach ($map as $key => [$ph, $cast]) {
            if (array_key_exists($key, $b)) {
                $fields[]   = $colMap[$key] . " = $ph";
                $vals[$ph]  = $cast($b[$key]);
            }
        }

        if ($fields === []) {
            Response::error('Güncellenecek alan bulunamadı.', 422);
            return null;
        }

        try {
            $sql = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = :id';
            Database::pdo()->prepare($sql)->execute($vals);
        } catch (PDOException $e) {
            Response::error('Ürün güncellenemedi.', 409, ['detail' => $e->getMessage()]);
            return null;
        }

        return ['status' => 'ok', 'message' => 'Ürün güncellendi.'];
    }

    /** DELETE /api/v1/admin/products/{id} */
    public function delete(Request $r): ?array
    {
        $id = (int) ($r->params['id'] ?? 0);
        $stmt = Database::pdo()->prepare('DELETE FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);

        if ($stmt->rowCount() === 0) {
            Response::error('Ürün bulunamadı.', 404);
            return null;
        }
        return ['status' => 'ok', 'message' => 'Ürün silindi.'];
    }

    /**
     * @param array<string,mixed> $b
     * @return array<string,mixed>
     */
    private function buildPayload(array $b, string $name): array
    {
        return [
            ':name'  => $name,
            ':slug'  => Slug::make((string) ($b['slug'] ?? $name)),
            ':desc'  => isset($b['description']) ? (string) $b['description'] : null,
            ':price' => (float) ($b['price'] ?? 0),
            ':cur'   => strtoupper(substr((string) ($b['currency'] ?? 'TRY'), 0, 3)),
            ':img'   => isset($b['image_url']) && $b['image_url'] !== '' ? (string) $b['image_url'] : null,
            ':vid'   => isset($b['video_url']) && $b['video_url'] !== '' ? (string) $b['video_url'] : null,
            ':avail' => (int) (bool) ($b['is_available'] ?? true),
            ':feat'  => (int) (bool) ($b['is_featured'] ?? false),
            ':sort'  => (int) ($b['sort_order'] ?? 0),
        ];
    }
}
