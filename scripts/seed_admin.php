<?php

declare(strict_types=1);

/**
 * Idempotent admin seeder.
 * Usage:
 *   docker compose exec app php scripts/seed_admin.php [username] [password]
 */

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Lumemia\Database\Database;

$username = $argv[1] ?? 'admin';
$password = $argv[2] ?? 'lumemia2026';

/** @var array<string,mixed> $cfg */
$cfg = require dirname(__DIR__) . '/config/database.php';
Database::boot($cfg);
$pdo = Database::pdo();

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$stmt = $pdo->prepare(
    'INSERT INTO users (username, password_hash, display_name, role)
     VALUES (:u, :p, :d, :r)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
);
$stmt->execute([
    ':u' => $username,
    ':p' => $hash,
    ':d' => 'Yönetici',
    ':r' => 'admin',
]);

echo "OK — admin kullanıcısı hazır.\n";
echo "  kullanıcı adı: $username\n";
echo "  şifre:         $password\n";
