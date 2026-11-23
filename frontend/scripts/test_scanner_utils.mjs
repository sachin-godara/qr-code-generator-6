import assert from 'node:assert/strict';
import { parseQRContent, getCreatorUrl, evaluateURLSafety } from '../src/react/scanner/scannerUtils.ts';

console.log('Running Scanner Utils Test Suite...');

// 1. WiFi Parser Tests
{
  const wifiRaw = 'WIFI:S:MyHomeNetwork;T:WPA;P:SuperSecretPass123;H:false;;';
  const parsed = parseQRContent(wifiRaw);
  assert.equal(parsed.type, 'wifi');
  assert.equal(parsed.wifi?.ssid, 'MyHomeNetwork');
  assert.equal(parsed.wifi?.password, 'SuperSecretPass123');
  assert.equal(parsed.wifi?.authType, 'WPA');
  assert.equal(parsed.wifi?.hidden, false);
  console.log('  ✓ standard WiFi parsing passed');
}

// 2. Escaped WiFi Parser Tests (Task 2)
{
  const raw = 'WIFI:S:Guest\\;Office\\:Main;T:WPA;P:Super\\;Secret\\:2026;H:true;;';
  const parsed = parseQRContent(raw);
  assert.equal(parsed.type, 'wifi');
  assert.equal(parsed.wifi?.ssid, 'Guest;Office:Main');
  assert.equal(parsed.wifi?.password, 'Super;Secret:2026');
  assert.equal(parsed.wifi?.authType, 'WPA');
  assert.equal(parsed.wifi?.hidden, true);
  console.log('  ✓ escaped WiFi parsing passed');
}

// 3. Localized getCreatorUrl Tests (Task 1)
{
  assert.equal(getCreatorUrl('https://example.com', 'en'), '/?text=https%3A%2F%2Fexample.com');
  assert.equal(getCreatorUrl('https://example.com', 'de'), '/de/?text=https%3A%2F%2Fexample.com');
  assert.equal(getCreatorUrl('https://example.com', 'es'), '/es/?text=https%3A%2F%2Fexample.com');
  assert.equal(getCreatorUrl('https://example.com', 'pt'), '/pt/?text=https%3A%2F%2Fexample.com');
  assert.equal(getCreatorUrl('https://example.com', 'tr'), '/tr/?text=https%3A%2F%2Fexample.com');
  assert.equal(getCreatorUrl(null, 'de'), '/de/');
  assert.equal(getCreatorUrl(null, 'en'), '/');
  console.log('  ✓ localized getCreatorUrl passed across all locales');
}

// 4. vCard Parser Tests
{
  const vcardRaw = `BEGIN:VCARD
VERSION:3.0
FN:Jane Doe
TEL:+1-555-123-4567
EMAIL:jane@example.com
ORG:Tech Corp
TITLE:CTO
URL:https://example.com
END:VCARD`;
  const parsed = parseQRContent(vcardRaw);
  assert.equal(parsed.type, 'vcard');
  assert.equal(parsed.vcard?.name, 'Jane Doe');
  assert.equal(parsed.vcard?.phone, '+1-555-123-4567');
  assert.equal(parsed.vcard?.email, 'jane@example.com');
  assert.equal(parsed.vcard?.org, 'Tech Corp');
  assert.equal(parsed.vcard?.title, 'CTO');
  console.log('  ✓ vCard parsing passed');
}

// 5. WhatsApp Chat Parser Tests
{
  const waRaw = 'https://wa.me/15551234567?text=Hello%20there!';
  const parsed = parseQRContent(waRaw);
  assert.equal(parsed.type, 'whatsapp');
  assert.equal(parsed.whatsapp?.phone, '15551234567');
  assert.equal(parsed.whatsapp?.message, 'Hello there!');
  assert.ok(parsed.whatsapp?.chatUrl.includes('wa.me/15551234567'));
  console.log('  ✓ WhatsApp parsing passed');
}

// 6. URL Safety Heuristics & Localization Keys Tests (Task 4/5)
{
  const secureUrl = 'https://generatecustomqr.com';
  const secureParsed = parseQRContent(secureUrl);
  assert.equal(secureParsed.safety?.status, 'safe');
  assert.equal(secureParsed.safety?.badgeLabelKey, 'scanner.safety.secureHttps');
  assert.deepEqual(secureParsed.safety?.reasonKeys, ['scanner.safety.verifiedSsl']);

  const insecureUrl = 'http://192.168.1.1/admin';
  const insecureParsed = parseQRContent(insecureUrl);
  assert.equal(insecureParsed.safety?.status, 'caution');
  assert.equal(insecureParsed.safety?.badgeLabelKey, 'scanner.safety.cautionUnverified');
  assert.ok(insecureParsed.safety?.reasonKeys.includes('scanner.safety.unencryptedHttp'));
  assert.ok(insecureParsed.safety?.reasonKeys.includes('scanner.safety.directIp'));

  const shortenerUrl = 'https://bit.ly/3xY9z';
  const shortenerParsed = parseQRContent(shortenerUrl);
  assert.equal(shortenerParsed.safety?.status, 'warning');
  assert.equal(shortenerParsed.safety?.badgeLabelKey, 'scanner.safety.urlShortener');
  console.log('  ✓ URL safety heuristics & keys passed');
}

