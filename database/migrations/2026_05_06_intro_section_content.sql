-- Adds editable content and media slots for the full-bleed corporate intro band.
-- Idempotent: preserves existing admin edits on rerun.

INSERT IGNORE INTO site_content (`key`, value_tr, `group`, label) VALUES
  ('intro.kicker',   'Lume Mia Coffee', 'intro', 'Intro üst etiketi'),
  ('intro.title',    'Kurumsal kahve deneyimi', 'intro', 'Intro ana başlık'),
  ('intro.body',     'Lume Mia, seçili çekirdekleri, sakin servis dilini ve botanik atmosferini aynı standartta buluşturan çağdaş bir kahve evidir. Her fincan; izlenebilir tedarik, dikkatli kavurma ve tutarlı misafir deneyimi üzerine kurulur.', 'intro', 'Intro açıklama metni'),
  ('intro.metric_1', 'Seçili tedarik', 'intro', 'Intro kısa vurgu 1'),
  ('intro.metric_2', 'Günlük hazırlık', 'intro', 'Intro kısa vurgu 2'),
  ('intro.metric_3', 'Net servis standardı', 'intro', 'Intro kısa vurgu 3'),
  ('intro.cta',      'Hikayemizi incele', 'intro', 'Intro buton metni'),
  ('media.intro.banner', '/images/visit_interior.jpg', 'media-intro', 'Kurumsal açılış bandı arka plan görseli');
