<?php

declare(strict_types=1);

namespace Lumemia\Auth;

use RuntimeException;

/**
 * Minimal HS256 JWT implementation (no external deps).
 * Suitable for first-party auth tokens consumed by our own clients.
 */
final class Jwt
{
    public function __construct(
        private readonly string $secret,
        private readonly string $issuer = 'lumemia',
        private readonly int $ttlSeconds = 86400, // 24 saat
    ) {
        if (strlen($this->secret) < 16) {
            throw new RuntimeException('JWT secret çok kısa.');
        }
    }

    public function issue(array $claims): string
    {
        $now = time();
        $payload = array_merge([
            'iss' => $this->issuer,
            'iat' => $now,
            'exp' => $now + $this->ttlSeconds,
        ], $claims);

        $header = ['alg' => 'HS256', 'typ' => 'JWT'];

        $segments = [
            self::b64UrlEncode(json_encode($header,  JSON_UNESCAPED_SLASHES)),
            self::b64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES)),
        ];
        $signingInput = implode('.', $segments);
        $signature    = hash_hmac('sha256', $signingInput, $this->secret, true);
        $segments[]   = self::b64UrlEncode($signature);

        return implode('.', $segments);
    }

    /**
     * @return array<string,mixed>  the decoded claims
     * @throws RuntimeException on any validation failure
     */
    public function verify(string $token): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new RuntimeException('Geçersiz token formatı.');
        }
        [$h64, $p64, $s64] = $parts;

        $header = json_decode((string) self::b64UrlDecode($h64), true);
        if (!is_array($header) || ($header['alg'] ?? null) !== 'HS256') {
            throw new RuntimeException('Desteklenmeyen imza algoritması.');
        }

        $expected = hash_hmac('sha256', "$h64.$p64", $this->secret, true);
        $actual   = self::b64UrlDecode($s64);
        if (!hash_equals($expected, $actual)) {
            throw new RuntimeException('İmza doğrulanamadı.');
        }

        $payload = json_decode((string) self::b64UrlDecode($p64), true);
        if (!is_array($payload)) {
            throw new RuntimeException('Bozuk token gövdesi.');
        }
        if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
            throw new RuntimeException('Token süresi dolmuş.');
        }

        return $payload;
    }

    private static function b64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64UrlDecode(string $data): string
    {
        $pad = strlen($data) % 4;
        if ($pad > 0) {
            $data .= str_repeat('=', 4 - $pad);
        }
        $decoded = base64_decode(strtr($data, '-_', '+/'), true);
        if ($decoded === false) {
            throw new RuntimeException('Base64 çözümleme hatası.');
        }
        return $decoded;
    }
}
