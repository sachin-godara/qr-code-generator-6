# 🔌 00 - MCP Server Architecture & Tools (`mcp-server-qrcode-enhanced`)

> **Comprehensive architectural reference for the Model Context Protocol (MCP) server, JSON-RPC stdio transport, Zod schema validation, QR generation/analysis utilities, and the 13 automated tool interfaces.**

---

## 🏛️ 1. MCP Server Overview & System Topology

The `mcp-server-qrcode-enhanced` package implements the **Model Context Protocol (MCP)** specification from Anthropic/DeepMind, allowing AI agents and pair-programming assistants to autonomously generate, style, batch-process, analyze, and validate QR codes directly inside IDE environments.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             AI Agent Client                                 │
│          (Claude Desktop, Antigravity IDE, Cursor, Continue.dev)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ JSON-RPC 2.0 via Stdio Transport
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    EnhancedQRCodeMCPServer (index.ts)                       │
│  • Tool Registry (13 Registered Tool Handlers)                              │
│  • Zod Validation Middleware (QRStyleSchema, VCardSchema, WiFiSchema, etc.) │
│  • Error Handling & Custom Exceptions (QRValidationError, QRGenerationError)│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        QRCodeEnhanced Engine (qr-utils.ts)                  │
│  • Native Node QR Generator (`qrcode`, `qrcode-svg`)                        │
│  • Image Processing & Resampling (`sharp`, `jimp`)                          │
│  • Computer Vision Decoders (`jsqr` & Inverted Matrix Scanning)             │
│  • Telemetry & Statistics Engine (In-Memory Gen Metrics, Avg Latency)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 2. Comprehensive Tool Reference (All 13 Tools)

| Tool Name | Purpose | Key Parameters | Return Type |
| :--- | :--- | :--- | :--- |
| `generate_qr_basic` | Standard QR code generation | `content`, `size` (50–2000), `margin` (0–10), `errorCorrectionLevel` ('L', 'M', 'Q', 'H'), `format` ('png', 'svg', 'pdf', 'jpeg') | File path, data buffer, metadata |
| `generate_qr_styled` | QR code with custom colors, gradients, rounded corners, and logo overlay | `content`, `style` (`foregroundColor`, `backgroundColor`, `logoPath`, `logoSize`, `cornerRadius`, `gradientStart`, `gradientEnd`), `config` | Styled QR file path & metrics |
| `generate_qr_batch` | Batch process multiple items with custom file naming and unified style | `items` (array of content + filename + style overrides), `outputDir`, `format`, `baseConfig` | Batch generation summary & manifest |
| `generate_vcard_qr` | Contact card QR code (vCard 3.0 / 4.0 format) | `firstName`, `lastName`, `organization`, `title`, `phone`, `email`, `website`, `address` | Formatted vCard QR file |
| `generate_wifi_qr` | Wi-Fi network connection QR code (`WIFI:T:WPA;S:MySSID;P:MyPass;;`) | `ssid`, `password`, `security` ('WEP', 'WPA', 'WPA2', 'WPA3', 'nopass'), `hidden` | Wi-Fi connection QR file |
| `generate_event_qr` | iCalendar event QR code (`BEGIN:VEVENT ...`) | `title`, `description`, `location`, `startDate` (ISO 8601), `endDate`, `allDay` | Calendar invite QR file |
| `decode_qr_image` | Decodes QR code from disk image with image pre-processing | `imagePath`, `outputFormat` ('json', 'text') | Decoded text payload & metadata |
| `analyze_qr_quality` | Evaluates contrast, error correction headroom, and scannability | `imagePath` | Quality score (0–100), readability rating, recommendations |
| `optimize_qr_content` | Recommends optimal error correction and mode for given text | `content`, `targetSize`, `intendedMedium` ('print', 'screen', 'billboard') | Optimal EC level, character encoding mode, suggested pixel size |
| `list_qr_templates` | Lists built-in preset design templates | `category` ('business', 'personal', 'event', 'marketing', 'social') | Array of template names, descriptions, and configs |
| `generate_qr_from_template` | Generates a QR code directly from a named template | `content`, `templateName`, `overrides` | Rendered template QR image |
| `get_qr_statistics` | Telemetry on generated codes, formats, latency, and average size | None | Statistics summary object |
| `validate_qr_content` | Pre-flight check for content size, URL schemes, and encodability | `content`, `contentType` ('url', 'email', 'phone', 'wifi', 'vcard', 'text') | Validation boolean, detected mode, warnings |

---

## 🔒 3. Error Architecture & Zod Schemas

The MCP server enforces strict runtime safety using **Zod**:

```typescript
export class QRError extends Error {
  constructor(public code: string, message: string, public details?: any) {
    super(message);
    this.name = 'QRError';
  }
}
export class QRValidationError extends QRError {}
export class QRGenerationError extends QRError {}
export class QRAnalysisError extends QRError {}
```

All incoming tool calls are validated against schemas (`QRConfigSchema`, `QRStyleSchema`, `VCardSchema`, etc.). In the event of schema mismatch, malformed color hexes, or file missing errors, the server returns structured JSON-RPC error responses with actionable remediation tips rather than crashing the stdio pipe.

---

## 🚀 4. How to Register & Run the MCP Server

### 1. Build TypeScript:
```bash
cd mcp-server-qrcode-enhanced
npm run build
```

### 2. Register in Antigravity / Claude Desktop MCP Config (`mcp_config.json`):
```json
{
  "mcpServers": {
    "qrcode-enhanced": {
      "command": "node",
      "args": ["f:/Project 001/qr code generator 6/mcp-server-qrcode-enhanced/dist/index.js"]
    }
  }
}
```
