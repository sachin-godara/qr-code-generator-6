---
title: "QR-Code Fehlerkorrektur erklärt: Low, Medium, Quartile und High (L, M, Q, H)"
description: "Reed-Solomon-Fehlerkorrektur bei QR-Codes verstehen: Welches Level (7%, 15%, 25%, 30%) eignet sich für Logos, Außenwerbung und garantierte Lesbarkeit?"
pubDate: 2026-08-10
author: "GenerateCustomQR Team"
keywords: "qr code fehlerkorrektur level, qr code fehlerkorrektur L M Q H, reed solomon qr code, qr code mit logo fehlerkorrektur, maximale logo groesse qr code"
category: "design-tips"
readingTime: 8
featured: false
faqs:
  - q: "Was bedeutet Fehlerkorrektur bei einem QR-Code?"
    a: "Die Fehlerkorrektur basiert auf dem mathematischen Reed-Solomon-Algorithmus, der Redundanz-Codewörter in die Matrix einbettet. Dadurch können Lesegeräte die Daten zu 100% rekonstruieren, selbst wenn bis zu 30% des Codes beschädigt, zerkratzt oder von einem Logo verdeckt sind."
  - q: "Welches Fehlerkorrektur-Level ist für Logos erforderlich?"
    a: "Wählen Sie immer Level H (High - 30%) oder Level Q (25%), wenn Sie ein Logo in der Mitte des QR-Codes platzieren. Level H garantiert, dass trotz Verdeckung der mittleren Module jedes Smartphone den Code blitzschnell liest."
  - q: "Macht eine höhere Fehlerkorrektur das QR-Muster dichter?"
    a: "Ja. Höhere Fehlerkorrektur benötigt mehr Module für die Paritätsblöcke. Auf kleinen Visitenkarten sollte das Verhältnis von Fehlerkorrektur und physischer Druckgröße sorgfältig abgewogen werden."
howToSteps:
  - name: "Einsatzbereich festlegen"
    text: "Entscheiden Sie, ob der QR-Code rein digital angezeigt wird (Level M), gedruckt wird (Level M/Q) oder ein Logo enthält (Level H)."
  - name: "Fehlerkorrektur in GenerateCustomQR wählen"
    text: "Stellen Sie das Level ein: Beim Upload eines Logos empfiehlt GenerateCustomQR automatisch Level H."
  - name: "Mit mehreren Kameras testen"
    text: "Führen Sie vor dem Massendruck immer einen physischen Testscan unter realen Lichtverhältnissen durch."
---

Haben Sie sich jemals gefragt, warum ein QR-Code trotz Kaffeefleck, Knick oder Firmenlogo in der Mitte blitzschnell gescannt werden kann?

Das Geheimnis ist die **Reed-Solomon-Fehlerkorrektur** — ein genialer mathematischer Algorithmus, der ursprünglich für die Raumfahrt und optische Datenträger wie CDs entwickelt wurde.

In diesem Leitfaden erfahren Sie, wie die Fehlerkorrektur funktioniert, welche Unterschiede zwischen den **Levels L, M, Q und H** bestehen und wie Sie das optimale Level für Ihr Projekt wählen.

---

## Die 4 Fehlerkorrektur-Stufen im Überblick

Der internationale Standard (ISO/IEC 18004) definiert **vier diskrete Fehlerkorrektur-Stufen**:

| Stufe | Kennung | Datenwiederherstellung | Musterdichte | Bester Einsatzzweck |
| :---: | :---: | :---: | :---: | :--- |
| **L** | Low | **~7%** Wiederherstellung | Sehr gering (Grobe Punkte) | Winzige Druckformate, digitale Displays, einfache URLs OHNE Logo |
| **M** | Medium | **~15%** Wiederherstellung | Standard | **Standard-Vorgabe** für Flyer, Plakate und allgemeine Webseiten-Links |
| **Q** | Quartile | **~25%** Wiederherstellung | Mittel-Hoch | Robuste Etiketten, beanspruchte Verpackungen, kleine Grafiken |
| **H** | High | **~30%** Wiederherstellung | Hoch (Feine Punkte) | **Pflicht bei Logos**, Außenwerbung, Bodenaufklebern und Visitenkarten |

---

## Wie Reed-Solomon-Fehlerkorrektur unter der Haube funktioniert

