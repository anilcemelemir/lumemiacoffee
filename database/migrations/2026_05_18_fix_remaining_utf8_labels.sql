SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > Menü Linki' WHERE `key` = 'nav.menu';
UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > Hikâye Linki' WHERE `key` = 'nav.story';
UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > Ziyaret Linki' WHERE `key` = 'nav.visit';
UPDATE site_content SET label = 'Tüm Sayfalar > Üst Menü > İletişim Linki' WHERE `key` = 'nav.contact';

UPDATE site_content SET label = 'Tüm Sayfalar > Marka > Marka Adı' WHERE `key` = 'brand.name';
UPDATE site_content SET label = 'Tüm Sayfalar > Marka > Logo Filigranı' WHERE `key` = 'brand.watermark';

UPDATE site_content SET label = 'Anasayfa > 1. Bölüm > Üst Etiket' WHERE `key` = 'hero.eyebrow';
UPDATE site_content SET label = 'Anasayfa > 1. Bölüm > Ana Başlık' WHERE `key` = 'hero.main_title';
UPDATE site_content SET label = 'Anasayfa > 1. Bölüm > Açıklama' WHERE `key` = 'hero.body';

UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Buton Metni' WHERE `key` = 'intro.cta';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Açıklama' WHERE `key` = 'intro.body';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Üst Etiket' WHERE `key` = 'intro.kicker';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Metrik 1' WHERE `key` = 'intro.metric_1';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Metrik 2' WHERE `key` = 'intro.metric_2';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Metrik 3' WHERE `key` = 'intro.metric_3';
UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Başlık' WHERE `key` = 'intro.title';

UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz > Başlık' WHERE `key` = 'selection.title';
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz > Açıklama' WHERE `key` = 'selection.body';
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz > Halka Yazısı' WHERE `key` = 'selection.ring';

UPDATE site_content SET label = 'Anasayfa > Anı Tadın > Başlık' WHERE `key` = 'taste.title';
UPDATE site_content SET label = 'Anasayfa > Anı Tadın > Açıklama' WHERE `key` = 'taste.body';

UPDATE site_content SET label = 'Anasayfa > Bitkisel > Başlık' WHERE `key` = 'plant.title';
UPDATE site_content SET label = 'Anasayfa > Bitkisel > Açıklama' WHERE `key` = 'plant.body';
UPDATE site_content SET label = 'Anasayfa > Botanik Demlemeler > Başlık' WHERE `key` = 'botanical.title';
UPDATE site_content SET label = 'Anasayfa > Botanik Demlemeler > Açıklama' WHERE `key` = 'botanical.body';
UPDATE site_content SET label = 'Anasayfa > Botanik Demlemeler > Buton Metni' WHERE `key` = 'botanical.cta';

UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Ana Başlık' WHERE `key` = 'roasted.title';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Açıklama' WHERE `key` = 'roasted.body';

UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı > Başlık' WHERE `key` = 'barista.title';
UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı > Açıklama' WHERE `key` = 'barista.body';

UPDATE site_content SET label = 'Anasayfa > Yavaşlayın > Başlık' WHERE `key` = 'slowdown.title';
UPDATE site_content SET label = 'Anasayfa > Yavaşlayın > Açıklama' WHERE `key` = 'slowdown.body';

UPDATE site_content SET label = 'Anasayfa > Menü Vurgusu > Üst Etiket' WHERE `key` = 'menu.cta.eyebrow';
UPDATE site_content SET label = 'Anasayfa > Menü Vurgusu > Başlık' WHERE `key` = 'menu.cta.title';
UPDATE site_content SET label = 'Anasayfa > Menü Vurgusu > Açıklama' WHERE `key` = 'menu.cta.body';
UPDATE site_content SET label = 'Anasayfa > Menü Vurgusu > Buton Metni' WHERE `key` = 'menu.cta.button';
UPDATE site_content SET label = 'Anasayfa > 9. Bölüm > Ekstralar Notu' WHERE `key` = 'menu.extras_note';
UPDATE site_content SET label = 'Anasayfa > 9. Bölüm > Ekstralar Başlığı' WHERE `key` = 'menu.extras_title';
UPDATE site_content SET label = 'Anasayfa > 9. Bölüm > Alt Başlık' WHERE `key` = 'menu.subtitle';
UPDATE site_content SET label = 'Anasayfa > 9. Bölüm > Sıcak Etiket' WHERE `key` = 'menu.tag_hot';
UPDATE site_content SET label = 'Anasayfa > 9. Bölüm > Soğuk Etiket' WHERE `key` = 'menu.tag_iced';
UPDATE site_content SET label = 'Anasayfa > 9. Bölüm > Ana Gövde Başlığı' WHERE `key` = 'menu.title';

