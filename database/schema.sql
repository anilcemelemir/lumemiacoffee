-- ---------------------------------------------------------------
-- Lume Mia Coffee — Schema (TR)
-- MariaDB 11.x / utf8mb4
-- ---------------------------------------------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS shop_settings;
DROP TABLE IF EXISTS appearance_settings;
DROP TABLE IF EXISTS site_content;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------
-- users  (admin paneli)
-- ---------------------------------------------------------------
CREATE TABLE users (
    id              INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    username        VARCHAR(80)    NOT NULL,
    password_hash   VARCHAR(255)   NOT NULL,
    display_name    VARCHAR(120)   NULL,
    role            VARCHAR(40)    NOT NULL DEFAULT 'admin',
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMP      NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- categories  (kategoriler)
-- ---------------------------------------------------------------
CREATE TABLE categories (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name        VARCHAR(120)    NOT NULL,
    slug        VARCHAR(140)    NOT NULL,
    sort_order  SMALLINT        NOT NULL DEFAULT 0,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- products  (ürünler)
-- ---------------------------------------------------------------
CREATE TABLE products (
    id            INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    category_id   INT UNSIGNED      NOT NULL,
    name          VARCHAR(160)      NOT NULL,
    slug          VARCHAR(180)      NOT NULL,
    description   TEXT              NULL,
    price         DECIMAL(10, 2)    NOT NULL DEFAULT 0.00,
    currency      CHAR(3)           NOT NULL DEFAULT 'TRY',
    image_url     VARCHAR(500)      NULL,
    video_url     VARCHAR(500)      NULL,
    is_available  TINYINT(1)        NOT NULL DEFAULT 1,
    is_featured   TINYINT(1)        NOT NULL DEFAULT 0,
    sort_order    SMALLINT          NOT NULL DEFAULT 0,
    created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_products_slug (slug),
    KEY idx_products_category (category_id),
    KEY idx_products_available (is_available),
    KEY idx_products_featured (is_featured),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- site_content  (her UI metni — anahtar / Türkçe değer)
-- ---------------------------------------------------------------
CREATE TABLE site_content (
    `key`       VARCHAR(160)    NOT NULL,
    value_tr    TEXT            NULL,
    `group`     VARCHAR(80)     NOT NULL DEFAULT 'general',
    label       VARCHAR(200)    NULL,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- shop_settings  (anahtar / değer — adres, sosyal medya vb.)
-- ---------------------------------------------------------------
CREATE TABLE shop_settings (
    `key`       VARCHAR(120)    NOT NULL,
    `value`     TEXT            NULL,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- appearance_settings  (tema renkleri, logo, tipografi)
-- key → CSS değişkeni adı (tire ile, ör. brand-primary)
-- ---------------------------------------------------------------
CREATE TABLE appearance_settings (
    `key`       VARCHAR(80)     NOT NULL,
    `value`     VARCHAR(255)    NOT NULL,
    `kind`      VARCHAR(20)     NOT NULL DEFAULT 'color',  -- color | text | url | font
    `group`     VARCHAR(40)     NOT NULL DEFAULT 'theme',  -- theme | brand | typography
    label       VARCHAR(160)    NULL,
    sort_order  SMALLINT        NOT NULL DEFAULT 0,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- NOTE: admin kullanıcısı, scripts/seed_admin.php tarafından bcrypt ile oluşturulur.

-- ---------------------------------------------------------------
-- Seed: Kategoriler (TR)
-- ---------------------------------------------------------------
INSERT INTO categories (name, slug, sort_order) VALUES
    ('Espresso Bazlılar',  'espresso-bazlilar',  10),
    ('Soğuk Demlemeler',   'soguk-demlemeler',   20),
    ('Botanik Çaylar',     'botanik-caylar',     30),
    ('Tatlılar & Atıştırmalıklar', 'tatlilar-atistirmaliklar', 40);

-- ---------------------------------------------------------------
-- Seed: Ürünler (TR, ₺)
-- ---------------------------------------------------------------
INSERT INTO products
    (category_id, name, slug, description, price, currency, image_url, is_available, sort_order)
VALUES
    -- Espresso Bazlılar
    ((SELECT id FROM categories WHERE slug='espresso-bazlilar'),
     'Lavanta Latte', 'lavanta-latte',
     'Tek menşeli çift shot espresso, yulaf sütü, ev yapımı lavanta şurubu, üzerinde yenilebilir taç yaprakları.',
     145.00, 'TRY', '/images/menu/lavanta-latte.jpg', 1, 10),

    ((SELECT id FROM categories WHERE slug='espresso-bazlilar'),
     'Ballı Kakuleli Cortado', 'balli-kakuleli-cortado',
     'Eşit oranda espresso ve buharlanmış süt, doğal bal, hafif yeşil kakule notası.',
     125.00, 'TRY', '/images/menu/balli-kakuleli-cortado.jpg', 1, 20),

    ((SELECT id FROM categories WHERE slug='espresso-bazlilar'),
     'Kavrulmuş Tereyağlı Mocha', 'kavrulmus-tereyagli-mocha',
     'Kavrulmuş tereyağlı kakao, espresso, buharlanmış süt, deniz tuzu finişi.',
     155.00, 'TRY', '/images/menu/kavrulmus-tereyagli-mocha.jpg', 1, 30),

    -- Soğuk Demlemeler
    ((SELECT id FROM categories WHERE slug='soguk-demlemeler'),
     'Zanaat Soğuk Demleme', 'zanaat-soguk-demleme',
     '18 saat yavaş demlenmiş, derin kakao ve koyu kiraz notaları. Elde kırılmış buz üzerinde.',
     130.00, 'TRY', '/images/menu/zanaat-soguk-demleme.jpg', 1, 10),

    ((SELECT id FROM categories WHERE slug='soguk-demlemeler'),
     'Portakal Çiçeği Toniği', 'portakal-cicegi-tonigi',
     'Portakal çiçeği suyu ile çalkalanmış espresso, narenciye yağı, üstte botanik tonik.',
     165.00, 'TRY', '/images/menu/portakal-cicegi-tonigi.jpg', 1, 20),

    ((SELECT id FROM categories WHERE slug='soguk-demlemeler'),
     'Vanilyalı Yulaf Nitro', 'vanilyali-yulaf-nitro',
     'Nitro soğuk demleme, Madagaskar vanilyası, barista yulaf sütü. Kadife dokulu.',
     150.00, 'TRY', '/images/menu/vanilyali-yulaf-nitro.jpg', 1, 30),

    -- Botanik Çaylar
    ((SELECT id FROM categories WHERE slug='botanik-caylar'),
     'Papatya & Kır Çiçeği', 'papatya-kir-cicegi',
     'Bütün gonca papatya, kadife çiçeği ve hafif ıhlamur. Elde bağlanmış poşet.',
     95.00, 'TRY', '/images/menu/papatya-kir-cicegi.jpg', 1, 10),

    ((SELECT id FROM categories WHERE slug='botanik-caylar'),
     'Gül & Hibiskus Soğutucusu', 'gul-hibiskus-sogutucusu',
     'Buzlu hibiskus, Şam gülü yaprakları, bir damla limon. Bardakta bahçe.',
     115.00, 'TRY', '/images/menu/gul-hibiskus-sogutucusu.jpg', 1, 20),

    -- Tatlılar & Atıştırmalıklar
    ((SELECT id FROM categories WHERE slug='tatlilar-atistirmaliklar'),
     'Antep Fıstığı & Kakuleli Kruvasan', 'antep-fistigi-kakuleli-kruvasan',
     '36 saat katmanlı, Antep fıstığı kreması, kakule şekeri.',
     110.00, 'TRY', '/images/menu/antep-fistigi-kakuleli-kruvasan.jpg', 1, 10),

    ((SELECT id FROM categories WHERE slug='tatlilar-atistirmaliklar'),
     'Zeytinyağlı Narenciye Keki', 'zeytinyagli-narenciye-keki',
     'İspanyol zeytinyağı, kan portakalı kabuğu, badem kırığı. Vegan.',
     125.00, 'TRY', '/images/menu/zeytinyagli-narenciye-keki.jpg', 1, 20),

    ((SELECT id FROM categories WHERE slug='tatlilar-atistirmaliklar'),
     'İncir & Keçi Peyniri Tostu', 'incir-keci-peyniri-tostu',
     'Ekşi mayalı ekmek, çırpılmış keçi peyniri, siyah misyon inciri, kekik balı.',
     175.00, 'TRY', '/images/menu/incir-keci-peyniri-tostu.jpg', 0, 30);

-- ---------------------------------------------------------------
-- Seed: site_content  (UI metinleri)
-- ---------------------------------------------------------------
INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    -- Marka
    ('brand.logo_text',     '',                                                                                 'brand',  'Header logo yazisi'),
    ('brand.name',          'Lume Mia Coffee',                                                                  'brand',  'Marka adı'),
    ('brand.tagline',       'Botanik demlemeler, yavaşça servis edilir.',                                       'brand',  'Marka sloganı'),
    ('brand.watermark',     'Lume Mia',                                                                         'brand',  'Logo filigranı'),

    -- Navigasyon
    ('nav.menu',            'Menü',                                                                             'nav',    'Menü linki'),
    ('nav.story',           'Hikâyemiz',                                                                        'nav',    'Hikâye linki'),
    ('nav.visit',           'Ziyaret',                                                                          'nav',    'Ziyaret linki'),
    ('nav.contact',         'İletişim',                                                                         'nav',    'İletişim linki'),

    -- Hero  (Giriş bölümü — sayfanın en üstündeki kart)
    ('hero.main_title',     'BOTANİK\nDEMLEMELER',                                                              'hero',   'Ana başlık (her satır yeni satır karakteri ile ayrılır)'),
    ('hero.tags',           'Tek Menşe, Küçük Parti, Yerinde Kavrulmuş',                                        'hero',   'Etiketler (virgülle ayrılır)'),
    ('hero.cta',            'Menüyü keşfet',                                                                    'hero',   'Buton metni — Hero altında'),

    -- Taste
    ('taste.title',         'ANI TADIN',                                                                        'taste',  'Bölüm başlığı'),
    ('taste.body',          'Spesiyalite kahve, hafif lezzetler ve şehrin yemyeşil bir köşesinde sakin sabahlar.', 'taste', 'Açıklama paragrafı'),
    ('taste.cta',           'Masa ayırt',                                                                       'taste',  'Buton metni'),

    -- Botanical Brews
    ('botanical.title',     'BOTANİK\nDEMLEMELER',                                                              'botanical', 'Bölüm başlığı (her satır yeni satır karakteri ile)'),
    ('botanical.body',      'Taze yapraklar. Berrak notalar. Sakin enerji.',                                    'botanical', 'Açıklama paragrafı'),
    ('botanical.cta',       'Hikâyemizi okuyun',                                                                'botanical', 'Buton metni'),

    -- Plant Based
    ('plant.title',         'BİTKİSEL',                                                                         'plant',  'Bölüm başlığı'),
    ('plant.body',          'Süt alternatifleri ve mevsim taze malzemeler.',                                    'plant',  'Açıklama paragrafı'),
    ('plant.cta',           'Vegan seçenekleri gör',                                                            'plant',  'Buton metni'),
    ('plant.tags',          'Yulaf / Badem / Soya, Mevsim Sebze & Meyve, Yapay Aroma Yok',                      'plant',  'Etiketler (virgülle ayrılır)'),

    -- Freshly Roasted
    ('roasted.title',       'YENİ\nKAVRULDU',                                                                   'roasted','Bölüm başlığı (her satır yeni satır karakteri ile)'),
    ('roasted.body',        'Kahveyi küçük partilerde kavurur, gün boyu demleriz — her fincan size özel hazırlanmış gibi tat alır.', 'roasted', 'Açıklama paragrafı'),
    ('roasted.cta',         'Bugünün kavurmasını sor',                                                          'roasted','Buton metni'),

    -- Barista Craft
    ('barista.title',       'BARİSTA ZANAATI',                                                                  'barista','Bölüm başlığı'),
    ('barista.tags',        'Her Gün El Emeği, Hassas Demleme, Sıcak Servis',                                   'barista','Etiketler (virgülle ayrılır)'),
    ('barista.cta',         'Ekibimizle tanışın',                                                               'barista','Buton metni'),

    -- Slow Down
    ('slowdown.title',      'YAVAŞLAYIN',                                                                       'slowdown','Başlık'),
    ('slowdown.body',       'Doğal ışık, yapraklı köşeler ve oyalanmak için hazırlanmış bir çalma listesi.',    'slowdown','Açıklama'),
    ('slowdown.cta',        'Yaklaşan etkinliklere bak',                                                        'slowdown','CTA'),

    -- Coffee Selection
    ('selection.ring',      'KAHVE SEÇKİMİZ • TEK MENŞE & EV HARMANLARI •',                                     'selection','Halka yazısı'),
    ('selection.body',      'Tek menşe çekirdekler ve özenle hazırlanmış ev harmanları.',                       'selection','Açıklama'),
    ('selection.cta',       'Tüm menüyü gör',                                                                   'selection','CTA'),

    -- Menu
    ('menu.title',          'MENÜ',                                                                             'menu',   'Menü başlığı'),
    ('menu.subtitle',       'Mevsime göre değişir, her gün taze. Tüm fiyatlara KDV dahildir.',                  'menu',   'Menü alt başlık'),
    ('menu.tag_hot',        'sıcak',                                                                            'menu',   'Sıcak etiket'),
    ('menu.tag_iced',       'soğuk',                                                                            'menu',   'Soğuk etiket'),
    ('menu.extras_title',   'EKSTRALAR',                                                                        'menu',   'Ekstralar başlığı'),
    ('menu.extras_note',    'Hafif tatlılar her gün taze — bugünün seçimi için baristamıza danışın.',           'menu',   'Ekstralar notu'),

    -- Visit
    ('visit.title',         'BİZİ ZİYARET EDİN',                                                                'visit',  'Bölüm başlığı'),
    ('visit.address',       'Bomonti Mah. Cumhuriyet Cad. No:14\nŞişli / İstanbul — Botanik Bahçe yakını',      'visit',  'Adres (her satır yeni satır karakteri ile)'),
    ('visit.hours_label',   'Çalışma Saatleri',                                                                 'visit',  'Saatler etiketi'),
    ('visit.weekday_label', 'Pzt – Cum',                                                                        'visit',  'Hafta içi etiketi'),
    ('visit.weekday_hours', '07:00 – 21:00',                                                                    'visit',  'Hafta içi saatleri'),
    ('visit.weekend_label', 'Cmt – Paz',                                                                        'visit',  'Hafta sonu etiketi'),
    ('visit.weekend_hours', '08:00 – 22:00',                                                                    'visit',  'Hafta sonu saatleri'),
    ('visit.phone',         '+90 (212) 555 01 19',                                                              'visit',  'Telefon'),
    ('visit.email',         'merhaba@lumemia.coffee',                                                           'visit',  'E-posta'),
    ('visit.cta_directions','Yol tarifi al',                                                                    'visit',  'Yön CTA'),
    ('visit.cta_reserve',   'Masa ayırt',                                                                       'visit',  'Rezervasyon CTA'),

    -- Newsletter
    ('newsletter.title',    'LUME MIA ÇEMBERİNE KATILIN',                                                       'newsletter','Başlık'),
    ('newsletter.body',     'Yeni gelen kavurmalara, mevsimsel menülere ve mahalle etkinliklerine erken erişim.', 'newsletter','Açıklama'),
    ('newsletter.placeholder','E-posta adresiniz',                                                              'newsletter','Placeholder'),
    ('newsletter.cta',      'Abone ol',                                                                         'newsletter','CTA'),
    ('newsletter.cta_done', 'Abone olundu!',                                                                    'newsletter','Tamamlandı butonu'),
    ('newsletter.success',  'Katıldığınız için teşekkürler! Hoş geldin notumuz için gelen kutunuzu kontrol edin.','newsletter','Başarı mesajı'),
    ('newsletter.social_ig','Instagram',                                                                        'newsletter','Sosyal IG'),
    ('newsletter.social_fb','Facebook',                                                                         'newsletter','Sosyal FB'),
    ('newsletter.social_tt','TikTok',                                                                           'newsletter','Sosyal TT'),

    -- Footer
    ('footer.note_title',   'BİR NOT BIRAKIN',                                                                  'footer', 'Not başlığı'),
    ('footer.note_sent',    'Mesajınız gönderildi!',                                                            'footer', 'Gönderildi başlık'),
    ('footer.note_sent_sub','24 saat içinde size dönüş yapacağız.',                                             'footer', 'Gönderildi alt yazı'),
    ('footer.field_name',   'Adınız',                                                                           'footer', 'İsim placeholder'),
    ('footer.field_email',  'E-posta adresiniz',                                                                'footer', 'E-posta placeholder'),
    ('footer.field_message','Mesajınız',                                                                        'footer', 'Mesaj placeholder'),
    ('footer.field_submit', 'Mesajı gönder',                                                                    'footer', 'Gönder butonu'),
    ('footer.call_title',   'ARAMAK MI İSTERSİNİZ?',                                                            'footer', 'Arama başlığı'),
    ('footer.phone',        '+90 (212) 555 01 19',                                                              'footer', 'Telefon'),
    ('footer.email',        'merhaba@lumemia.coffee',                                                           'footer', 'E-posta'),
    ('footer.links_title',  'Hızlı Erişim',                                                                     'footer', 'Link grup başlığı'),
    ('footer.link_menu',    'Menü',                                                                             'footer', 'Link menü'),
    ('footer.link_story',   'Hikâyemiz',                                                                        'footer', 'Link hikâye'),
    ('footer.link_visit',   'Ziyaret',                                                                          'footer', 'Link ziyaret'),
    ('footer.copyright',    '© 2026 Lume Mia Coffee. Tüm hakları saklıdır.',                                    'footer', 'Telif metni'),
    ('footer.privacy',      'Gizlilik',                                                                         'footer', 'Gizlilik linki'),
    ('footer.social_ig',    'Instagram',                                                                        'footer', 'Instagram etiketi'),
    ('footer.social_ig_url','https://www.instagram.com/',                                                       'footer', 'Instagram URL'),
    ('footer.social_fb',    'Facebook',                                                                         'footer', 'Facebook etiketi'),
    ('footer.social_fb_url','https://www.facebook.com/',                                                        'footer', 'Facebook URL'),
    ('footer.social_tt',    'TikTok',                                                                           'footer', 'TikTok etiketi'),
    ('footer.social_tt_url','https://www.tiktok.com/',                                                          'footer', 'TikTok URL'),
    ('footer.accessibility','Erişilebilirlik',                                                                  'footer', 'Erişilebilirlik linki');

-- ---------------------------------------------------------------
-- Seed: shop_settings  (mağaza bilgileri)
-- ---------------------------------------------------------------
INSERT INTO shop_settings (`key`, `value`) VALUES
    ('shop.name',          'Lume Mia Coffee'),
    ('shop.tagline',       'Botanik demlemeler, yavaşça servis edilir.'),
    ('shop.address',       'Bomonti Mah. Cumhuriyet Cad. No:14, Şişli / İstanbul'),
    ('shop.phone',         '+90 (212) 555 01 19'),
    ('shop.email',         'merhaba@lumemia.coffee'),
    ('shop.hours.weekday', '07:00 – 21:00'),
    ('shop.hours.weekend', '08:00 – 22:00'),
    ('social.instagram',   'https://instagram.com/lumemia.coffee'),
    ('social.tiktok',      'https://tiktok.com/@lumemia.coffee'),
    ('social.maps',        'https://maps.app.goo.gl/lumemia');

-- ---------------------------------------------------------------
-- Seed: appearance_settings  (Lume Mia logo paleti — derin bordo, altın, krem)
-- ---------------------------------------------------------------
INSERT INTO appearance_settings (`key`, `value`, `kind`, `group`, label, sort_order) VALUES
    -- Marka renkleri
    ('brand-primary',      '#6B1F2A', 'color', 'theme', 'Birincil (bordo)',          10),
    ('brand-primary-dark', '#4A1218', 'color', 'theme', 'Birincil koyu',             20),
    ('brand-accent',       '#C9A961', 'color', 'theme', 'Vurgu (altın)',             30),
    ('brand-accent-soft',  '#E2C68A', 'color', 'theme', 'Vurgu açık',                40),

    -- Yüzeyler
    ('surface-cream',      '#F4EFE6', 'color', 'theme', 'Krem zemin',                50),
    ('surface-paper',      '#FAF6EE', 'color', 'theme', 'Kağıt zemin',               60),
    ('surface-ink',        '#2A1A1C', 'color', 'theme', 'Mürekkep (koyu)',           70),
    ('surface-mist',       '#EDE4D3', 'color', 'theme', 'Pus (yumuşak)',             80),

    -- Metin
    ('text-primary',       '#2A1A1C', 'color', 'theme', 'Birincil metin',            90),
    ('text-on-dark',       '#F4EFE6', 'color', 'theme', 'Koyu üzerinde metin',      100),
    ('text-muted',         '#7A6B5D', 'color', 'theme', 'Soluk metin',              110),

    -- Kenarlık
    ('border-soft',        '#E0D4BE', 'color', 'theme', 'Yumuşak kenarlık',         120),

    -- Marka
    ('logo-url',           '/images/logo.svg',         'url',  'brand', 'Logo URL',          200),
    ('logo-mark-url',      '/images/logo-mark.svg',    'url',  'brand', 'Logo işareti URL',  210),
    ('brand-name',         'Lume Mia Coffee',          'text', 'brand', 'Marka adı',         220),

    -- Tipografi
    ('font-display',       'Cormorant Garamond, serif', 'font', 'typography', 'Başlık fontu', 300),
    ('font-body',          'Inter, sans-serif',         'font', 'typography', 'Gövde fontu',  310),

    -- Yerleşim & davranış
    ('menu_cta.background',   'dotted', 'option', 'layout', 'Menü CTA arka planı (dotted | cream)',     400),
    ('nav.solid_on_subpages', 'true',   'option', 'layout', 'Alt sayfalarda tepe çubuğu opak başlasın', 410),
    ('menu.compact_footer',   'true',   'option', 'layout', 'Menü sayfasında kompakt footer',           420);