Beim Erstellen eines QR-Codes werden die Zeichen nicht nur in binäre Bits übersetzt, sondern es werden **Polynom-Paritätsblöcke** berechnet:

<div class="blog-equation-card">
  <div class="blog-equation-segment data">
    <span class="segment-label">Nutzdaten</span>
    <span class="segment-val">70%</span>
  </div>
  <span class="blog-equation-op">+</span>
  <div class="blog-equation-segment parity">
    <span class="segment-label">Reed-Solomon Parität</span>
    <span class="segment-val">30%</span>
  </div>
  <span class="blog-equation-op">=</span>
  <div class="blog-equation-segment total">
    <span class="segment-label">Gesamtmatrix</span>
    <span class="segment-val">Level H (100%)</span>
  </div>
</div>

Wenn ein Smartphone den Code erfasst:
1. Die Kamera orientiert sich an den **3 Eck-Suchmustern (Augen)**.
2. Der Decoder liest die Datenmodule aus.
3. Fehlende oder durch ein Logo verdeckte Daten werden über Polynomgleichungen exakt mathematisch rekonstruiert.

Solange der Schaden **unter dem Schwellenwert (7% bis 30%)** bleibt, wird der Inhalt zu 100% ohne Datenverlust decodiert.

---

## Fehlerkorrektur vs. Musterdichte: Der Trade-Off

Mehr Redundanz bedeutet zwangsläufig mehr Module im Raster:

### Beispiel: 45 Zeichen lange URL (`https://generatecustomqr.com/de/url-qr-code`)

- **Level L (7% Korrektur)**: Matrix **25 × 25 Module** (Version 2). Große, leicht lesbare Punkte bei kleinen Druckformaten (z. B. 1,5 cm).
- **Level H (30% Korrektur)**: Matrix **33 × 33 Module** (Version 4). Deutlich mehr und feinere Punkte. Erfordert eine Mindestdruckgröße von 2,5 cm für zuverlässige Kamerafokussierung.

> [!IMPORTANT]
> **Gestaltungsregel**: Für schlichte Visitenkarten ohne Logo reicht **Level M**. Mit Logo wählen Sie immer **Level H** und drucken mit mindestens **25 × 25 mm**.

---

## Logo-Berechnung: Wie groß darf ein Logo sein?

- **Maximale Logo-Fläche bei Level H**: Maximal **20% bis 25%** der Gesamtfläche.
- **5% Sicherheitspuffer**: Bei maximal 22% bleibt genügend Toleranz für schwaches Licht und Reflexionen.
- **Abstandshalter**: Immer eine weiße Schutzfläche um das Logo legen, damit die Grafik nicht in die Datenpunkte übergeht.

---

## Reale Einsatzszenarien und Empfehlungen

| Einsatzbereich | Belastung | Empfohlene Stufe | Grund |
| :--- | :--- | :---: | :--- |
| **Gastro-Tischaufsteller** | Verschmutzung, Reinigungsmittel | **Level H** | Widersteht Abnutzung im täglichen Betrieb |
| **Vinyl-Banner im Freien** | Sonne, Regen, Knicke | **Level Q / H** | Scannt auch bei Wellenbildung sicher |
| **Produktverpackungen** | Druckabrieb, Versandbelastung | **Level Q** | Gute Balance aus Druckqualität und Lesbarkeit |
| **E-Mail-Signaturen & Web** | Keine physische Abnutzung | **Level M** | Hält das Raster sauber für Bildschirme |
| **Gebrandete Logo-Codes** | Gezielte Verdeckung von Modulen | **Level H** | Garantiert Lesbarkeit um das Logo herum |

---

## 3 Best Practices für High-Level-Fehlerkorrektur

1. **Kurze URLs verwenden**: Halten Sie URLs unter 50 Zeichen, um feine Muster zu vermeiden.
2. **4,5:1 Mindestkontrast wahren**: Dichte Level-H-Codes reagieren empfindlicher auf geringen Kontrast.
3. **Vektor-SVG für den Druck nutzen**: Für Banner immer SVG oder druckfertiges 300 DPI PDF exportieren.

---

## Zusammenfassung

- **Level M (15%)** für normale Weblinks und Displays ohne Logo.
- **Level H (30%)** für Logoeinbindung und Außenwerbung.
- Testen Sie alle Stufen kostenlos mit über 40 Stilen auf **[GenerateCustomQR](/de)**.
