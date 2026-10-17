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
  assert.equal(getCreatorUrl(null, 'de'), '/de');
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

console.log('\n✅ ALL 7 SCANNER UTILS TEST SUITES PASSED CLEANLY!\n');
