---
title: "QR Code Size Guide — Minimum Sizes for Print & Billboards"
description: "Complete sizing reference for QR codes. Learn the minimum dimensions for business cards, stickers, posters, billboards, and digital screens."
pubDate: 2026-08-21
author: "GenerateCustomQR Team"
keywords: "qr code size, qr code minimum size, qr code dimensions, qr code print size, how big should a qr code be, qr code size for business card"
category: "guides"
readingTime: 6
featured: false
---

# QR Code Size Guide — How Big Should a QR Code Be?

One of the most common questions when creating a QR code is: *"How big does it need to be?"* The answer depends on where you're placing it, how far away people will scan it, and how much data the code contains.

This guide provides definitive sizing recommendations for every common use case.

## The Golden Rule: Scan Distance ÷ 10

The simplest formula for QR code sizing:

> **Minimum QR code size = scanning distance ÷ 10**

If someone will scan the QR code from **30 cm away** (a typical business card distance), the minimum size is **3 cm × 3 cm** (about 1.2 inches).

If they'll scan from **3 meters away** (a poster on a wall), the minimum size is **30 cm × 30 cm** (about 12 inches).

## Size Chart by Use Case

| Use Case | Typical Scan Distance | Minimum QR Size | Recommended Size |
|----------|----------------------|-----------------|-----------------|
| **Business card** | 15–30 cm | 2 cm × 2 cm | 2.5–3 cm × 2.5–3 cm |
| **Product label** | 15–25 cm | 1.5 cm × 1.5 cm | 2 cm × 2 cm |
| **Sticker / Badge** | 20–40 cm | 2 cm × 2 cm | 3 cm × 3 cm |
| **Flyer / Brochure** | 25–40 cm | 2.5 cm × 2.5 cm | 3–4 cm × 3–4 cm |
| **Restaurant table tent** | 30–50 cm | 3 cm × 3 cm | 4–5 cm × 4–5 cm |
| **A4 Poster** | 0.5–1.5 m | 5 cm × 5 cm | 8–10 cm × 8–10 cm |
| **A3/A2 Poster** | 1–3 m | 10 cm × 10 cm | 15 cm × 15 cm |
| **Banner / Roll-up** | 1–5 m | 15 cm × 15 cm | 20–25 cm × 20–25 cm |
| **Billboard** | 5–20 m | 50 cm × 50 cm | 80–100 cm × 80–100 cm |
| **Stadium display** | 20–50 m | 2 m × 2 m | 3 m × 3 m |

## How Data Complexity Affects Size

The more data you encode in a QR code, the more *modules* (tiny squares) it needs. More modules require a larger physical size to remain scannable.

| Content Type | Approximate Module Count | Minimum Size Impact |
|-------------|------------------------|-------------------|
| **Short URL** (under 50 chars) | 25×25 modules | Standard sizing works |
| **Medium URL** (50–100 chars) | 33×33 modules | +10% size increase |
| **Long URL** (100–200 chars) | 41×41 modules | +25% size increase |
| **vCard** (full contact info) | 45×45 modules | +30% size increase |
| **WiFi credentials** | 29×29 modules | Standard sizing works |
| **Plain text** (500+ chars) | 57×57+ modules | +50% or more |

**Pro tip:** Use URL shorteners for long URLs to keep the module count low, which means smaller QR codes that are easier to scan.

## Error Correction and Size

QR codes have four error correction levels that affect size:

| Level | Recovery Capacity | Size Impact | Best For |
|-------|------------------|-------------|---------|
| **L** (Low) | 7% recovery | Smallest code | Digital screens, clean environments |
| **M** (Medium) | 15% recovery | +10% larger | General use, printed materials |
| **Q** (Quartile) | 25% recovery | +20% larger | Outdoor use, textured surfaces |
| **H** (High) | 30% recovery | +30% larger | Logo embedding, harsh environments |

When you embed a logo in your QR code, always use Error Correction **H**. This means the code will be physically larger, so account for the extra 30% in your size planning.

## Resolution Requirements by Export Format

Size isn't just about physical dimensions — you also need the right resolution for crisp printing.

| Export Format | Best Resolution | Use Case |
|--------------|----------------|---------|
| **PNG** | 300 DPI for print, 72 DPI for web | Most versatile format |
| **SVG** | Infinite (vector) | Print at any size without pixelation |
| **PDF** | 300 DPI embedded | Professional print shops, brochures |

With [GenerateCustomQR](/), you can export PNG at up to **8192 × 8192 pixels** — more than enough for even billboard-sized prints. For unlimited scaling, use SVG export.

## Common Sizing Mistakes

### ❌ Making it too small
QR codes under 2 cm × 2 cm are risky. Older phones and low-light conditions make small codes unreliable. Always err on the side of bigger.

### ❌ Forgetting the quiet zone
The **quiet zone** (white border around the QR code) must be at least 4 modules wide. This border is part of the code's scanning specification — cropping it will cause scan failures.

### ❌ Using low resolution for print
A 300×300 pixel PNG looks fine on a phone screen but will be blurry on a printed flyer. For print, export at minimum 1200×1200 pixels or use SVG.

### ❌ Not testing at actual size
Before printing 10,000 flyers, print a single test copy and scan it with 3 different phones. What looks good on screen may not scan reliably when printed.

## Size Checklist Before Printing

✅ Calculate minimum size using scan distance ÷ 10
✅ Add 30% if using Error Correction H (for logo)
✅ Include quiet zone (4+ module widths of padding)
✅ Export at 300+ DPI for print materials
✅ Test scan with 3 different devices at the intended distance
✅ Check on both light and dark backgrounds

## Create the Perfect QR Code

Ready to generate a QR code at the perfect size? [GenerateCustomQR](/) lets you export at custom resolutions up to 8192×8192px, with SVG vector export for unlimited scaling. All styles, all formats, 100% free.

- [Create a URL QR code →](/url-qr-code-generator)
- [Create a WiFi QR code →](/wifi-qr-code)
- [Create a vCard QR code →](/vcard-qr-code)
- [Learn print best practices →](/blog/qr-code-design-best-practices-for-print)
