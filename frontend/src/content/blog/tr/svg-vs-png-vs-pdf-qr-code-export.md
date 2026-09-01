---
title: "QR Kodlar İçin SVG, PNG ve PDF Karşılaştırması — Nihai Baskı ve Web Dışa Aktarma Rehberi (2026)"
description: "QR kodları ne zaman SVG, PNG veya PDF olarak dışa aktaracağınızı öğrenin. Vektör ölçeklenebilirliği, 300 DPI baskı standartları ve bulanık, okunamayan taramaları önleme yolları."
pubDate: 2026-08-25
author: "GenerateCustomQR Ekibi"
keywords: "svg vs png qr kod, qr kod disa aktarma formatlari, vektor qr kod indir, baski icin pdf qr kod, yuksek cozunurluklu qr kod"
category: "comparisons"
readingTime: 6
featured: false
faqs:
  - q: "Kartvizit veya ambalaj baskısı için en iyi format hangisidir?"
    a: "Baskı için SVG ve PDF gibi vektörel formatlar en iyisidir. Piksel tabanlı PNG görsellerinin aksine, vektörler çözünürlükten bağımsızdır ve piksellenme veya bulanıklık olmadan her boyuta kusursuz ölçeklenir (300+ DPI)."
  - q: "Bir QR kod için ne zaman PNG kullanmalıyım?"
    a: "PNG; dosya boyutunun küçük olması gereken ve ekran boyutlarının sabit olduğu web siteleri, e-posta imzaları ve sosyal medya gönderileri için idealdir."
  - q: "SVG formatı Adobe Illustrator veya Figma gibi profesyonel yazılımlarla çalışır mı?"
    a: "Evet. SVG; Illustrator, Photoshop, InDesign, Canva ve Figma tarafından yerel olarak desteklenen açık bir vektör standardıdır. Vektör yollarını doğrudan düzenleyebilir ve baskı mizanpajlarına sorunsuz ekleyebilirsiniz."
howToSteps:
  - name: "Kullanım ortamını belirleyin"
    text: "QR kodunuzun fiziksel baskı (ambalaj, kartvizit, tabela) için mi yoksa dijital ekran (e-posta, web, slayt) için mi olduğunu belirleyin."
  - name: "Baskı için SVG veya PDF seçin"
    text: "Net vektör kenarları ve CMYK baskı öncesi uyumluluğu için SVG veya PDF formatında dışa aktarın."
  - name: "Dijital ortam için yüksek çözünürlüklü PNG seçin"
    text: "Web sayfaları ve e-posta altbilgileri için şeffaf arka planlı PNG formatında dışa aktarın."
---

QR kodunuz için yanlış dosya formatı seçmek tüm baskı sürecini mahvedebilir. Ticari bir matbaaya düşük çözünürlüklü piksel tabanlı bir görsel (örneğin 72 DPI JPG veya PNG) gönderirseniz, modül kenarları bulanıklaşır ve kod akıllı telefon kameraları tarafından taranamaz hale gelir.

Bu teknik rehberde baskı veya dijital projeleriniz için her zaman en doğru formatı seçmeniz adına **SVG, PNG ve PDF** formatlarını karşılaştırıyoruz.

---

## Hızlı Karşılaştırma: SVG, PNG ve PDF

| Özellik | SVG (Vektörel) | PNG (Piksel Matrisi) | PDF (Vektörel Belge) |
| :--- | :--- | :--- | :--- |
| **Format Türü** | Matematiksel Vektör | Piksel Bitmap | Vektörel Belge |
| **Ölçeklenebilirlik** | Sonsuz (Kayıpsız) | Büyütülünce bozulur | Sonsuz (Kayıpsız) |
| **En Uygun Kullanım** | Grafik Tasarım, Ambalaj | Web, E-posta, Sosyal Medya | Doğrudan Baskı, Matbaa |
| **Şeffaflık Desteği** | Evet | Evet | Evet |
| **Baskı Çözünürlüğü** | Kusursuz (300+ DPI) | Piksel boyutuna bağlıdır | Kusursuz (300+ DPI) |

---

## 1. SVG (Ölçeklenebilir Vektör Grafikleri) — Tasarımcıların Tercihi

SVG dosyaları, QR kod modüllerini piksel kareleri yerine matematiksel vektör koordinatları (`<path>`) olarak tanımlar.

