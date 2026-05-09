-- ---------------------------------------------------------------
-- Migration: SEO & Analytics Settings
-- New table for meta tags, tracking scripts, and SEO config.
-- ---------------------------------------------------------------

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS seo_settings (
    `key`       VARCHAR(120)  NOT NULL,
    `value`     TEXT          NULL,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO seo_settings (`key`, `value`) VALUES
    ('meta_title',       'Lume Mia Coffee — Botanik Demlemeler'),
    ('meta_description', 'İstanbul''un kalbinde el yapımı spesiyalite kahve, bitkisel demlemeler ve sakin atmosfer.'),
    ('meta_keywords',    'kahve, coffee shop, istanbul, botanik, spesiyalite kahve, lume mia'),
    ('tracking_head',    ''),
    ('tracking_body',    ''),
    ('og_image',         ''),
    ('robots_txt',       'User-agent: *\nAllow: /\nSitemap: /sitemap.xml')
ON DUPLICATE KEY UPDATE `key` = `key`;
