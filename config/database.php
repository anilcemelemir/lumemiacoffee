<?php

declare(strict_types=1);

return [
    'host'     => getenv('DB_HOST') ?: 'db',
    'port'     => (int) (getenv('DB_PORT') ?: 3306),
    'database' => getenv('DB_NAME') ?: 'lumemia',
    'username' => getenv('DB_USER') ?: 'lumemia',
    'password' => getenv('DB_PASSWORD') ?: 'lumemia_secret',
    'charset'  => 'utf8mb4',
];
