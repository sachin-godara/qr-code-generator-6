---
title: "QR Kod Boyutlandırma Rehberi — Baskı ve Açık Hava Panoları İçin Minimum Ölçüler"
description: "QR kodlar için eksiksiz boyutlandırma kılavuzu. Kartvizitler, çıkartmalar, posterler, reklam panoları ve dijital ekranlar için minimum boyutları öğrenin."
pubDate: 2026-08-22
author: "GenerateCustomQR Ekibi"
keywords: "qr kod boyutu, qr kod minimum boyut, qr kod olculeri, qr kod baski boyutu, qr kod ne kadar buyuk olmali, kartvizit icin qr kod boyutu"
category: "guides"
readingTime: 6
featured: false
faqs:
  - q: "Bir QR kod için minimum boyut nedir?"
    a: "Yakın mesafeden (20 cm'den az) taranan QR kodlar için güvenilir mutlak minimum boyut 2×2 cm'dir. Ancak çoğu baskı uygulaması için güvenli minimum olarak 3×3 cm önerilir. Formülü uygulayın: minimum boyut = tarama mesafesi ÷ 10."
  - q: "Bir kartvizitteki QR kod ne kadar büyük olmalıdır?"
    a: "Standart bir kartvizitte (8.5×5.5 cm) QR kod en az 1.5×1.5 cm, ideal olarak 2×2 cm olmalıdır. Tarama hatalarını önlemek için her kenarında en az 3 mm beyaz sessiz alan bırakın."
  - q: "Açık hava reklam panosu için hangi boyutta QR kod gerekir?"
    a: "10 metre mesafeden araç içinden taranacak bir pano için minimum 100×100 cm gereklidir. 2 metre mesafedeki yaya tabelaları için minimum 20×20 cm olmalıdır. Formül: QR boyutu = görüntüleme mesafesi (cm) ÷ 10."
  - q: "QR koddaki veri miktarının artması daha büyük baskı boyutu gerektirir mi?"
    a: "Evet. Kısa bir URL (20 karakter) kodlayan bir QR kod, tam bir vCard (300+ karakter) kodlayandan çok daha az modüle sahiptir. Daha fazla veri = daha fazla modül = aynı mesafeden okunabilmesi için daha büyük fiziksel boyut gerektirir."
  - q: "Bir QR kodu basarken hangi çözünürlüğü kullanmalıyım?"
    a: "Profesyonel baskı kalitesi için QR kodları daima en az 300 DPI çözünürlükte basın. GenerateCustomQR, piksellenme olmadan her boyutta kusursuz çalışan vektörel SVG ve 300 DPI PDF dışa aktarımı sunar."
---

Bir QR kod oluştururken en sık sorulan sorulardan biri şudur: *"Ne kadar büyük olması gerekiyor?"* Yanıt; kodu nereye yerleştireceğinize, insanların kodu ne kadar uzaktan tarayacağına ve kodun ne kadar veri içerdiğine bağlıdır.

Bu rehber, tüm yaygın kullanım alanları için net boyutlandırma standartları sunar.

## Altın Kural: Tarama Mesafesi ÷ 10

Akıllı telefon kameralarının optik netliği için altın formül:

<div class="blog-equation-card">
  <div class="blog-equation-segment data">
    <span class="segment-label">Tarama Mesafesi</span>
    <span class="segment-val">Mesafe (cm)</span>
  </div>
  <span class="blog-equation-op">÷</span>
  <div class="blog-equation-segment parity">
    <span class="segment-label">Optik Sabit</span>
    <span class="segment-val">10</span>
  </div>
  <span class="blog-equation-op">=</span>
  <div class="blog-equation-segment total">
    <span class="segment-label">Minimum QR Genişliği</span>
    <span class="segment-val">Baskı Boyutu (cm)</span>
  </div>
</div>

- **30 cm mesafe** (Kol mesafesinde tutulan kartvizit) → minimum **3 × 3 cm**.
- **3 metre mesafe** (Vitrin posteri veya yönlendirme tabelası) → minimum **30 × 30 cm**.

## Kullanım Alanına Göre Boyut Tablosu

| Kullanım Alanı | Tipik Tarama Mesafesi | Minimum QR Boyutu | Önerilen İdeal Boyut |
|---|---|---|---|
| **Kartvizit** | 15–30 cm | 2 cm × 2 cm | 2.5–3 cm × 2.5–3 cm |
| **Ürün Etiketi** | 15–25 cm | 1.5 cm × 1.5 cm | 2 cm × 2 cm |
| **Çıkartma / Yaka Kartı** | 20–40 cm | 2 cm × 2 cm | 3 cm × 3 cm |
| **El İlanı / Broşür** | 25–40 cm | 2.5 cm × 2.5 cm | 3–4 cm × 3–4 cm |
| **Restoran Masa Kartı** | 30–50 cm | 3 cm × 3 cm | 4–5 cm × 4–5 cm |
| **A4 Poster** | 0.5–1.5 m | 5 cm × 5 cm | 8–10 cm × 8–10 cm |
| **A3/A2 Afiş** | 1–3 m | 10 cm × 10 cm | 15 cm × 15 cm |
| **Roll-up / Banner** | 1–5 m | 15 cm × 15 cm | 20–25 cm × 20–25 cm |
| **Açık Hava Reklam Panosu** | 5–20 m | 50 cm × 50 cm | 80–100 cm × 80–100 cm |
| **Stadyum ve Bina Ekranı** | 20–50 m | 2 m × 2 m | 3 m × 3 m |

