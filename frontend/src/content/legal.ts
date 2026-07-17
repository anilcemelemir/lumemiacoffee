export type LegalPageKind = "delivery" | "privacy" | "distance";

export type LegalContentDefinition = {
  path: string;
  group: string;
  titleKey: string;
  bodyKey: string;
  fallbackTitle: string;
  fallbackBody: string;
};

const contactBlock = `
  <h2>İletişim</h2>
  <p><strong>Lume Mia Cafe</strong><br>Huzurevleri, 77123. Sk. No:7, 01360 Çukurova/Adana<br>Telefon: 0532 406 42 62<br>E-posta: <a href="mailto:merhaba@lumemia.cafe">merhaba@lumemia.cafe</a></p>
`;

export const LEGAL_CONTENT: Record<LegalPageKind, LegalContentDefinition> = {
  delivery: {
    path: "/teslimat-ve-iade",
    group: "legal-delivery",
    titleKey: "legal.delivery.title",
    bodyKey: "legal.delivery.body_html",
    fallbackTitle: "Teslimat ve İade Şartları",
    fallbackBody: `
      <p><strong>Son güncelleme: 17 Temmuz 2026</strong></p>
      <p>Bu metin, Lume Mia Cafe üzerinden verilen siparişlerin hazırlanması, teslimi, iptali ve iadesine ilişkin esasları açıklar.</p>

      <h2>Sipariş ve Teslimat</h2>
      <ul>
        <li>Siparişin kapsamı, toplam bedeli, teslimat yöntemi ve varsa teslimat ücreti ödeme öncesinde müşteriye gösterilir.</li>
        <li>Siparişler, seçilen teslimat veya teslim alma zamanı ile ürünlerin hazırlanma süresi dikkate alınarak yerine getirilir.</li>
        <li>Teslimat adresinin eksik veya hatalı girilmesinden kaynaklanan gecikmelerden müşteri sorumludur.</li>
        <li>Yoğunluk, hava koşulları veya mücbir sebepler nedeniyle gecikme yaşanırsa müşteriye kayıtlı iletişim bilgileri üzerinden haber verilir.</li>
      </ul>

      <h2>İptal</h2>
      <p>Hazırlığı henüz başlamamış siparişler için iptal talebi telefon veya e-posta yoluyla iletilebilir. Hazırlığı başlayan, kişiye özel hazırlanan ya da niteliği gereği kısa sürede bozulabilecek ürünlerde iptal kabul edilmeyebilir.</p>

      <h2>Cayma Hakkı ve İstisnalar</h2>
      <p>Mevzuat gereği çabuk bozulabilen, son kullanma tarihi kısa olan veya müşterinin talebine göre hazırlanmış yiyecek ve içeceklerde cayma hakkı kullanılamayabilir. Cayma hakkının geçerli olduğu diğer ürünlerde tüketici, teslimden itibaren 14 gün içinde yazılı olarak veya kalıcı veri saklayıcısı ile bildirimde bulunabilir.</p>

      <h2>Hatalı veya Hasarlı Ürün</h2>
      <p>Eksik, yanlış, hasarlı ya da ayıplı teslim edilen ürünler için teslimden sonra mümkün olan en kısa sürede sipariş bilgileri ve varsa görsellerle birlikte bizimle iletişime geçilmelidir. İnceleme sonucuna göre ürün yeniden hazırlanır, değiştirilir veya bedeli iade edilir.</p>

      <h2>Bedel İadesi</h2>
      <p>Onaylanan iadeler, müşteriye masraf yüklenmeden ve satın alımda kullanılan ödeme aracına uygun biçimde gerçekleştirilir. Banka ve ödeme kuruluşlarının işlem süreleri nedeniyle tutarın hesaba yansıması ek süre alabilir.</p>

      ${contactBlock}
    `,
  },
  privacy: {
    path: "/gizlilik",
    group: "legal-privacy",
    titleKey: "legal.privacy.title",
    bodyKey: "legal.privacy.body_html",
    fallbackTitle: "Gizlilik ve Kişisel Verilerin Korunması",
    fallbackBody: `
      <p><strong>Son güncelleme: 17 Temmuz 2026</strong></p>
      <p>Lume Mia Cafe, kişisel verilerinizi 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hukuka ve dürüstlük kurallarına uygun olarak işler ve korur.</p>

      <h2>Veri Sorumlusu</h2>
      <p>Bu internet sitesi üzerinden işlenen kişisel veriler bakımından veri sorumlusu Lume Mia Cafe'dir.</p>

      <h2>İşlenen Veriler</h2>
      <ul>
        <li>İletişim formunda paylaştığınız ad, e-posta adresi ve mesaj içeriği,</li>
        <li>Sipariş verilmesi halinde iletişim, teslimat, sipariş ve ödeme işlem bilgileri,</li>
        <li>IP adresi, tarayıcı ve cihaz bilgisi gibi işlem güvenliği kayıtları,</li>
        <li>Onay ve talep kayıtları.</li>
      </ul>

      <h2>İşleme Amaçları ve Hukuki Sebepler</h2>
      <p>Veriler; taleplerin yanıtlanması, sipariş ve ödeme süreçlerinin yürütülmesi, müşteri hizmetlerinin sunulması, bilgi güvenliğinin sağlanması, hukuki yükümlülüklerin yerine getirilmesi ve uyuşmazlıkların çözülmesi amaçlarıyla işlenir. İşleme faaliyetleri sözleşmenin kurulması veya ifası, hukuki yükümlülük, bir hakkın tesisi veya korunması, meşru menfaat ve gerekli olduğu durumlarda açık rıza hukuki sebeplerine dayanır.</p>

      <h2>Verilerin Aktarılması</h2>
      <p>Kişisel verileriniz, yalnızca hizmetin gerektirdiği ölçüde barındırma ve bilişim hizmeti sağlayıcılarına, teslimat hizmeti sağlayıcılarına, ödeme işlemlerinde iyzico gibi yetkili ödeme kuruluşlarına ve kanunen yetkili kamu kurumlarına aktarılabilir. Kart bilgileriniz Lume Mia Cafe tarafından saklanmaz; ödeme kuruluşunun güvenli altyapısında işlenir.</p>

      <h2>Saklama Süresi ve Güvenlik</h2>
      <p>Veriler, işleme amacı ve ilgili mevzuatta öngörülen süre boyunca saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir. Yetkisiz erişimi ve veri kaybını önlemek için uygun teknik ve idari tedbirler uygulanır.</p>

      <h2>Haklarınız</h2>
      <p>KVKK'nın 11. maddesi kapsamında verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme veya yok etme isteme, aktarılan üçüncü kişilere bildirim talep etme ve kanunda belirtilen diğer haklara sahipsiniz. Taleplerinizi kimliğinizi doğrulamaya elverişli bilgilerle birlikte e-posta veya posta yoluyla iletebilirsiniz.</p>

      <h2>Çerezler</h2>
      <p>Site, temel işlevlerin ve güvenliğin sağlanması için zorunlu çerezler veya benzeri yerel depolama teknolojileri kullanabilir. Zorunlu olmayan çerezler kullanılması halinde ayrıca bilgilendirme ve gerektiğinde onay sunulur.</p>

      ${contactBlock}
    `,
  },
  distance: {
    path: "/mesafeli-satis-sozlesmesi",
    group: "legal-distance",
    titleKey: "legal.distance.title",
    bodyKey: "legal.distance.body_html",
    fallbackTitle: "Mesafeli Satış Sözleşmesi",
    fallbackBody: `
      <p><strong>Son güncelleme: 17 Temmuz 2026</strong></p>
      <p>Bu sözleşme, alıcının Lume Mia Cafe'ye ait internet sitesi veya diğer uzaktan iletişim araçları üzerinden verdiği siparişe ilişkin tarafların hak ve yükümlülüklerini düzenler.</p>

      <h2>1. Taraflar</h2>
      <p><strong>Satıcı:</strong> Lume Mia Cafe<br><strong>Adres:</strong> Huzurevleri, 77123. Sk. No:7, 01360 Çukurova/Adana<br><strong>Telefon:</strong> 0532 406 42 62<br><strong>E-posta:</strong> <a href="mailto:merhaba@lumemia.cafe">merhaba@lumemia.cafe</a></p>
      <p><strong>Alıcı:</strong> Sipariş sırasında adı, iletişim bilgileri ve teslimat bilgileri beyan edilen kişidir.</p>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>Sözleşmenin konusu, alıcının elektronik ortamda özelliklerini ve satış fiyatını inceleyerek sipariş verdiği ürün veya hizmetin satışı, ödemesi ve teslimidir. Ürünlerin temel nitelikleri, adedi, vergiler dahil toplam fiyatı, teslimat ücreti ve ödeme yöntemi sipariş özetinde yer alır ve bu sözleşmenin ayrılmaz parçasıdır.</p>

      <h2>3. Ön Bilgilendirme ve Onay</h2>
      <p>Alıcı; sipariş öncesinde ürünlerin temel nitelikleri, satıcı bilgileri, toplam fiyat, teslimat, cayma hakkı ve başvuru yolları hakkında açık ve anlaşılır biçimde bilgilendirildiğini; siparişi onaylamasının ödeme yükümlülüğü doğurduğunu kabul eder.</p>

      <h2>4. Ödeme</h2>
      <p>Ödeme, sipariş sırasında sunulan yöntemlerden biriyle yapılır. Kartlı ödemeler yetkili ödeme kuruluşunun güvenli altyapısı üzerinden işlenir. Ödemenin yetkisiz veya hukuka aykırı kullanımından doğan durumlar ilgili banka ve ödeme kuruluşu kurallarına tabidir.</p>

      <h2>5. Teslimat ve İfa</h2>
      <p>Sipariş, alıcının belirttiği adrese veya seçtiği teslim alma noktasına, sipariş özetinde bildirilen yöntem ve tahmini sürede teslim edilir. Satıcı, teslimata kadar oluşan kayıp ve hasardan sorumludur. İfanın imkânsızlaşması halinde alıcıya üç gün içinde bildirim yapılır ve tahsil edilen ödemeler bildirimi izleyen en geç 14 gün içinde iade edilir.</p>

      <h2>6. Cayma Hakkı</h2>
      <p>Cayma hakkının geçerli olduğu mal satışlarında alıcı, teslimden itibaren 14 gün içinde gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilir. Bildirim yazılı olarak veya e-posta gibi kalıcı veri saklayıcısı ile satıcıya yöneltilmelidir.</p>

      <h2>7. Cayma Hakkının İstisnaları</h2>
      <p>Alıcının isteğine göre hazırlanan ürünler, çabuk bozulabilen veya son kullanma tarihi kısa olan yiyecek ve içecekler ile belirli bir tarihte veya dönemde sunulması gereken yiyecek-içecek tedariki gibi mevzuatta istisna tutulan ürün ve hizmetlerde cayma hakkı kullanılamaz.</p>

      <h2>8. İade ve Ayıplı Ürün</h2>
      <p>Cayma hakkının geçerli olduğu hallerde alıcı, cayma bildiriminden itibaren ürünü yasal süre içinde iade eder. Satıcı, ilgili mevzuata uygun olarak tahsil edilen bedeli satın alımda kullanılan ödeme aracına uygun biçimde iade eder. Ayıplı, eksik veya yanlış teslimlerde alıcının yasal seçimlik hakları saklıdır.</p>

      <h2>9. Kişisel Veriler</h2>
      <p>Kişisel veriler siparişin kurulması ve ifası, ödemenin alınması, teslimat ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir. Ayrıntılar <a href="/gizlilik">Gizlilik ve Kişisel Verilerin Korunması</a> sayfasında açıklanmıştır.</p>

      <h2>10. Uyuşmazlıkların Çözümü</h2>
      <p>Uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen parasal sınırlar dahilinde alıcının yerleşim yerindeki veya işlemin yapıldığı yerdeki tüketici hakem heyetleri ile tüketici mahkemeleri yetkilidir.</p>

      <h2>11. Yürürlük</h2>
      <p>Alıcı, siparişi tamamlayarak bu sözleşmeyi ve ön bilgilendirme koşullarını okuyup kabul ettiğini beyan eder. Sözleşme, siparişin elektronik ortamda onaylandığı tarihte yürürlüğe girer.</p>
    `,
  },
};

export const LEGAL_CONTENT_ITEMS = (Object.values(LEGAL_CONTENT)).flatMap((definition) => [
  {
    key: definition.titleKey,
    value: definition.fallbackTitle,
    group: definition.group,
    label: "Sayfa başlığı",
  },
  {
    key: definition.bodyKey,
    value: definition.fallbackBody.trim(),
    group: definition.group,
    label: "Sayfa içeriği",
  },
]);
