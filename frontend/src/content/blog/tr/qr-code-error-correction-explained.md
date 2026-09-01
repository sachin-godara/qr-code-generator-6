---
title: "QR Kod Hata Düzeltme Seviyeleri Açıklandı: Düşük, Orta, Yüksek ve Ultra (L, M, Q, H)"
description: "QR kodlarda Reed-Solomon hata düzeltme matematiğini öğrenin. Özel logolar, dış mekan panoları ve garantili okunabilirlik için hangi kurtarma seviyesini (%7, %15, %25, %30) seçeceğinizi keşfedin."
pubDate: 2026-08-10
author: "GenerateCustomQR Ekibi"
keywords: "qr kod hata düzeltme seviyeleri, qr kod hata duzeltme L M Q H, reed solomon hata duzeltme qr kod, logolu qr kod hata duzeltme, maksimum logo boyutu qr kod"
category: "design-tips"
readingTime: 8
featured: false
faqs:
  - q: "QR kod hata düzeltme nedir?"
    a: "Hata düzeltme, bir QR kod matrisine matematiksel yedeklilik (Reed-Solomon kodlaması) ekleyen bir algoritmadır. Bu sayede kodun %30'a kadarı yırtılsa, lekelense, çizilse veya üzerine bir şirket logosu eklense bile tarayıcılar orijinal veriyi %100 doğrulukla çözer."
  - q: "Logo eklerken hangi hata düzeltme seviyesini seçmeliyim?"
    a: "Merkeze özel bir logo yerleştirirken her zaman Seviye H (Yüksek - %30) veya Seviye Q (%25) seçin. Seviye H, merkezdeki modüllerin bir görselle kapatılmasına rağmen tüm telefonlarda anında okunabilirliği korur."
  - q: "Yüksek hata düzeltme QR kodu daha yoğun ve karmaşık yapar mı?"
    a: "Evet. Daha yüksek hata düzeltme, yedek kurtarma bloklarını depolamak için daha fazla veri modülü gerektirir. Küçük kartvizitlerde hata düzeltme seviyesi ile minimum baskı boyutu arasındaki dengeyi koruyun."
howToSteps:
  - name: "Kullanım alanınızı belirleyin"
    text: "QR kodun dijital ekranda mı (Seviye M), kağıt baskıda mı (Seviye M/Q), yoksa merkezde özel bir logo ile mi (Seviye H) kullanılacağını seçin."
  - name: "GenerateCustomQR'da Hata Düzeltmeyi Seçin"
    text: "GenerateCustomQR'ı açın ve Hata Düzeltmeyi ayarlayın: özel bir logo yüklediğinizde sistem otomatik olarak Yüksek (H) seviyesine geçecektir."
  - name: "Farklı telefon kameralarında test edin"
    text: "Seri üretime geçmeden önce farklı mesafelerden ve ışık açılarından fiziksel tarama testi yapın."
---

Bir QR kodun üzerinde kahve lekesi varken, bir köşesi yırtılmışken veya tam ortasında koca bir şirket logosu bulunurken bile nasıl saniyeler içinde taranabildiğini hiç merak ettiniz mi?

Bu başarının sırrı **Reed-Solomon Hata Düzeltme Algoritmasıdır** — aslında derin uzay iletişimleri ve optik CD'ler için geliştirilmiş dahi bir matematiksel formüldür.

Bu teknik rehberde hata düzeltmenin nasıl çalıştığını, **L, M, Q ve H Seviyeleri** arasındaki farkları ve projeniz için en doğru seviyeyi nasıl seçeceğinizi ayrıntılarıyla inceliyoruz.

---

## 4 QR Kod Hata Düzeltme Seviyesi

Uluslararası QR kod standardı (ISO/IEC 18004) **dört farklı hata düzeltme kademesi** tanımlar. Her kademe, veri matrisine belirli bir oranda matematiksel yedeklilik baytı ekler:

| Seviye | Tanımlayıcı | Veri Kurtarma Kapasitesi | Matris Yoğunluğu | En Uygun Kullanım Alanı |
| :---: | :---: | :---: | :---: | :--- |
| **L** | Low (Düşük) | **~%7** veri kurtarma | En Düşük (Seyrek noktalar) | Çok küçük baskılar, temiz ekranlar, logosuz sade bağlantılar |
| **M** | Medium (Orta) | **~%15** veri kurtarma | Standart | Genel pazarlama, el ilanları ve standart web linkleri için **varsayılan standart** |
| **Q** | Quartile (Yüksek) | **~%25** veri kurtarma | Orta-Yoğun | Endüstriyel etiketler, yoğun temaslı alanlar, mikro logolar |
| **H** | High (Ultra) | **~%30** veri kurtarma | En Yoğun (Sıkı desen) | **Merkezde Logo İçeren Kodlar için Zorunlu**, dış mekan panoları, kartvizitler |

---

## Reed-Solomon Hata Düzeltme Arka Planda Nasıl Çalışır?

Bir QR kod oluşturucu kodu çizdiğinde, URL karakterlerinizi yalnızca 1 ve 0'lara dönüştürmekle kalmaz. Özel **polinom denetim kodları (parity codewords)** hesaplar:

<div class="blog-equation-card">
  <div class="blog-equation-segment data">
    <span class="segment-label">Kodlanan Veri</span>
    <span class="segment-val">%70</span>
  </div>
  <span class="blog-equation-op">+</span>
  <div class="blog-equation-segment parity">
    <span class="segment-label">Reed-Solomon Eşlik</span>
    <span class="segment-val">%30</span>
  </div>
  <span class="blog-equation-op">=</span>
  <div class="blog-equation-segment total">
    <span class="segment-label">Tam Matris</span>
    <span class="segment-val">Seviye H (%100)</span>
  </div>
