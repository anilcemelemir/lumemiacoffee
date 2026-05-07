-- Repair labels that were inserted with broken Turkish characters.
-- Values are written as UTF-8 hex to avoid client encoding surprises.

UPDATE site_content SET label = _utf8mb4 0x496e74726f20c3bc7374206574696b657469 WHERE `key` = 'intro.kicker';
UPDATE site_content SET label = _utf8mb4 0x496e74726f20616e61206261c59f6cc4b16b WHERE `key` = 'intro.title';
UPDATE site_content SET label = _utf8mb4 0x496e74726f2061c3a7c4b16b6c616d61206d65746e69 WHERE `key` = 'intro.body';
UPDATE site_content SET label = _utf8mb4 0x496e74726f206bc4b173612076757267752031 WHERE `key` = 'intro.metric_1';
UPDATE site_content SET label = _utf8mb4 0x496e74726f206bc4b173612076757267752032 WHERE `key` = 'intro.metric_2';
UPDATE site_content SET label = _utf8mb4 0x496e74726f206bc4b173612076757267752033 WHERE `key` = 'intro.metric_3';
UPDATE site_content SET label = _utf8mb4 0x496e74726f206275746f6e206d65746e69 WHERE `key` = 'intro.cta';
UPDATE site_content SET label = _utf8mb4 0x4b7572756d73616c2061c3a7c4b16cc4b1c59f2062616e64c4b12061726b6120706c616e2067c3b67273656c69 WHERE `key` = 'media.intro.banner';