## Veri Karmaşıklığı Boyutu Nasıl Etkiler?

Bir QR koda ne kadar çok veri kodlarsanız, o kadar çok *modül* (küçük kare nokta) gerekir. Daha fazla modül, aynı mesafeden taranabilmesi için daha büyük bir fiziksel baskı boyutu gerektirir.

| İçerik Türü | Yaklaşık Modül Sayısı | Boyuta Etkisi |
|---|---|---|
| **Kısa URL** (50 karakter altı) | 25×25 modül | Standart boyut yeterlidir |
| **Orta URL** (50–100 karakter) | 33×33 modül | +%10 boyut artışı gerekir |
| **Uzun URL** (100–200 karakter) | 41×41 modül | +%25 boyut artışı gerekir |
| **vCard** (tam iletişim bilgisi) | 45×45 modül | +%30 boyut artışı gerekir |
| **Wi-Fi Bilgileri** | 29×29 modül | Standart boyut yeterlidir |
| **Düz Metin** (500+ karakter) | 57×57+ modül | +%50 veya daha fazla büyüme |

**Uzman ipucu:** Uzun URL'ler için URL kısaltıcı kullanarak modül sayısını düşük tutun; bu sayede daha küçük boyutlarda bile kolayca taranabilir.

## Hata Düzeltme Seviyesi ve Boyut

QR kodlar boyutu etkileyen dört hata düzeltme seviyesine sahiptir:

| Seviye | Kurtarma Kapasitesi | Boyut Etkisi | En Uygun Kullanım |
|---|---|---|---|
| **L** (Düşük) | %7 kurtarma | En küçük kod | Dijital ekranlar, temiz ortamlar |
| **M** (Orta) | %15 kurtarma | +%10 daha büyük | Genel kullanım, basılı materyaller |
| **Q** (Yüksek) | %25 kurtarma | +%20 daha büyük | Dış mekan, pürüzlü yüzeyler |
| **H** (Ultra) | %30 kurtarma | +%30 daha büyük | Logo ekleme, zorlu koşullar |

QR kodunuza bir logo eklediğinizde daima Hata Düzeltme **H** seviyesini kullanın. Kod fiziksel olarak daha yoğun olacağından boyut planlamanızda ekstra %30 pay bırakın.

## Dosya Formatlarına Göre Çözünürlük Gereksinimleri

Boyut yalnızca santimetre ile ilgili değildir — net baskı için doğru çözünürlük de şarttır.

| Dışa Aktarma Formatı | En İyi Çözünürlük | Kullanım Alanı |
|---|---|---|
| **PNG** | Baskı için 300 DPI, web için 72 DPI | En çok yönlü format |
| **SVG** | Sonsuz (Vektörel) | Piksellenme olmadan her boyutta baskı |
| **PDF** | 300 DPI gömülü | Profesyonel matbaalar, broşürler |

[GenerateCustomQR](/tr) ile **8192 × 8192 piksele** kadar PNG dışa aktarabilirsiniz — reklam panoları için bile fazlasıyla yeterlidir. Sınırsız ölçekleme için SVG kullanın.

## Yaygın Boyutlandırma Hataları

### Kodu Çok Küçük Basmak
2 cm × 2 cm altındaki QR kodlar risklidir. Eski telefonlar ve loş ışık küçük kodları okumayı zorlaştırır. Her zaman biraz daha büyük basmayı tercih edin.

### Sessiz Alanı Unutmak
QR kodun etrafındaki **sessiz alan** (beyaz kenar boşluğu) en az 4 modül genişliğinde olmalıdır. Bu kenarlık kodun bir parçasıdır; kırpmak tarama hatasına yol açar.

### Baskıda Düşük Çözünürlük Kullanmak
300×300 piksellik bir PNG ekranda iyi görünür ancak basılı bir broşürde bulanıklaşır. Baskı için en az 1200×1200 piksel veya SVG tercih edin.

### Gerçek Boyutta Test Etmemek
10.000 broşür basmadan önce tek bir test baskısı alın ve 3 farklı telefonla gerçek mesafeden tarayın.

## Baskı Öncesi Boyut Kontrol Listesi

- Tarama mesafesi ÷ 10 formülüyle minimum boyutu hesaplayın
- Logo için Seviye H seçildiyse %30 büyüme payı ekleyin
- Sessiz alanı (4+ modül beyaz kenar) dahil edin
- Baskı için 300+ DPI veya SVG formatında dışa aktarın
- 3 farklı cihazla gerçek mesafeden test taraması yapın

## Mükemmel Boyutta QR Kodunuzu Oluşturun

[GenerateCustomQR](/tr); 8192×8192px çözünürlüğe kadar PNG ve sınırsız ölçekleme için SVG vektör desteği sunar. Tüm stiller %100 ücretsizdir.

- [URL QR Kodu Oluşturun →](/tr/url-qr-code-generator)
- [Wi-Fi QR Kodu Oluşturun →](/tr/wifi-qr-code)
- [vCard QR Kodu Oluşturun →](/tr/vcard-qr-code)
- [Baskı İpuçlarını Öğrenin →](/tr/blog/qr-code-design-best-practices-for-print)
