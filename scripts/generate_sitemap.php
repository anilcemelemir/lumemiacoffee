<?php

/**
 * CLI script: Generate a static sitemap.xml file.
 *
 * Usage:
 *   php scripts/generate_sitemap.php
 *
 * Cron example (every 6 hours):
 *   0 */6 * * * docker exec lumemia_php php /var/www/html/scripts/generate_sitemap.php
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Lumemia\API\V1\Controllers\SitemapController;
use Lumemia\Database\Database;

// Boot database
$dbConfig = require dirname(__DIR__) . '/config/database.php';
Database::boot($dbConfig);

// Generate XML
$xml = SitemapController::generateXml();

// Write to the frontend dist directory (served by Nginx)
$distPath = dirname(__DIR__) . '/frontend/dist/sitemap.xml';

// Also write to public directory as fallback
$publicPath = dirname(__DIR__) . '/public/sitemap.xml';

$written = 0;

if (is_dir(dirname($distPath))) {
    file_put_contents($distPath, $xml);
    echo "[OK] Written to: {$distPath}\n";
    $written++;
}

file_put_contents($publicPath, $xml);
echo "[OK] Written to: {$publicPath}\n";
$written++;

echo "[DONE] Sitemap generated with " . substr_count($xml, '<url>') . " URLs.\n";
