import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQRStore } from "@/store/useQRStore";
import { useTranslation } from "@/i18n/useTranslation";
import {
  UrlForm, TextForm, PhoneForm, SmsForm, WhatsAppForm, EmailForm, VCardForm,
  WifiForm, LocationForm, EventForm, UpiForm, CryptoForm, PaypalForm,
  AppStoreForm, GooglePlayForm, SocialForm
} from "@/components/generator/forms/ContentForms";

const contentCategoryDefs = [
  {
    id: "basic",
    titleKey: "basic",
    title: "Basic",
    icon: "bolt",
    items: [
      { id: "url",      labelKey: "url",      label: "URL",      icon: "link",         popular: true },
      { id: "text",    labelKey: "text",    label: "Text",     icon: "subject",      popular: false },
      { id: "phone",   labelKey: "phone",   label: "Phone",    icon: "phone",        popular: false },
      { id: "sms",     labelKey: "sms",     label: "SMS",      icon: "sms",          popular: false },
      { id: "whatsapp",labelKey: "whatsapp",label: "WhatsApp", icon: "chat",         popular: false },
      { id: "email",   labelKey: "email",   label: "Email",    icon: "mail",         popular: false },
      { id: "vcard",   labelKey: "vcard",   label: "vCard",    icon: "contact_page", popular: true },
    ]
  },
  {
    id: "network",
    titleKey: "network",
    title: "Network",
    icon: "wifi",
    items: [
      { id: "wifi", labelKey: "wifi", label: "Wi-Fi", icon: "wifi", popular: true },
    ]
  },
  {
    id: "locationEvents",
    titleKey: "locationEvents",
    title: "Location & Events",
    icon: "location_on",
    items: [
      { id: "location", labelKey: "location", label: "Location", icon: "location_on", popular: false },
      { id: "event",    labelKey: "event",    label: "Event",    icon: "event",        popular: false },
    ]
  },
  {
    id: "payments",
    titleKey: "payments",
    title: "Payments",
    icon: "payments",
    items: [
      { id: "upi",    labelKey: "upi",    label: "UPI",    icon: "account_balance",   popular: false },
      { id: "crypto", labelKey: "crypto", label: "Crypto", icon: "currency_bitcoin", popular: false },
      { id: "paypal", labelKey: "paypal", label: "PayPal", icon: "payments",         popular: false },
    ]
  },
  {
    id: "appsSocial",
    titleKey: "appsSocial",
    title: "Apps & Social",
    icon: "apps",
    items: [
      { id: "appstore",   labelKey: "appstore",   label: "App Store",   icon: "apps",       popular: false },
      { id: "googleplay", labelKey: "googleplay", label: "Google Play", icon: "play_arrow", popular: false },
      { id: "social",     labelKey: "social",     label: "Social",      icon: "share",      popular: false },
    ]
  },
  {
    id: "advanced",
    titleKey: "advanced",
    title: "Advanced",
    icon: "dataset",
    items: [
      { id: "batch", labelKey: "batch", label: "Batch CSV", icon: "dataset", popular: false, comingSoon: true },
    ]
  }
];

