import React, { useState, useEffect, useId } from 'react';
import { useQRStore } from '@/store/useQRStore';
import { useTranslation } from '@/i18n/useTranslation';

const Input = ({ label, id: propId, name: propName, ...props }: any) => {
  const generatedId = useId();
  const id = propId || generatedId;
  const name = propName || id;
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>}
      <input 
        id={id}
        name={name}
        className="w-full p-3 sm:p-2.5 text-base sm:text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        {...props}
      />
    </div>
  );
};

const Textarea = ({ label, id: propId, name: propName, ...props }: any) => {
  const generatedId = useId();
  const id = propId || generatedId;
  const name = propName || id;
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>}
      <textarea 
        id={id}
        name={name}
        className="w-full p-2.5 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow min-h-[80px]"
        {...props}
      />
    </div>
  );
};

const Select = ({ label, children, id: propId, name: propName, ...props }: any) => {
  const generatedId = useId();
  const id = propId || generatedId;
  const name = propName || id;
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>}
      <select 
        id={id}
        name={name}
        className="w-full p-2.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export const UrlForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  return (
    <Input 
      label={t("studio.forms.url.label")} 
      type="url" 
      placeholder={t("studio.forms.url.placeholder")} 
      value={settings.contentData} 
      onChange={(e: any) => updateSettings({ contentData: e.target.value })} 
    />
  );
};

export const TextForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  return (
    <Textarea 
      label={t("studio.forms.text.label")} 
      placeholder={t("studio.forms.text.placeholder")} 
      value={settings.contentData} 
      onChange={(e: any) => updateSettings({ contentData: e.target.value })} 
    />
  );
};

export const PhoneForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const [val, setVal] = useState(settings.contentData.replace('tel:', ''));
  useEffect(() => { updateSettings({ contentData: `tel:${val}` }); }, [val]);
  return (
    <Input 
      label={t("studio.forms.phone.label")} 
      type="tel" 
      placeholder={t("studio.forms.phone.placeholder")} 
      value={val} 
      onChange={(e: any) => setVal(e.target.value)} 
    />
  );
};

export const SmsForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseSms = (str: string) => {
    const match = str.match(/^smsto:([^:]*):?(.*)$/i);
    return match ? { phone: match[1], msg: match[2] } : { phone: '', msg: '' };
  };
  const [phone, setPhone] = useState(parseSms(settings.contentData).phone);
  const [msg, setMsg] = useState(parseSms(settings.contentData).msg);
  useEffect(() => { updateSettings({ contentData: `smsto:${phone}:${msg}` }); }, [phone, msg]);
  return (
    <div className="space-y-3">
      <Input 
        label={t("studio.forms.sms.phoneLabel")} 
        type="tel" 
        placeholder={t("studio.forms.sms.phonePlaceholder")} 
        value={phone} 
        onChange={(e: any) => setPhone(e.target.value)} 
      />
      <Textarea 
        label={t("studio.forms.sms.messageLabel")} 
        placeholder={t("studio.forms.sms.messagePlaceholder")} 
        value={msg} 
        onChange={(e: any) => setMsg(e.target.value)} 
      />
    </div>
  );
};

export const WhatsAppForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseWa = (str: string) => {
    try {
      const url = new URL(str);
      return { phone: url.pathname.replace('/', ''), msg: url.searchParams.get('text') || '' };
    } catch { return { phone: '', msg: '' }; }
  };
  const [phone, setPhone] = useState(parseWa(settings.contentData).phone);
  const [msg, setMsg] = useState(parseWa(settings.contentData).msg);
  useEffect(() => { 
    updateSettings({ contentData: `https://wa.me/${phone.replace(/[^0-9]/g, '')}${msg ? `?text=${encodeURIComponent(msg)}` : ''}` }); 
  }, [phone, msg]);
  return (
    <div className="space-y-3">
      <Input 
        label={t("studio.forms.whatsapp.phoneLabel")} 
        type="tel" 
        placeholder={t("studio.forms.whatsapp.phonePlaceholder")} 
        value={phone} 
        onChange={(e: any) => setPhone(e.target.value)} 
      />
      <Textarea 
        label={t("studio.forms.whatsapp.messageLabel")} 
        placeholder={t("studio.forms.whatsapp.messagePlaceholder")} 
        value={msg} 
        onChange={(e: any) => setMsg(e.target.value)} 
      />
    </div>
  );
};

