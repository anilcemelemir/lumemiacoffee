-- ---------------------------------------------------------------
-- Migration: Site icons (favicon + Apple touch icon)
-- Adds two `appearance_settings` rows in a dedicated `icons` group
-- so admins can upload browser-tab and iOS home-screen icons.
-- ---------------------------------------------------------------

SET NAMES utf8mb4;

INSERT INTO appearance_settings (`key`, `value`, `kind`, `group`, `label`, `sort_order`) VALUES
    ('favicon-url',          '', 'url', 'icons', 'Favicon (tarayıcı sekme ikonu)', 300),
    ('apple-touch-icon-url', '', 'url', 'icons', 'Apple Touch Icon (iOS ana ekran)', 310)
ON DUPLICATE KEY UPDATE `key` = `key`;