export function ContentPanel() {
  const { t } = useTranslation();
  const { 
    settings, 
    updateSettings,
    batchCsvRows,
    batchCsvHeaders,
    batchDataColumn,
    batchFilenameColumn,
    setBatchData,
    updateBatchColumn
  } = useQRStore();
  
  const [contentCategoryTab, setContentCategoryTab] = useState<string>('basic');

  useEffect(() => {
    const activeCategory = contentCategoryDefs.find(c => c.items.some(i => i.id === settings.contentType));
    if (activeCategory) {
      setContentCategoryTab(activeCategory.id);
    }
  }, [settings.contentType]);

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });
      rows.push(row);
    }
    
    const dataCol = headers.includes('Data') ? 'Data' : (headers.includes('URL') ? 'URL' : headers[0]);
    const fileCol = headers.includes('Filename') ? 'Filename' : (headers.includes('Name') ? 'Name' : '');
    setBatchData(rows, headers, dataCol, fileCol);
  };

  const downloadSampleCSV = () => {
    const csvContent = "Filename,Data\nSKU_1001,https://example.com/sku/1001\nSKU_1002,https://example.com/sku/1002\nSKU_1003,https://example.com/sku/1003";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_qr_batch.csv";
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="space-y-6">
      {/* Content Type Selector */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-xl overflow-x-auto custom-scrollbar">
          {contentCategoryDefs.map((cat) => {
            const categoryTitle = t(`studio.content.categories.${cat.titleKey}`) || cat.title;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setContentCategoryTab(cat.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap outline-none ${
                  contentCategoryTab === cat.id
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-black/5"
                }`}
              >
                {contentCategoryTab === cat.id && (
                  <motion.div
                    layoutId="content-category-tab"
                    className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  {categoryTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {contentCategoryDefs
            .find(c => c.id === contentCategoryTab)
            ?.items
            .map(type => {
              const isSelected = settings.contentType === type.id;
              const typeLabel = t(`studio.content.types.${type.labelKey}`) || type.label;
              return (
                <button
                  key={type.id}
                  type="button"
                  disabled={(type as any).comingSoon}
                  onClick={() => updateSettings({ contentType: type.id as any, contentData: "" })}
                  className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-colors outline-none font-bold text-sm ${
                    (type as any).comingSoon
                      ? "opacity-60 cursor-not-allowed bg-surface-container-low border-outline-variant/30 text-on-surface-variant/50"
                      : isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant/50 bg-white text-on-surface-variant hover:border-outline hover:bg-surface-container-lowest"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">{type.icon}</span>
                    {typeLabel}
                  </div>
                  {(type as any).comingSoon && (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* Beginner hint */}
      {!settings.contentData && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/15 text-sm">
          <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">lightbulb</span>
          <p className="text-on-surface-variant leading-relaxed">
            {settings.contentType === 'url' && 'Paste a website link below and your QR code will update instantly!'}
            {settings.contentType === 'text' && 'Type any message below — it will be encoded into your QR code.'}
            {settings.contentType === 'wifi' && 'Enter your Wi-Fi network details. Anyone who scans can connect instantly!'}
            {settings.contentType === 'vcard' && 'Fill in contact details. Scanning this QR will save the contact to a phone.'}
            {!['url', 'text', 'wifi', 'vcard'].includes(settings.contentType) && 'Fill in the details below. Your QR code updates live as you type!'}
          </p>
        </div>
      )}

      {/* Input Card */}
      <div className="bg-white rounded-xl border border-outline-variant space-y-6 p-4 sm:p-6">
        {settings.contentType === "url" && <UrlForm />}
        {settings.contentType === "text" && <TextForm />}
        {settings.contentType === "phone" && <PhoneForm />}
        {settings.contentType === "sms" && <SmsForm />}
        {settings.contentType === "whatsapp" && <WhatsAppForm />}
        {settings.contentType === "email" && <EmailForm />}
        {settings.contentType === "vcard" && <VCardForm />}
        {settings.contentType === "wifi" && <WifiForm />}
        {settings.contentType === "location" && <LocationForm />}
        {settings.contentType === "event" && <EventForm />}
        {settings.contentType === "upi" && <UpiForm />}
        {settings.contentType === "crypto" && <CryptoForm />}
        {settings.contentType === "paypal" && <PaypalForm />}
        {settings.contentType === "appstore" && <AppStoreForm />}
        {settings.contentType === "googleplay" && <GooglePlayForm />}
        {settings.contentType === "social" && <SocialForm />}

        {settings.contentType === "batch" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-headline-sm text-on-surface font-bold">Batch ZIP Generation</h3>
              <p className="text-on-surface-variant font-label-md text-label-md mt-1">
                Upload a CSV file to generate up to 500 QR codes in a single ZIP file.
              </p>
            </div>

            <div className="space-y-3">
              <div className="section-label flex justify-between items-center mb-1">
                <span className="font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-sm">upload_file</span>Upload CSV</span>
                <button type="button" onClick={downloadSampleCSV} className="text-xs text-primary font-bold hover:underline">Download Sample CSV</button>
              </div>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/40 rounded-3xl p-8 bg-surface/40 hover:bg-primary/5 transition-all cursor-pointer relative group overflow-hidden">
                <input name="input_field_dd0ea10a" aria-label="Input Field" type="file" accept=".csv" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert("CSV file size exceeds 5MB limit.");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => parseCSV(e.target?.result as string);
                    reader.readAsText(file);
                  }
                }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />

                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-2xl">dataset</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{batchCsvRows.length > 0 ? `${batchCsvRows.length} rows loaded` : "Select or drag CSV file"}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{batchCsvRows.length > 0 ? "Click or drag to replace" : "Max 500 rows supported"}</p>
                  </div>
                </div>
              </div>
            </div>

            {batchCsvRows.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-on-surface-variant">QR Data Column (Required)</div>
                    <select name="input_field_f7330c0b" aria-label="Input Field" value={batchDataColumn} onChange={(e) => updateBatchColumn('data', e.target.value)} className="w-full p-2.5 bg-white border border-outline-variant rounded-xl text-sm outline-none focus:border-primary">
                      <option value="">Select column...</option>
                      {batchCsvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-on-surface-variant">File Name Column (Optional)</div>
                    <select name="input_field_7d95655f" aria-label="Input Field" value={batchFilenameColumn} onChange={(e) => updateBatchColumn('filename', e.target.value)} className="w-full p-2.5 bg-white border border-outline-variant rounded-xl text-sm outline-none focus:border-primary">
                      <option value="">Auto-generate names (QR_Item_001)</option>
                      {batchCsvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant overflow-hidden">
                  <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant text-xs font-bold flex justify-between">
                    <span>Data Preview (First 5 rows)</span>
                    <span className="text-primary">{batchCsvRows.length} total rows</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-surface">
                          {batchCsvHeaders.map(h => (
                            <th key={h} className="p-2 border-b border-outline-variant font-semibold text-on-surface-variant whitespace-nowrap">
                              {h}
                              {h === batchDataColumn && <span className="ml-1 text-primary material-symbols-outlined text-[10px]">qr_code</span>}
                              {h === batchFilenameColumn && <span className="ml-1 text-primary material-symbols-outlined text-[10px]">description</span>}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {batchCsvRows.slice(0, 5).map((row, i) => (
                          <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container-lowest">
                            {batchCsvHeaders.map(h => (
                              <td key={h} className="p-2 truncate max-w-[150px]" title={row[h]}>{row[h]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
