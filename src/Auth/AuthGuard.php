<?php

declare(strict_types=1);

namespace Lumemia\Auth;

use Lumemia\Http\Request;
use Lumemia\Http\Response;
use Throwable;

final class AuthGuard
{
    public function __construct(private readonly Jwt $jwt)
    {
    }

    /**
     * Returns decoded claims if Authorization header is valid, otherwise
     * sends a 401 JSON response and exits.
     */
    public function require(Request $request): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
            Response::error('Yetkisiz erişim. Lütfen giriş yapın.', 401);
            exit;
        }

        try {
            return $this->jwt->verify(trim($m[1]));
        } catch (Throwable $e) {
            Response::error('Oturum geçersiz veya süresi dolmuş.', 401, ['detail' => $e->getMessage()]);
            exit;
        }
    }
}
