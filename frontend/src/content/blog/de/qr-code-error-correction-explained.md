---
title: "QR-Code Fehlerkorrektur Erklärt: Level L, M, Q und H im Detail"
description: "Meistern Sie die Reed-Solomon-Fehlerkorrektur bei QR-Codes. Welches Wiederherstellungs-Level (7%, 15%, 25%, 30%) für Firmenlogos und Außenwerbung nötig ist."
pubDate: 2026-08-10
author: "GenerateCustomQR Team"
keywords: "qr code fehlerkorrektur, qr code error correction l m q h, reed solomon qr code, qr code mit logo fehlerkorrektur, maximale logogroesse qr code"
category: "design-tips"
readingTime: 8
featured: false
faqs:
  - q: "Was ist die Fehlerkorrektur bei QR-Codes?"
    a: "Ein mathematischer Algorithmus (Reed-Solomon-Code), der Redundanz hinzufügt. Dadurch bleibt der QR-Code auch dann zu 100% lesbar, wenn bis zu 30% der Fläche zerkratzt, verschmutzt oder durch ein Firmenlogo verdeckt sind."
  - q: "Welches Level sollte ich für ein eigenes Logo wählen?"
    a: "Wählen Sie immer Level H (High - 30%) oder Level Q (25%), sobald Sie ein eigenes Logo im Zentrum einbinden."
  - q: "Wird der QR-Code durch höhere Fehlerkorrektur dichter?"
    a: "Ja. Mehr Redundanzblöcke erfordern mehr Datenmodule im Raster. Eine 50-Zeichen-URL erzeugt bei Level L ein 25×25 Raster, bei Level H jedoch 33×33 Module."
howToSteps:
  - name: "Einsatzzweck festlegen"
    text: "Entscheiden Sie, ob der Code für Displays (Level M), Standarddrucke (Level M/Q) oder Logo-Integration (Level H) gedacht ist."
  - name: "Fehlerkorrektur auf GenerateCustomQR wählen"
    text: "Beim Upload eines Firmenlogos schaltet GenerateCustomQR die Fehlerkorrektur automatisch auf Level H."
  - name: "Scan-Test durchführen"
    text: "Prüfen Sie den Code vor dem Massendruck unter realen Bedingungen mit verschiedenen Smartphones."
---

Warum scannt ein QR-Code auch dann noch blitzschnell, wenn er Kaffeeflecken aufweist, eine Ecke abgerissen ist oder ein großes Firmenlogo in der Mitte platziert wurde?

Das Geheimnis ist die **Reed-Solomon-Fehlerkorrektur** — ein mathematisches Verfahren, das ursprünglich für die Satellitenkommunikation und CDs entwickelt wurde.

---

## Die 4 Fehlerkorrektur-Stufen nach ISO/IEC 18004

| Stufe | Kennung | Wiederherstellung | Rasterdichte | Empfohlener Einsatz |
| :---: | :---: | :---: | :---: | :--- |
| **L** | Low | **~7%** | Sehr grob (große Punkte) | Kleine Druckformate, digitale Displays ohne Logo |
| **M** | Medium | **~15%** | Standard | **Standard** für Flyer, Plakate und Web-Links |
| **Q** | Quartile | **~25%** | Mittel-Hoch | Produktverpackungen, Micro-Logos |
| **H** | High | **~30%** | Fein / Dicht | **Pflicht bei Firmenlogos** und Außenwerbung |

---

## Funktionsweise der Reed-Solomon-Polynome

<div class="blog-equation-card">
  <div class="blog-equation-segment data">
    <span class="segment-label">Codierte Daten</span>
    <span class="segment-val">70%</span>
  </div>
  <span class="blog-equation-op">+</span>
  <div class="blog-equation-segment parity">
    <span class="segment-label">Reed-Solomon-Parität</span>
    <span class="segment-val">30%</span>
  </div>
  <span class="blog-equation-op">=</span>
  <div class="blog-equation-segment total">
    <span class="segment-label">Gesamte Matrix</span>
    <span class="segment-val">Level H (100%)</span>
  </div>
</div>

Beim Scan ermittelt die Kamera über mathematische Gleichungen die fehlenden oder durch ein Logo verdeckten Datenpunkte, sodass der Inhalt zu 100% fehlerfrei decodiert wird.

---

## Richtige Logo-Größe im Zentrum

- **Maximal 20% bis 25%** der gesamten QR-Code-Fläche mit dem Logo abdecken.
- **5% Sicherheitspuffer**: Lässt Spielraum für schlechte Lichtverhältnisse oder Schatten.
- **Schutzabstand (Padding)**: Immer einen sauberen weißen Rand um das Logo legen.

---

## Praxis-Empfehlungen nach Einsatzbereich

| Einsatzbereich | Mögliche Belastung | Empfohlenes Level |
| :--- | :--- | :---: |
| **Gastro-Tischaufkleber** | Nässe, Putzmittel, Kratzer | **Level H** |
| **Außenbanner / Bauzaun** | UV-Strahlung, Regen, Faltenwurf | **Level Q oder H** |
| **Versandkartons** | Knicke, Paketaufkleber | **Level Q** |
| **E-Mail-Signatur / Web** | Keine physische Beschädigung | **Level M** |
| **QR-Code mit Firmenlogo** | Gezielte Datenüberdeckung | **Level H** |

---

Erstellen Sie Ihre QR-Codes mit optimierter Fehlerkorrektur auf **[GenerateCustomQR](/de)**.