UPDATE site_content SET label = 'Anasayfa > Ziyaret > Başlık' WHERE `key` = 'visit.title';
UPDATE site_content SET label = 'Anasayfa > Ziyaret > Yol Tarifi Butonu' WHERE `key` = 'visit.cta_directions';
UPDATE site_content SET label = 'Anasayfa > Ziyaret > Hafta İçi Etiketi' WHERE `key` = 'visit.weekday_label';
UPDATE site_content SET label = 'Anasayfa > Ziyaret > Hafta İçi Saatleri' WHERE `key` = 'visit.weekday_hours';

UPDATE site_content SET label = 'Anasayfa > Bülten > Başlık' WHERE `key` = 'newsletter.title';
UPDATE site_content SET label = 'Anasayfa > Bülten > Açıklama' WHERE `key` = 'newsletter.body';
UPDATE site_content SET label = 'Anasayfa > Bülten > Başarı Mesajı' WHERE `key` = 'newsletter.success';
UPDATE site_content SET label = 'Anasayfa > Bülten > Tamamlandı Butonu' WHERE `key` = 'newsletter.cta_done';

UPDATE site_content SET label = 'Anasayfa > Footer > Bağlantılar Başlığı' WHERE `key` = 'footer.links_title';
UPDATE site_content SET label = 'Anasayfa > Footer > Menü Bağlantısı' WHERE `key` = 'footer.link_menu';
UPDATE site_content SET label = 'Anasayfa > Footer > Hikâye Bağlantısı' WHERE `key` = 'footer.link_story';
UPDATE site_content SET label = 'Anasayfa > Footer > Ziyaret Bağlantısı' WHERE `key` = 'footer.link_visit';
UPDATE site_content SET label = 'Anasayfa > Footer > Gizlilik Linki' WHERE `key` = 'footer.privacy';
UPDATE site_content SET label = 'Anasayfa > Footer > Erişilebilirlik Linki' WHERE `key` = 'footer.accessibility';
UPDATE site_content SET label = 'Anasayfa > Footer > Arama Başlığı' WHERE `key` = 'footer.call_title';
UPDATE site_content SET label = 'Anasayfa > Footer > Not Başlığı' WHERE `key` = 'footer.note_title';
UPDATE site_content SET label = 'Anasayfa > Footer > Not Açıklaması' WHERE `key` = 'footer.note_body';
UPDATE site_content SET label = 'Anasayfa > Footer > İsim Placeholder' WHERE `key` = 'footer.field_name';
UPDATE site_content SET label = 'Anasayfa > Footer > Telefon Placeholder' WHERE `key` = 'footer.field_phone';
UPDATE site_content SET label = 'Anasayfa > Footer > Mesaj Placeholder' WHERE `key` = 'footer.field_message';
UPDATE site_content SET label = 'Anasayfa > Footer > Gönder Butonu' WHERE `key` = 'footer.field_submit';
UPDATE site_content SET label = 'Anasayfa > Footer > İzin Metni' WHERE `key` = 'footer.consent';
UPDATE site_content SET label = 'Anasayfa > Footer > Gönderildi Başlığı' WHERE `key` = 'footer.note_sent';
UPDATE site_content SET label = 'Anasayfa > Footer > Gönderildi Alt Yazı' WHERE `key` = 'footer.note_sent_sub';

UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Üst Başlık' WHERE `key` = 'story.eyebrow';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Sayfa Başlığı' WHERE `key` = 'story.title';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Spot Yazı' WHERE `key` = 'story.intro';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Giriş > Sağ Kart Görseli' WHERE `key` = 'story.image';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > İçerik > Ana Metin Bloğu' WHERE `key` = 'story.body_html';
UPDATE site_content SET label = 'Hikâyemiz Sayfası > Alt > Buton Metni' WHERE `key` = 'story.cta_label';

