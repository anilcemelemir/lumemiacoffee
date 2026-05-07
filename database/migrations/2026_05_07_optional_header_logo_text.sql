-- Adds an optional header logo text field.
-- Blank by default so the header can show only the logo mark.

INSERT IGNORE INTO site_content (`key`, value_tr, `group`, label) VALUES
  ('brand.logo_text', '', 'brand', 'Header Logo Yazısı');
