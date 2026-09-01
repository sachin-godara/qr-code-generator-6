---
title: "Quishing Nedir? QR Kod Oltalama Saldırıları Nasıl Tanınır ve Korunulur? (2026 Kapsamlı Rehber)"
description: "Quishing (QR kod oltalama saldırıları) hakkında kapsamlı 2026 rehberi. Siber suçluların e-posta güvenlik duvarlarını nasıl aştığını ve kurumunuzu nasıl koruyacağınızı öğrenin."
pubDate: 2026-08-25
author: "GenerateCustomQR Güvenlik Araştırma Ekibi"
keywords: "quishing nedir, qr kod oltalama, quishing nasil onlenir, bu qr kod guvenli mi, qr kod guvenligi, kurumsal quishing savunmasi"
category: "industry"
readingTime: 10
featured: true
faqs:
  - q: "Quishing nedir?"
    a: "Quishing ('QR' ve 'Phishing' kelimelerinin birleşimi), geleneksel metin köprüleri yerine 2D optik karekodların kullanıldığı; güvenli e-posta ağ geçitlerini (SEG) atlatarak kurumsal kimlik bilgilerini çalmayı hedefleyen gelişmiş bir sosyal mühendislik siber saldırısıdır."
  - q: "Quishing neden geleneksel e-posta oltalamasından daha tehlikelidir?"
    a: "Kullanıcıyı kurumsal güvenlik duvarı ve EDR koruması altındaki bilgisayardan, korunmasız kişisel akıllı telefonuna geçmeye zorlar. Ayrıca optik QR görselleri, hedef web adresini klasik metin ayrıştırıcı e-posta filtrelerinden gizler."
  - q: "Bir QR kod yalnızca taranarak telefonumu otomatik olarak hackleyebilir mi?"
    a: "Tarama işlemi temel olarak kodlanmış metni veya bağlantıyı çözer. Ancak kullanıcı açılan sayfayla etkileşime girdiğinde tarayıcı açıklarını tetikleyebilir, sahte Wi-Fi ağına bağlayabilir veya kimlik hırsızlığı yapan sahte MFA portallarına yönlendirebilir."
  - q: "Taramadan veya tıklamadan önce bir QR kodun kötü niyetli olduğunu nasıl anlarım?"
    a: "Fiziksel yüzeyde sahte bir yapıştırma etiketi olup olmadığını kontrol edin. Kamera kodu tanıdığında açılan bağlantı önizlemesindeki alan adını, yazım hatalarını (typosquatting) ve şüpheli URL kısaltıcılarını dikkatle inceleyin."
  - q: "Kurumsal güvenlik ekipleri quishing saldırılarına karşı nasıl savunma yapmalıdır?"
    a: "Görsel işleme (OCR/Computer Vision) yetenekli yapay zeka destekli e-posta güvenliği kurun, proxy saldırılarına karşı bağışık olan FIDO2/WebAuthn donanım güvenlik anahtarlarını (YubiKey) zorunlu kılın ve mobil cihaz yönetimi (MDM) uygulayın."
  - q: "Statik QR kodlar dinamik QR kodlardan daha mı güvenlidir?"
    a: "Evet. Statik QR kodlar hedef adresi hiçbir aracı sunucu olmadan doğrudan geometrik matrise kodlar. Dinamik kodlar ise hacklenebilecek veya kötüye kullanılabilecek üçüncü taraf yönlendirme sunucularından geçer."
howToSteps:
  - name: "Fiziksel yüzeyi kontrol edin"
    text: "Otopark otomatı veya restoran masalarındaki orijinal levha üzerine sonradan yapıştırılmış şüpheli bir çıkartma olup olmadığını kontrol edin."
  - name: "Kamera URL önizlemesini inceleyin"
    text: "Uyarıya körü körüne dokunmayın. Ana alan adının resmi kuruma ait olduğunu ve HTTPS kullandığını doğrulayın."
  - name: "FIDO2 donanım anahtarları kullanın"
    text: "Çalışanlar sahte bir giriş sayfasına yönlendirilse bile kimlik bilgilerinin çalınmasını önleyen fiziksel güvenlik anahtarlarını devreye alın."
  - name: "Gizlilik odaklı tarayıcılar kullanın"
    text: "Kötü amaçlı komutları çalıştırmadan ham içeriği güvenle inceleyen GenerateCustomQR Tarayıcı gibi istemci taraflı araçları tercih edin."
