<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Controllers;

use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;
use PDO;
use PDOException;

final class SubmissionController
{
    /** POST /api/v1/newsletter */
    public function newsletter(Request $r): ?array
    {
        $body = $r->body ?? [];
        $email = strtolower(trim((string) ($body['email'] ?? '')));

        if ($this->honeypotFilled($body)) {
            return ['status' => 'ok', 'message' => 'Abonelik kaydedildi.'];
        }

        if (!$this->allowAttempt('newsletter', 3, 600)) {
            Response::error('Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.', 429);
            return null;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Geçerli bir e-posta adresi girin.', 422);
            return null;
        }

        try {
            $stmt = Database::pdo()->prepare(
                'INSERT INTO newsletter_subscribers (email, source, ip_address, user_agent)
                      VALUES (:email, :source, :ip, :ua)
                 ON DUPLICATE KEY UPDATE
                      is_active = 1,
                      source = VALUES(source),
                      ip_address = VALUES(ip_address),
                      user_agent = VALUES(user_agent),
                      updated_at = CURRENT_TIMESTAMP'
            );
            $stmt->execute([
                ':email'  => $email,
                ':source' => substr(trim((string) ($body['source'] ?? 'website')), 0, 60),
                ':ip'     => $this->clientIp(),
                ':ua'     => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500),
            ]);
        } catch (PDOException $e) {
            Response::error('Abonelik kaydedilemedi.', 500, ['detail' => $e->getMessage()]);
            return null;
        }

        return ['status' => 'ok', 'message' => 'Abonelik kaydedildi.'];
    }

    /** POST /api/v1/contact-messages */
    public function contactMessage(Request $r): ?array
    {
        $body = $r->body ?? [];
        $name = trim((string) ($body['name'] ?? ''));
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $message = trim((string) ($body['message'] ?? ''));
        $consent = (bool) ($body['consent'] ?? false);

        if ($this->honeypotFilled($body)) {
            return ['status' => 'ok', 'message' => 'Mesajınız kaydedildi.'];
        }

        if (!$this->allowAttempt('contact_message', 2, 600)) {
            Response::error('Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.', 429);
            return null;
        }

        if ($name === '' || mb_strlen($name) > 160) {
            Response::error('Ad alanı zorunludur.', 422);
            return null;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Geçerli bir e-posta adresi girin.', 422);
            return null;
        }
        if ($message === '' || mb_strlen($message) > 5000) {
            Response::error('Mesaj alanı zorunludur.', 422);
            return null;
        }
        if (!$consent) {
            Response::error('Veri saklama onayı gereklidir.', 422);
            return null;
        }

        try {
            $stmt = Database::pdo()->prepare(
                'INSERT INTO contact_messages (name, email, message, consent, ip_address, user_agent)
                      VALUES (:name, :email, :message, :consent, :ip, :ua)'
            );
            $stmt->execute([
                ':name'    => $name,
                ':email'   => $email,
                ':message' => $message,
                ':consent' => 1,
                ':ip'      => $this->clientIp(),
                ':ua'      => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500),
            ]);
        } catch (PDOException $e) {
            Response::error('Mesaj kaydedilemedi.', 500, ['detail' => $e->getMessage()]);
            return null;
        }

        return ['status' => 'ok', 'message' => 'Mesajınız kaydedildi.'];
    }

    /** @param array<string,mixed> $body */
    private function honeypotFilled(array $body): bool
    {
        foreach (['website', 'company', 'url'] as $field) {
            if (trim((string) ($body[$field] ?? '')) !== '') {
                return true;
            }
        }

        return false;
    }

    private function allowAttempt(string $action, int $limit, int $windowSeconds): bool
    {
        $pdo = Database::pdo();
        $ipHash = hash('sha256', $this->clientIp() . '|' . (getenv('JWT_SECRET') ?: 'lumemia-rate-limit'));
        $now = time();

        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare(
                'SELECT id, attempts, window_started_at
                   FROM form_rate_limits
                  WHERE action = :action AND ip_hash = :ip_hash
                  FOR UPDATE'
            );
            $stmt->execute([':action' => $action, ':ip_hash' => $ipHash]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                $insert = $pdo->prepare(
                    'INSERT INTO form_rate_limits (action, ip_hash, attempts, window_started_at)
                          VALUES (:action, :ip_hash, 1, CURRENT_TIMESTAMP)'
                );
                $insert->execute([':action' => $action, ':ip_hash' => $ipHash]);
                $pdo->commit();
                return true;
            }

            $windowStartedAt = strtotime((string) $row['window_started_at']);
            $windowExpired = $windowStartedAt === false || ($now - $windowStartedAt) >= $windowSeconds;
            if ($windowExpired) {
                $reset = $pdo->prepare(
                    'UPDATE form_rate_limits
                        SET attempts = 1, window_started_at = CURRENT_TIMESTAMP
                      WHERE id = :id'
                );
                $reset->execute([':id' => (int) $row['id']]);
                $pdo->commit();
                return true;
            }

            $attempts = (int) $row['attempts'];
            if ($attempts >= $limit) {
                $pdo->commit();
                return false;
            }

            $update = $pdo->prepare('UPDATE form_rate_limits SET attempts = attempts + 1 WHERE id = :id');
            $update->execute([':id' => (int) $row['id']]);
            $pdo->commit();
            return true;
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    private function clientIp(): string
    {
        $forwarded = (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '');
        if ($forwarded !== '') {
            return substr(trim(explode(',', $forwarded)[0]), 0, 45);
        }

        $cloudflare = (string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? '');
        if ($cloudflare !== '') {
            return substr(trim($cloudflare), 0, 45);
        }

        return substr((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 45);
    }
}
