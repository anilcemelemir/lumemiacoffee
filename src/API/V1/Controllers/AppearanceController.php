<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Controllers;

use Lumemia\Database\Database;
use Lumemia\Http\Request;

final class AppearanceController
{
    /**
     * GET /api/v1/appearance
     * Tema ayarlarını düz key→value sözlük olarak döner.
     * Frontend tek istekle alıp :root üzerine CSS değişkeni olarak basar.
     */
    public function __invoke(Request $r): array
    {
        $rows = Database::pdo()->query(
            'SELECT `key`, `value`, `kind`, `group` FROM appearance_settings ORDER BY sort_order ASC'
        )->fetchAll();

        $theme = [];
        $brand = [];
        $typography = [];
        $layout = [];
        foreach ($rows as $row) {
            $entry = ['value' => $row['value'], 'kind' => $row['kind']];
            $group = (string) ($row['group'] ?? 'theme');
            if ($group === 'layout' || $row['kind'] === 'option') {
                $layout[$row['key']] = $entry;
            } elseif ($row['kind'] === 'color') {
                $theme[$row['key']] = $entry;
            } elseif ($row['kind'] === 'font') {
                $typography[$row['key']] = $entry;
            } else {
                $brand[$row['key']] = $entry;
            }
        }

        return [
            'status'     => 'ok',
            'theme'      => $theme,
            'brand'      => $brand,
            'typography' => $typography,
            'layout'     => $layout,
        ];
    }
}
