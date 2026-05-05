<?php

declare(strict_types=1);

namespace Lumemia\Http;

final class Response
{
    public static function json(mixed $data, int $status = 200, array $headers = []): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        foreach ($headers as $name => $value) {
            header($name . ': ' . $value);
        }

        echo json_encode(
            $data,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        );
    }

    public static function error(string $message, int $status = 400, array $extra = []): void
    {
        self::json(['status' => 'error', 'message' => $message] + $extra, $status);
    }
}