export const EmailForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseEmail = (str: string) => {
    const match = str.match(/^mailto:([^?]*)\??(.*)$/i);
    if (!match) return { to: '', sub: '', body: '' };
    const params = new URLSearchParams(match[2] || '');
    return { to: match[1], sub: params.get('subject') || '', body: params.get('body') || '' };
  };
  const [to, setTo] = useState(parseEmail(settings.contentData).to);
  const [sub, setSub] = useState(parseEmail(settings.contentData).sub);
  const [body, setBody] = useState(parseEmail(settings.contentData).body);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (sub) params.append('subject', sub);
    if (body) params.append('body', body);
    const qs = params.toString();
    updateSettings({ contentData: `mailto:${to}${qs ? `?${qs}` : ''}` });
  }, [to, sub, body]);

  return (
    <div className="space-y-3">
      <Input 
        label={t("studio.forms.email.toLabel")} 
        type="email" 
        placeholder={t("studio.forms.email.toPlaceholder")} 
        value={to} 
        onChange={(e: any) => setTo(e.target.value)} 
      />
      <Input 
        label={t("studio.forms.email.subjectLabel")} 
        placeholder={t("studio.forms.email.subjectPlaceholder")} 
        value={sub} 
        onChange={(e: any) => setSub(e.target.value)} 
      />
      <Textarea 
        label={t("studio.forms.email.bodyLabel")} 
        placeholder={t("studio.forms.email.bodyPlaceholder")} 
        value={body} 
        onChange={(e: any) => setBody(e.target.value)} 
      />
    </div>
  );
};