// 7. Geo & Event Parser Tests
{
  const geoRaw = 'geo:37.7749,-122.4194';
  const geoParsed = parseQRContent(geoRaw);
  assert.equal(geoParsed.type, 'geo');
  assert.equal(geoParsed.geo?.lat, '37.7749');
  assert.equal(geoParsed.geo?.lng, '-122.4194');

  const eventRaw = `BEGIN:VEVENT
SUMMARY:Product Launch
LOCATION:San Francisco
END:VEVENT`;
  const eventParsed = parseQRContent(eventRaw);
  assert.equal(eventParsed.type, 'event');
  assert.equal(eventParsed.event?.summary, 'Product Launch');
  console.log('  ✓ Geo and Event parsing passed');
}

// 8. captureVideoFrame graceful fallback test
{
  const { captureVideoFrame } = await import('../src/react/scanner/scannerUtils.ts');
  const result = await captureVideoFrame(null);
  assert.equal(result, null);
  console.log('  ✓ captureVideoFrame graceful null safety passed');
}

// 9. detectBarcodeNative graceful fallback test
{
  const { detectBarcodeNative } = await import('../src/react/scanner/scannerUtils.ts');
  const result = await detectBarcodeNative(null);
  assert.equal(result, null);
  console.log('  ✓ detectBarcodeNative graceful environment check passed');
}

// 10. Quoted Wi-Fi Parameters Test
{
  const raw = 'WIFI:S:"Office-Guest";T:WPA;P:"SecretPass123";;';
  const parsed = parseQRContent(raw);
  assert.equal(parsed.type, 'wifi');
  assert.equal(parsed.wifi?.ssid, 'Office-Guest');
  assert.equal(parsed.wifi?.password, 'SecretPass123');
  console.log('  ✓ quoted Wi-Fi SSID and password stripping passed');
}

// 11. MeCard Parser and serializeToVCard Test
{
  const { serializeToVCard } = await import('../src/react/scanner/scannerUtils.ts');
  const raw = 'MECARD:N:Smith,John;TEL:5551234;EMAIL:john@example.com;NOTE:VIP Client;;';
  const parsed = parseQRContent(raw);
  assert.equal(parsed.type, 'vcard');
  assert.equal(parsed.vcard?.name, 'John Smith');
  assert.equal(parsed.vcard?.phone, '5551234');
  assert.equal(parsed.vcard?.email, 'john@example.com');
  assert.equal(parsed.vcard?.notes, 'VIP Client');

  const vcardStr = serializeToVCard(parsed.vcard);
  assert.ok(vcardStr.startsWith('BEGIN:VCARD\r\nVERSION:3.0'));
  assert.ok(vcardStr.includes('FN:John Smith'));
  assert.ok(vcardStr.includes('TEL;TYPE=CELL:5551234'));
  assert.ok(vcardStr.endsWith('END:VCARD'));
  console.log('  ✓ MeCard parsing & RFC 2426 vCard serialization passed');
}

// 12. vCard RFC 6350 Line Unfolding Test
{
  const foldedVCard = `BEGIN:VCARD
VERSION:3.0
FN:Jane Doe
NOTE:This is a long note that continues on 
 the second line of the card.
END:VCARD`;
  const parsed = parseQRContent(foldedVCard);
  assert.equal(parsed.vcard?.notes, 'This is a long note that continues on the second line of the card.');
  console.log('  ✓ vCard RFC 6350 line unfolding passed');
}

// 13. Google Maps Coordinate Extraction (?q= and /@)
{
  const mapsQ = 'https://maps.google.com/?q=40.7128,-74.0060';
  const parsedQ = parseQRContent(mapsQ);
  assert.equal(parsedQ.type, 'geo');
  assert.equal(parsedQ.geo?.lat, '40.7128');
  assert.equal(parsedQ.geo?.lng, '-74.0060');

  const mapsAt = 'https://www.google.com/maps/@37.7749,-122.4194,15z';
  const parsedAt = parseQRContent(mapsAt);
  assert.equal(parsedAt.type, 'geo');
  assert.equal(parsedAt.geo?.lat, '37.7749');
  assert.equal(parsedAt.geo?.lng, '-122.4194');
  console.log('  ✓ Google Maps coordinate extraction passed');
}

// 14. www. URL Normalization
{
  const rawWww = 'www.wikipedia.org/wiki/QR_code';
  const parsed = parseQRContent(rawWww);
  assert.equal(parsed.type, 'url');
  assert.equal(parsed.url, 'https://www.wikipedia.org/wiki/QR_code');
  assert.equal(parsed.isHttps, true);
  assert.equal(parsed.domain, 'www.wikipedia.org');
  console.log('  ✓ www. URL normalization passed');
}

// 15. 1D Barcode Detection (UPC-A, EAN-13)
{
  const upcA = '012345678905';
  const parsedUpc = parseQRContent(upcA);
  assert.equal(parsedUpc.type, 'barcode');
  assert.equal(parsedUpc.barcode?.format, 'UPC-A');
  assert.ok(parsedUpc.barcode?.searchUrl.includes('google.com/search?q=012345678905'));

  const ean13 = '9780306406157';
  const parsedEan = parseQRContent(ean13);
  assert.equal(parsedEan.type, 'barcode');
  assert.equal(parsedEan.barcode?.format, 'EAN-13');
  console.log('  ✓ 1D Barcode detection passed');
}

console.log('\n✅ ALL 15 SCANNER UTILS TEST SUITES PASSED CLEANLY!\n');

