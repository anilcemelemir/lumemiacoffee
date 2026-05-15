<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Admin;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;

final class SubmissionsController
{
    /** GET /api/v1/admin/newsletter-subscribers */
    public function subscribers(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT id, email, source, is_active, ip_address, user_agent, created_at, updated_at
               FROM newsletter_subscribers
              ORDER BY created_at DESC'
        )->fetchAll();

        return [
            'status' => 'ok',
            'data' => array_map(static fn (array $row): array => [
                'id' => (int) $row['id'],
                'email' => $row['email'],
                'source' => $row['source'],
                'is_active' => (bool) $row['is_active'],
                'ip_address' => $row['ip_address'],
                'user_agent' => $row['user_agent'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ], $rows),
        ];
    }

    /** GET /api/v1/admin/contact-messages */
    public function messages(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT id, name, email, message, status, consent, ip_address, user_agent, created_at, updated_at
               FROM contact_messages
              ORDER BY created_at DESC'
        )->fetchAll();

        return [
            'status' => 'ok',
            'data' => array_map(static fn (array $row): array => [
                'id' => (int) $row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'message' => $row['message'],
                'status' => $row['status'],
                'consent' => (bool) $row['consent'],
                'ip_address' => $row['ip_address'],
                'user_agent' => $row['user_agent'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ], $rows),
        ];
    }

    /** PATCH /api/v1/admin/contact-messages/{id} */
    public function updateMessage(Request $r): ?array
    {
        $id = (int) ($r->params['id'] ?? 0);
        $status = (string) (($r->body ?? [])['status'] ?? '');
        if ($id <= 0 || !in_array($status, ['new', 'read', 'archived'], true)) {
            Response::error('Geçersiz mesaj durumu.', 422);
            return null;
        }

        $stmt = Database::pdo()->prepare('UPDATE contact_messages SET status = :status WHERE id = :id');
        $stmt->execute([':status' => $status, ':id' => $id]);
        if ($stmt->rowCount() === 0) {
            Response::error('Mesaj bulunamadı.', 404);
            return null;
        }

        return ['status' => 'ok', 'message' => 'Mesaj durumu güncellendi.'];
    }

    /** DELETE /api/v1/admin/contact-messages/{id} */
    public function deleteMessage(Request $r): ?array
    {
        $id = (int) ($r->params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Geçersiz mesaj.', 422);
            return null;
        }

        $stmt = Database::pdo()->prepare('DELETE FROM contact_messages WHERE id = :id');
        $stmt->execute([':id' => $id]);
        if ($stmt->rowCount() === 0) {
            Response::error('Mesaj bulunamadı.', 404);
            return null;
        }

        return ['status' => 'ok', 'message' => 'Mesaj silindi.'];
    }

    /** DELETE /api/v1/admin/newsletter-subscribers/{id} */
    public function deleteSubscriber(Request $r): ?array
    {
        $id = (int) ($r->params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Geçersiz abone.', 422);
            return null;
        }

        $stmt = Database::pdo()->prepare('DELETE FROM newsletter_subscribers WHERE id = :id');
        $stmt->execute([':id' => $id]);
        if ($stmt->rowCount() === 0) {
            Response::error('Abone bulunamadı.', 404);
            return null;
        }

        return ['status' => 'ok', 'message' => 'Abone silindi.'];
    }
}
