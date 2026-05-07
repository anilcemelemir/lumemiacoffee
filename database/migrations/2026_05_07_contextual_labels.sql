-- ---------------------------------------------------------------
-- Migration: Contextual UI Naming System
-- Renames all site_content labels to positional format:
--   [Page] > [Section] > [Specific Area]
-- ---------------------------------------------------------------

SET NAMES utf8mb4;

-- Brand
UPDATE site_content SET label = 'Tüm Sayfalar > Başlık & Footer > Logo Yazısı'          WHERE `key` = 'brand.logo_text';
UPDATE site_content SET label = 'Tüm Sayfalar > Başlık & Footer > Marka Adı'            WHERE `key` = 'brand.name';
UPDATE site_content SET label = 'Tüm Sayfalar > Başlık & Footer > Marka Sloganı'        WHERE `key` = 'brand.tagline';
UPDATE site_content SET label = 'Tüm Sayfalar > Arka Plan > Logo Filigranı'             WHERE `key` = 'brand.watermark';

-- Navigation
UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > Menü Linki'                 WHERE `key` = 'nav.menu';
UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > Hikâye Linki'               WHERE `key` = 'nav.story';
UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > Ziyaret Linki'              WHERE `key` = 'nav.visit';
UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > İletişim Linki'             WHERE `key` = 'nav.contact';

-- Hero (Section 1)
UPDATE site_content SET label = 'Anasayfa > Hero (Bölüm 1) > Ana Başlık'               WHERE `key` = 'hero.main_title';
UPDATE site_content SET label = 'Anasayfa > Hero (Bölüm 1) > Etiketler'                WHERE `key` = 'hero.tags';
UPDATE site_content SET label = 'Anasayfa > Hero (Bölüm 1) > Buton Metni (CTA)'        WHERE `key` = 'hero.cta';

-- Taste the Moment (Section 2)
UPDATE site_content SET label = 'Anasayfa > Anı Tadın (Bölüm 2) > Bölüm Başlığı'      WHERE `key` = 'taste.title';
UPDATE site_content SET label = 'Anasayfa > Anı Tadın (Bölüm 2) > Açıklama Paragrafı'  WHERE `key` = 'taste.body';
UPDATE site_content SET label = 'Anasayfa > Anı Tadın (Bölüm 2) > Buton Metni (CTA)'   WHERE `key` = 'taste.cta';

-- Botanical Brews (Section 3)
UPDATE site_content SET label = 'Anasayfa > Botanik Demlemeler (Bölüm 3) > Bölüm Başlığı'     WHERE `key` = 'botanical.title';
UPDATE site_content SET label = 'Anasayfa > Botanik Demlemeler (Bölüm 3) > Açıklama Paragrafı' WHERE `key` = 'botanical.body';
UPDATE site_content SET label = 'Anasayfa > Botanik Demlemeler (Bölüm 3) > Buton Metni (CTA)'  WHERE `key` = 'botanical.cta';

-- Plant-Based (Section 4)
UPDATE site_content SET label = 'Anasayfa > Bitkisel (Bölüm 4) > Bölüm Başlığı'       WHERE `key` = 'plant.title';
UPDATE site_content SET label = 'Anasayfa > Bitkisel (Bölüm 4) > Açıklama Paragrafı'   WHERE `key` = 'plant.body';
UPDATE site_content SET label = 'Anasayfa > Bitkisel (Bölüm 4) > Buton Metni (CTA)'    WHERE `key` = 'plant.cta';
UPDATE site_content SET label = 'Anasayfa > Bitkisel (Bölüm 4) > Etiketler'            WHERE `key` = 'plant.tags';

-- Freshly Roasted (Section 5)
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu (Bölüm 5) > Bölüm Başlığı'       WHERE `key` = 'roasted.title';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu (Bölüm 5) > Açıklama Paragrafı'   WHERE `key` = 'roasted.body';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu (Bölüm 5) > Buton Metni (CTA)'    WHERE `key` = 'roasted.cta';

-- Barista Craft (Section 6)
UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı (Bölüm 6) > Bölüm Başlığı'     WHERE `key` = 'barista.title';
UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı (Bölüm 6) > Etiketler'          WHERE `key` = 'barista.tags';
UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı (Bölüm 6) > Buton Metni (CTA)'  WHERE `key` = 'barista.cta';

-- Slow Down (Section 7)
UPDATE site_content SET label = 'Anasayfa > Yavaşlayın (Bölüm 7) > Başlık'              WHERE `key` = 'slowdown.title';
UPDATE site_content SET label = 'Anasayfa > Yavaşlayın (Bölüm 7) > Açıklama'            WHERE `key` = 'slowdown.body';
UPDATE site_content SET label = 'Anasayfa > Yavaşlayın (Bölüm 7) > Buton Metni (CTA)'   WHERE `key` = 'slowdown.cta';

-- Coffee Selection (Section 8)
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz (Bölüm 8) > Halka Yazısı'    WHERE `key` = 'selection.ring';
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz (Bölüm 8) > Açıklama'        WHERE `key` = 'selection.body';
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz (Bölüm 8) > Buton Metni (CTA)' WHERE `key` = 'selection.cta';

