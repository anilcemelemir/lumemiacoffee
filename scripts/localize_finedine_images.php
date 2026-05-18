<?php

declare(strict_types=1);

/**
 * Downloads remote FineDine product images into public/uploads/finedine
 * and rewrites product image URLs to local /uploads paths.
 *
 * Usage:
 *   docker compose exec app php scripts/localize_finedine_images.php
 */

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Lumemia\Database\Database;

/** @var array<string,mixed> $cfg */
$cfg = require dirname(__DIR__) . '/config/database.php';
Database::boot($cfg);
$pdo = Database::pdo();

$uploadDir = dirname(__DIR__) . '/public/uploads/finedine';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
    throw new RuntimeException('Upload klasörü oluşturulamadı: ' . $uploadDir);
}

$rows = $pdo->query(
    "SELECT id, slug, image_url
       FROM products
      WHERE image_url LIKE 'https://media.finedinemenu.com/%'
      ORDER BY id ASC"
)->fetchAll();

$update = $pdo->prepare('UPDATE products SET image_url = :url WHERE id = :id');
$downloaded = 0;
$updated = 0;
$failed = 0;

foreach ($rows as $row) {
    $id = (int) $row['id'];
    $slug = preg_replace('/[^a-z0-9_-]+/i', '-', (string) $row['slug']) ?: 'product-' . $id;
    $remote = (string) $row['image_url'];
    $path = (string) (parse_url($remote, PHP_URL_PATH) ?? '');
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
        $ext = 'jpg';
    }

    $filename = sprintf('%03d-%s.%s', $id, $slug, $ext);
    $target = $uploadDir . DIRECTORY_SEPARATOR . $filename;
    $localUrl = '/uploads/finedine/' . $filename;

    if (!is_file($target)) {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8\r\n",
                'ignore_errors' => true,
                'timeout' => 45,
            ],
        ]);
        $bytes = file_get_contents($remote, false, $context);
        if ($bytes === false || $bytes === '') {
            fwrite(STDERR, "Görsel indirilemedi: product#$id $remote\n");
            $failed++;
            continue;
        }
        file_put_contents($target, $bytes);
        $downloaded++;
    }

    $update->execute([':url' => $localUrl, ':id' => $id]);
    $updated++;
}

echo "OK - FineDine görselleri lokal hale getirildi.\n";
echo "  indirilen: $downloaded\n";
echo "  güncellenen ürün: $updated\n";
echo "  hata: $failed\n";
echo "  klasör: public/uploads/finedine\n";
