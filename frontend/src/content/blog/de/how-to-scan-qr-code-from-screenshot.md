---
title: "QR-Code aus Screenshot scannen (Smartphone, PC & Mac)"
description: "Schritt-für-Schritt-Anleitung zum Scannen von QR-Codes aus Screenshots oder gespeicherten Bildern auf Smartphone und PC ohne zweite Kamera."
pubDate: 2026-08-28
author: "GenerateCustomQR Team"
keywords: "qr code aus screenshot scannen, qr code auf demselben handy scannen, qr code am pc scannen, qr code aus bilddatei lesen"
category: "guides"
readingTime: 6
featured: true
faqs:
  - q: "Wie scanne ich einen QR-Code, der auf meinem Smartphone-Bildschirm angezeigt wird?"
    a: "Mache einen Screenshot des QR-Codes. Auf dem iPhone öffnest du die Fotos-App und tippst auf das Live-Text / QR-Symbol unten rechts. Auf Android öffnest du Google Fotos und tippst auf 'Lens'. Alternativ kannst du den GenerateCustomQR Web-Scanner (generatecustomqr.com/de/qr-code-scanner) im Browser öffnen und den Screenshot hochladen."
  - q: "Kann ich einen QR-Code am PC mit Strg+V einfügen und scannen?"
    a: "Ja! Öffne generatecustomqr.com/de/qr-code-scanner im Browser und drücke Strg+V (Windows) oder Cmd+V (Mac) mit einem Bild in der Zwischenablage. Unsere browserbasierte Engine liest den Code in Millisekunden aus."
  - q: "Warum schlägt der Scan meines QR-Code-Screenshots fehl?"
    a: "Häufige Ursachen: (1) Der Screenshot wurde zu eng beschnitten (fehlende weiße Ruhezone). (2) Kompressionsartefakte in Messenger-Apps wie WhatsApp. (3) Der Dunkelmodus hat die Farben invertiert. (4) Die Auflösung liegt unter 150x150 Pixeln."
howToSteps:
  - name: "Screenshot erstellen"
    text: "Erstellen Sie einen Screenshot des QR-Codes auf dem Smartphone (Ein/Aus + Leiser bei Android oder Seitentaste + Lauter bei iPhone) bzw. am PC (Win + Umschalt + S oder Cmd + Umschalt + 4)."
  - name: "GenerateCustomQR Web-Scanner öffnen"
    text: "Rufen Sie generatecustomqr.com/de/qr-code-scanner auf und wählen Sie 'Bild Hochladen' oder drücken Sie Strg+V."
  - name: "Ergebnis abrufen & Aktion ausführen"
    text: "Der Scanner decodiert URL, WLAN-Daten, vCard oder WhatsApp-Nachrichten sofort mit 1-Klick-Aktionen."
---

Wir alle kennen das Problem: Jemand schickt uns ein Ticket, eine Zahlung oder einen Link als QR-Code in einem Bild oder PDF. Der QR-Code ist auf dem Handy-Display, aber die Kamera befindet sich auf der *Rückseite* desselben Smartphones.

Wie scannt man einen QR-Code, ohne ein zweites Gerät zu benutzen oder ihn auszudrucken?

Hier ist die vollständige Anleitung für iPhone, Android, Windows und Mac.

---

## Methode 1: Der Universelle Web-Scanner (Am schnellsten für alle Geräte)

Die einfachste Methode ohne Installation ist ein browserbasierter QR-Decoder wie **[GenerateCustomQR Scanner](/de/qr-code-scanner)**.

```
+---------------------------------------------------------------+
| 1. Screenshot erstellen -> 2. Einfügen (Strg+V) -> 3. Öffnen  |
+---------------------------------------------------------------+
```

