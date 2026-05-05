-- ---------------------------------------------------------------
-- Migration: 2026-05-03
-- Consolidate word-level site_content rows into sentence/phrase blocks.
-- Idempotent: safe to re-run.
-- ---------------------------------------------------------------

SET NAMES utf8mb4;

-- Hero ----------------------------------------------------------
INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    ('hero.main_title',
     CONCAT(
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='hero.title_line1') x), 'BOTANİK'),
        '\n',
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='hero.title_line2') x), 'DEMLEMELER')
     ),
     'hero', 'Ana başlık (her satır yeni satır karakteri ile ayrılır)')
ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), label = VALUES(label);

INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    ('hero.tags',
     CONCAT_WS(', ',
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='hero.tag1') x),
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='hero.tag2') y),
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='hero.tag3') z)
     ),
     'hero', 'Etiketler (virgülle ayrılır)')
ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), label = VALUES(label);

UPDATE site_content SET label = 'Buton metni — Hero altında' WHERE `key` = 'hero.cta';

DELETE FROM site_content WHERE `key` IN
    ('hero.title_line1','hero.title_line2','hero.tag1','hero.tag2','hero.tag3');

-- Botanical -----------------------------------------------------
INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    ('botanical.title',
     CONCAT(
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='botanical.title_line1') x), 'BOTANİK'),
        '\n',
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='botanical.title_line2') x), 'DEMLEMELER')
     ),
     'botanical', 'Bölüm başlığı (her satır yeni satır karakteri ile)')
ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), label = VALUES(label);

DELETE FROM site_content WHERE `key` IN ('botanical.title_line1','botanical.title_line2');

-- Roasted -------------------------------------------------------
INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    ('roasted.title',
     CONCAT(
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='roasted.title_line1') x), 'YENİ'),
        '\n',
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='roasted.title_line2') x), 'KAVRULDU')
     ),
     'roasted', 'Bölüm başlığı (her satır yeni satır karakteri ile)')
ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), label = VALUES(label);

DELETE FROM site_content WHERE `key` IN ('roasted.title_line1','roasted.title_line2');

-- Plant ---------------------------------------------------------
INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    ('plant.tags',
     CONCAT_WS(', ',
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='plant.tag1') x),
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='plant.tag2') y),
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='plant.tag3') z)
     ),
     'plant', 'Etiketler (virgülle ayrılır)')
ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), label = VALUES(label);

DELETE FROM site_content WHERE `key` IN ('plant.tag1','plant.tag2','plant.tag3');

-- Barista -------------------------------------------------------
INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    ('barista.tags',
     CONCAT_WS(', ',
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='barista.tag1') x),
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='barista.tag2') y),
        (SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='barista.tag3') z)
     ),
     'barista', 'Etiketler (virgülle ayrılır)')
ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), label = VALUES(label);

DELETE FROM site_content WHERE `key` IN ('barista.tag1','barista.tag2','barista.tag3');

-- Visit ---------------------------------------------------------
INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
    ('visit.address',
     CONCAT(
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='visit.address_line1') x), 'Bomonti Mah. Cumhuriyet Cad. No:14'),
        '\n',
        COALESCE((SELECT v FROM (SELECT value_tr v FROM site_content WHERE `key`='visit.address_line2') x), 'Şişli / İstanbul')
     ),
     'visit', 'Adres (her satır yeni satır karakteri ile)')
ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), label = VALUES(label);

DELETE FROM site_content WHERE `key` IN ('visit.address_line1','visit.address_line2');
