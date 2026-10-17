// Pure business logic, type definitions, URL safety evaluator, and QR parsers
// Separated from React JSX components for high-speed testing and clean modularity.

export type ParsedQRType = 'url' | 'whatsapp' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms' | 'geo' | 'event' | 'text';

export interface URLSafetyReport {
  status: 'safe' | 'warning' | 'caution';
  badgeColor: string;
  badgeLabelKey: string;
  badgeLabel: string;
  reasons: string[];
  reasonKeys: string[];
}

export function evaluateURLSafety(urlStr: string): URLSafetyReport {
  const reasons: string[] = [];
  const reasonKeys: string[] = [];
  let isHttps = false;
  let isShortener = false;
  let isIP = false;

  try {
    const parsed = new URL(urlStr);
    isHttps = parsed.protocol === 'https:';
    isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname);
    const shortenerDomains = ['bit.ly', 'tinyurl.com', 't.co', 'rb.gy', 'is.gd', 'cutt.ly', 'shorturl.at', 'ow.ly'];
    isShortener = shortenerDomains.includes(parsed.hostname.toLowerCase());

    if (!isHttps) {
      reasons.push('Unencrypted HTTP connection');
      reasonKeys.push('scanner.safety.unencryptedHttp');
    }
    if (isIP) {
      reasons.push('Direct IP address');
      reasonKeys.push('scanner.safety.directIp');
    }
    if (isShortener) {
      reasons.push('Hidden destination (URL shortener)');
      reasonKeys.push('scanner.safety.hiddenShortener');
    }

    if (isIP || (!isHttps && isShortener)) {
      return {
        status: 'caution',
        badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
        badgeLabelKey: 'scanner.safety.cautionUnverified',
        badgeLabel: 'Caution: Unverified',
        reasons,
        reasonKeys
      };
    }
    if (!isHttps || isShortener) {
      return {
        status: 'warning',
        badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        badgeLabelKey: isShortener ? 'scanner.safety.urlShortener' : 'scanner.safety.httpUnencrypted',
        badgeLabel: isShortener ? 'URL Shortener' : 'HTTP Unencrypted',
        reasons,
        reasonKeys
      };
    }
    return {
      status: 'safe',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      badgeLabelKey: 'scanner.safety.secureHttps',
      badgeLabel: 'Secure HTTPS',
      reasons: ['Verified SSL/TLS connection'],
      reasonKeys: ['scanner.safety.verifiedSsl']
    };
  } catch {
    return {
      status: 'safe',
      badgeColor: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
      badgeLabelKey: 'scanner.safety.textContent',
      badgeLabel: 'Text Content',
      reasons: [],
      reasonKeys: []
    };
  }
}

export interface ParsedQRData {
  type: ParsedQRType;
  title: string;
  raw: string;
  url?: string;
  domain?: string;
  isHttps?: boolean;
  safety?: URLSafetyReport;
  whatsapp?: {
    phone: string;
    message?: string;
    chatUrl: string;
  };
  wifi?: {
    ssid: string;
    password?: string;
    authType: string;
    hidden?: boolean;
  };
  vcard?: {
    name?: string;
    phone?: string;
    email?: string;
    org?: string;
    title?: string;
    url?: string;
    address?: string;
    notes?: string;
  };
  email?: {
    to: string;
    subject?: string;
    body?: string;
  };
  phone?: {
    number: string;
  };
  sms?: {
    number: string;
    message?: string;
  };
  geo?: {
    lat: string;
    lng: string;
    mapsUrl: string;
  };
  event?: {
    summary: string;
    location?: string;
    description?: string;
    dtstart?: string;
    dtend?: string;
  };
}

export interface ScanHistoryItem {
  id: string;
  raw: string;
  type: ParsedQRType;
  title: string;
  timestamp: number;
}

// Generate localized creator studio URL preserving active language route
export function getCreatorUrl(rawText?: string | null, locale: string = 'en'): string {
  if (!rawText) return locale && locale !== 'en' ? `/${locale}` : '/';
  const prefix = locale && locale !== 'en' ? `/${locale}` : '';
  return `${prefix}/?text=${encodeURIComponent(rawText)}`;
}

