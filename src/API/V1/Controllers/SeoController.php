<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Controllers;

use Lumemia\Database\Database;
use Lumemia\Http\Request;

/**
 * Public SEO endpoint — returns meta tags and tracking scripts
 * so the React frontend can inject them into head and body.
 *
 * GET /api/v1/seo
 */
final class SeoController
{
    public function __invoke(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT `key`, `value` FROM seo_settings ORDER BY `key` ASC'
        )->fetchAll();

        $data = [];
        foreach ($rows as $row) {
            $data[$row['key']] = $row['value'];
        }

        return [
            'status' => 'ok',
            'data'   => $data,
        ];
    }
}
