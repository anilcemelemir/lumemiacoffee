<?php

declare(strict_types=1);

/**
 * Imports the live FineDine menu into the local Lumemia menu tables.
 *
 * Usage:
 *   docker compose exec app php scripts/import_finedine_menu.php
 */

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Lumemia\Database\Database;
use Lumemia\Support\Slug;

const SHOP_SLUG = 'lume-mia-coffee';
const MENU_ID = '69df41c7097bfdc171466838';
const API_BASE = 'https://api.finedinemenu.com';
const MEDIA_BASE = 'https://media.finedinemenu.com/fit-in/800x800/filters:strip_exif()';

/** @var array<string,mixed> $cfg */
$cfg = require dirname(__DIR__) . '/config/database.php';
Database::boot($cfg);
$pdo = Database::pdo();

/**
 * @param array<string,string> $headers
 * @return array<string,mixed>|list<mixed>
 */
function requestJson(string $method, string $url, ?array $body = null, array $headers = []): array
{
    $headerLines = ['Accept: application/json'];
    if ($body !== null) {
        $headerLines[] = 'Content-Type: application/json';
    }
    foreach ($headers as $name => $value) {
        $headerLines[] = $name . ': ' . $value;
    }

    $context = stream_context_create([
        'http' => [
            'method' => $method,
            'header' => implode("\r\n", $headerLines),
            'content' => $body === null ? null : json_encode($body, JSON_UNESCAPED_UNICODE),
            'ignore_errors' => true,
            'timeout' => 30,
        ],
    ]);

    $raw = file_get_contents($url, false, $context);
    if ($raw === false) {
        throw new RuntimeException('FineDine isteği başarısız: ' . $url);
    }

    $status = 0;
    foreach ($http_response_header ?? [] as $line) {
        if (preg_match('~^HTTP/\S+\s+(\d+)~', $line, $m)) {
            $status = (int) $m[1];
            break;
        }
    }
    if ($status < 200 || $status >= 300) {
        throw new RuntimeException("FineDine HTTP $status: " . mb_substr($raw, 0, 400));
    }

    $json = json_decode($raw, true);
    if (!is_array($json)) {
        throw new RuntimeException('FineDine JSON okunamadı.');
    }
    return $json;
}

/** @param mixed $value */
function trText($value): string
{
    if (is_array($value)) {
        foreach (['tr', 'en'] as $lang) {
            if (isset($value[$lang]) && is_string($value[$lang]) && trim($value[$lang]) !== '') {
                return trim($value[$lang]);
            }
        }
        foreach ($value as $candidate) {
            if (is_string($candidate) && trim($candidate) !== '') {
                return trim($candidate);
            }
        }
    }
    return is_string($value) ? trim($value) : '';
}

function uniqueSlug(string $name, array &$used, string $fallbackPrefix): string
{
    $base = Slug::make($name);
    if ($base === 'urun') {
        $base = $fallbackPrefix;
    }

    $slug = $base;
    $i = 2;
    while (isset($used[$slug])) {
        $slug = $base . '-' . $i;
        $i++;
    }
    $used[$slug] = true;
    return $slug;
}

function mediaUrl(?string $path): ?string
{
    $path = trim((string) $path);
    if ($path === '') {
        return null;
    }
    if (preg_match('~^https?://~i', $path)) {
        return $path;
    }
    return MEDIA_BASE . '/' . ltrim($path, '/');
}

$auth = requestJson('POST', API_BASE . '/v2/mobile-menu/auth', [
    'slug' => SHOP_SLUG,
    'visitor_id' => null,
]);

$token = (string) ($auth['token'] ?? '');
if ($token === '') {
    throw new RuntimeException('FineDine token alınamadı.');
}

$flatList = requestJson(
    'GET',
    API_BASE . '/v1/entities/' . MENU_ID . '/flat-list',
    null,
    ['Authorization' => 'Bearer ' . $token],
);

$sections = [];
$items = [];
$itemsByParent = [];
foreach ($flatList as $entry) {
    if (!is_array($entry)) {
        continue;
    }
    if (($entry['type'] ?? '') === 'section') {
        $name = trText($entry['name'] ?? null);
        if ($name !== '') {
            $sections[(string) ($entry['_id'] ?? '')] = $entry;
        }
    } elseif (($entry['type'] ?? '') === 'item') {
        $name = trText($entry['name'] ?? null);
        if ($name !== '') {
            $items[] = $entry;
            $itemsByParent[(string) ($entry['parentId'] ?? '')][] = $entry;
        }
    }
}

