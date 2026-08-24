import { describe, it, expect } from 'vitest';
import { parseQRContent } from '../react/scanner/QRScannerApp';

describe('parseQRContent Parser', () => {
  it('correctly parses WiFi payloads', () => {
    const wifiRaw = 'WIFI:S:MyHomeNetwork;T:WPA;P:SuperSecretPass123;H:false;;';
    const parsed = parseQRContent(wifiRaw);
    expect(parsed.type).toBe('wifi');
    expect(parsed.wifi?.ssid).toBe('MyHomeNetwork');
    expect(parsed.wifi?.password).toBe('SuperSecretPass123');
    expect(parsed.wifi?.authType).toBe('WPA');
    expect(parsed.wifi?.hidden).toBe(false);
  });

  it('correctly parses vCard contacts', () => {
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
    expect(parsed.type).toBe('vcard');
    expect(parsed.vcard?.name).toBe('Jane Doe');
    expect(parsed.vcard?.phone).toBe('+1-555-123-4567');
    expect(parsed.vcard?.email).toBe('jane@example.com');
    expect(parsed.vcard?.org).toBe('Tech Corp');
    expect(parsed.vcard?.title).toBe('CTO');
  });

  it('correctly parses HTTPS URLs', () => {
    const urlRaw = 'https://generatecustomqr.com/qr-code-scanner';
    const parsed = parseQRContent(urlRaw);
    expect(parsed.type).toBe('url');
    expect(parsed.domain).toBe('generatecustomqr.com');
    expect(parsed.isHttps).toBe(true);
    expect(parsed.url).toBe(urlRaw);
  });

  it('correctly parses email mailto: and MATMSG:', () => {
    const mailtoRaw = 'mailto:support@generatecustomqr.com?subject=Hello%20Team&body=Help%20me';
    const parsed = parseQRContent(mailtoRaw);
    expect(parsed.type).toBe('email');
    expect(parsed.email?.to).toBe('support@generatecustomqr.com');
    expect(parsed.email?.subject).toBe('Hello Team');

    const matmsgRaw = 'MATMSG:TO:test@example.com;SUB:Testing;BODY:Message text;;';
    const parsedMatmsg = parseQRContent(matmsgRaw);
    expect(parsedMatmsg.type).toBe('email');
    expect(parsedMatmsg.email?.to).toBe('test@example.com');
    expect(parsedMatmsg.email?.subject).toBe('Testing');
  });

  it('correctly parses phone numbers', () => {
    const telRaw = 'tel:+1234567890';
    const parsed = parseQRContent(telRaw);
    expect(parsed.type).toBe('phone');
    expect(parsed.phone?.number).toBe('+1234567890');
  });

  it('correctly parses SMS messages', () => {
    const smsRaw = 'smsto:+1987654321:Hello there!';
    const parsed = parseQRContent(smsRaw);
    expect(parsed.type).toBe('sms');
    expect(parsed.sms?.number).toBe('+1987654321');
    expect(parsed.sms?.message).toBe('Hello there!');
  });

  it('correctly parses geo coordinates', () => {
    const geoRaw = 'geo:37.7749,-122.4194';
    const parsed = parseQRContent(geoRaw);
    expect(parsed.type).toBe('geo');
    expect(parsed.geo?.lat).toBe('37.7749');
    expect(parsed.geo?.lng).toBe('-122.4194');
    expect(parsed.geo?.mapsUrl).toContain('37.7749,-122.4194');
  });

  it('correctly parses calendar events', () => {
    const eventRaw = `BEGIN:VEVENT
SUMMARY:Product Launch Keynote
LOCATION:San Francisco, CA
DESCRIPTION:Annual developer conference
DTSTART:20260901T090000Z
DTEND:20260901T170000Z
END:VEVENT`;
    const parsed = parseQRContent(eventRaw);
    expect(parsed.type).toBe('event');
    expect(parsed.event?.summary).toBe('Product Launch Keynote');
    expect(parsed.event?.location).toBe('San Francisco, CA');
  });

  it('correctly parses WhatsApp chat links (wa.me and api.whatsapp.com)', () => {
    const waRaw = 'https://wa.me/15551234567?text=Hello%20there!';
    const parsed = parseQRContent(waRaw);
    expect(parsed.type).toBe('whatsapp');
    expect(parsed.whatsapp?.phone).toBe('15551234567');
    expect(parsed.whatsapp?.message).toBe('Hello there!');
    expect(parsed.whatsapp?.chatUrl).toContain('wa.me/15551234567');

    const waApiRaw = 'https://api.whatsapp.com/send?phone=919876543210&text=Booking%20Inquiry';
    const parsedApi = parseQRContent(waApiRaw);
    expect(parsedApi.type).toBe('whatsapp');
    expect(parsedApi.whatsapp?.phone).toBe('919876543210');
    expect(parsedApi.whatsapp?.message).toBe('Booking Inquiry');
  });

  it('correctly evaluates URL safety reports', () => {
    const httpsUrl = 'https://generatecustomqr.com';
    const httpsParsed = parseQRContent(httpsUrl);
    expect(httpsParsed.safety?.status).toBe('safe');
    expect(httpsParsed.safety?.badgeLabel).toBe('Secure HTTPS');

    const httpUrl = 'http://unsecured-domain.com/login';
    const httpParsed = parseQRContent(httpUrl);
    expect(httpParsed.safety?.status).toBe('warning');
    expect(httpParsed.safety?.badgeLabel).toBe('HTTP Unencrypted');

    const shortenerUrl = 'https://bit.ly/3xY9z';
    const shortenerParsed = parseQRContent(shortenerUrl);
    expect(shortenerParsed.safety?.status).toBe('warning');
    expect(shortenerParsed.safety?.badgeLabel).toBe('URL Shortener');
  });

  it('correctly parses Google Maps web links', () => {
    const mapsRaw = 'https://maps.google.com/?q=40.7128,-74.0060';
    const parsed = parseQRContent(mapsRaw);
    expect(parsed.type).toBe('geo');
    expect(parsed.geo?.mapsUrl).toBe(mapsRaw);
  });

  it('correctly falls back to plain text for generic content', () => {
    const textRaw = 'Just some random free-form notes or serial number SN-998271';
    const parsed = parseQRContent(textRaw);
    expect(parsed.type).toBe('text');
    expect(parsed.raw).toBe(textRaw);
  });
});

