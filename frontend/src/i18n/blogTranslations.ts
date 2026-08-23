import { type Locale } from './config';

export interface LocalizedBlogMeta {
  title: string;
  description: string;
  categoryLabel?: string;
}

export const blogTranslations: Record<string, Record<Locale, LocalizedBlogMeta>> = {
  "how-to-add-qr-code-to-business-card": {
    en: {
      title: "How to Add a QR Code to Your Business Card — Complete Guide",
      description: "Step-by-step guide to putting a vCard or portfolio QR code on your business cards. Optimal size, placement, DPI, and print best practices."
    },
    es: {
      title: "Cómo Añadir un Código QR a tu Tarjeta de Visita — Guía Completa",
      description: "Guía paso a paso para incluir un código QR vCard o de portafolio en tus tarjetas de presentación. Tamaño óptimo, ubicación, DPI y consejos de impresión."
    },
    pt: {
      title: "Como Adicionar um QR Code no seu Cartão de Visita — Guia Completo",
      description: "Passo a passo para colocar um QR code vCard ou de portfólio no seu cartão de visita. Tamanho ideal, posicionamento, DPI e dicas de impressão gráfica."
    },
    de: {
      title: "So fügen Sie einen QR-Code auf Ihrer Visitenkarte ein — Vollständige Anleitung",
      description: "Schritt-für-Schritt-Anleitung für vCard- und Kontakt-QR-Codes auf Visitenkarten. Optimale Größe, Platzierung, DPI und Drucktipps."
    }
  },
  "how-to-scan-a-qr-code": {
    en: {
      title: "How to Scan a QR Code on Any Device — iPhone, Android, and PC",
      description: "Learn how to scan QR codes on iPhone, iPad, Samsung, Google Pixel, Windows, and Mac using built-in tools and browser scanners. No app downloads required."
    },
    es: {
      title: "Cómo Escanear un Código QR en Cualquier Dispositivo — iPhone, Android y PC",
      description: "Aprende a escanear códigos QR en iPhone, Android, Windows y Mac usando herramientas nativas y escáneres web. Sin instalar aplicaciones."
    },
    pt: {
      title: "Como Escanear um QR Code em Qualquer Dispositivo — Celular e PC",
      description: "Aprenda a ler QR codes no iPhone, Android, Windows e Mac utilizando a câmera nativa ou leitor online. Sem precisar baixar aplicativos."
    },
    de: {
      title: "So scannen Sie einen QR-Code auf jedem Gerät — iPhone, Android & PC",
      description: "Anleitung zum Scannen von QR-Codes mit Smartphone-Kameras, Web-Scannern und Screenshots auf iPhone, Android, Windows und Mac."
    }
  },
  "qr-code-color-guide": {
    en: {
      title: "QR Code Color Best Practices: Contrast, Gradients, and Scannability",
      description: "How to choose brand colors for QR codes without breaking scannability. WCAG contrast ratios, gradient dos and don'ts, and inverted color rules."
    },
    es: {
      title: "Guía de Colores para Códigos QR: Contraste, Degradados y Escaneabilidad",
      description: "Cómo elegir colores corporativos para códigos QR sin perder legibilidad. Ratios de contraste WCAG, reglas de degradados y fondos oscuros."
    },
    pt: {
      title: "Guia de Cores para QR Code: Contraste, Gradientes e Legibilidade",
      description: "Como escolher as cores da sua marca para QR codes sem prejudicar o escaneamento. Proporções de contraste, degradês e regras de cores invertidas."
    },
    de: {
      title: "QR-Code Farb-Guide: Kontrast, Verläufe & Lesbarkeit optimieren",
      description: "Wählen Sie Markenfarben für QR-Codes, ohne die Scanbarkeit zu gefährden. Kontrastverhältnisse, Farbverläufe und Best Practices für Print & Screen."
    }
  },
  "qr-code-design-best-practices-for-print": {
    en: {
      title: "QR Code Design Best Practices for Print — Resolution, Margin & Materials",
      description: "Everything you need to know before sending QR codes to the printer. DPI, vector formats, quiet zones, color profiles, and real-world test workflows."
    },
    es: {
      title: "Buenas Prácticas de Diseño de Códigos QR para Impresión — Resolución y Materiales",
      description: "Todo lo que debes saber antes de imprimir códigos QR en folletos, carteles y envases. DPI, formatos vectoriales SVG, zonas de silencio y pruebas reales."
    },
    pt: {
      title: "Melhores Práticas de Design de QR Code para Impressão — Resolução e Margens",
      description: "Tudo o que você precisa saber antes de enviar QR codes para a gráfica. Resolução em DPI, formatos vetoriais, margens de respiro e testes práticos."
    },
    de: {
      title: "QR-Code Design-Regeln für den Druck — Auflösung, Ränder & Materialien",
      description: "Alles, was Sie vor dem Drucken von QR-Codes auf Flyern, Plakaten und Verpackungen wissen müssen: Vektorgrafiken, Ruhezonen und Druckauflösung."
    }
  },
  "qr-code-for-google-maps": {
    en: {
      title: "How to Create a QR Code for Google Maps Location — Free Guide",
      description: "Generate a QR code that opens your storefront, venue, or event location directly in Google Maps or Apple Maps. Perfect for flyers, invites, and table tents."
    },
    es: {
      title: "Cómo Crear un Código QR para Ubicación en Google Maps — Guía Gratis",
      description: "Genera un código QR que abra tu tienda, local o evento directamente en Google Maps. Perfecto para folletos, invitaciones y cartelería física."
    },
    pt: {
      title: "Como Criar um QR Code para Localização no Google Maps — Guia Grátis",
      description: "Gere um QR code que abre o endereço do seu comércio ou evento diretamente no Google Maps. Perfeito para panfletos, convites e banners."
    },
    de: {
      title: "QR-Code für Google Maps Standort erstellen — Kostenlose Anleitung",
      description: "Erstellen Sie einen QR-Code für Ihr Geschäft oder Event, der direkt Google Maps auf dem Smartphone öffnet. Perfekt für Flyer und Schaufenster."
    }
  },
  "qr-code-for-restaurant-menu": {
    en: {
      title: "QR Code for Restaurant Menus: Setup, Best Practices, and Free Generator",
      description: "How restaurants, cafes, and bars can create contactless digital menus with custom branding, table numbers, and fast loading times."
    },
    es: {
      title: "Códigos QR para Menús de Restaurante: Configuración y Buenas Prácticas",
      description: "Cómo crear cartas digitales y menús sin contacto para restaurantes, bares y cafeterías con diseño personalizado y carga ultrarrápida."
    },
    pt: {
      title: "QR Code para Cardápio de Restaurante: Como Criar Menu Digital Grátis",
      description: "Como restaurantes, bares e lanchonetes podem criar cardápios digitais sem contato, com logotipo da marca e acesso rápido pelo celular."
    },
    de: {
      title: "QR-Codes für Speisekarten in der Gastronomie — Kostenlos erstellen",
      description: "So erstellen Restaurants, Cafés und Bars kontaktlose digitale Speisekarten mit eigenem Logo und schneller Ladezeit auf allen Smartphones."
    }
  },
  "qr-code-size-guide": {
    en: {
      title: "QR Code Minimum Size Guide: Distances, Modules, and Print Standards",
      description: "Calculate the exact minimum size for QR codes based on scanning distance, content density, and printing surface. Formula and cheat sheet included."
    },
    es: {
      title: "Guía de Tamaño Mínimo para Códigos QR: Distancias y Estándares de Impresión",
      description: "Calcula el tamaño mínimo exacto para tus códigos QR según la distancia de escaneo, densidad de datos y soporte de impresión. Fórmula y tabla de referencia."
    },
    pt: {
      title: "Guia de Tamanho Mínimo de QR Code: Distâncias e Padrões Gráficos",
      description: "Calcule o tamanho ideal do QR code com base na distância de leitura, densidade de informações e material de impressão. Tabela prática inclusa."
    },
    de: {
      title: "QR-Code Mindestgrößen-Tabelle: Scanabstände & Druckstandards",
      description: "Berechnen Sie die exakte Mindestgröße für QR-Codes basierend auf Leseabstand, Datenmenge und Druckoberfläche. Mit Formel und Spickzettel."
    }
  },
  "qr-code-trends-2025": {
    en: {
      title: "Top QR Code Trends for 2026 & Beyond: AI Design, Dynamic Data, and Security",
      description: "Explore the newest QR code design innovations, enterprise adoption patterns, and cybersecurity standards shaping 2026 and beyond."
    },
    es: {
      title: "Tendencias en Códigos QR para 2026 y el Futuro: Diseño con IA y Seguridad",
      description: "Descubre las últimas innovaciones en diseño de códigos QR, adopción empresarial y estándares de ciberseguridad para 2026 y el futuro."
    },
    pt: {
      title: "Tendências de QR Code para 2026 e o Futuro: Design Moderno e Segurança",
      description: "Conheça as principais inovações em criação de QR code, personalização visual, novos casos de uso e proteção contra golpes digitais."
    },
    de: {
      title: "QR-Code Trends für 2026 und die Zukunft: KI-Design, Sicherheit & Trends",
      description: "Entdecken Sie die neuesten Innovationen im QR-Code-Design, Unternehmensanwendungen und Sicherheitsstandards für 2026 und die Zukunft."
    }
  },
  "qr-code-vs-barcode": {
    en: {
      title: "QR Code vs. Barcode: Key Differences, Storage, and When to Use Which",
      description: "Comprehensive comparison between 2D QR codes and 1D traditional barcodes. Capacity, speed, error correction, and industry use cases."
    },
    es: {
      title: "Código QR vs. Código de Barras: Diferencias Clave y Cuándo Usar Cada Uno",
      description: "Comparativa completa entre códigos QR bidimensionales y códigos de barras tradicionales. Capacidad, velocidad, corrección de errores y aplicaciones."
    },
    pt: {
      title: "QR Code vs. Código de Barras: Diferenças, Capacidade e Quando Usar",
      description: "Comparação detalhada entre QR codes 2D e códigos de barras tradicionais 1D. Capacidade de dados, velocidade de leitura e utilidade prática."
    },
    de: {
      title: "QR-Code vs. Strichcode (Barcode): Unterschiede & Anwendungsbereiche",
      description: "Vollständiger Vergleich zwischen 2D-QR-Codes und herkömmlichen 1D-Barcodes. Speicherkapazität, Fehlertoleranz und beste Einsatzzwecke."
    }
  },
  "qr-codes-for-real-estate": {
    en: {
      title: "QR Codes for Real Estate: Yard Signs, Property Flyers, and Virtual Tours",
      description: "How real estate agents and brokerages use custom QR codes to capture leads, share virtual tours, and track open house interest effortlessly."
    },
    es: {
      title: "Códigos QR para Inmobiliarias: Carteles, Folletos y Visitas Virtuales",
      description: "Cómo los agentes inmobiliarios usan códigos QR personalizados para captar clientes, compartir tours virtuales y promocionar viviendas en venta."
    },
    pt: {
      title: "QR Codes para Imobiliárias: Placas de Venda, Panfletos e Tours Virtuais",
      description: "Como corretores e imobiliárias utilizam QR codes personalizados para gerar leads, mostrar fotos do imóvel e apresentar tours 360°."
    },
    de: {
      title: "QR-Codes für Immobilienmakler: Verkaufsschilder & Virtuelle Rundgänge",
      description: "Wie Makler und Immobilienbüros QR-Codes auf Verkaufsschildern, Exposés und Flyern einsetzen, um Interessenten sofort zum Rundgang zu leiten."
    }
  },
  "static-vs-dynamic-qr-codes": {
    en: {
      title: "Static vs. Dynamic QR Codes: Which Should You Choose?",
      description: "Understand the fundamental differences between permanent static QR codes and editable dynamic QR codes. Learn which one fits your project."
    },
    es: {
      title: "Códigos QR Estáticos vs. Dinámicos: ¿Cuál Deberías Elegir?",
      description: "Comprende las diferencias fundamentales entre códigos QR estáticos permanentes y dinámicos editables. Elige el formato adecuado para tu proyecto."
    },
    pt: {
      title: "QR Codes Estáticos vs. Dinâmicos: Qual a Melhor Escolha?",
      description: "Entenda a diferença essencial entre QR codes estáticos que nunca expiram e dinâmicos editáveis. Saiba qual escolher para o seu objetivo."
    },
    de: {
      title: "Statische vs. dynamische QR-Codes: Welche Variante ist die richtige?",
      description: "Verstehen Sie den Unterschied zwischen dauerhaft gültigen statischen QR-Codes und editierbaren dynamischen QR-Codes für Ihre Kampagnen."
    }
  },
  "wifi-qr-code-for-hotels": {
    en: {
      title: "WiFi QR Codes for Hotels, Airbnb & Cafes: Setup and Guest Experience",
      description: "Complete guide to setting up branded WiFi QR codes for hospitality. Improve guest reviews, reduce support questions, and protect your network."
    },
    es: {
      title: "Códigos QR de WiFi para Hoteles, Airbnb y Cafés: Guía de Configuración",
      description: "Guía completa para configurar códigos QR de WiFi personalizados en hostelería. Mejora las valoraciones de tus huéspedes y evita preguntas sobre la clave."
    },
    pt: {
      title: "QR Code de Wi-Fi para Hotéis, Pousadas e Airbnb: Como Configurar",
      description: "Guia completo para oferecer conexão Wi-Fi via QR code em hotelaria e restaurantes. Melhore a experiência do hóspede e elimine digitação de senha."
    },
    de: {
      title: "WLAN QR-Codes für Hotels, Airbnb & Cafés: Einrichtung & Gäste-Komfort",
      description: "Vollständige Anleitung zur Bereitstellung von Marken-WLAN-QR-Codes im Gastgewerbe. Schnelle Verbindung für Gäste ohne lästiges Passworttippen."
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
