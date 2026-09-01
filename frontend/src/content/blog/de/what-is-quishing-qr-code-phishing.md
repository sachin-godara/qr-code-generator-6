---
title: "Was ist Quishing? Schutz vor Phishing-Angriffen mit QR-Codes (Leitfaden 2026)"
description: "Umfassender Leitfaden 2026 zu Quishing (QR-Code-Phishing). Wie Angreifer E-Mail-Filter umgehen, MFA-Tokens stehlen und wie Sie Unternehmen absichern."
pubDate: 2026-08-25
author: "GenerateCustomQR Sicherheitsforschung"
keywords: "was ist quishing, qr code phishing, quishing schutz, qr code sicherheit, quishing unternehmen verhindern"
category: "industry"
readingTime: 10
featured: true
faqs:
  - q: "Was bedeutet Quishing?"
    a: "Quishing (ein Kunstwort aus 'QR-Code' und 'Phishing') bezeichnet einen Cyberangriff, bei dem Angreifer QR-Codes anstelle von Text-Links nutzen, um Secure Email Gateways (SEGs) zu umgehen und Zugangsdaten zu erbeuten."
  - q: "Warum ist Quishing gefährlicher als klassisches E-Mail-Phishing?"
    a: "Weil der Nutzer vom geschützten Firmencomputer auf das ungeschützte private Smartphone wechselt. Zudem können klassische E-Mail-Sicherheitsfilter optische Bildmuster schwerer automatisiert analysieren."
  - q: "Kann ein QR-Code mein Telefon allein durch das Scannen hacken?"
    a: "Der Scan liest Text oder URLs aus. Das Öffnen des Links kann jedoch Browser-Sicherheitslücken ausnutzen oder auf gefälschte Login-Seiten führen."
  - q: "Wie erkenne ich gefährliche QR-Codes vor dem Öffnen?"
    a: "Prüfen Sie physische Schilder auf Aufkleber. Kontrollieren Sie in der Kamera-Vorschau die Ziel-URL auf verdächtige Schreibweisen oder Domain-Endungen."
  - q: "Wie sollten Unternehmen sich vor Quishing schützen?"
    a: "Durch KI-gestützte E-Mail-Sicherheit mit OCR-Analyse, verbindliche FIDO2-Sicherheitsschlüssel (YubiKeys) und DNS-Filter auf Mobilgeräten."
  - q: "Sind statische QR-Codes sicherer als dynamische?"
    a: "Ja. Statische QR-Codes speichern den Link direkt im Bildmuster ohne Server-Zwischenstationen. Dynamische Codes laufen über externe Server, die manipuliert werden können."
howToSteps:
  - name: "Physischen QR-Code prüfen"
    text: "Prüfen Sie, ob der QR-Code an Parkscheinautomaten oder Plakaten als Aufkleber überklebt wurde."
  - name: "Ziel-URL in der Kamera kontrollieren"
    text: "Tippen Sie nicht blind auf Vorschläge, sondern kontrollieren Sie den echten Domainnamen und HTTPS."
  - name: "FIDO2-Hardware-Schlüssel nutzen"
    text: "Nutzen Sie YubiKeys, um Logins kryptografisch an die echte Domain zu binden."
  - name: "Mit privatem Scanner prüfen"
    text: "Nutzen Sie den GenerateCustomQR Scanner, um Inhalte ohne Scriptausführung gefahrlos zu analysieren."
---

Mit der weltweiten Verbreitung von QR-Codes im Alltag nutzen Cyberkriminelle ein neues Einfallstor: **Quishing** (QR-Code-Phishing).

Im Gegensatz zu klassischen Phishing-Mails mit Text-Links bettet Quishing schädliche URLs in 2D-Barcodes ein. Dies umgeht herkömmliche E-Mail-Sicherheitsfilter und ermöglicht Angreifern den Zugriff auf sensible Unternehmensnetzwerke.

---

## Quishing in Zahlen: Die Bedrohungslage 2026

Sicherheitsanalysen führender IT-Sicherheitsunternehmen belegen den rasanten Anstieg von QR-Angriffen:

<div class="blog-stat-grid">
  <div class="blog-stat-card">
    <div class="blog-stat-value text-red-600">+340%</div>
    <div class="blog-stat-label">Anstieg der Quishing-Angriffe (2024–2026)</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-amber-600">89%</div>
    <div class="blog-stat-label">Alljährlich betroffene Unternehmen</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-blue-600">0.4s</div>
    <div class="blog-stat-label">Durchschnittliche Scanzeit der Kamera</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-emerald-600">4,8 Mio. $</div>
    <div class="blog-stat-label">Durchschnittskosten eines Datendiebstahls</div>
  </div>