// Play subtle Web Audio chime on successful QR decode
export function playScanSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // AudioContext blocked or not supported, ignore silently
  }
}

// Parse scanned QR raw text into structured typed format with escape support
export function parseQRContent(rawText: string): ParsedQRData {
  const raw = rawText.trim();

  // 0. WhatsApp Format: wa.me, api.whatsapp.com, or whatsapp://
  if (raw.includes('wa.me/') || raw.includes('api.whatsapp.com/send') || raw.startsWith('whatsapp://')) {
    let phone = '';
    let message = '';
    try {
      const normalizedUrl = raw.startsWith('whatsapp://') ? raw.replace('whatsapp://', 'https://') : raw;
      const waUrl = new URL(normalizedUrl);
      if (waUrl.hostname.includes('wa.me')) {
        phone = waUrl.pathname.replace(/^\//, '').split('?')[0];
        message = waUrl.searchParams.get('text') || '';
      } else {
        phone = waUrl.searchParams.get('phone') || '';
        message = waUrl.searchParams.get('text') || '';
      }
    } catch {
      phone = raw.replace(/[^0-9+]/g, '');
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const chatUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    return {
      type: 'whatsapp',
      title: `WhatsApp: ${phone || 'Direct Chat'}`,
      raw,
      whatsapp: { phone, message, chatUrl }
    };
  }

  // 1. WiFi Format: WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
  // Supports escaped characters: \; \: \, \\
  if (raw.startsWith('WIFI:') || raw.startsWith('wifi:')) {
    const getField = (tag: string) => {
      const match = raw.match(new RegExp(`${tag}:((?:[^;\\\\]|\\\\.)*)`));
      if (!match) return '';
      return match[1].replace(/\\([;:,\\])/g, '$1');
    };
    const ssid = getField('S') || 'Unknown WiFi';
    const password = getField('P');
    const authType = getField('T') || 'WPA';
    const hidden = getField('H') === 'true';

    return {
      type: 'wifi',
      title: `WiFi: ${ssid}`,
      raw,
      wifi: { ssid, password, authType, hidden }
    };
  }

  // 2. vCard Format: BEGIN:VCARD ... END:VCARD
  if (raw.includes('BEGIN:VCARD')) {
    const lines = raw.split(/\r\n|\r|\n/);
    let name = '';
    let phone = '';
    let email = '';
    let org = '';
    let title = '';
    let url = '';
    let address = '';
    let notes = '';

    for (const line of lines) {
      if (line.startsWith('FN:')) name = line.substring(3).trim();
      else if (!name && line.startsWith('N:')) {
        const parts = line.substring(2).split(';');
        name = parts.filter(Boolean).reverse().join(' ').trim();
      } else if (line.match(/^TEL(;[^:]+)?:/i)) {
        if (!phone) phone = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.match(/^EMAIL(;[^:]+)?:/i)) {
        if (!email) email = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.startsWith('ORG:')) {
        org = line.substring(4).replace(/;/g, ' ').trim();
      } else if (line.startsWith('TITLE:')) {
        title = line.substring(6).trim();
      } else if (line.startsWith('URL:')) {
        url = line.substring(4).trim();
      } else if (line.match(/^ADR(;[^:]+)?:/i)) {
        address = line.substring(line.indexOf(':') + 1).replace(/;/g, ', ').trim();
      } else if (line.startsWith('NOTE:')) {
        notes = line.substring(5).trim();
      }
    }

    return {
      type: 'vcard',
      title: name ? `Contact: ${name}` : 'Contact Card (vCard)',
      raw,
      vcard: { name, phone, email, org, title, url, address, notes }
    };
  }

  // 3. Email format: mailto:... or MATMSG:...
  if (raw.startsWith('mailto:') || raw.startsWith('MAILTO:')) {
    try {
      const emailUrl = new URL(raw);
      const to = emailUrl.pathname;
      const subject = emailUrl.searchParams.get('subject') || undefined;
      const body = emailUrl.searchParams.get('body') || undefined;
      return {
        type: 'email',
        title: `Email to ${to}`,
        raw,
        email: { to, subject, body }
      };
    } catch (e) {
      const to = raw.replace(/^mailto:/i, '').split('?')[0];
      return {
        type: 'email',
        title: `Email to ${to}`,
        raw,
        email: { to }
      };
    }
  }
  if (raw.startsWith('MATMSG:')) {
    const to = raw.match(/TO:([^;]+)/)?.[1] || '';
    const subject = raw.match(/SUB:([^;]+)/)?.[1];
    const body = raw.match(/BODY:([^;]+)/)?.[1];
    return {
      type: 'email',
      title: `Email to ${to}`,
      raw,
      email: { to, subject, body }
    };
  }

  // 4. Phone format: tel:...
  if (raw.startsWith('tel:') || raw.startsWith('TEL:')) {
    const number = raw.substring(4).trim();
    return {
      type: 'phone',
      title: `Phone: ${number}`,
      raw,
      phone: { number }
    };
  }

  // 5. SMS format: smsto:... or sms:...
  if (raw.startsWith('smsto:') || raw.startsWith('SMSTO:') || raw.startsWith('sms:') || raw.startsWith('SMS:')) {
    const parts = raw.substring(raw.indexOf(':') + 1).split(':');
    const number = parts[0] || '';
    const message = parts.slice(1).join(':');
    return {
      type: 'sms',
      title: `SMS to ${number}`,
      raw,
      sms: { number, message }
    };
  }

  // 6. Geo format: geo:lat,lng or Google Maps URL
  if (raw.startsWith('geo:') || (raw.startsWith('http') && (raw.includes('maps.google.com') || raw.includes('goo.gl/maps') || raw.includes('maps.app.goo.gl')))) {
    let lat = '';
    let lng = '';
    let mapsUrl = raw;
    if (raw.startsWith('geo:')) {
      const coords = raw.substring(4).split('?')[0].split(',');
      lat = coords[0]?.trim() || '';
      lng = coords[1]?.trim() || '';
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    return {
      type: 'geo',
      title: lat && lng ? `Location: ${lat}, ${lng}` : 'Google Maps Location',
      raw,
      geo: { lat, lng, mapsUrl }
    };
  }

  // 7. Event format: BEGIN:VEVENT ... END:VEVENT
  if (raw.includes('BEGIN:VEVENT')) {
    const summary = raw.match(/SUMMARY:([^\r\n]+)/)?.[1] || 'Calendar Event';
    const location = raw.match(/LOCATION:([^\r\n]+)/)?.[1];
    const description = raw.match(/DESCRIPTION:([^\r\n]+)/)?.[1];
    const dtstart = raw.match(/DTSTART:([^\r\n]+)/)?.[1];
    const dtend = raw.match(/DTEND:([^\r\n]+)/)?.[1];
    return {
      type: 'event',
      title: summary,
      raw,
      event: { summary, location, description, dtstart, dtend }
    };
  }

  // 8. Standard URL / Website
  if (/^https?:\/\//i.test(raw)) {
    const safety = evaluateURLSafety(raw);
    try {
      const parsedUrl = new URL(raw);
      return {
        type: 'url',
        title: parsedUrl.hostname.replace(/^www\./, ''),
        raw,
        url: raw,
        domain: parsedUrl.hostname,
        isHttps: parsedUrl.protocol === 'https:',
        safety
      };
    } catch (e) {
      return {
        type: 'url',
        title: raw,
        raw,
        url: raw,
        isHttps: raw.startsWith('https://'),
        safety
      };
    }
  }

  // 9. Plain Text / JSON / Other
  return {
    type: 'text',
    title: raw.length > 40 ? `${raw.substring(0, 40)}...` : raw,
    raw
  };
}

// Convert an uploaded SVG File to a PNG File via canvas for backend OpenCV compatibility
export async function svgFileToPngFile(file: File): Promise<File> {
  if (typeof document === 'undefined') return file;
  if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const size = 1024;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(file);
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return resolve(file);
        const pngFile = new File([blob], file.name.replace(/\.svg$/i, '.png'), { type: 'image/png' });
        resolve(pngFile);
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