<div class="blog-flow-grid">
  <div class="blog-flow-card highlight">
    <div class="blog-flow-header">
      <span class="blog-flow-step">1</span>
      <h4 class="blog-flow-title">Sonsuz Ölçekleme</h4>
    </div>
    <p class="blog-flow-desc">1 cm'lik saat kadranından 10 metrelik dev otoyol panosuna kadar sıfır netlik kaybıyla büyür.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">2</span>
      <h4 class="blog-flow-title">Yazılım Desteği</h4>
    </div>
    <p class="blog-flow-desc">Adobe Illustrator, InDesign, CorelDRAW ve Figma'da doğrudan düzenlenebilir.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">3</span>
      <h4 class="blog-flow-title">Ultra Hafif</h4>
    </div>
    <p class="blog-flow-desc">10 KB altındaki minik dosya boyutu sayesinde anında açılır ve hızlı yüklenir.</p>
  </div>
</div>

---

## 2. PNG (Taşınabilir Ağ Grafikleri) — Web ve Dijital Standart

PNG, kayıpsız bir piksel resim formatıdır. Veriyi tam bir piksel matrisi olarak saklar ve alfa şeffaflığı destekler.

- **En İyi Kullanım:** Web sitesi afişleri, sunum slaytları, e-posta imzaları ve mobil uygulamalar.
- **Sınırlama:** Orijinal piksel boyutunun ötesinde büyütüldüğünde bulanıklaşır ve piksellenir.

---

## 3. PDF (Taşınabilir Belge Formatı) — Ticari Matbaa Standardı

PDF, temiz vektör geometrisini standartlaştırılmış bir belge kapsayıcısı içine gömer.

- **En İyi Kullanım:** Dosyaları doğrudan ticari matbaalara, tabelacılara ve ambalaj üreticilerine göndermek.
- **Avantaj:** Tam milimetre veya inç ölçülerini koruyarak baskı öncesi üretimde istenmeyen boyut kaymalarını önler.

---

## 4. Saf Vektörler ile 300 DPI Yüksek Çözünürlüklü Kapsayıcılar

Özel QR kodlar tasarlarken görsel stillerin dosya yapısını nasıl etkilediğini anlamak önemlidir:

- **Standart / Sade QR Kodlar (Saf Vektör `<path>`):** Kare noktalı klasik siyah-beyaz veya düz renkli bir kod oluşturduğunuzda, SVG çıktısı saf XML `<path>` öğeleri üretir. Bunlar devasa panolarda sıfır piksellenmeyle ölçeklenir ve Illustrator'da düğüm bazlı düzenlenebilir.
- **Özel Tasarımlı QR Kodlar (300 DPI Yüksek Kaliteli Kapsayıcılar):** Yuvarlatılmış noktalar, yaprak göz çerçeveleri, çok tonlu gradyanlar, alt gölgeler veya merkez logo gibi gelişmiş stilleri etkinleştirdiğinizde; grafik motoru SVG (`<image>`) ve PDF kapsayıcıları içine gömülü **300 DPI yüksek çözünürlüklü** keskin antialiasing uygulanmış sanat eseri oluşturur. Bu, tüm matbaa sistemlerinde maksimum optik okunabilirlik sağlar.

---

## Dışa Aktarma Karar Matrisi: Hangi Formatı Seçmelisiniz?

<div class="blog-checklist-grid">
  <div class="blog-checklist-card do">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-check">check_circle</span>
      Önerilen Format Seçimleri (Yapın)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Figma, Illustrator veya Canva'da çalışırken <strong>SVG</strong> kullanın
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Tasarımı doğrudan matbaaya e-posta ile gönderirken <strong>PDF</strong> kullanın
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Web ve dijital sunumlar için <strong>PNG</strong> (1024×1024px+) tercih edin
      </li>
    </ul>
  </div>

  <div class="blog-checklist-card dont">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-cross">cancel</span>
      Yaygın Hatalar (Kaçının)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Fiziksel baskı üretimi için asla 72 DPI düşük kaliteli JPG kullanmayın
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Küçük PNG dosyalarını dev posterlere yerleştirip büyütmeyin
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Dışa aktarılan dosyalarda beyaz sessiz alan kenar boşluğunu kırpmayın
      </li>
    </ul>
  </div>
</div>

---

## Ücretsiz Vektörel QR Kodunuzu İndirin

Özel QR kodunuzu **SVG, PDF ve PNG** formatlarında **[GenerateCustomQR](/tr/)** üzerinden ücretsiz oluşturun ve indirin.
