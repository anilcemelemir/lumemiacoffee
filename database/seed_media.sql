-- Step 12 — Total Media Sovereignty
-- Seeds homepage image URLs into site_content as group='media-<section>'.
-- Idempotent: INSERT IGNORE preserves any URL the admin has already changed.

INSERT IGNORE INTO site_content (`key`, value_tr, `group`, label) VALUES
  -- HERO
  ('media.hero.latte',         '/images/hero_latte.jpg',         'media-hero',      'Hero · Sol kart (latte detayı)'),
  ('media.hero.collage',       '/images/hero_collage.jpg',       'media-hero',      'Hero · Sağ büyük kart (mekân)'),
  ('media.hero.pour_overlay',  '/images/moment_pour.jpg',        'media-hero',      'Hero · Sol üst bindirme kartı (akıtma anı)'),

  -- TASTE
  ('media.taste.hand',         '/images/moment_hand.jpg',        'media-taste',     'Anı Tadın · Sol kart (el ve fincan)'),
  ('media.taste.latte',        '/images/moment_latte.jpg',       'media-taste',     'Anı Tadın · Orta kart (latte art)'),
  ('media.taste.pour',         '/images/moment_pour.jpg',        'media-taste',     'Anı Tadın · Sağ kart (akıtma anı)'),

  -- PLANT-BASED
  ('media.plant.background',   '/images/plant_based.jpg',        'media-plant',     'Bitkisel · Ana kart (hazırlık)'),
  ('media.plant.jug',          '/images/plant_jug.jpg',          'media-plant',     'Bitkisel · Bindirme kartı (sürahi)'),

  -- FRESHLY ROASTED
  ('media.roasted.beans_1',    '/images/beans_01.jpg',           'media-roasted',   'Yeni Kavruldu · Çekirdek 1'),
  ('media.roasted.beans_2',    '/images/beans_02.jpg',           'media-roasted',   'Yeni Kavruldu · Çekirdek 2'),
  ('media.roasted.beans_3',    '/images/beans_03.jpg',           'media-roasted',   'Yeni Kavruldu · Çekirdek 3'),
  ('media.roasted.beans_4',    '/images/beans_04.jpg',           'media-roasted',   'Yeni Kavruldu · Çekirdek 4'),
  ('media.roasted.machine',    '/images/roasting_machine.jpg',   'media-roasted',   'Yeni Kavruldu · Sağ kart (kavurma makinesi)'),
  ('media.roasted.cup',        '/images/roasted_cup.jpg',        'media-roasted',   'Yeni Kavruldu · Üst kart (fincan)'),

  -- BARISTA CRAFT
  ('media.barista.portrait',   '/images/barista_portrait.jpg',   'media-barista',   'Barista · Sol portre kartı'),
  ('media.barista.hands',      '/images/barista_hands.jpg',      'media-barista',   'Barista · Sağ büyük kart (eller)'),
  ('media.barista.at_work',    '/images/roasted_barista.jpg',    'media-barista',   'Barista · Sol üst bindirme kartı'),

  -- SLOW DOWN
  ('media.slowdown.plants',    '/images/slow_plants.jpg',        'media-slowdown',  'Yavaşlayın · Sol kart (bitki duvarı)'),
  ('media.slowdown.interior',  '/images/slow_interior.jpg',      'media-slowdown',  'Yavaşlayın · Sağ kart (mekân içi)'),

  -- COFFEE SELECTION
  ('media.selection.variety',  '/images/bean_trip_01.jpg',       'media-selection', 'Kahve Seçkimiz · Sol kart (çeşitler)'),
  ('media.selection.closeup',  '/images/bean_trip_02.jpg',       'media-selection', 'Kahve Seçkimiz · Orta kart (yakın çekim)'),
  ('media.selection.origin',   '/images/bean_trip_03.jpg',       'media-selection', 'Kahve Seçkimiz · Sağ kart (köken)'),

  -- VISIT
  ('media.visit.interior',     '/images/visit_interior.jpg',     'media-visit',     'Bizi Ziyaret Edin · Mekân fotoğrafı');