---

QR kodların ticaret, restoranlar ve kurumsal operasyonlarda hızla yaygınlaşmasıyla birlikte siber suçlular bu teknolojiyi on yılın en hızlı büyüyen siber tehditlerinden birine dönüştürdü: **Quishing** (QR Kod Oltalama Saldırısı).

E-posta metninde düz bağlantılara dayanan klasik oltalama saldırılarının aksine quishing, zararlı adresleri optik 2D barkod görsellerinin içine gömer. Bu yöntem geleneksel e-posta güvenlik ağ geçitlerini (SEG) etkisiz hale getirerek saldırganların kurumsal ağlara sızmasına olanak tanır.

---

## Rakamlarla Quishing: 2026 Tehdit Haritası

Önde gelen siber güvenlik kuruluşlarının tehdit istihbaratı raporları, QR tabanlı saldırıların tehlikeli boyutunu gözler önüne seriyor:

<div class="blog-stat-grid">
  <div class="blog-stat-card">
    <div class="blog-stat-value text-red-600">+%340</div>
    <div class="blog-stat-label">Quishing Artış Oranı (2024–2026)</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-amber-600">%89</div>
    <div class="blog-stat-label">Hedef Alınan Kurum Oranı</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-blue-600">0.4sn</div>
    <div class="blog-stat-label">Ortalama Kamera Odaklama Süresi</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-emerald-600">4.8M $</div>
    <div class="blog-stat-label">Ortalama Kurumsal İhlal Maliyeti</div>
  </div>
</div>

Quishing saldırılarının bu denli hızlı büyümesinin ardında psikolojik bir avantaj yatar: İnsanlar çıplak gözle okuyamadıkları görsel karekodlara doğal olarak güvenirler.

---

## Quishing Saldırı Zincirinin Anatomisi

Quishing saldırıları, korumalı kurumsal masaüstü bilgisayarlar ile savunmasız kişisel akıllı telefonlar arasındaki geçiş açığından faydalanır:

<div class="blog-threat-container">
  <div class="blog-threat-header">
    <span class="material-symbols-outlined text-[18px]">security_update_warning</span>
    4 Aşamalı Quishing Saldırı Zinciri
  </div>
  <div class="blog-threat-flow">
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Aşama 1: İletim</span>
      <h4 class="blog-threat-title">Optik E-posta Eki</h4>
      <p class="blog-threat-desc">Saldırgan; İK bildirimi, maaş bordrosu veya Microsoft 365 MFA sıfırlama uyarısı süsü verilmiş PDF/PNG görseli gönderir.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Aşama 2: Cihaz Atlama</span>
      <h4 class="blog-threat-title">Mobil Cihaza Geçiş</h4>
      <p class="blog-threat-desc">Çalışan kodu kişisel telefonuyla tarar; şirket VPN'i, kurumsal proxy filtreleri ve EDR korumasının dışına çıkar.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Aşama 3: Aldatma</span>
      <h4 class="blog-threat-title">Klon Giriş Portalı</h4>
      <p class="blog-threat-desc">Mobil tarayıcı, ters proxy araçlarıyla birebir kopyalanmış sahte bir Microsoft, Okta veya Google giriş sayfasını yükler.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Aşama 4: İhlal</span>
      <h4 class="blog-threat-title">Oturum Çalma</h4>
      <p class="blog-threat-desc">Saldırgan kullanıcı adı, şifre ve anlık MFA oturum belirteçlerini canlı olarak yakalayarak kurumsal bulut hesabını ele geçirir.</p>
    </div>
  </div>
</div>

---

## Geleneksel Güvenlik Duvarları Neden Yetersiz Kalıyor?

Standart Güvenlik Ağ Geçitleri (SEG) metin tabanlı analiz için geliştirilmiştir. Bir e-postada normal bir bağlantı olduğunda `href` etiketini okur ve kara listedeki alan adlarıyla karşılaştırır.

