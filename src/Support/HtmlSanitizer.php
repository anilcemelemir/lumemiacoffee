<?php

declare(strict_types=1);

namespace Lumemia\Support;

/**
 * Minimal HTML allowlist sanitizer for editor output.
 *
 * Only the tags/attributes strictly used by our admin RichTextEditor are
 * preserved. Anything else (script, style, iframe, on* handlers, javascript:
 * URLs, custom data-*) is stripped. Output is always UTF-8 safe.
 */
final class HtmlSanitizer
{
    private const ALLOWED = [
        'p'      => [],
        'br'     => [],
        'strong' => [],
        'b'      => [],
        'em'     => [],
        'i'      => [],
        'u'      => [],
        'h2'     => [],
        'h3'     => [],
        'h4'     => [],
        'ul'     => [],
        'ol'     => [],
        'li'     => [],
        'blockquote' => [],
        'a'      => ['href', 'title', 'target', 'rel'],
    ];

    public static function clean(string $html): string
    {
        $html = trim($html);
        if ($html === '') {
            return '';
        }

        // libxml swallows UTF-8 unless we force the meta hint.
        $wrapped = '<?xml encoding="UTF-8"?><div id="__root__">' . $html . '</div>';

        $prev = libxml_use_internal_errors(true);
        $doc  = new \DOMDocument('1.0', 'UTF-8');
        $doc->loadHTML($wrapped, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET);
        libxml_clear_errors();
        libxml_use_internal_errors($prev);

        $root = $doc->getElementById('__root__');
        if (!$root instanceof \DOMElement) {
            return '';
        }

        self::walk($root);

        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $doc->saveHTML($child);
        }

        return trim($out);
    }

    private static function walk(\DOMNode $node): void
    {
        // Snapshot children — we will mutate the tree.
        $children = iterator_to_array($node->childNodes);
        foreach ($children as $child) {
            if ($child instanceof \DOMElement) {
                $tag = strtolower($child->nodeName);
                if (!isset(self::ALLOWED[$tag])) {
                    // Unknown tag: unwrap (keep text/children, drop element).
                    while ($child->firstChild) {
                        $node->insertBefore($child->firstChild, $child);
                    }
                    $node->removeChild($child);
                    continue;
                }

                $allowedAttrs = self::ALLOWED[$tag];
                foreach (iterator_to_array($child->attributes ?? []) as $attr) {
                    /** @var \DOMAttr $attr */
                    $name = strtolower($attr->nodeName);
                    if (!in_array($name, $allowedAttrs, true)) {
                        $child->removeAttributeNode($attr);
                        continue;
                    }
                    if ($name === 'href') {
                        $val = trim((string) $attr->nodeValue);
                        if (!self::safeUrl($val)) {
                            $child->removeAttributeNode($attr);
                            continue;
                        }
                    }
                }

                // Force rel=noopener on external target=_blank links.
                if ($tag === 'a' && $child->getAttribute('target') === '_blank') {
                    $child->setAttribute('rel', 'noopener noreferrer');
                }

                self::walk($child);
            } elseif ($child instanceof \DOMComment || $child instanceof \DOMProcessingInstruction) {
                $node->removeChild($child);
            }
        }
    }

    private static function safeUrl(string $url): bool
    {
        if ($url === '' || $url === '#') {
            return true;
        }
        if (str_starts_with($url, '/') || str_starts_with($url, '#')) {
            return true;
        }
        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
        return in_array($scheme, ['http', 'https', 'mailto', 'tel'], true);
    }
}