$sectionsByParent = [];
foreach ($sections as $fineId => $section) {
    $sectionsByParent[(string) ($section['parentId'] ?? MENU_ID)][$fineId] = $section;
}

$orderedSections = [];
$walkSections = function (string $parentId) use (&$walkSections, &$orderedSections, &$sectionsByParent, &$itemsByParent): void {
    $children = $sectionsByParent[$parentId] ?? [];
    uasort($children, static fn (array $a, array $b): int => ((int) ($a['order'] ?? 0)) <=> ((int) ($b['order'] ?? 0)));

    foreach ($children as $fineId => $section) {
        if (!empty($itemsByParent[$fineId])) {
            $orderedSections[$fineId] = $section;
        }
        $walkSections((string) $fineId);
    }
};
$walkSections(MENU_ID);

foreach ($itemsByParent as &$siblings) {
    usort($siblings, static fn (array $a, array $b): int => ((int) ($a['order'] ?? 0)) <=> ((int) ($b['order'] ?? 0)));
}
unset($siblings);

$pdo->beginTransaction();
try {
    $pdo->exec('DELETE FROM products');
    $pdo->exec('DELETE FROM categories');

    $categoryStmt = $pdo->prepare(
        'INSERT INTO categories (name, slug, sort_order) VALUES (:name, :slug, :sort)'
    );
    $productStmt = $pdo->prepare(
        'INSERT INTO products
            (category_id, name, slug, description, price, currency, image_url, video_url, is_available, is_featured, sort_order)
         VALUES
            (:category_id, :name, :slug, :description, :price, :currency, :image_url, :video_url, :is_available, :is_featured, :sort_order)'
    );

    $categoryIds = [];
    $categorySlugs = [];
    $categorySort = 0;
    foreach ($orderedSections as $fineId => $section) {
        $name = trText($section['name'] ?? null);
        $slug = uniqueSlug($name, $categorySlugs, 'kategori');

        $categoryStmt->execute([
            ':name' => $name,
            ':slug' => $slug,
            ':sort' => $categorySort,
        ]);
        $categoryIds[$fineId] = (int) $pdo->lastInsertId();
        $categorySort += 10;
    }

    $productSlugs = [];
    $importedProducts = 0;
    foreach ($orderedSections as $parentId => $section) {
        $categoryId = $categoryIds[$parentId] ?? null;
        if ($categoryId === null) continue;

        foreach ($itemsByParent[$parentId] ?? [] as $item) {
            $name = trText($item['name'] ?? null);
            $description = trText($item['description'] ?? null);
            $price = 0.0;
            if (isset($item['prices'][0]['value']) && is_numeric($item['prices'][0]['value'])) {
                $price = (float) $item['prices'][0]['value'];
            }

            $slugBase = $name . '-' . Slug::make(trText($section['name'] ?? ''));
            $slug = uniqueSlug($slugBase, $productSlugs, 'urun');
            $published = (bool) ($item['published'] ?? true);
            $soldOut = (bool) ($item['soldout'] ?? false);

            $productStmt->execute([
                ':category_id' => $categoryId,
                ':name' => $name,
                ':slug' => $slug,
                ':description' => $description !== '' ? $description : null,
                ':price' => $price,
                ':currency' => 'TRY',
                ':image_url' => mediaUrl(isset($item['image']) ? (string) $item['image'] : null),
                ':video_url' => mediaUrl(isset($item['video']) ? (string) $item['video'] : null),
                ':is_available' => $published && !$soldOut ? 1 : 0,
                ':is_featured' => (bool) ($item['highlighted'] ?? false) ? 1 : 0,
                ':sort_order' => ((int) ($item['order'] ?? 0)) * 10,
            ]);
            $importedProducts++;
        }
    }

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}

echo "OK - FineDine menüsü aktarıldı.\n";
echo '  kategori: ' . count($categoryIds) . "\n";
echo '  ürün:     ' . $importedProducts . "\n";