Quishing bu koruma kalkanını şu yollarla aşar:

1. **Metin Köprüsü Yoktur:** E-posta gövdesinde incelenecek tıklanabilir bir web linki bulunmaz; yalnızca bir resim dosyası yer alır.
2. **Dinamik Yönlendirme Kalkanı:** Saldırganlar ilk sayfayı SharePoint, Google Docs veya Canva gibi güvenilir alan adlarında barındırır. E-posta teslim edildikten saatler sonra adresi sahte portala yönlendirirler.
3. **Optik Karıştırma:** OCR (Optik Karakter Tanıma) tarayıcılarını yanıltmak için arka plana hafif gürültü pikselleri eklenirken telefon kameralarının kodu kolayca okuması sağlanır.

---

## En Yaygın 4 Quishing Saldırı Vektörü

### 1. Kurumsal Sahte MFA Sıfırlama Bildirimleri
En yaygın saldırı türüdür. Çalışanlara hesaplarının kapatılmaması için 24 saat içinde QR kodu tarayarak iki faktörlü doğrulamayı (MFA) güncellemeleri gerektiği söylenir.

### 2. Otopark Otomatları ve Halka Açık Ödeme Levhaları
Suçlular, belediye otoparkları ve elektrikli araç şarj istasyonlarındaki orijinal ödeme karekodlarının üzerine sahte yapıştırma etiketler yapıştırarak kredi kartı bilgilerini kopyalar.

### 3. Restoran Masalarındaki Sahte Menü Kodları
Kalabalık mekanlarda masa üstü karekodların üzeri sahte etiketlerle kapatılır. Açılan sayfa kullanıcıdan kredi kartı bilgisi ister veya casus yazılım indirir.

### 4. Sahte "Ücretsiz Wi-Fi" QR Kodları
Havalimanları ve otellerde "Ücretsiz Yüksek Hızlı İnternet" vadeden karekodlarla cihazlar sahte erişim noktalarına bağlanarak ağ trafiği dinlenir (MitM).

---

## Gerçek Dünyadan Vaka Analizleri: Yüksek Etkili Quishing Olayları

### Vaka Analizi A: Enerji Sektöründe Kimlik Bilgisi Hırsızlığı Kampanyası
2024 yılı sonunda ABD'deki büyük bir enerji holdingi hedefli bir quishing saldırısına uğradı. Saldırganlar, çalışanlara kişiselleştirilmiş QR kodlar içeren "Zorunlu Yan Haklar Kaydı" başlıklı PDF ekleri gönderdi. Bilgi işlem ekibi müdahale edene kadar 4 saat içinde 1.000'den fazla kurumsal kimlik bilgisi çalındı.

### Vaka Analizi B: Çok Şehirli Otopark Otomatı Saldırısı
Teksas ve Kaliforniya genelindeki belediye ulaşım yetkilileri, binlerce otopark otomatının üzerine sürücüleri sahte ödeme sayfalarına yönlendiren kötü niyetli QR çıkartmalar yapıştırıldığını tespit etti. Mağdurlar kişi başı ortalama 350 $ yetkisiz kredi kartı harcamasıyla karşılaştı.

---

## Saldırganlar Zararlı QR Bağlantılarını Nasıl Gizler?

Teknik bağlantı yapılarını anlamak sahte kodları tanımanızı sağlar:

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Yazım Taklidi (Typosquatting)</span>
  <span class="blog-endpoint-url">https://login.micros0ft-online-security.com/mfa/auth-session</span>
</div>

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Açık Yönlendirme İstismarı</span>
  <span class="blog-endpoint-url">https://www.google.com/url?q=https://phishing-portal-internal.ru</span>
</div>

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Data URI Yükü</span>
  <span class="blog-endpoint-url">data:text/html;base64,PHNjcmlwdD53aW5kb3cubG9jYXRpb249...</span>
</div>

---

## Kurumsal Savunma Rehberi: 4 Katmanlı Güvenlik

