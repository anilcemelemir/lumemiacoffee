<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'app'        => 'Lume Mia Coffee API',
    'php'        => PHP_VERSION,
    'status'     => 'ok',
    'timestamp'  => gmdate('c'),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
