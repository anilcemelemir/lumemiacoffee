<?php

declare(strict_types=1);

namespace Lumemia\Http;

final class Request
{
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        /** @var array<string, string> */
        public readonly array $query,
        public readonly ?array $body,
        /** @var array<string, string> */
        public readonly array $params = [],
    ) {
    }

    public static function capture(): self
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $path   = '/' . trim($uri, '/');

        $body = null;
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input') ?: '';
            if ($raw !== '') {
                $decoded = json_decode($raw, true);
                $body = is_array($decoded) ? $decoded : null;
            }
        } elseif (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
            $body = $_POST ?: null;
        }

        return new self(
            method: $method,
            path:   $path,
            query:  array_map('strval', $_GET),
            body:   $body,
        );
    }

    public function withParams(array $params): self
    {
        return new self(
            method: $this->method,
            path:   $this->path,
            query:  $this->query,
            body:   $this->body,
            params: $params,
        );
    }
}
