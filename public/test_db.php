<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Lumemia\Database\Connection;

header('Content-Type: application/json; charset=utf-8');

/** @var array<string, mixed> $config */
$config = require dirname(__DIR__) . '/config/database.php';

try {
    $pdo = Connection::fromConfig($config)->pdo();

    $version = $pdo->query('SELECT VERSION() AS version')->fetch();
    $now     = $pdo->query('SELECT NOW() AS now')->fetch();

    http_response_code(200);
    echo json_encode([
        'status'     => 'success',
        'message'    => 'Connected to MariaDB successfully.',
        'driver'     => $pdo->getAttribute(PDO::ATTR_DRIVER_NAME),
        'server'     => $version['version'] ?? null,
        'server_now' => $now['now'] ?? null,
        'database'   => $config['database'],
        'host'       => $config['host'] . ':' . $config['port'],
        'extensions' => [
            'pdo'       => extension_loaded('pdo'),
            'pdo_mysql' => extension_loaded('pdo_mysql'),
            'mysqli'    => extension_loaded('mysqli'),
        ],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}
