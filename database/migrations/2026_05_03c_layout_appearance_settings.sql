-- 2026_05_03c_layout_appearance_settings.sql
-- Adds layout-related toggles to appearance_settings so the admin
-- can manage homepage CTA background, navigation behavior on subpages,
-- and footer compactness without editing code.

INSERT INTO appearance_settings (`key`, `value`, `kind`, `group`, label, sort_order) VALUES
    ('menu_cta.background',     'dotted',    'option', 'layout', 'Menü CTA arka planı (dotted | cream)',      400),
    ('nav.solid_on_subpages',   'true',      'option', 'layout', 'Alt sayfalarda tepe çubuğu opak başlasın',  410),
    ('menu.compact_footer',     'true',      'option', 'layout', 'Menü sayfasında kompakt footer',            420)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