UPDATE site_content SET label = 'Anasayfa > Intro Bandı > Arka Plan Görseli' WHERE `key` = 'media.intro.banner';
UPDATE site_content SET label = 'Anasayfa > Açılış Ekranı > Sağ Büyük Kart · Mekân' WHERE `key` = 'media.hero.collage';
UPDATE site_content SET label = 'Anasayfa > Açılış Ekranı > Sol Kart · Latte Detayı' WHERE `key` = 'media.hero.latte';
UPDATE site_content SET label = 'Anasayfa > Açılış Ekranı > Sol Üst Bindirme · Akıtma Anı' WHERE `key` = 'media.hero.pour_overlay';
UPDATE site_content SET label = 'Anasayfa > Anı Tadın > Sol Kart · El ve Fincan' WHERE `key` = 'media.taste.hand';
UPDATE site_content SET label = 'Anasayfa > Anı Tadın > Orta Kart · Latte Art' WHERE `key` = 'media.taste.latte';
UPDATE site_content SET label = 'Anasayfa > Anı Tadın > Sağ Kart · Akıtma Anı' WHERE `key` = 'media.taste.pour';
UPDATE site_content SET label = 'Anasayfa > Bitkisel > Ana Kart · Hazırlık' WHERE `key` = 'media.plant.background';
UPDATE site_content SET label = 'Anasayfa > Bitkisel > Bindirme Kartı · Sürahi' WHERE `key` = 'media.plant.jug';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Çekirdek 1' WHERE `key` = 'media.roasted.beans_1';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Çekirdek 2' WHERE `key` = 'media.roasted.beans_2';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Çekirdek 3' WHERE `key` = 'media.roasted.beans_3';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Çekirdek 4' WHERE `key` = 'media.roasted.beans_4';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Sağ Kart · Kavurma Makinesi' WHERE `key` = 'media.roasted.machine';
UPDATE site_content SET label = 'Anasayfa > Yeni Kavruldu > Üst Kart · Fincan' WHERE `key` = 'media.roasted.cup';
UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı > Sol Portre Kartı' WHERE `key` = 'media.barista.portrait';
UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı > Sağ Büyük Kart · Eller' WHERE `key` = 'media.barista.hands';
UPDATE site_content SET label = 'Anasayfa > Barista Zanaatı > Sol Üst Bindirme · İş Başında' WHERE `key` = 'media.barista.at_work';
UPDATE site_content SET label = 'Anasayfa > Yavaşlayın > Sol Kart · Bitki Duvarı' WHERE `key` = 'media.slowdown.plants';
UPDATE site_content SET label = 'Anasayfa > Yavaşlayın > Sağ Kart · Mekân İçi' WHERE `key` = 'media.slowdown.interior';
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz > Sol Kart · Çeşitler' WHERE `key` = 'media.selection.variety';
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz > Orta Kart · Yakın Çekim' WHERE `key` = 'media.selection.closeup';
UPDATE site_content SET label = 'Anasayfa > Kahve Seçkimiz > Sağ Kart · Köken' WHERE `key` = 'media.selection.origin';
UPDATE site_content SET label = 'Anasayfa > Ziyaret > Mekân Fotoğrafı' WHERE `key` = 'media.visit.interior';

UPDATE site_content SET value_tr = 'Ekibimizle tanışın' WHERE `key` = 'barista.cta';
UPDATE site_content SET value_tr = 'Hafif tatlılar her gün taze; bugünün seçimi için baristamıza danışın.' WHERE `key` = 'menu.extras_note';
UPDATE site_content SET value_tr = 'Vegan seçenekleri gör' WHERE `key` = 'plant.cta';
UPDATE site_content SET value_tr = 'Bugünün kavurmasını sor' WHERE `key` = 'roasted.cta';
UPDATE site_content SET value_tr = 'Masa ayırt' WHERE `key` = 'taste.cta';
UPDATE site_content SET value_tr = 'Masa ayırt' WHERE `key` = 'visit.cta_reserve';