</div>

Bir akıllı telefon kamerası kodu okurken:
1. Kamera, yön ve perspektif düzeltmesi yapmak için **3 köşe bulucu gözü** tespit eder.
2. Kod çözücü, 8 maskeleme deseni boyunca ikili modülleri okur.
3. Bir logo ile kapatılmış, yırtılmış veya kirlenmiş modüller varsa, çözücü polinom denklemlerini çözerek eksik piksellerin orijinal değerini yeniden oluşturur.

Hasarlı veya kapalı alan **hata düzeltme eşiğinin (%7–%30) altında kaldığı sürece**, verinin %100'ü sıfır kayıpla çözülür.

---

## Hata Düzeltme ile Matris Yoğunluğu Arasındaki Denge

Bilgisayar biliminde bedava bir kazanç yoktur. Hata düzeltme kapasitesini artırmak, karekoddaki toplam siyah ve beyaz modül sayısını artırır:

### Örnek: 45 Karakterli Bir URL (`https://generatecustomqr.com/tr/url-qr-code`)

- **Seviye L (%7 Kurtarma)**: Matris boyutu **25 × 25 modül** (Versiyon 2). Küçük baskı boyutlarında (örneğin 1.5 cm) taranması son derece kolay olan geniş, iri noktalar.
- **Seviye H (%30 Kurtarma)**: Matris boyutu **33 × 33 modül** (Versiyon 4). Belirgin şekilde daha fazla nokta ve ince detaylar. Kamera sensörlerinin noktaları ayırt edebilmesi için biraz daha büyük fiziksel baskı boyutu (minimum 2.5 cm) gerektirir.

> [!IMPORTANT]
> **Tasarım Kuralı**: Logosuz küçük kartvizitler için **Seviye M** kullanın. Merkeze logo ekleyecekseniz daima **Seviye H** seçin ve en az **25 mm × 25 mm (1 × 1 inç)** boyutunda basın.

---

## Merkez Logo Matematiği: Logonuz Ne Kadar Büyük Olabilir?

Özel markalı QR kod tasarlarken birçok tasarımcı logonun boyutunu aşırı büyüterek tarama hatasına neden olur.

### Logo Boyutlandırmasında Altın Oran:
- **Seviye H'de Maksimum Logo Alanı**: Logo, toplam matris alanının **en fazla %20 ila %25'ini** kaplamalıdır.
- **%5 Güvenlik Payı Bırakın**: Seviye H teorik olarak %30'a kadar veri kurtarsa da, logoyu %22'nin altında tutmak yetersiz odaklama, parmak gölgeleri ve loş ışık için %8'lik hayati bir güvenlik marjı bırakır.
- **Nokta Ayırma Boşluğu Ekleyin**: Logonun etrafına dairesel veya kare bir beyaz koruma halkası ekleyerek grafik piksellerinin veri noktalarıyla temas etmesini engelleyin.

---

## Gerçek Hayat Aşınma Senaryoları ve Önerilen Seviyeler

| Gerçek Kullanım Senaryosu | Olası Fiziksel Riskler | Önerilen Seviye | Gerekçe |
| :--- | :--- | :---: | :--- |
| **Restoran Masa Etiketleri** | Yemek dökülmeleri, temizlik kimyasalları, çizikler | **Seviye H** | Aylarca süren yoğun müşteri temasına ve fiziksel aşınmaya direnir |
| **Dış Mekan Vinil Afişler** | Güneş solması, yağmur, rüzgar kırışıklıkları | **Seviye Q veya H** | Katlanma veya kısmi gölgelenme olsa dahi kararlı taranır |
| **Ürün Ambalajları ve Kutular** | Ezilen koli köşeleri, sevkiyat sürtünmeleri | **Seviye Q** | Ambalaj baskı kalitesi ile barkod okuma hızını dengeler |
| **E-posta İmzaları ve Ekranlar** | Sıfır fiziksel hasar riski | **Seviye M** | Yüksek DPI retina ekranlarda hızlı yükleme için yoğunluğu düşük tutar |
| **Logolu Özel Marka QR Kodları** | Bilinçli veri kapatma (Logo) | **Seviye H** | Kameranın grafik logonun etrafındaki veriyi eksiksiz okumasını sağlar |

---

## Yüksek Hata Düzeltmeli QR Kod Üretirken 3 Kritik Kural

1. **Bağlantılarınızı Kısa Tutun**: Seviye H'de 150 karakterlik bir URL, aşırı yoğun bir Versiyon 10 (57×57 modül) matrisi oluşturur. Şık ve net nokta desenleri için URL'lerinizi 50 karakterin altında tutun.
2. **4.5:1 Kontrast Oranını Koruyun**: Yüksek yoğunluklu Seviye H kodlar düşük kontrasta karşı daha hassastır. Beyaz zemin üzerinde açık pastel renklerden kaçının.
3. **Baskı İçin Vektörel SVG Formatında Dışa Aktarın**: Baskıda piksellenmeyi önlemek için daima ölçeklenebilir SVG veya 300 DPI PDF kullanın.

---

## Özet

- Logosuz standart web linkleri, dijital ekranlar ve genel pazarlama için **Seviye M (%15)** tercih edin.
- Özel marka logosu eklediğinizde veya yoğun temaslı dış mekan baskılarında **Seviye H (%30)** kullanın.
- Tüm bu seviyeleri 40+ nokta stiliyle ücretsiz olarak **[GenerateCustomQR](/tr/)** üzerinde test edin.
