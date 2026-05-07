-- Adds mobile typography controls for public-site rendering.
INSERT INTO appearance_settings (`key`, `value`, `kind`, `group`, label, sort_order) VALUES
    ('mobile.heading.scale', '1',    'option', 'layout', 'Mobil başlık ölçeği', 430),
    ('mobile.body.scale',    '1',    'option', 'layout', 'Mobil gövde metni ölçeği', 440),
    ('mobile.nav.scale',     '1',    'option', 'layout', 'Mobil navigasyon metni ölçeği', 450)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
