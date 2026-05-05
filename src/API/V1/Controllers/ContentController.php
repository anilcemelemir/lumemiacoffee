<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Controllers;

use Lumemia\Database\Database;
use Lumemia\Http\Request;

final class ContentController
{
    /**
     * GET /api/v1/content
     * Tüm UI metinlerini düz key→value sözlük olarak döner.
     * Frontend tek istekle sözlüğü alır ve t('hero.title') ile kullanır.
     */
    public function __invoke(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT `key`, value_tr FROM site_content'
        )->fetchAll();

        $dict = [];
        foreach ($rows as $row) {
            $dict[$row['key']] = $row['value_tr'];
        }

        return [
            'status'  => 'ok',
            'locale'  => 'tr',
            'content' => $dict,
        ];
    }
}
