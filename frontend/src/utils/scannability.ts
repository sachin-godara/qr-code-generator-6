import { type QRSettings } from "@/types/qr";

/**
 * Convert a hex color to relative luminance.
 * Uses standard sRGB luminance formula.
 */
function hexToLuminance(hex: string): number {
  if (!hex) return 1; // Default to white luminance if invalid
  
  // Clean up hex
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  // If we have alpha, ignore it or handle it? We'll ignore alpha for now
  if (hex.length === 8) {
    hex = hex.substring(0, 6);
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Convert to linear sRGB
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate the contrast ratio between two hex colors.
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = hexToLuminance(hex1);
  const lum2 = hexToLuminance(hex2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ScannabilityResult {
  score: number;
  label: "Excellent" | "Good" | "Fair" | "Poor";
  color: string;
  issues: string[];
}

export function calculateScannability(settings: QRSettings): ScannabilityResult {
  let score = 100;
  const issues: string[] = [];

  // 1. Contrast Check
  // Consider worst-case contrast if gradient is used
  const bgColor = settings.bg_color || "#ffffff";
  const dotsColor1 = settings.dots_color || "#000000";
  const dotsColor2 = settings.gradient_type && settings.gradient_type !== "Solid Color" && settings.dots_color_end
    ? settings.dots_color_end
    : dotsColor1;

  const contrast1 = getContrastRatio(bgColor, dotsColor1);
  const contrast2 = getContrastRatio(bgColor, dotsColor2);
  const minContrast = Math.min(contrast1, contrast2);

  if (minContrast < 2.5) {
    score -= 40;
    issues.push("Contrast is too low. Ensure dots are much darker (or lighter) than the background.");
  } else if (minContrast < 3.5) {
    score -= 20;
    issues.push("Contrast is a bit low. Some scanners might struggle.");
  } else if (minContrast < 4.5) {
    score -= 5;
  }

  // 2. Dot Style Penalty
  const dotStyle = settings.dots_style || "square";
  const safeDots = ["square", "rounded", "circle", "classy"];
  const moderateDots = ["diamond", "hexagon", "octagon", "gapped"];
  const riskyDots = ["star", "heart", "plus", "vertical_bars", "horizontal_bars"];
  
  if (!safeDots.includes(dotStyle) && !moderateDots.includes(dotStyle) && !riskyDots.includes(dotStyle)) {
    // Advanced/highly experimental styles
    score -= 20;
    issues.push(`The '${dotStyle.replace(/_/g, ' ')}' dot style removes a lot of QR module mass, reducing readability.`);
  } else if (riskyDots.includes(dotStyle)) {
    score -= 10;
    issues.push(`The '${dotStyle.replace(/_/g, ' ')}' dot style can be harder for older scanners to read.`);
  } else if (moderateDots.includes(dotStyle)) {
    score -= 2;
  }

  // 3. Eye Frame and Eyeball Penalty
  const frameStyle = settings.eye_frame_style || "square";
  const ballStyle = settings.eyeball_style || "square";
  
  const safeEyes = ["square", "rounded", "octagon", "squircle"];
  if (!safeEyes.includes(frameStyle)) {
    score -= 10;
    issues.push(`Complex eye frames can confuse scanners looking for standard square alignment markers.`);
  }
  if (!safeEyes.includes(ballStyle)) {
    score -= 10;
    issues.push(`Complex eyeballs can distort alignment anchors.`);
  }

  // 4. Logo & Error Correction Check
  const hasLogo = (settings.preset_logo && settings.preset_logo !== "None") || !!settings.logo_image;
  if (hasLogo) {
    const errorCorrection = settings.error_correction || "H";
    if (errorCorrection === "L") {
      score -= 30;
      issues.push("Adding a logo requires higher Error Correction. Level 'L' is too weak.");
    } else if (errorCorrection === "M") {
      score -= 15;
      issues.push("Adding a logo normally requires Error Correction 'Q' or 'H'.");
    }
  }

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine Label and Color
  let label: ScannabilityResult["label"] = "Poor";
  let color = "text-error"; // red

  if (score >= 90) {
    label = "Excellent";
    color = "text-emerald-500";
  } else if (score >= 70) {
    label = "Good";
    color = "text-yellow-500";
  } else if (score >= 50) {
    label = "Fair";
    color = "text-orange-500";
  }

  return { score, label, color, issues };
}
