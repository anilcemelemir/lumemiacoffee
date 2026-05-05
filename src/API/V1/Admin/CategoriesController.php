<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Admin;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;
use Lumemia\Support\Slug;
use PDOException;

final class CategoriesController
{
    /** GET /api/v1/admin/categories */
    public function index(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT id, name, slug, sort_order, created_at
               FROM categories
              ORDER BY sort_order ASC, name ASC'
        )->fetchAll();

        return [
            'status' => 'ok',
            'data'   => array_map(static fn (array $c): array => [
                'id'         => (int) $c['id'],
                'name'       => $c['name'],
                'slug'       => $c['slug'],
                'sort_order' => (int) $c['sort_order'],
                'created_at' => $c['created_at'],
            ], $rows),
        ];
    }

    /** POST /api/v1/admin/categories */
    public function create(Request $r): ?array
    {
        $name = trim((string) ($r->body['name'] ?? ''));
        if ($name === '') {
            Response::error('Kategori adı zorunludur.', 422);
            return null;
        }
        $slug      = Slug::make((string) ($r->body['slug'] ?? $name));
        $sortOrder = (int) ($r->body['sort_order'] ?? 0);

        try {
            $pdo  = Database::pdo();
            $stmt = $pdo->prepare(
                'INSERT INTO categories (name, slug, sort_order) VALUES (:n, :s, :o)'
            );
            $stmt->execute([':n' => $name, ':s' => $slug, ':o' => $sortOrder]);
            $id = (int) $pdo->lastInsertId();
        } catch (PDOException $e) {
            Response::error('Kategori oluşturulamadı (slug benzersiz olmalı).', 409, ['detail' => $e->getMessage()]);
            return null;
        }

        return ['status' => 'ok', 'message' => 'Kategori eklendi.', 'id' => $id];
    }

    /** PUT /api/v1/admin/categories/{id} */
    public function update(Request $r): ?array
    {
        $id = (int) ($r->params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Geçersiz kategori.', 404);
            return null;
        }

        $fields = [];
        $vals   = [':id' => $id];
        if (isset($r->body['name']))       { $fields[] = 'name = :n';        $vals[':n'] = (string) $r->body['name']; }
        if (isset($r->body['slug']))       { $fields[] = 'slug = :s';        $vals[':s'] = Slug::make((string) $r->body['slug']); }
        if (isset($r->body['sort_order'])) { $fields[] = 'sort_order = :o';  $vals[':o'] = (int) $r->body['sort_order']; }

        if ($fields === []) {
            Response::error('Güncellenecek alan bulunamadı.', 422);
            return null;
        }

        $sql = 'UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = :id';
        Database::pdo()->prepare($sql)->execute($vals);

        return ['status' => 'ok', 'message' => 'Kategori güncellendi.'];
    }

    /** DELETE /api/v1/admin/categories/{id} */
    public function delete(Request $r): ?array
    {
        $id = (int) ($r->params['id'] ?? 0);
        $stmt = Database::pdo()->prepare('DELETE FROM categories WHERE id = :id');
        $stmt->execute([':id' => $id]);

        if ($stmt->rowCount() === 0) {
            Response::error('Kategori bulunamadı.', 404);
            return null;
        }
        return ['status' => 'ok', 'message' => 'Kategori silindi.'];
    }
}