</div>

Die Gefährlichkeit von Quishing beruht auf einem psychologischen Faktor: Menschen vertrauen visuellen QR-Mustern, da das menschliche Auge die Daten nicht direkt lesen kann.

---

## Die Quishing-Angriffskette in 4 Stufen

Quishing nutzt den Wechsel vom geschützten Firmencomputer auf das ungesicherte Privathandy aus:

<div class="blog-threat-container">
  <div class="blog-threat-header">
    <span class="material-symbols-outlined text-[18px]">security_update_warning</span>
    Die 4-stufige Quishing-Angriffskette
  </div>
  <div class="blog-threat-flow">
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Stufe 1: Zustellung</span>
      <h4 class="blog-threat-title">Optischer Bild-Anhang</h4>
      <p class="blog-threat-desc">Gefälschte Support-Mail als PDF oder Bild mit Aufforderung zur 'MFA-Aktualisierung in Microsoft 365'.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Stufe 2: Gerätewechsel</span>
      <h4 class="blog-threat-title">Scan mit Smartphone</h4>
      <p class="blog-threat-desc">Mitarbeiter scannt mit eigenem Smartphone außerhalb des Firmen-VPNs und EDR-Schutzes.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Stufe 3: Täuschung</span>
      <h4 class="blog-threat-title">Geklonte Login-Seite</h4>
      <p class="blog-threat-desc">Täuschend echte Anmeldeseite für Microsoft Entra ID, Okta oder Google Workspace.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Stufe 4: Zugriff</span>
      <h4 class="blog-threat-title">Session-Hijacking</h4>
      <p class="blog-threat-desc">Angreifer erbeutet Zugangsdaten und aktive MFA-Sitzungstoken in Echtzeit für vollen Zugriff.</p>
    </div>
  </div>
</div>

---

## Warum klassische Firewalls & E-Mail-Gateways (SEGs) versagen

Klassische E-Mail-Gateways analysieren Textinhalte. Bei Hyperlinks prüfen sie Domains gegen Reputationslisten.

Quishing umgeht diese Schutzmechanismen vollständig:

1. **Keine Text-Links:** Im Mailtext existieren keine anklickbaren Links, die der Filter untersuchen könnte.
2. **Dynamische Weiterleitungen:** Die Zielseite liegt zunächst auf seriösen Plattformen wie SharePoint oder Google Docs und wird erst später umgeleitet.
3. **Evasions-Muster:** Subtile Farbverläufe verwirren serverseitige OCR-Filter, werden von Smartphone-Kameras jedoch problemlos decodiert.

---

## Die 4 wichtigsten Quishing-Vektoren in der Praxis

### 1. Gefälschte MFA-Rücksetz-Mails in Unternehmen
Mails, die vorgeben, von der IT-Abteilung zu stammen, und unter Androhung einer Kontosperrung zum Bestätigen von Sicherheitszertifikaten auffordern.

### 2. Überklebte QR-Codes an Parkscheinautomaten & Ladesäulen
Kriminelle drucken eigene Aufkleber und überkleben offizielle Bezahl-Codes im öffentlichen Raum, um Zahlungen abzufangen.

### 3. Manipulierte Speisekarten in Restaurants
In Lokalen werden Menü-Codes überklebt, um Gäste zur Eingabe von Kreditkartendaten oder zum Download von Spyware zu verleiten.

### 4. Gefälschte WLAN-Zugangs-Codes
Auf Messen und in Hotels leiten betrügerische QR-Codes auf manipulierte Access Points um, die Datenverkehr mitschneiden.

---

## Reale Fallbeispiele mit hohem Schaden

### Fallstudie A: Angriff auf den Energiesektor
Ende 2024 wurden über 1.000 Unternehmens-Logins eines Energiekonzerns durch QR-Codes in PDF-Anhängen innerhalb von 4 Stunden kompromittiert.

### Fallstudie B: Massenbetrug an Parkscheinautomaten
In mehreren Großstädten führten gefälschte QR-Aufkleber zu unberechtigten Abbuchungen von durchschnittlich 350 € pro Opfer.

---

