import { type Locale } from './config';

export interface LocalizedBlogMeta {
  title: string;
  description: string;
  categoryLabel?: string;
}

export const blogTranslations: Record<string, Record<Locale, LocalizedBlogMeta>> = {
  "how-to-add-qr-code-to-business-card": {
    "en": {
      "title": "How to Add a QR Code to Your Business Card — Complete Guide",
      "description": "Learn how to create and add a custom QR code to your business card. Includes design tips, vCard setup, sizing guides, and free tools for professional results."
    },
    "es": {
      "title": "Cómo Añadir un Código QR a tu Tarjeta de Visita — Guía Completa",
      "description": "Aprende a crear y añadir un código QR personalizado a tu tarjeta de presentación. Incluye consejos de diseño, vCard digital, tamaños y herramientas gratis."
    },
    "pt": {
      "title": "Como Adicionar um QR Code ao Cartão de Visita — Guia Completo",
      "description": "Aprenda a criar e inserir um QR code com cartão digital vCard no seu cartão de visita. Dicas de design, tamanhos mínimos e download em alta resolução."
    },
    "de": {
      "title": "QR-Code auf der Visitenkarte einbinden — Vollständige Anleitung",
      "description": "Erfahren Sie, wie Sie einen individuellen vCard-QR-Code auf Ihrer Visitenkarte platzieren: Design-Tipps, Größenrichtlinien, Druckformate und kostenlose Tools."
    },
    "tr": {
      "title": "Kartvizite QR Kod Nasıl Eklenir — Tam Rehber",
      "description": "Kartvizitinize özel bir vCard QR kodunu nasıl ekleyeceğinizi öğrenin. Tasarım ipuçları, boyut rehberi ve profesyonel sonuçlar için ücretsiz araçlar."
    }
  },
  "how-to-scan-a-qr-code": {
    "en": {
      "title": "How to Scan a QR Code on iPhone and Android — Complete Guide",
      "description": "Step-by-step guide to scanning QR codes on iPhone, Android, and desktop. Learn how to use your camera app, Google Lens, and web-based scanners."
    },
    "es": {
      "title": "Cómo Escanear un Código QR en iPhone y Android — Guía Completa",
      "description": "Guía paso a paso para escanear códigos QR en iPhone, Android y ordenador. Aprende a usar la cámara nativa, Google Lens, WhatsApp Web y escáneres online."
    },
    "pt": {
      "title": "Como Ler um Código QR no iPhone e Android — Guia Completo",
      "description": "Passo a passo para escanear códigos QR no iPhone, Android e computador. Aprenda a usar a câmera nativa, Google Lens, WhatsApp Web e leitores online."
    },
    "de": {
      "title": "QR-Code scannen mit iPhone und Android — Komplette Anleitung",
      "description": "Schritt-für-Schritt-Anleitung zum Scannen von QR-Codes auf Smartphone und PC. Nutzen Sie die Kamera-App, Google Lens, WhatsApp Web und Web-Scanner."
    },
    "tr": {
      "title": "iPhone ve Android'de QR Kod Nasıl Taranır — Tam Rehber",
      "description": "iPhone, Android ve bilgisayarda QR kodlarını tarama rehberi. Kamera uygulaması, Google Lens ve web tabanlı okuyucuları nasıl kullanacağınızı öğrenin."
    }
  },
  "how-to-scan-qr-code-from-screenshot": {
    "en": {
      "title": "How to Scan a QR Code from a Screenshot (Phone, PC & Mac)",
      "description": "Step-by-step guide to decoding QR codes from screenshots or saved image files on your phone, PC, or Mac without needing a second camera."
    },
    "es": {
      "title": "Cómo Escanear un Código QR de una Captura de Pantalla (Móvil, PC y Mac)",
      "description": "Guía paso a paso para decodificar códigos QR desde capturas de pantalla o imágenes guardadas en tu teléfono o PC sin necesitar una segunda cámara."
    },
    "pt": {
      "title": "Como Ler um Código QR de uma Captura de Tela (Celular, PC e Mac)",
      "description": "Guia passo a passo para escanear e decodificar códigos QR a partir de capturas de tela ou imagens no celular e computador sem uma segunda câmera."
    },
    "de": {
      "title": "QR-Code aus Screenshot scannen (Smartphone, PC & Mac)",
      "description": "Schritt-für-Schritt-Anleitung zum Scannen von QR-Codes aus Screenshots oder gespeicherten Bildern auf Smartphone und PC ohne zweite Kamera."
    },
    "tr": {
      "title": "Ekran Görüntüsünden QR Kod Nasıl Taranır (Telefon, PC & Mac)",
      "description": "İkinci bir kameraya ihtiyaç duymadan telefonunuzda, bilgisayarınızda veya Mac'inizde ekran görüntülerinden ve kaydedilmiş resimlerden QR kod okuma rehberi."
    }
  },
  "qr-code-color-guide": {
    "en": {
      "title": "QR Code Color Guide — Best Color Combinations for Scannability",
      "description": "Which colors work best for QR codes? Learn about contrast ratios, safe color combinations, and which colors to avoid for reliable scanning."
    },
    "es": {
      "title": "Guía de Colores para Códigos QR — Mejores Combinaciones y Contraste",
      "description": "¿Qué colores funcionan mejor para los códigos QR? Aprende sobre ratios de contraste, combinaciones seguras y colores que debes evitar para un escaneo infalible."
    },
    "pt": {
      "title": "Guia de Cores para QR Code — Melhores Combinações e Contraste",
      "description": "Quais cores funcionam melhor em códigos QR? Aprenda sobre proporção de contraste, paletas seguras e erros de cores que prejudicam o escaneamento."
    },
    "de": {
      "title": "QR-Code Farb-Leitfaden — Die Besten Farbkombinationen für Schnellen Scan",
      "description": "Welche Farben funktionieren bei QR-Codes am besten? Erfahren Sie alles über Kontrastverhältnisse, sichere Farbkombinationen und No-Gos beim Farbdesign."
    },
    "tr": {
      "title": "QR Kod Renk Rehberi — Güvenilir Tarama İçin En İyi Renk Kombinasyonları",
      "description": "QR kodları için hangi renkler en iyi sonucu verir? Kontrast oranları, güvenli renk kombinasyonları ve kaçınılması gereken renk hatalarını öğrenin."
    }
  },
  "qr-code-design-best-practices-for-print": {
    "en": {
      "title": "QR Code Design Best Practices for Print — Expert Tips for 2026",
      "description": "Master print-ready QR codes. Learn optimal sizing, 300 DPI resolution, color contrast, and material strategies that ensure every scan succeeds."
    },
    "es": {
      "title": "Mejores Prácticas de Diseño de Códigos QR para Impresión — Consejos 2026",
      "description": "Domina la impresión de códigos QR. Aprende sobre dimensiones óptimas, resolución 300 DPI, contraste de color, materiales y márgenes para un escaneo infalible."
    },
    "pt": {
      "title": "Boas Práticas de Design de QR Code para Impressão — Dicas 2026",
      "description": "Aprenda a preparar códigos QR para gráfica: tamanhos mínimos recomendados, resolução de 300 DPI, contraste de cores e acabamentos sem reflexo."
    },
    "de": {
      "title": "QR-Code Design-Tipps für den Druck — Best Practices 2026",
      "description": "Druckfertige QR-Codes professionell gestalten. Mindestmaße, 300 DPI Druckauflösung, Kontraste und Materialanforderungen für fehlerfreies Scannen."
    },
    "tr": {
      "title": "Baskı İçin QR Kod Tasarım Kuralları — 2026 Uzman Tavsiyeleri",
      "description": "Baskıya hazır QR kodlarında ustalaşın. Optimum boyutlar, 300 DPI çözünürlük, renk kontrastı ve her taramanın başarılı olmasını sağlayan malzeme önerileri."
    }
  },
  "qr-code-error-correction-explained": {
    "en": {
      "title": "QR Code Error Correction Explained: Low, Medium, Quartile vs High (L, M, Q, H)",
      "description": "Master Reed-Solomon error correction in QR codes. Learn which recovery level (7%, 15%, 25%, 30%) to choose for custom logos, outdoor signage, and scannability."
    },
    "es": {
      "title": "Corrección de Errores en Códigos QR Explicada: Niveles L, M, Q y H",
      "description": "Domina la corrección de errores Reed-Solomon en códigos QR. Aprende qué nivel (7%, 15%, 25%, 30%) elegir para logotipos, vallas y escaneo infalible."
    },
    "pt": {
      "title": "Correção de Erros em QR Code Explicada: Níveis L, M, Q e H",
      "description": "Entenda o algoritmo Reed-Solomon em códigos QR. Descubra qual nível (7%, 15%, 25%, 30%) escolher para logotipos corporativos, outdoors e leitura rápida."
    },
    "de": {
      "title": "QR-Code Fehlerkorrektur Erklärt: Level L, M, Q und H im Detail",
      "description": "Meistern Sie die Reed-Solomon-Fehlerkorrektur bei QR-Codes. Welches Wiederherstellungs-Level (7%, 15%, 25%, 30%) für Firmenlogos und Außenwerbung nötig ist."
    },
    "tr": {
      "title": "QR Kod Hata Düzeltme Seviyeleri: L, M, Q ve H Karşılaştırması",
      "description": "QR kodlarındaki Reed-Solomon hata düzeltme algoritmasını öğrenin. Özel logolar, açık hava tabelaları ve okunabilirlik için hangi seviyeyi (%7, %15, %25, %30) seçmelisiniz."
    }
  },
  "qr-code-for-google-maps": {
    "en": {
      "title": "How to Create a QR Code for Google Maps — Location QR Code Guide",
      "description": "Create a free QR code that opens a Google Maps location when scanned. Perfect for event venues, storefronts, wedding invitations, and delivery instructions."
    },
    "es": {
      "title": "Cómo Crear un Código QR para Google Maps — Guía de Ubicación",
      "description": "Crea un código QR gratuito que abre una ubicación en Google Maps al escanearlo. Ideal para bodas, locales comerciales, eventos y envíos."
    },
    "pt": {
      "title": "Como Criar um QR Code para o Google Maps — Guia de Localização",
      "description": "Crie um QR code gratuito que abre uma localização no Google Maps ao ser escaneado. Perfeito para casamentos, lojas físicas, eventos e entregas."
    },
    "de": {
      "title": "Google Maps QR-Code erstellen — Standort & Routenplaner Guide",
      "description": "Erstellen Sie einen kostenlosen QR-Code, der beim Scannen direkt einen Google Maps Standort oder eine Navigation öffnet. Ideal für Events, Geschäfte und Einladungen."
    },
    "tr": {
      "title": "Google Haritalar İçin QR Kod Nasıl Oluşturulur — Konum QR Kod Rehberi",
      "description": "Tarandığında Google Haritalar'da belirli bir konumu açan ücretsiz QR kod oluşturun. Etkinlikler, mağazalar, düğün davetiyeleri ve yol tarifleri için idealdir."
    }
  },
  "qr-code-for-instagram": {
    "en": {
      "title": "How to Make a Custom Instagram QR Code to Grow Followers & Engagement",
      "description": "Create a branded Instagram QR code for your profile, reels, or direct messages. Learn vector design tips, deep-link formats, and high-converting print placements."
    },
    "es": {
      "title": "Cómo Crear un Código QR de Instagram para Conseguir Seguidores y Engagement",
      "description": "Crea un código QR personalizado de Instagram para tu perfil, reels o mensajes directos. Aprende trucos de diseño vectorial y las mejores ubicaciones en imprenta."
    },
    "pt": {
      "title": "Como Criar um QR Code do Instagram para Ganhar Seguidores e Engajamento",
      "description": "Crie um QR Code personalizado do Instagram para seu perfil, reels ou mensagens diretas (DM). Dicas de design vetorial e impressões de alta conversão."
    },
    "de": {
      "title": "Instagram QR-Code erstellen für mehr Follower & Reichweite",
      "description": "Erstellen Sie einen gebrandeten Instagram QR-Code für Profil, Reels oder Direktnachrichten. Vektordesign-Tipps und conversion-starke Druckplatzierungen."
    },
    "tr": {
      "title": "Takipçi ve Etkileşimi Artırmak İçin Özel Instagram QR Kodu Nasıl Yapılır",
      "description": "Profiliniz, Reels videolarınız veya direkt mesajlarınız için logolu Instagram QR kodu oluşturun. Vektör tasarım ipuçları ve yüksek dönüşüm sağlayan baskı taktikleri."
    }
  },
  "qr-code-for-restaurant-menu": {
    "en": {
      "title": "How to Use QR Codes for Restaurant Menus — Complete Guide (2026)",
      "description": "Learn how to create, customize, and print QR codes for your restaurant menu. Step-by-step guide with design tips, placement advice, and free tools to go contactless."
    },
    "es": {
      "title": "Cómo Usar Códigos QR para Menús de Restaurantes — Guía Completa (2026)",
      "description": "Aprende a crear, personalizar e imprimir códigos QR para la carta o menú de tu restaurante. Guía paso a paso con consejos de diseño, ubicación y herramientas gratis."
    },
    "pt": {
      "title": "Como Usar QR Code para Cardápios de Restaurantes — Guia (2026)",
      "description": "Aprenda a criar, personalizar e imprimir QR codes para o cardápio digital do seu restaurante ou bar. Dicas de displays de mesa, higiene e ferramentas gratuitas."
    },
    "de": {
      "title": "QR-Code für Restaurant-Speisekarten — Komplette Anleitung (2026)",
      "description": "Erfahren Sie, wie Sie digitale QR-Code-Speisekarten für Ihr Restaurant erstellen, gestalten und drucken. Tipps für Tischaufsteller, Hygiene und Gastronomie-Tools."
    },
    "tr": {
      "title": "Restoran Menüleri İçin QR Kod Nasıl Kullanılır — 2026 Rehberi",
      "description": "Restoranınızın dijital menüsü için QR kod oluşturma, özelleştirme ve basma adımları. Tasarım ipuçları, masa stantları ve temassız menü araçları."
    }
  },
  "qr-code-for-whatsapp": {
    "en": {
      "title": "How to Create a WhatsApp QR Code for Direct Chat (No Contact Save Required)",
      "description": "Learn how to generate a custom WhatsApp QR code with pre-filled messages. Enable 1-tap direct chats for retail stores, menus, packaging, and customer support."
    },
    "es": {
      "title": "Cómo Crear un Código QR de WhatsApp para Chat Directo (Sin Guardar Contacto)",
      "description": "Aprende a generar un código QR de WhatsApp personalizado con mensaje predefinido. Chatea con 1 solo toque en tiendas, cartas, embalajes y soporte."
    },
    "pt": {
      "title": "Como Criar um QR Code do WhatsApp para Conversa Direta (Sem Salvar Número)",
      "description": "Aprenda a gerar um QR Code personalizado do WhatsApp com mensagem pré-definida. Inicie chats com 1 toque no varejo, cardápios, embalagens e suporte."
    },
    "de": {
      "title": "WhatsApp QR-Code für direkten Chat erstellen (Ohne Nummernspeichern)",
      "description": "Erfahren Sie, wie Sie einen individuellen WhatsApp QR-Code mit vorgefertigter Nachricht erstellen. 1-Klick-Direktchat für Einzelhandel, Speisekarten und Support."
    },
    "tr": {
      "title": "Doğrudan Sohbet İçin WhatsApp QR Kodu Nasıl Oluşturulur (Numara Kaydetmeden)",
      "description": "Önceden yazılmış mesaj taslağı içeren özel WhatsApp QR kodları oluşturun. Mağazalar, menüler, ambalajlar ve müşteri desteği için tek dokunuşla doğrudan sohbet."
    }
  },
  "qr-code-for-youtube": {
    "en": {
      "title": "How to Create a YouTube QR Code for Subscribers, Videos & Playlists (2026)",
      "description": "Generate custom YouTube QR codes that open channel subscriptions, video tutorials, and live streams. Learn the 1-click auto-subscribe trick to double conversions."
    },
    "es": {
      "title": "Cómo Crear un Código QR para YouTube — Suscriptores, Vídeos y Listas (2026)",
      "description": "Genera códigos QR personalizados para YouTube que abren suscripciones, tutoriales y directos. Conoce el truco de auto-suscripción para duplicar seguidores."
    },
    "pt": {
      "title": "Como Criar QR Code para YouTube — Inscritos, Vídeos e Playlists (2026)",
      "description": "Crie códigos QR para o YouTube que abrem inscrições automáticas, tutoriais e lives. Conheça o truque de auto-inscrição para dobrar suas conversões."
    },
    "de": {
      "title": "YouTube QR-Code erstellen — Für Abonnenten, Videos & Playlists (2026)",
      "description": "Erstellen Sie professionelle YouTube QR-Codes für Kanal-Abos, Video-Tutorials und Playlists. Mit dem 1-Klick-Auto-Abo-Trick zur Verdoppelung Ihrer Conversions."
    },
    "tr": {
      "title": "Abone, Video ve Çalma Listeleri İçin YouTube QR Kodu Nasıl Oluşturulur (2026)",
      "description": "Kanal abonelikleri, video eğitimleri ve canlı yayınları açan özel YouTube QR kodları oluşturun. Dönüşümleri ikiye katlayan 1 tıkla otomatik abone olma taktiği."
    }
  },
  "qr-code-size-guide": {
    "en": {
      "title": "QR Code Size Guide — Minimum Sizes for Print & Billboards",
      "description": "Complete sizing reference for QR codes. Learn the minimum dimensions for business cards, stickers, posters, billboards, and digital screens."
    },
    "es": {
      "title": "Guía de Tamaños de Códigos QR — Dimensiones Mínimas para Impresión y Vallas",
      "description": "Referencia completa de dimensiones para códigos QR. Descubre los tamaños mínimos para tarjetas de visita, pegatinas, carteles, vallas publicitarias y pantallas."
    },
    "pt": {
      "title": "Guia de Tamanhos de QR Code — Dimensões Mínimas para Impressão e Outdoors",
      "description": "Tabela completa de medidas para códigos QR. Calcule os tamanhos mínimos para cartões de visita, adesivos, cartazes, banners e outdoors."
    },
    "de": {
      "title": "QR-Code Größen-Leitfaden — Mindestmaße für Druck, Plakate und Banner",
      "description": "Vollständige Größentabelle für QR-Codes. Berechnen Sie die Mindestmaße für Visitenkarten, Aufkleber, Plakate, Großflächenwerbung und Bildschirme."
    },
    "tr": {
      "title": "QR Kod Boyut Rehberi — Baskı ve Tabelalar İçin Minimum Ölçüler",
      "description": "QR kodları için kapsamlı boyut referans tablosu. Kartvizitler, çıkartmalar, posterler, reklam panoları ve dijital ekranlar için minimum boyutları öğrenin."
    }
  },
  "qr-code-trends-2025": {
    "en": {
      "title": "QR Code Trends 2026 & Beyond — Design Innovations, Statistics & GS1 Sunrise 2027",
      "description": "Explore the latest QR code trends in 2026 and beyond, including GS1 Sunrise 2027 transition, EU Digital Product Passport, design innovations, and industry statistics."
    },
    "es": {
      "title": "Tendencias de Códigos QR 2026 y Más Allá — Innovación, Estadísticas y GS1 Sunrise 2027",
      "description": "Explora las últimas tendencias en códigos QR para 2026: la transición GS1 Sunrise 2027, el Pasaporte Digital de Producto de la UE y estadísticas globales de adopción."
    },
    "pt": {
      "title": "Tendências de QR Code 2026 e o Futuro — Estatísticas, GS1 Sunrise 2027 e Design",
      "description": "Confira as principais tendências de códigos QR para 2026: a transição GS1 Sunrise 2027 no varejo, o passaporte digital de produtos da UE e estatísticas de uso."
    },
    "de": {
      "title": "QR-Code Trends 2026 & Zukunft — GS1 Sunrise 2027, Statistiken & Design-Innovationen",
      "description": "Die wichtigsten QR-Code-Trends 2026: Die GS1-Sunrise-2027-Umstellung im Handel, der digitale Produktpass der EU und aktuelle Wachstumsstatistiken."
    },
    "tr": {
      "title": "2026 QR Kod Trendleri ve Gelecek — Tasarım İnovasyonları, İstatistikler ve GS1 Sunrise 2027",
      "description": "GS1 Sunrise 2027 geçişi, AB Dijital Ürün Pasaportu, tasarım yenilikleri ve sektör istatistikleri dahil olmak üzere 2026 ve sonrasındaki en yeni QR kod trendlerini keşfedin."
    }
  },
  "qr-code-vs-barcode": {
    "en": {
      "title": "QR Code vs Barcode — What's the Difference? (2026 Guide)",
      "description": "Understand the key differences between QR codes and traditional barcodes. Compare data capacity, scanning methods, use cases, and which is better for your needs."
    },
    "es": {
      "title": "Código QR vs Código de Barras — ¿Cuál es la Diferencia? (Guía 2026)",
      "description": "Comprende las diferencias entre códigos QR y códigos de barras tradicionales. Comparativa de capacidad, tipos de escaneo, usos y cuál conviene elegir."
    },
    "pt": {
      "title": "QR Code vs Código de Barras — Qual é a Diferença? (Guia 2026)",
      "description": "Descubra as diferenças entre códigos de barras tradicionais e códigos QR. Compare capacidade de dados, leitura, aplicações e qual a melhor escolha."
    },
    "de": {
      "title": "QR-Code vs. Barcode — Der Große Unterschied (Leitfaden 2026)",
      "description": "Erfahren Sie die zentralen Unterschiede zwischen 1D-Strichcodes und 2D-QR-Codes. Datenkapazität, Scan-Verfahren, Einsatzgebiete und Zukunftsaussichten."
    },
    "tr": {
      "title": "QR Kod vs Barkod — Farklar Nelerdir? (2026 Karşılaştırma Rehberi)",
      "description": "Geleneksel barkodlar ile 2D QR kodları arasındaki temel farkları anlayın. Veri kapasitesi, tarama yöntemleri, kullanım alanları ve ihtiyaçlarınıza en uygun seçimi karşılaştırın."
    }
  },
  "qr-codes-for-real-estate": {
    "en": {
      "title": "QR Codes for Real Estate — Listing Signs & Virtual Tours",
      "description": "How real estate agents use QR codes on property signs, brochures, and business cards to link buyers to virtual tours, MLS listings, and contact details."
    },
    "es": {
      "title": "Códigos QR para Inmobiliarias — Carteles de Venta y Tours Virtuales",
      "description": "Cómo los agentes inmobiliarios usan códigos QR en carteles de propiedades, folletos y tarjetas para conectar con tours virtuales y fichas de inmuebles."
    },
    "pt": {
      "title": "QR Codes para Imobiliárias — Placas de Venda e Tours Virtuais",
      "description": "Como corretores e imobiliárias usam códigos QR em placas de imóveis, folhetos e cartões para conectar compradores a tours 3D virtuais e imóveis."
    },
    "de": {
      "title": "QR-Codes für Immobilienmakler — Maklerschilder & Virtuelle 3D-Touren",
      "description": "Wie Immobilienmakler QR-Codes auf Verkaufsschildern, Exposés und Visitenkarten einsetzen, um Interessenten zu 3D-Rundgängen und Objektdetails zu führen."
    },
    "tr": {
      "title": "Gayrimenkul İçin QR Kodlar — Satılık İlan Tabelaları ve Sanal Turlar",
      "description": "Gayrimenkul danışmanlarının alıcıları 3D sanal turlara, ilan detaylarına ve iletişim bilgilerine yönlendirmek için satılık tabelalarında ve broşürlerde QR kodları nasıl kullandığı."
    }
  },
  "static-vs-dynamic-qr-codes": {
    "en": {
      "title": "Static vs Dynamic QR Codes — What's the Difference?",
      "description": "Understand the key differences between static and dynamic QR codes. Learn when to use each type, their pros and cons, and which is better for your business needs."
    },
    "es": {
      "title": "Códigos QR Estáticos vs Dinámicos — ¿Cuál es la Diferencia?",
      "description": "Comprende las diferencias clave entre códigos QR estáticos y dinámicos. Descubre cuándo usar cada uno, ventajas, desventajas y cuál conviene a tu negocio."
    },
    "pt": {
      "title": "QR Code Estático vs Dinâmico — Qual é a Diferença?",
      "description": "Entenda as diferenças fundamentais entre códigos QR estáticos e dinâmicos. Descubra vantagens, desvantagens, privacidade e qual escolher para o seu negócio."
    },
    "de": {
      "title": "Statische vs. Dynamische QR-Codes — Der Große Vergleich",
      "description": "Verstehen Sie die entscheidenden Unterschiede zwischen statischen und dynamischen QR-Codes. Vor- und Nachteile, Datenschutz und der beste Einsatz für Ihr Unternehmen."
    },
    "tr": {
      "title": "Statik vs Dinamik QR Kodlar — Aralarındaki Fark Nedir?",
      "description": "Statik ve dinamik QR kodları arasındaki temel farkları öğrenin. Avantajlar, dezavantajlar, gizlilik ve işletmeniz için en doğru tercihi keşfedin."
    }
  },
  "svg-vs-png-vs-pdf-qr-code-export": {
    "en": {
      "title": "SVG vs PNG vs PDF for QR Codes — The Ultimate Print & Web Export Guide (2026)",
      "description": "Learn when to export QR codes as SVG, PNG, or PDF. Understand vector scalability, 300 DPI print standards, and how to avoid blurry, unreadable scans."
    },
    "es": {
      "title": "SVG vs PNG vs PDF para Códigos QR — Guía Completa de Exportación (2026)",
      "description": "Aprende cuándo exportar códigos QR en SVG, PNG o PDF. Comprende la escalabilidad vectorial, los 300 DPI de imprenta y cómo evitar impresiones borrosas."
    },
    "pt": {
      "title": "SVG vs PNG vs PDF para QR Codes — Guia de Exportação para Gráfica e Web (2026)",
      "description": "Descubra quando exportar códigos QR em SVG, PNG ou PDF. Entenda a escala vetorial, os 300 DPI para impressão e como evitar imagens borradas."
    },
    "de": {
      "title": "SVG vs PNG vs PDF für QR-Codes — Der ultimative Export-Ratgeber (2026)",
      "description": "Wann sollten Sie QR-Codes als SVG, PNG oder PDF exportieren? Alles über Vektorskalierung, 300-DPI-Druckstandards und gestochen scharfe Scans."
    },
    "tr": {
      "title": "QR Kodlar İçin SVG vs PNG vs PDF — Kapsamlı Baskı ve Web Dışa Aktarım Rehberi (2026)",
      "description": "QR kodlarını ne zaman SVG, PNG veya PDF olarak dışa aktarmanız gerektiğini öğrenin. Vektörel ölçeklenebilirlik, 300 DPI baskı standartları ve bulanık taramaları önleme yolları."
    }
  },
  "what-is-quishing-qr-code-phishing": {
    "en": {
      "title": "What is Quishing? How to Recognize & Protect Against QR Code Phishing (2026 Guide)",
      "description": "Comprehensive 2026 guide to Quishing (QR code phishing). Discover how cybercriminals bypass email firewalls, steal MFA tokens, and how to defend your enterprise."
    },
    "es": {
      "title": "¿Qué es el Quishing? Cómo Reconocer y Protegerte del Phishing con Códigos QR (Guía 2026)",
      "description": "Guía completa 2026 sobre Quishing (phishing con códigos QR). Descubre cómo los ciberdelincuentes eluden cortafuegos de correo y cómo blindar tu empresa."
    },
    "pt": {
      "title": "O que é Quishing? Como Identificar e Evitar Golpes com QR Code (Guia 2026)",
      "description": "Guia completo 2026 sobre Quishing (phishing via QR code). Saiba como criminosos burlam filtros de e-mail, roubam tokens MFA e como proteger sua empresa."
    },
    "de": {
      "title": "Was ist Quishing? Schutz vor Phishing-Angriffen mit QR-Codes (Leitfaden 2026)",
      "description": "Umfassender Leitfaden 2026 zu Quishing (QR-Code-Phishing). Wie Angreifer E-Mail-Filter umgehen, MFA-Tokens stehlen und wie Sie Unternehmen absichern."
    },
    "tr": {
      "title": "Quishing Nedir? QR Kod Kimlik Avını Tanıma ve Korunma Yolları (2026 Rehberi)",
      "description": "Quishing (QR kod kimlik avı) hakkında kapsamlı 2026 rehberi. Siber suçluların e-posta güvenlik duvarlarını nasıl aştığını ve kurumsal güvenliğinizi nasıl koruyacağınızı öğrenin."
    }
  },
  "whatsapp-web-qr-code-troubleshooting": {
    "en": {
      "title": "WhatsApp Web QR Code Not Working? 7 Fixes for Scan & Connection Errors",
      "description": "Fix WhatsApp Web QR code scan failures, loading loops, camera focus issues, and device linking errors on Windows, Mac, iPhone, and Android."
    },
    "es": {
      "title": "¿El Código QR de WhatsApp Web No Funciona? 7 Soluciones Rápidas",
      "description": "Soluciona los errores al escanear el código QR de WhatsApp Web. Corrige problemas de enfoque de cámara, brillo, caché del navegador y vinculación."
    },
    "pt": {
      "title": "Código QR do WhatsApp Web Não Funciona? 7 Soluções Rápidas para Erros de Leitura",
      "description": "Resolva falhas de leitura, loops de carregamento e erros ao conectar o WhatsApp Web no Windows, Mac, iPhone e Android. Dicas de foco, brilho e limites de aparelhos."
    },
    "de": {
      "title": "WhatsApp Web QR-Code funktioniert nicht? 7 Fixes für Scan- & Verbindungsfehler",
      "description": "Behebe Scan- und Verbindungsfehler bei WhatsApp Web. Tipps zu Kamerafokus, Monitor-Spiegelungen, Browser-Cache, WebSockets und Geräte-Limits."
    },
    "tr": {
      "title": "WhatsApp Web QR Kodu Çalışmıyor mu? Tarama ve Bağlantı Hataları İçin 7 Çözüm",
      "description": "Windows, Mac, iPhone ve Android'de WhatsApp Web QR kod tarama hatalarını, yükleme döngülerini, kamera odaklama sorunlarını ve cihaz bağlama hatalarını giderin."
    }
  },
  "wifi-qr-code-for-hotels": {
    "en": {
      "title": "WiFi QR Code for Hotels & Airbnb — Guest Network Setup Guide",
      "description": "Create and print a WiFi QR code for your hotel, Airbnb, or guest house. Let visitors connect to your network with a single scan — no typing passwords."
    },
    "es": {
      "title": "Código QR de Wi-Fi para Hoteles y Airbnb — Guía para Redes de Huéspedes",
      "description": "Crea e imprime un código QR de Wi-Fi para tu hotel, casa rural o apartamento de Airbnb. Conecta a tus clientes sin necesidad de escribir contraseñas."
    },
    "pt": {
      "title": "QR Code de Wi-Fi para Hotéis e Airbnb — Guia de Rede para Hóspedes",
      "description": "Crie e imprima um QR code de Wi-Fi para seu hotel, pousada ou imóvel no Airbnb. Conecte seus hóspedes com apenas 1 scan sem digitar senhas."
    },
    "de": {
      "title": "WLAN QR-Code für Hotels & Airbnb — Leitfaden für Gäste-Netzwerke",
      "description": "Erstellen und drucken Sie einen WLAN-QR-Code für Ihr Hotel, Ihre Ferienwohnung oder Airbnb. Gäste verbinden sich mit einem einzigen Klick ohne Passworteingabe."
    },
    "tr": {
      "title": "Oteller ve Airbnb İçin WiFi QR Kodu — Misafir Ağı Kurulum Rehberi",
      "description": "Oteliniz, pansiyonunuz veya Airbnb mülkünüz için WiFi QR kodu oluşturun ve bastırın. Misafirleriniz şifre yazmadan tek bir taramayla ağınıza bağlansın."
    }
  }
};

export function getLocalizedPostData(postId: string, locale: Locale, fallbackPost: any) {
  const trans = blogTranslations[postId]?.[locale];
  return {
    title: trans?.title || fallbackPost.data.title,
    description: trans?.description || fallbackPost.data.description,
    pubDate: fallbackPost.data.pubDate,
    updatedDate: fallbackPost.data.updatedDate,
    author: fallbackPost.data.author,
    category: fallbackPost.data.category,
    readingTime: fallbackPost.data.readingTime,
    featured: fallbackPost.data.featured,
    ogImage: fallbackPost.data.ogImage
  };
}
