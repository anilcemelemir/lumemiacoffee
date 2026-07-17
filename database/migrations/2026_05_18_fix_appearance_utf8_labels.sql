SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE appearance_settings SET label = 'Birincil (bordo)' WHERE `key` = 'brand-primary';
UPDATE appearance_settings SET label = 'Birincil koyu' WHERE `key` = 'brand-primary-dark';
UPDATE appearance_settings SET label = 'Vurgu (altın)' WHERE `key` = 'brand-accent';
UPDATE appearance_settings SET label = 'Vurgu açık' WHERE `key` = 'brand-accent-soft';

UPDATE appearance_settings SET label = 'Krem zemin' WHERE `key` = 'surface-cream';
UPDATE appearance_settings SET label = 'Kağıt zemin' WHERE `key` = 'surface-paper';
UPDATE appearance_settings SET label = 'Mürekkep (koyu)' WHERE `key` = 'surface-ink';
UPDATE appearance_settings SET label = 'Pus (yumuşak)' WHERE `key` = 'surface-mist';

UPDATE appearance_settings SET label = 'Birincil metin' WHERE `key` = 'text-primary';
UPDATE appearance_settings SET label = 'Koyu üzerinde metin' WHERE `key` = 'text-on-dark';
UPDATE appearance_settings SET label = 'Soluk metin' WHERE `key` = 'text-muted';

UPDATE appearance_settings SET label = 'Yumuşak kenarlık' WHERE `key` = 'border-soft';

UPDATE appearance_settings SET label = 'Logo URL' WHERE `key` = 'logo-url';
UPDATE appearance_settings SET label = 'Logo işareti URL' WHERE `key` = 'logo-mark-url';
UPDATE appearance_settings SET label = 'Marka adı' WHERE `key` = 'brand-name';

UPDATE appearance_settings SET label = 'Favicon (tarayıcı sekme ikonu)' WHERE `key` = 'favicon-url';
UPDATE appearance_settings SET label = 'Apple Touch Icon (iOS ana ekran)' WHERE `key` = 'apple-touch-icon-url';

UPDATE appearance_settings SET label = 'Başlık fontu' WHERE `key` = 'font-display';
UPDATE appearance_settings SET label = 'Gövde fontu' WHERE `key` = 'font-body';

UPDATE appearance_settings SET label = 'Menü CTA arka planı' WHERE `key` = 'menu_cta.background';
UPDATE appearance_settings SET label = 'Alt sayfalarda tepe çubuğu opak başlasın' WHERE `key` = 'nav.solid_on_subpages';
UPDATE appearance_settings SET label = 'Menü sayfasında kompakt footer' WHERE `key` = 'menu.compact_footer';
UPDATE appearance_settings SET label = 'Mobil başlık ölçeği' WHERE `key` = 'mobile.heading.scale';
UPDATE appearance_settings SET label = 'Mobil gövde metni ölçeği' WHERE `key` = 'mobile.body.scale';
UPDATE appearance_settings SET label = 'Mobil navigasyon metni ölçeği' WHERE `key` = 'mobile.nav.scale';