### Schritte:
1. Öffnen Sie **[generatecustomqr.com/de/qr-code-scanner](/de/qr-code-scanner)** in Chrome, Safari, Edge oder Firefox.
2. Wählen Sie den Reiter **Bild Hochladen**.
3. Wählen Sie eine Option:
   - **Klicken Sie auf "Dateien Durchsuchen"** und wählen Sie Ihre Bilddatei (`.png`, `.jpg`, `.webp`, `.svg`).
   - **Drücken Sie Strg+V (Windows) oder Cmd+V (Mac)**, um ein kopiertes Bild direkt aus der Zwischenablage einzufügen.
   - **Ziehen Sie das Bild per Drag & Drop** direkt in das Scanfenster.
4. Der Scanner liest die Daten in Millisekunden aus, prüft die URL-Sicherheit und bietet 1-Klick-Aktionen (Link öffnen, WLAN verbinden, vCard speichern, WhatsApp-Chat).

> [!TIP]
> **Datenschutzhinweis**: GenerateCustomQR verarbeitet Bilder zu 100% lokal im Browser via WebAssembly. Ihre Screenshots werden niemals auf externe Server hochgeladen.

---

## Methode 2: Screenshot auf iPhone & iPad scannen (iOS 15+)

Apple hat **Live-Text & QR-Erkennung** direkt in die Fotos-App integriert:

1. Erstellen Sie einen Screenshot (**Seitentaste + Lauter** auf aktuellen iPhones).
2. Öffnen Sie die **Fotos-App** und wählen Sie den Screenshot aus.
3. Achten Sie auf das **Live-Text-Symbol** (drei Linien im Kasten) unten rechts.
4. Tippen Sie direkt auf den QR-Code im Bild, um die Optionen (*In Safari öffnen*, *Link kopieren*, *Teilen*) aufzurufen.

---

## Methode 3: Screenshot auf Android & Samsung scannen

### Option A: Mit Google Fotos (Google Lens)
1. Erstellen Sie einen Screenshot (**Ein/Aus + Leiser**).
2. Öffnen Sie die App **Google Fotos** und wählen Sie das Bild.
3. Tippen Sie in der unteren Leiste auf **Lens**.
4. Google Lens erkennt das QR-Muster automatisch und zeigt den anklickbaren Link an.

### Option B: Mit der Samsung Galerie
1. Öffnen Sie die **Galerie-App** auf Ihrem Samsung Galaxy.
2. Öffnen Sie den Screenshot mit dem QR-Code.
3. Tippen Sie auf das gelbe **"T"-Symbol** unten rechts oder das **Bixby Vision-Auge**.
4. Tippen Sie auf den angezeigten Link.

---

## Methode 4: Screenshots am Windows PC & Mac scannen

| Betriebssystem | Screenshot-Tastenkombination | Schnellste Decodierung |
| :--- | :--- | :--- |
| **Windows 11 / 10** | `Win + Umschalt + S` (Snipping Tool) | In [Web-Scanner](/de/qr-code-scanner) einfügen (`Strg+V`) |
| **macOS** | `Cmd + Umschalt + 4` | In Vorschau (Live-Text) oder im [Web-Scanner](/de/qr-code-scanner) |
| **Google Chrome (Alle OS)** | Rechtsklick auf Bild | Rechtsklick → *"Bild mit Google suchen"* |

---

## 4 Häufige Gründe für Scanfehler bei Screenshots

1. **Invertierter Dunkelmodus**: Weiße Module auf schwarzem Hintergrund werden von Standardkameras nicht erkannt. Nutzen Sie den Deep-Scan-Modus von GenerateCustomQR.
2. **Ruhezone abgeschnitten**: Ein QR-Code benötigt mindestens 20px weißen Rand an allen 4 Seiten.
3. **Komprimierung in Chat-Apps**: WhatsApp komprimiert JPEG-Dateien stark. Bitten Sie um Zusendung als "Dokument".
4. **Zu niedrige Auflösung (< 150x150 px)**: Zoomen Sie vor dem Screenshot näher heran.

---

Erstellen Sie Ihre eigenen scannbaren QR-Codes auf **[GenerateCustomQR](/de)**.
