<?php

declare(strict_types=1);

namespace Lumemia\API\V1\Controllers;

use DOMDocument;
use Lumemia\Database\Database;
use Lumemia\Http\Request;

/**
 * Automated sitemap.xml generator.
 *
 * GET /sitemap.xml
 *
 * Crawls all known static routes and active product slugs,
 * then returns a standards-compliant sitemap XML document.
 */
final class SitemapController
{
    private const DEFAULT_SITE_URL = 'https://lumemia.coffee';

    /** Static SPA routes with their priority and change frequency. */
    private const STATIC_ROUTES = [
        '/'          => ['priority' => '1.0', 'changefreq' => 'weekly'],
        '/menu'      => ['priority' => '0.9', 'changefreq' => 'weekly'],
        '/hikayemiz' => ['priority' => '0.7', 'changefreq' => 'monthly'],
    ];

    public function __invoke(Request $r): never
    {
        $siteUrl = rtrim(getenv('SITE_URL') ?: self::DEFAULT_SITE_URL, '/');
        $today   = date('Y-m-d');

        $doc = new DOMDocument('1.0', 'UTF-8');
        $doc->formatOutput = true;

        $urlset = $doc->createElement('urlset');
        $urlset->setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $doc->appendChild($urlset);

        // Static routes
        foreach (self::STATIC_ROUTES as $path => $meta) {
            $this->addUrl($doc, $urlset, $siteUrl . $path, $today, $meta['changefreq'], $meta['priority']);
        }

        // Dynamic: active product categories (menu anchors)
        try {
            $categories = Database::pdo()->query(
                'SELECT slug FROM categories ORDER BY sort_order ASC'
            )->fetchAll();

            foreach ($categories as $cat) {
                $this->addUrl(
                    $doc, $urlset,
                    $siteUrl . '/menu#' . $cat['slug'],
                    $today, 'weekly', '0.6'
                );
            }
        } catch (\Throwable) {
            // DB unavailable — skip dynamic routes
        }

        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        echo $doc->saveXML();
        exit;
    }

    private function addUrl(
        DOMDocument $doc,
        \DOMElement $urlset,
        string $loc,
        string $lastmod,
        string $changefreq,
        string $priority,
    ): void {
        $url = $doc->createElement('url');
        $url->appendChild($doc->createElement('loc', htmlspecialchars($loc, ENT_XML1, 'UTF-8')));
        $url->appendChild($doc->createElement('lastmod', $lastmod));
        $url->appendChild($doc->createElement('changefreq', $changefreq));
        $url->appendChild($doc->createElement('priority', $priority));
        $urlset->appendChild($url);
    }

    /**
     * Generate the sitemap XML as a string.
     * Used by the CLI script to write a static file.
     */
    public static function generateXml(): string
    {
        $siteUrl = rtrim(getenv('SITE_URL') ?: self::DEFAULT_SITE_URL, '/');
        $today   = date('Y-m-d');

        $doc = new DOMDocument('1.0', 'UTF-8');
        $doc->formatOutput = true;

        $urlset = $doc->createElement('urlset');
        $urlset->setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $doc->appendChild($urlset);

        $instance = new self();

        foreach (self::STATIC_ROUTES as $path => $meta) {
            $instance->addUrl($doc, $urlset, $siteUrl . $path, $today, $meta['changefreq'], $meta['priority']);
        }

        try {
            $categories = Database::pdo()->query(
                'SELECT slug FROM categories ORDER BY sort_order ASC'
            )->fetchAll();

            foreach ($categories as $cat) {
                $instance->addUrl($doc, $urlset, $siteUrl . '/menu#' . $cat['slug'], $today, 'weekly', '0.6');
            }
        } catch (\Throwable) {
            // skip
        }

        return $doc->saveXML();
    }
}
