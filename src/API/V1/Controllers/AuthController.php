<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Controllers;

use Lumemia\Auth\Jwt;
use Lumemia\Database\Database;
use Lumemia\Http\Request;
use Lumemia\Http\Response;

final class AuthController
{
    public function __construct(private readonly Jwt $jwt)
    {
    }

    /** POST /api/v1/auth/login  { username, password } */
    public function login(Request $r): ?array
    {
        $username = trim((string) ($r->body['username'] ?? ''));
        $password = (string) ($r->body['password'] ?? '');

        if ($username === '' || $password === '') {
            Response::error('Kullanıcı adı ve şifre zorunludur.', 422);
            return null;
        }

        $pdo = Database::pdo();
        $stmt = $pdo->prepare('SELECT id, username, password_hash, display_name, role FROM users WHERE username = :u LIMIT 1');
        $stmt->execute([':u' => $username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, (string) $user['password_hash'])) {
            Response::error('Kullanıcı adı veya şifre hatalı.', 401);
            return null;
        }

        $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id')
            ->execute([':id' => $user['id']]);

        $token = $this->jwt->issue([
            'sub'  => (int) $user['id'],
            'usr'  => $user['username'],
            'role' => $user['role'],
        ]);

        return [
            'status'  => 'ok',
            'message' => 'Giriş başarılı.',
            'token'   => $token,
            'user'    => [
                'id'           => (int) $user['id'],
                'username'     => $user['username'],
                'display_name' => $user['display_name'],
                'role'         => $user['role'],
            ],
        ];
    }

    /** GET /api/v1/auth/me  (Bearer required) */
    public function me(Request $r): array
    {
        // Guard is applied at route level; claims already validated.
        $claims = $r->params['__claims'] ?? [];
        return [
            'status' => 'ok',
            'user'   => [
                'id'       => (int) ($claims['sub']  ?? 0),
                'username' => (string) ($claims['usr']  ?? ''),
                'role'     => (string) ($claims['role'] ?? ''),
            ],
        ];
    }
}