export const VCardForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseVcard = (str: string) => {
    const getField = (prefix: string) => {
      const match = str.match(new RegExp(`^${prefix}:(.*)$`, 'mi'));
      return match ? match[1].trim() : '';
    };
    const n = getField('N').split(';');
    return {
      fName: n[1] || '', lName: n[0] || '', phone: getField('TEL'),
      email: getField('EMAIL'), org: getField('ORG'), title: getField('TITLE'),
      url: getField('URL'), adr: getField('ADR').replace(/;/g, ' ').trim()
    };
  };
  const [data, setData] = useState(parseVcard(settings.contentData));
  
  useEffect(() => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${data.lName};${data.fName};;;\nFN:${data.fName} ${data.lName}\nORG:${data.org}\nTITLE:${data.title}\nTEL:${data.phone}\nEMAIL:${data.email}\nURL:${data.url}\nADR:;;${data.adr};;;;\nEND:VCARD`;
    updateSettings({ contentData: vcard });
  }, [data]);

  const set = (k: keyof typeof data, v: string) => setData(p => ({ ...p, [k]: v }));

  return (
    <div className="grid grid-cols-2 gap-3">
      <Input label={t("studio.forms.vcard.firstName")} placeholder="John" value={data.fName} onChange={(e: any) => set('fName', e.target.value)} />
      <Input label={t("studio.forms.vcard.lastName")} placeholder="Doe" value={data.lName} onChange={(e: any) => set('lName', e.target.value)} />
      <Input label={t("studio.forms.vcard.phone")} type="tel" placeholder="+1234567890" value={data.phone} onChange={(e: any) => set('phone', e.target.value)} />
      <Input label={t("studio.forms.vcard.email")} type="email" placeholder="john@example.com" value={data.email} onChange={(e: any) => set('email', e.target.value)} />
      <Input label={t("studio.forms.vcard.organization")} placeholder="Acme Corp" value={data.org} onChange={(e: any) => set('org', e.target.value)} />
      <Input label={t("studio.forms.vcard.title")} placeholder="Software Engineer" value={data.title} onChange={(e: any) => set('title', e.target.value)} />
      <div className="col-span-2">
        <Input label={t("studio.forms.vcard.url")} type="url" placeholder="https://example.com" value={data.url} onChange={(e: any) => set('url', e.target.value)} />
      </div>
      <div className="col-span-2">
        <Textarea label={t("studio.forms.vcard.address")} placeholder="123 Main St, City, Country" value={data.adr} onChange={(e: any) => set('adr', e.target.value)} />
      </div>
    </div>
  );
};

export const WifiForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseWifi = (str: string) => {
    const getField = (prefix: string) => {
      const match = str.match(new RegExp(`${prefix}:([^;]+)`));
      return match ? match[1] : '';
    };
    return {
      ssid: getField('S'), pass: getField('P'), type: getField('T') || 'WPA', hidden: getField('H') === 'true'
    };
  };
  const [data, setData] = useState(parseWifi(settings.contentData));
  
  useEffect(() => {
    updateSettings({ contentData: `WIFI:T:${data.type};S:${data.ssid};P:${data.pass};H:${data.hidden};;` });
  }, [data]);

  const set = (k: keyof typeof data, v: any) => setData(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <Input label={t("studio.forms.wifi.ssidLabel")} placeholder={t("studio.forms.wifi.ssidPlaceholder")} value={data.ssid} onChange={(e: any) => set('ssid', e.target.value)} />
      <Input label={t("studio.forms.wifi.passwordLabel")} type="password" placeholder={t("studio.forms.wifi.passwordPlaceholder")} value={data.pass} onChange={(e: any) => set('pass', e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Select label={t("studio.forms.wifi.encryptionLabel")} value={data.type} onChange={(e: any) => set('type', e.target.value)}>
          <option value="WPA">{t("studio.forms.wifi.wpa")}</option>
          <option value="WEP">{t("studio.forms.wifi.wep")}</option>
          <option value="nopass">{t("studio.forms.wifi.none")}</option>
        </Select>
        <div className="flex items-center space-x-2 pt-6">
          <input type="checkbox" id="hiddenWifi" checked={data.hidden} onChange={(e: any) => set('hidden', e.target.checked)} className="rounded border-gray-300" />
          <label htmlFor="hiddenWifi" className="text-sm font-medium">{t("studio.forms.wifi.hiddenLabel")}</label>
        </div>
      </div>
    </div>
  );
};

export const LocationForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseLoc = (str: string) => {
    const geoMatch = str.match(/^geo:.*?(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (geoMatch) return { lat: geoMatch[1], lng: geoMatch[2] };
    const mapsMatch = str.match(/(?:q|query)=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (mapsMatch) return { lat: mapsMatch[1], lng: mapsMatch[2] };
    return { lat: '', lng: '' };
  };
  const [lat, setLat] = useState(parseLoc(settings.contentData).lat);
  const [lng, setLng] = useState(parseLoc(settings.contentData).lng);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { 
    if (lat || lng) {
      updateSettings({ contentData: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` }); 
    }
  }, [lat, lng]);

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(6));
          setLng(position.coords.longitude.toFixed(6));
          setLoading(false);
        },
        (error) => {
          let msg = 'Could not get location.';
          if (error.code === 1) msg = 'Location permission denied.';
          else if (error.code === 2) msg = 'Location unavailable.';
          else if (error.code === 3) msg = 'Location request timed out.';
          
          setError(msg);
          setLoading(false);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label={t("studio.forms.location.latLabel")} placeholder={t("studio.forms.location.latPlaceholder")} value={lat} onChange={(e: any) => setLat(e.target.value)} />
        <Input label={t("studio.forms.location.lngLabel")} placeholder={t("studio.forms.location.lngPlaceholder")} value={lng} onChange={(e: any) => setLng(e.target.value)} />
      </div>
      <button 
        onClick={getLocation} 
        disabled={loading}
        className="w-full py-2.5 px-4 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'Getting location...' : t("studio.forms.location.searchLabel")}
      </button>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export const EventForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseEvent = (str: string) => {
    const getField = (prefix: string) => {
      const match = str.match(new RegExp(`^${prefix}:(.*)$`, 'mi'));
      return match ? match[1].trim() : '';
    };
    const formatOut = (val: string) => {
      if(!val || val.length !== 16) return '';
      return `${val.substring(0,4)}-${val.substring(4,6)}-${val.substring(6,8)}T${val.substring(9,11)}:${val.substring(11,13)}`;
    };
    return {
      title: getField('SUMMARY'), loc: getField('LOCATION'),
      start: formatOut(getField('DTSTART')), end: formatOut(getField('DTEND'))
    };
  };
  const [data, setData] = useState(parseEvent(settings.contentData));

  useEffect(() => {
    const formatIn = (val: string) => {
      if(!val) return '';
      return val.replace(/[-:]/g, '') + '00Z';
    };
    const ics = `BEGIN:VEVENT\nSUMMARY:${data.title}\nLOCATION:${data.loc}\nDTSTART:${formatIn(data.start)}\nDTEND:${formatIn(data.end)}\nEND:VEVENT`;
    updateSettings({ contentData: ics });
  }, [data]);

  const set = (k: keyof typeof data, v: string) => setData(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <Input label={t("studio.forms.event.title")} placeholder="Birthday Party" value={data.title} onChange={(e: any) => set('title', e.target.value)} />
      <Input label={t("studio.forms.event.location")} placeholder="123 Party Lane" value={data.loc} onChange={(e: any) => set('loc', e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Input label={t("studio.forms.event.startDate")} type="datetime-local" value={data.start} onChange={(e: any) => set('start', e.target.value)} />
        <Input label={t("studio.forms.event.endDate")} type="datetime-local" value={data.end} onChange={(e: any) => set('end', e.target.value)} />
      </div>
    </div>
  );
};

export const UpiForm = () => {
  const { settings, updateSettings } = useQRStore();
  const parseUpi = (str: string) => {
    const match = str.match(/^upi:\/\/pay\?(.*)$/i);
    if (!match) return { vpa: '', name: '', amount: '' };
    const params = new URLSearchParams(match[1]);
    return { vpa: params.get('pa') || '', name: params.get('pn') || '', amount: params.get('am') || '' };
  };
  const [data, setData] = useState(parseUpi(settings.contentData));

  useEffect(() => {
    const params = new URLSearchParams();
    if (data.vpa) params.append('pa', data.vpa);
    if (data.name) params.append('pn', data.name);
    if (data.amount) { params.append('am', data.amount); params.append('cu', 'INR'); }
    updateSettings({ contentData: `upi://pay?${params.toString()}` });
  }, [data]);

  const set = (k: keyof typeof data, v: string) => setData(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <Input label="UPI ID (VPA)" placeholder="john@upi" value={data.vpa} onChange={(e: any) => set('vpa', e.target.value)} />
      <Input label="Payee Name" placeholder="John Doe" value={data.name} onChange={(e: any) => set('name', e.target.value)} />
      <Input label="Amount (Optional, INR)" type="number" placeholder="100.00" value={data.amount} onChange={(e: any) => set('amount', e.target.value)} />
    </div>
  );
};

export const CryptoForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parseCrypto = (str: string) => {
    const match = str.match(/^([^:]+):([^?]+)\??(.*)$/);
    if (!match) return { coin: 'bitcoin', addr: '', amount: '' };
    const params = new URLSearchParams(match[3] || '');
    return { coin: match[1], addr: match[2], amount: params.get('amount') || '' };
  };
  const [data, setData] = useState(parseCrypto(settings.contentData));

  useEffect(() => {
    const q = data.amount ? `?amount=${data.amount}` : '';
    updateSettings({ contentData: `${data.coin}:${data.addr}${q}` });
  }, [data]);

  const set = (k: keyof typeof data, v: string) => setData(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <Select label={t("studio.forms.crypto.currencyLabel")} value={data.coin} onChange={(e: any) => set('coin', e.target.value)}>
        <option value="bitcoin">Bitcoin (BTC)</option>
        <option value="ethereum">Ethereum (ETH)</option>
        <option value="litecoin">Litecoin (LTC)</option>
      </Select>
      <Input label={t("studio.forms.crypto.addressLabel")} placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" value={data.addr} onChange={(e: any) => set('addr', e.target.value)} />
      <Input label={t("studio.forms.crypto.amountLabel")} type="number" step="0.00000001" placeholder="0.05" value={data.amount} onChange={(e: any) => set('amount', e.target.value)} />
    </div>
  );
};

export const PaypalForm = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useQRStore();
  const parsePaypal = (str: string) => {
    const match = str.match(/paypal\.me\/([^/]+)\/?([^/]*)/i);
    return match ? { user: match[1], amount: match[2] } : { user: '', amount: '' };
  };
  const [user, setUser] = useState(parsePaypal(settings.contentData).user);
  const [amount, setAmount] = useState(parsePaypal(settings.contentData).amount);
  
  useEffect(() => {
    updateSettings({ contentData: `https://paypal.me/${user}${amount ? `/${amount}` : ''}` });
  }, [user, amount]);

  return (
    <div className="space-y-3">
      <Input label={t("studio.forms.paypal.userLabel")} placeholder="username" value={user} onChange={(e: any) => setUser(e.target.value)} />
      <Input label={t("studio.forms.paypal.amountLabel")} type="number" placeholder="50.00" value={amount} onChange={(e: any) => setAmount(e.target.value)} />
    </div>
  );
};

