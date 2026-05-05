<?php

declare(strict_types=1);

namespace Lumemia\API\V1;

use Lumemia\Database\Connection;
use Lumemia\Http\Request;
use PDO;
use Throwable;

final class StatusController
{
    public function __construct(private readonly array $dbConfig)
    {
    }

    public function __invoke(Request $request): array
    {
        $db = ['connected' => false, 'server' => null, 'error' => null];

        try {
            $pdo = Connection::fromConfig($this->dbConfig)->pdo();
            $row = $pdo->query('SELECT VERSION() AS v')->fetch(PDO::FETCH_ASSOC);
            $db['connected'] = true;
            $db['server']    = $row['v'] ?? null;
        } catch (Throwable $e) {
            $db['error'] = $e->getMessage();
        }

        return [
            'status'    => 'ok',
            'service'   => 'Lume Mia Coffee API',
            'message'   => 'Welcome to Lume Mia Coffee — botanical brews, served as JSON.',
            'version'   => 'v1',
            'php'       => PHP_VERSION,
            'timestamp' => gmdate('c'),
            'database'  => $db,
        ];
    }
}
