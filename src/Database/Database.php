<?php

declare(strict_types=1);

namespace Lumemia\Database;

use PDO;
use PDOException;
use RuntimeException;

/**
 * Process-wide singleton wrapper around PDO.
 *
 * Use Database::boot($config) once during bootstrap, then call
 * Database::pdo() anywhere downstream.
 */
final class Database
{
    private static ?self $instance = null;

    private ?PDO $pdo = null;

    private function __construct(
        private readonly string $host,
        private readonly int $port,
        private readonly string $database,
        private readonly string $username,
        private readonly string $password,
        private readonly string $charset = 'utf8mb4',
    ) {
    }

    public static function boot(array $config): self
    {
        if (self::$instance instanceof self) {
            return self::$instance;
        }

        self::$instance = new self(
            host:     (string) ($config['host']     ?? 'db'),
            port:     (int)    ($config['port']     ?? 3306),
            database: (string) ($config['database'] ?? ''),
            username: (string) ($config['username'] ?? ''),
            password: (string) ($config['password'] ?? ''),
            charset:  (string) ($config['charset']  ?? 'utf8mb4'),
        );

        return self::$instance;
    }

    public static function instance(): self
    {
        if (!self::$instance instanceof self) {
            throw new RuntimeException('Database has not been booted. Call Database::boot($config) first.');
        }
        return self::$instance;
    }

    public static function pdo(): PDO
    {
        return self::instance()->connection();
    }

    public function connection(): PDO
    {
        if ($this->pdo instanceof PDO) {
            return $this->pdo;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $this->host,
            $this->port,
            $this->database,
            $this->charset,
        );

        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE              => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE   => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES     => false,
                PDO::MYSQL_ATTR_INIT_COMMAND   => "SET NAMES {$this->charset} COLLATE {$this->charset}_unicode_ci",
            ]);
        } catch (PDOException $e) {
            throw new RuntimeException(
                'Database connection failed: ' . $e->getMessage(),
                (int) $e->getCode(),
                $e,
            );
        }

        return $this->pdo;
    }
}