-- Menu (Section 9)
UPDATE site_content SET label = 'Anasayfa > Menü Önizlemesi (Bölüm 9) > Başlık'         WHERE `key` = 'menu.title';
UPDATE site_content SET label = 'Anasayfa > Menü Önizlemesi (Bölüm 9) > Alt Başlık'     WHERE `key` = 'menu.subtitle';
UPDATE site_content SET label = 'Anasayfa > Menü Önizlemesi (Bölüm 9) > Sıcak Etiketi'  WHERE `key` = 'menu.tag_hot';
UPDATE site_content SET label = 'Anasayfa > Menü Önizlemesi (Bölüm 9) > Soğuk Etiketi'  WHERE `key` = 'menu.tag_iced';
UPDATE site_content SET label = 'Anasayfa > Menü Önizlemesi (Bölüm 9) > Ekstralar Başlığı' WHERE `key` = 'menu.extras_title';
UPDATE site_content SET label = 'Anasayfa > Menü Önizlemesi (Bölüm 9) > Ekstralar Notu' WHERE `key` = 'menu.extras_note';

-- Visit (Section 10)
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Bölüm Başlığı'        WHERE `key` = 'visit.title';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Adres'                 WHERE `key` = 'visit.address';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Saatler Etiketi'       WHERE `key` = 'visit.hours_label';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Hafta İçi Etiketi'     WHERE `key` = 'visit.weekday_label';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Hafta İçi Saatleri'    WHERE `key` = 'visit.weekday_hours';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Hafta Sonu Etiketi'    WHERE `key` = 'visit.weekend_label';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Hafta Sonu Saatleri'   WHERE `key` = 'visit.weekend_hours';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Telefon'               WHERE `key` = 'visit.phone';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > E-posta'               WHERE `key` = 'visit.email';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Yol Tarifi CTA'        WHERE `key` = 'visit.cta_directions';
UPDATE site_content SET label = 'Anasayfa > Ziyaret (Bölüm 10) > Rezervasyon CTA'       WHERE `key` = 'visit.cta_reserve';

-- Newsletter (Section 11)
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Başlık'                 WHERE `key` = 'newsletter.title';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Açıklama'               WHERE `key` = 'newsletter.body';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Form Placeholder'       WHERE `key` = 'newsletter.placeholder';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Abone Ol Butonu'        WHERE `key` = 'newsletter.cta';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Abone Olundu Butonu'    WHERE `key` = 'newsletter.cta_done';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Başarı Mesajı'          WHERE `key` = 'newsletter.success';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Instagram Etiketi'      WHERE `key` = 'newsletter.social_ig';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > Facebook Etiketi'       WHERE `key` = 'newsletter.social_fb';
UPDATE site_content SET label = 'Anasayfa > Bülten (Bölüm 11) > TikTok Etiketi'         WHERE `key` = 'newsletter.social_tt';

-- Footer (Section 12)
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Not Formu Başlığı'      WHERE `key` = 'footer.note_title';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Gönderildi Başlık'      WHERE `key` = 'footer.note_sent';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Gönderildi Alt Yazı'    WHERE `key` = 'footer.note_sent_sub';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > İsim Placeholder'       WHERE `key` = 'footer.field_name';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > E-posta Placeholder'    WHERE `key` = 'footer.field_email';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Mesaj Placeholder'      WHERE `key` = 'footer.field_message';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Gönder Butonu'          WHERE `key` = 'footer.field_submit';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Arama Başlığı'          WHERE `key` = 'footer.call_title';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Telefon'                WHERE `key` = 'footer.phone';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > E-posta'                WHERE `key` = 'footer.email';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Hızlı Erişim Başlığı'   WHERE `key` = 'footer.links_title';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Menü Linki'             WHERE `key` = 'footer.link_menu';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Hikâye Linki'           WHERE `key` = 'footer.link_story';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Ziyaret Linki'          WHERE `key` = 'footer.link_visit';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Telif Satırı'           WHERE `key` = 'footer.copyright';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Gizlilik Linki'         WHERE `key` = 'footer.privacy';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Instagram Etiketi'      WHERE `key` = 'footer.social_ig';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Instagram URL'          WHERE `key` = 'footer.social_ig_url';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Facebook Etiketi'       WHERE `key` = 'footer.social_fb';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Facebook URL'           WHERE `key` = 'footer.social_fb_url';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > TikTok Etiketi'         WHERE `key` = 'footer.social_tt';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > TikTok URL'             WHERE `key` = 'footer.social_tt_url';
UPDATE site_content SET label = 'Anasayfa > Footer (Bölüm 12) > Erişilebilirlik Linki'  WHERE `key` = 'footer.accessibility';

-- Story page (if exists)
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Üst Başlık (Kırmızı Yazı)' WHERE `key` = 'story.eyebrow';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Sayfa Başlığı'              WHERE `key` = 'story.title';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Spot Paragraf'              WHERE `key` = 'story.intro';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Sağ Kart Görseli'           WHERE `key` = 'story.image';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > İçerik > Ana Metin Bloğu (HTML)'    WHERE `key` = 'story.body_html';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Alt > Buton Metni (CTA)'            WHERE `key` = 'story.cta_label';

-- Intro section (if exists)
UPDATE site_content SET label = 'Anasayfa > Intro Bandı (Üst) > Üst Başlık'             WHERE `key` = 'intro.eyebrow';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı (Üst) > Ana Başlık'             WHERE `key` = 'intro.main_title';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı (Üst) > Açıklama'               WHERE `key` = 'intro.body';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı (Üst) > Buton Metni (CTA)'      WHERE `key` = 'intro.cta';