<div class="blog-flow-grid">
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">1</span>
      <h4 class="blog-flow-title">Görsel İşleme (CV)</h4>
    </div>
    <p class="blog-flow-desc">Görselleri tarayan, QR içeriğini çözen ve derin linkleri analiz eden yapay zeka e-posta güvenliği kullanın.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">2</span>
      <h4 class="blog-flow-title">FIDO2 Donanım Anahtarı</h4>
    </div>
    <p class="blog-flow-desc">Fiziksel YubiKey zorunlu kılın. FIDO2 doğrulamayı gerçek alan adına bağlar; sahte sitelerde şifre çalınamaz.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">3</span>
      <h4 class="blog-flow-title">Mobil Tehdit Koruması</h4>
    </div>
    <p class="blog-flow-desc">Şirket e-postalarına erişen tüm telefonlara aktif DNS filtreleme özellikli MDM kurun.</p>
  </div>
  <div class="blog-flow-card highlight">
    <div class="blog-flow-header">
      <span class="blog-flow-step">4</span>
      <h4 class="blog-flow-title">Quishing Tatbikatları</h4>
    </div>
    <p class="blog-flow-desc">Çalışanlara periyodik olarak optik QR oltalama simülasyonları uygulayın.</p>
  </div>
</div>

---

## Kullanıcı ve Çalışan Güvenliği Kontrol Listesi

<div class="blog-checklist-grid">
  <div class="blog-checklist-card do">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-check">verified_user</span>
      Zorunlu Güvenlik Alışkanlıkları (Yapın)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Dokunmadan önce kamera ekranındaki tam alan adı önizlemesini mutlaka okuyun
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Otopark otomatlarındaki kodlara parmağınızla dokunarak çıkartma olup olmadığını kontrol edin
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Banka ve şirket girişleri için tarayıcı yer işaretlerini kullanın
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Şüpheli kodları istemci taraflı gizlilik odaklı bir tarayıcıyla inceleyin
      </li>
    </ul>
  </div>

  <div class="blog-checklist-card dont">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-cross">dangerous</span>
      Kritik Hatalar (Kaçının)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        E-posta QR kodundan açılan mobil sayfaya asla şirket şifrenizi girmeyin
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Tanımadığınız bir tarama sonrası gelen MFA onay isteklerini onaylamayın
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Reklam dolu güvenilmez üçüncü taraf QR tarayıcı uygulamalarını yüklemeyin
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Üçüncü taraf yönlendirme sunucularına bağımlı dinamik kodlar kullanmayın
      </li>
    </ul>
  </div>
</div>

---

## Statik ve Sunucusuz QR Kodlar Neden Çok Daha Güvenlidir?

**[GenerateCustomQR](/tr/)** platformunda tüm kodlama işlemleri aracı bir sunucu olmadan %100 tarayıcınız içinde gerçekleşir:

- **Doğrudan ve Bağımsız:** Kodlanan veri üçüncü taraf yönlendirme sunucularından geçmeden doğrudan resmi alan adınıza işaret eder.
- **Sıfır Veri Kaydı:** Kullanıcı tarama saatleri, IP adresleri veya konum bilgileri asla kaydedilmez.
- **Yönlendirme Saldırılarına Karşı Bağışık:** Statik kodlar değiştirilemez veriler içerdiğinden, üçüncü taraf bir sunucu hacklense bile kodunuz asla manipüle edilemez.

---

## Özet ve Güvenlik Adımları

1. **Personeli Eğitin:** Optik oltalama eklerinin işaretlerini tanımalarını sağlayın.
2. **Kimlik Doğrulamayı Güçlendirin:** FIDO2 donanım anahtarlarına geçiş yapın.
3. **Güvenilir QR Oluşturucu Kullanın:** **[GenerateCustomQR](/tr/)** ile aracı sunucusuz, kurcalamaya karşı dayanıklı statik kodlar oluşturun.
4. **Gizlilik Odaklı Tarayıcı Kullanın:** Bilinmeyen bağlantıları açmadan önce **[QR Kod Tarayıcımızı](/tr/qr-code-scanner/)** kullanarak ham içeriği güvenle inceleyin.
