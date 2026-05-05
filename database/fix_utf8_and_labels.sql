-- =====================================================================
-- Deep UTF-8 cleanup + concise label rewrite for site_content.
-- Safe to re-run.
-- =====================================================================

ALTER DATABASE `lumemia` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE `site_content`         CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `appearance_settings`  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `categories`           CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `products`             CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `users`                CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `shop_settings`        CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------- BRAND / NAV ----------
UPDATE site_content SET label='Marka Adı'        WHERE `key`='brand.name';
UPDATE site_content SET label='Slogan'           WHERE `key`='brand.tagline';
UPDATE site_content SET label='Logo Filigranı'   WHERE `key`='brand.watermark';
UPDATE site_content SET label='Menü'             WHERE `key`='nav.menu';
UPDATE site_content SET label='Hikâye'           WHERE `key`='nav.story';
UPDATE site_content SET label='Ziyaret'          WHERE `key`='nav.visit';
UPDATE site_content SET label='İletişim'         WHERE `key`='nav.contact';

-- ---------- HERO ----------
UPDATE site_content SET label='Ana Başlık'       WHERE `key`='hero.main_title';
UPDATE site_content SET label='Etiketler'        WHERE `key`='hero.tags';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='hero.cta';

-- ---------- TASTE ----------
UPDATE site_content SET label='Başlık'           WHERE `key`='taste.title';
UPDATE site_content SET label='Açıklama'         WHERE `key`='taste.body';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='taste.cta';

-- ---------- BOTANICAL ----------
UPDATE site_content SET label='Başlık'           WHERE `key`='botanical.title';
UPDATE site_content SET label='Açıklama'         WHERE `key`='botanical.body';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='botanical.cta';

-- ---------- SLOWDOWN ----------
UPDATE site_content SET label='Başlık'           WHERE `key`='slowdown.title';
UPDATE site_content SET label='Açıklama'         WHERE `key`='slowdown.body';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='slowdown.cta';

-- ---------- PLANT ----------
UPDATE site_content SET label='Başlık'           WHERE `key`='plant.title';
UPDATE site_content SET label='Açıklama'         WHERE `key`='plant.body';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='plant.cta';
UPDATE site_content SET label='Etiketler'        WHERE `key`='plant.tags';

-- ---------- ROASTED ----------
UPDATE site_content SET label='Ana Başlık'       WHERE `key`='roasted.title';
UPDATE site_content SET label='Açıklama'         WHERE `key`='roasted.body';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='roasted.cta';

-- ---------- BARISTA ----------
UPDATE site_content SET label='Başlık'           WHERE `key`='barista.title';
UPDATE site_content SET label='Etiketler'        WHERE `key`='barista.tags';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='barista.cta';

-- ---------- SELECTION ----------
UPDATE site_content SET label='Açıklama'         WHERE `key`='selection.body';
UPDATE site_content SET label='Buton Metni'      WHERE `key`='selection.cta';
UPDATE site_content SET label='Halka Yazısı'     WHERE `key`='selection.ring';

-- ---------- MENU ----------
UPDATE site_content SET label='Başlık'              WHERE `key`='menu.title';
UPDATE site_content SET label='Alt Başlık'          WHERE `key`='menu.subtitle';
UPDATE site_content SET label='Sıcak Etiket'        WHERE `key`='menu.tag_hot';
UPDATE site_content SET label='Soğuk Etiket'        WHERE `key`='menu.tag_iced';
UPDATE site_content SET label='Ekstralar Başlığı'   WHERE `key`='menu.extras_title';
UPDATE site_content SET label='Ekstralar Notu'      WHERE `key`='menu.extras_note';

-- ---------- VISIT ----------
UPDATE site_content SET label='Başlık'             WHERE `key`='visit.title';
UPDATE site_content SET label='Adres'              WHERE `key`='visit.address';
UPDATE site_content SET label='Telefon'            WHERE `key`='visit.phone';
UPDATE site_content SET label='E-posta'            WHERE `key`='visit.email';
UPDATE site_content SET label='Saatler Etiketi'    WHERE `key`='visit.hours_label';
UPDATE site_content SET label='Hafta İçi Etiketi'  WHERE `key`='visit.weekday_label';
UPDATE site_content SET label='Hafta İçi Saatleri' WHERE `key`='visit.weekday_hours';
UPDATE site_content SET label='Hafta Sonu Etiketi' WHERE `key`='visit.weekend_label';
UPDATE site_content SET label='Hafta Sonu Saatleri' WHERE `key`='visit.weekend_hours';
UPDATE site_content SET label='Yön Tarifi Butonu'  WHERE `key`='visit.cta_directions';
UPDATE site_content SET label='Rezervasyon Butonu' WHERE `key`='visit.cta_reserve';

