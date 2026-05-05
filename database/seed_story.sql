-- Hikâyemiz (Our Story) page content seed.

INSERT INTO site_content (`key`, value_tr, `group`, label) VALUES
  ('story.eyebrow',     'HİKÂYEMİZ',                                                                                                                                         'story', 'Üst Etiket'),
  ('story.title',       'Bir fincan kahvenin\nardındaki yolculuk',                                                                                                            'story', 'Ana Başlık'),
  ('story.intro',       'Lume Mia, küçük partiler, sakin sabahlar ve özenle hazırlanmış demlemeler üzerine kurulu bir botanik kahve atölyesidir.',                              'story', 'Spot Yazı'),
  ('story.body_html',   '<p>Lume Mia, 2024 yılında, kahveyi bir alışkanlık değil bir <strong>ritüel</strong> olarak yaşatmak isteyen küçük bir ekiple kuruldu. Tek menşe çekirdekleri kendi kavurma odamızda, küçük partiler hâlinde işliyor; her demlemeyi taze, berrak ve şeffaf tutmaya özen gösteriyoruz.</p><p>Mekânımız bir <em>nefes alma alanı</em> olarak tasarlandı: doğal ışık, bitkiler, sıcak ahşap ve sakin bir çalma listesi. Her köşede oyalanmaya, her fincanda yavaşlamaya çağıran bir atmosfer.</p><h3>Ne Yapıyoruz?</h3><p>Spesiyalite kahve, mevsimsel bitkisel demlemeler, ev yapımı süt alternatifleri ve küçük tabaklarla bütünleşen bir menü. Sürdürülebilir tedarik, adil ticaret ve düşük israf bizim için <strong>pazarlama değil, yöntem</strong>.</p><h3>Neden Buradayız?</h3><p>Şehrin hızında kayıp giden o kısa anları geri kazanmak için. Bir yudum kahvenin, bir sabahı nasıl başlatabileceğine dair küçük bir hatırlatma olmak için.</p>', 'story', 'Ana Metin (Zengin)'),
  ('story.cta_label',   'Menüyü İncele',                                                                                                                                      'story', 'Buton Metni'),
  ('story.image',       '/images/hero_latte_detail.jpg',                                                                                                                      'story', 'Kahraman Görseli')
ON DUPLICATE KEY UPDATE
  `group` = VALUES(`group`),
  label   = VALUES(label);
