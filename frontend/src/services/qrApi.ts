import { type QRSettings } from "@/types/qr";
import { getReactLogoPngDataUrl, PRESET_LOGO_BRAND_COLORS } from "@/components/previews/SvgIcons";

export const API_BASE = import.meta.env.DEV ? "http://localhost:8000" : "";


export interface BatchItem {
  data: string;
  filename?: string;
}

/** Resolves preset logo to base64 PNG + brand color */
export async function resolveLogoPayload(settings: QRSettings) {
  const { contentData, ...rest } = settings;
  let finalLogo = rest.logo_image;
  const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";

  if (isPresetLogo) {
    finalLogo = await getReactLogoPngDataUrl(
      rest.preset_logo,
      rest.logo_color_mode || "default",
      rest.logo_custom_color || "#000000",
      rest.dots_color || "#000000",
      rest.logo_icon_style || "badge",
      rest.logo_card_shape || "Rounded Square"
    );
  }

  const color = rest.logo_color_mode === "custom"
    ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
    : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo as keyof typeof PRESET_LOGO_BRAND_COLORS] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

  return {
    ...rest,
    data: contentData || "Your text here...",
    logo_image: finalLogo,
    preset_logo: isPresetLogo ? "None" : rest.preset_logo,
    logo_card_shape: rest.logo_card_shape,
    preset_logo_color: color,
  };
}

/** Fetch QR code preview image */
export async function fetchQRPreview(settings: QRSettings) {
  const payload = await resolveLogoPayload(settings);
  const finalPayload = { ...payload, box_size: 10 };

  const response = await fetch(`${API_BASE}/api/generator/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to generate QR code");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  return {
    url,
    previewSize: blob.size
  };
}

/** Download as PNG/SVG/PDF with custom size */
export async function downloadQR(settings: QRSettings, format: string, size: number, noStretching: boolean) {
  const payload = await resolveLogoPayload(settings);
  const finalPayload = { 
    ...payload, 
    box_size: 10, 
    target_size: size, 
    no_stretching: noStretching 
  };

  let endpoint = `${API_BASE}/api/generator/generate`;
  let ext = "png";
  
  if (format === "SVG") {
    endpoint = `${API_BASE}/api/generator/generate/svg`;
    ext = "svg";
  } else if (format === "PDF") {
    endpoint = `${API_BASE}/api/generator/generate/pdf`;
    ext = "pdf";
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalPayload),
  });

  if (!response.ok) throw new Error(`Failed to generate ${format}`);
  
  const blob = await response.blob();
  return { blob, ext };
}

/** Copy QR to clipboard */
export async function copyQRToClipboard(settings: QRSettings, size: number, noStretching: boolean) {
  const payload = await resolveLogoPayload(settings);
  const finalPayload = { 
    ...payload, 
    box_size: 10, 
    target_size: size, 
    no_stretching: noStretching 
  };

  const response = await fetch(`${API_BASE}/api/generator/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalPayload),
  });

  if (!response.ok) throw new Error("Failed to generate PNG for clipboard");
  const blob = await response.blob();
  
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
  
  return blob;
}

/** Generate batch ZIP */
export async function generateBatch(settings: QRSettings, items: BatchItem[], format: string, size: number) {
  const payloadSettings = await resolveLogoPayload(settings);

  const payload = {
    items: items,
    settings: payloadSettings,
    format: format.toLowerCase(),
    target_size: size
  };

  const response = await fetch(`${API_BASE}/api/generator/generate/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Batch generation failed: " + errorText);
  }
  
  return await response.blob();
}

/** Fallback Deep Scan via Backend */
export async function scanQRImageBackend(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/generator/scan`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errMessage = "Backend scan failed.";
    try {
      const data = await response.json();
      if (data.detail) errMessage = data.detail;
    } catch (e) {
      // Ignore
    }
    throw new Error(errMessage);
  }

  const data = await response.json();
  if (!data.success || !data.text) {
    throw new Error("Backend could not find a valid QR code");
  }

  return data.text;
}