-- ---------- NEWSLETTER ----------
UPDATE site_content SET label='Başlık'             WHERE `key`='newsletter.title';
UPDATE site_content SET label='Açıklama'           WHERE `key`='newsletter.body';
UPDATE site_content SET label='Buton Metni'        WHERE `key`='newsletter.cta';
UPDATE site_content SET label='Tamamlandı Butonu'  WHERE `key`='newsletter.cta_done';
UPDATE site_content SET label='Placeholder'        WHERE `key`='newsletter.placeholder';
UPDATE site_content SET label='Başarı Mesajı'      WHERE `key`='newsletter.success';
UPDATE site_content SET label='Facebook Etiketi'   WHERE `key`='newsletter.social_fb';
UPDATE site_content SET label='Instagram Etiketi'  WHERE `key`='newsletter.social_ig';
UPDATE site_content SET label='TikTok Etiketi'     WHERE `key`='newsletter.social_tt';

-- ---------- FOOTER ----------
UPDATE site_content SET label='Arama Başlığı'         WHERE `key`='footer.call_title';
UPDATE site_content SET label='Telefon'               WHERE `key`='footer.phone';
UPDATE site_content SET label='E-posta'               WHERE `key`='footer.email';
UPDATE site_content SET label='Not Başlığı'           WHERE `key`='footer.note_title';
UPDATE site_content SET label='İsim Placeholder'      WHERE `key`='footer.field_name';
UPDATE site_content SET label='E-posta Placeholder'   WHERE `key`='footer.field_email';
UPDATE site_content SET label='Mesaj Placeholder'     WHERE `key`='footer.field_message';
UPDATE site_content SET label='Gönder Butonu'         WHERE `key`='footer.field_submit';
UPDATE site_content SET label='Gönderildi Başlığı'    WHERE `key`='footer.note_sent';
UPDATE site_content SET label='Gönderildi Alt Yazı'   WHERE `key`='footer.note_sent_sub';
UPDATE site_content SET label='Bağlantılar Başlığı'   WHERE `key`='footer.links_title';
UPDATE site_content SET label='Menü Bağlantısı'       WHERE `key`='footer.link_menu';
UPDATE site_content SET label='Hikâye Bağlantısı'     WHERE `key`='footer.link_story';
UPDATE site_content SET label='Ziyaret Bağlantısı'    WHERE `key`='footer.link_visit';
UPDATE site_content SET label='Erişilebilirlik Linki' WHERE `key`='footer.accessibility';
UPDATE site_content SET label='Gizlilik Linki'        WHERE `key`='footer.privacy';
UPDATE site_content SET label='Telif Metni'           WHERE `key`='footer.copyright';

-- ---------- MEDIA ----------
UPDATE site_content SET label='Sol Kart · Latte Detayı'         WHERE `key`='media.hero.latte';
UPDATE site_content SET label='Sağ Büyük Kart · Mekân'          WHERE `key`='media.hero.collage';
UPDATE site_content SET label='Sol Üst Bindirme · Akıtma Anı'   WHERE `key`='media.hero.pour_overlay';

UPDATE site_content SET label='Sol Kart · El ve Fincan'         WHERE `key`='media.taste.hand';
UPDATE site_content SET label='Orta Kart · Latte Art'           WHERE `key`='media.taste.latte';
UPDATE site_content SET label='Sağ Kart · Akıtma Anı'           WHERE `key`='media.taste.pour';

UPDATE site_content SET label='Ana Kart · Hazırlık'             WHERE `key`='media.plant.background';
UPDATE site_content SET label='Bindirme Kartı · Sürahi'         WHERE `key`='media.plant.jug';

UPDATE site_content SET label='Çekirdek 1'                      WHERE `key`='media.roasted.beans_1';
UPDATE site_content SET label='Çekirdek 2'                      WHERE `key`='media.roasted.beans_2';
UPDATE site_content SET label='Çekirdek 3'                      WHERE `key`='media.roasted.beans_3';
UPDATE site_content SET label='Çekirdek 4'                      WHERE `key`='media.roasted.beans_4';
UPDATE site_content SET label='Sağ Kart · Kavurma Makinesi'     WHERE `key`='media.roasted.machine';
UPDATE site_content SET label='Üst Kart · Fincan'               WHERE `key`='media.roasted.cup';

UPDATE site_content SET label='Sol Portre Kartı'                WHERE `key`='media.barista.portrait';
UPDATE site_content SET label='Sağ Büyük Kart · Eller'          WHERE `key`='media.barista.hands';
UPDATE site_content SET label='Sol Üst Bindirme · İş Başında'   WHERE `key`='media.barista.at_work';

UPDATE site_content SET label='Sol Kart · Bitki Duvarı'         WHERE `key`='media.slowdown.plants';
UPDATE site_content SET label='Sağ Kart · Mekân İçi'            WHERE `key`='media.slowdown.interior';

UPDATE site_content SET label='Sol Kart · Çeşitler'             WHERE `key`='media.selection.variety';
UPDATE site_content SET label='Orta Kart · Yakın Çekim'         WHERE `key`='media.selection.closeup';
UPDATE site_content SET label='Sağ Kart · Köken'                WHERE `key`='media.selection.origin';

UPDATE site_content SET label='Mekân Fotoğrafı'                 WHERE `key`='media.visit.interior';