## Verschleierungsmethoden bösartiger QR-Payloads

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Typosquatting</span>
  <span class="blog-endpoint-url">https://login.micros0ft-online-security.com/mfa/auth-session</span>
</div>

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Open Redirect Missbrauch</span>
  <span class="blog-endpoint-url">https://www.google.com/url?q=https://phishing-portal-intern.ru</span>
</div>

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Data-URI Payload</span>
  <span class="blog-endpoint-url">data:text/html;base64,PHNjcmlwdD53aW5kb3cubG9jYXRpb249...</span>
</div>

---

## Unternehmens-Sicherheitsplan: 4 Schutzebenen

<div class="blog-flow-grid">
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">1</span>
      <h4 class="blog-flow-title">Computer Vision</h4>
    </div>
    <p class="blog-flow-desc">KI-gestützte E-Mail-Filter, die QR-Codes extrahieren und Zielseiten in Sandboxes prüfen.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">2</span>
      <h4 class="blog-flow-title">FIDO2-Hardware</h4>
    </div>
    <p class="blog-flow-desc">Physische YubiKeys binden Logins kryptografisch an die Domain und verhindern Passwortdiebstahl.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">3</span>
      <h4 class="blog-flow-title">Mobilgeräte-Schutz</h4>
    </div>
    <p class="blog-flow-desc">Mobile Device Management mit aktivem DNS-Schutz auf allen geschäftlich genutzten Smartphones.</p>
  </div>
  <div class="blog-flow-card highlight">
    <div class="blog-flow-header">
      <span class="blog-flow-step">4</span>
      <h4 class="blog-flow-title">Schulungen</h4>
    </div>
    <p class="blog-flow-desc">Regelmäßige Praxissimulationen von Quishing-Szenarien für alle Mitarbeiter.</p>
  </div>
</div>

---

## Sicherheits-Checkliste für Nutzer & Mitarbeiter

<div class="blog-checklist-grid">
  <div class="blog-checklist-card do">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-check">verified_user</span>
      Wichtige Verhaltensweisen (Do)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Prüfen Sie stets die vollständige Domain in der Handy-Kamera vor dem Öffnen
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Tasten Sie QR-Schilder im öffentlichen Raum auf überklebte Kanten ab
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Nutzen Sie Lesezeichen für Banking und interne Firmenportale
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Analysieren Sie unbekannte Codes mit einem privaten, serverlosen Scanner
      </li>
    </ul>
  </div>

  <div class="blog-checklist-card dont">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-cross">dangerous</span>
      Kritische Fehler (Don't)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Geben Sie niemals Passwörter auf Seiten ein, die Sie per E-Mail-QR geöffnet haben
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Bestätigen Sie keine Push-Benachrichtigungen, die Sie nicht selbst ausgelöst haben
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Installieren Sie keine Drittanbieter-Scanner-Apps mit Werbung
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Verlassen Sie sich nicht auf unsichere dynamische Weiterleitungsdienste
      </li>
    </ul>
  </div>
</div>

---

## Warum statische QR-Codes ohne Server sicherer sind

Bei **[GenerateCustomQR](/de/)** werden QR-Codes zu 100 % statisch in Ihrem Browser erstellt – völlig ohne zwischengeschaltete Server:

- **100% Souverän & Direkt:** Die Zieldaten führen direkt zu Ihrer offiziellen Domain, ohne Umwege über zwischengeschaltete Proxy-Server.
- **Keine Telemetrie-Protokollierung:** Weder Scan-Zeitpunkte, IP-Adressen noch Standorte von Nutzern werden erfasst oder auf externen Servern gespeichert.
- **Immun gegen Hijacking:** Da die Daten unveränderbar in der Grafik codiert sind, können sie selbst bei Sicherheitslücken externer Dienste niemals manipuliert oder umgeleitet werden.

---

## Fazit & Handlungsempfehlungen

1. **Sensibilisierung:** Schulen Sie Mitarbeiter auf optische Phishing-Angriffe.
2. **FIDO2-Schutz:** Sichern Sie Zugänge mit physischen Sicherheitsschlüsseln ab.
3. **Statische Generatoren:** Erstellen Sie manipulationssichere QR-Codes auf **[GenerateCustomQR](/de/)**.
4. **Privater Scanner:** Nutzen Sie unseren **[QR-Code Scanner](/de/qr-code-scanner/)** zur gefahrlosen Vorschau unbekannter Links.