export const AppStoreForm = () => {
  const { settings, updateSettings } = useQRStore();
  return <Input label="App Store URL" type="url" placeholder="https://apps.apple.com/..." value={settings.contentData} onChange={(e: any) => updateSettings({ contentData: e.target.value })} />;
};

export const GooglePlayForm = () => {
  const { settings, updateSettings } = useQRStore();
  return <Input label="Google Play URL" type="url" placeholder="https://play.google.com/store/apps/details?id=..." value={settings.contentData} onChange={(e: any) => updateSettings({ contentData: e.target.value })} />;
};

export const SocialForm = () => {
  const { settings, updateSettings } = useQRStore();
  
  const platforms: Record<string, string> = {
    'instagram': 'https://instagram.com/',
    'facebook': 'https://facebook.com/',
    'x': 'https://x.com/',
    'linkedin': 'https://linkedin.com/in/',
    'youtube': 'https://youtube.com/@',
    'tiktok': 'https://tiktok.com/@',
    'snapchat': 'https://snapchat.com/add/',
    'pinterest': 'https://pinterest.com/',
    'reddit': 'https://reddit.com/user/',
    'github': 'https://github.com/',
    'discord': 'https://discord.gg/',
    'telegram': 'https://t.me/',
    'threads': 'https://threads.net/@',
    'twitch': 'https://twitch.tv/',
    'spotify': 'https://open.spotify.com/user/'
  };

  const parseSocial = (str: string) => {
    for (const [key, prefix] of Object.entries(platforms)) {
      if (str.startsWith(prefix)) return { platform: key, handle: str.replace(prefix, '') };
    }
    return { platform: 'instagram', handle: '' };
  };

  const [data, setData] = useState(parseSocial(settings.contentData));

  useEffect(() => {
    updateSettings({ contentData: `${platforms[data.platform]}${data.handle}` });
  }, [data]);

  const set = (k: keyof typeof data, v: string) => setData(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <Select label="Platform" value={data.platform} onChange={(e: any) => set('platform', e.target.value)}>
        <option value="instagram">Instagram</option>
        <option value="facebook">Facebook</option>
        <option value="x">X (Twitter)</option>
        <option value="linkedin">LinkedIn</option>
        <option value="youtube">YouTube</option>
        <option value="tiktok">TikTok</option>
        <option value="snapchat">Snapchat</option>
        <option value="pinterest">Pinterest</option>
        <option value="reddit">Reddit</option>
        <option value="github">GitHub</option>
        <option value="discord">Discord</option>
        <option value="telegram">Telegram</option>
        <option value="threads">Threads</option>
        <option value="twitch">Twitch</option>
        <option value="spotify">Spotify</option>
      </Select>
      <Input label="Username / Handle" placeholder="username" value={data.handle} onChange={(e: any) => set('handle', e.target.value)} />
    </div>
  );
};
