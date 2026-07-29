import os

file_path = 'f:/Project 001/qr code generator 6/frontend/src/components/previews/SvgIcons.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Docs to LOGO_ITEMS
old_1 = """  { id: "Forms", label: "Google Forms", category: "Tech & Contact", tags: ["doc", "form", "google", "forms"], gradient: "from-[#7248B9] to-[#5C3A95]" },
  { id: "ScanMe", label: "Scan Me", category: "Tech & Contact", tags: ["scan", "me", "qrcode", "badge"], gradient: "from-[#ef4444] to-[#dc2626]" },
  { id: "PDF", label: "PDF", category: "Tech & Contact", tags: ["document", "file", "pdf", "acrobat"], gradient: "from-[#F40F02] to-[#B30B00]" },"""

new_1 = """  { id: "Forms", label: "Google Forms", category: "Tech & Contact", tags: ["doc", "form", "google", "forms"], gradient: "from-[#7248B9] to-[#5C3A95]" },
  { id: "Docs", label: "Google Docs", category: "Tech & Contact", tags: ["doc", "document", "google", "docs"], gradient: "from-[#4285F4] to-[#2B60CE]" },
  { id: "ScanMe", label: "Scan Me", category: "Tech & Contact", tags: ["scan", "me", "qrcode", "badge"], gradient: "from-[#ef4444] to-[#dc2626]" },
  { id: "PDF", label: "PDF", category: "Tech & Contact", tags: ["document", "file", "pdf", "acrobat"], gradient: "from-[#F40F02] to-[#B30B00]" },"""
content = content.replace(old_1, new_1)

# Add PDF and Docs to switch case
old_2 = """      case 'ScanMe':
        return (
          <g>
            <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="12" y="11.5" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle" fontFamily="sans-serif">SCAN</text>
            <text x="12" y="17" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle" fontFamily="sans-serif">ME</text>
          </g>
        );"""

new_2 = """      case 'ScanMe':
        return (
          <g>
            <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="12" y="11.5" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle" fontFamily="sans-serif">SCAN</text>
            <text x="12" y="17" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle" fontFamily="sans-serif">ME</text>
          </g>
        );
      case 'Docs':
        return (
          <g fill="currentColor">
            <path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818v1.364zm0-3.273H7.091V9.273h9.818v1.363zM14.727 6h6l-6-6v6z"/>
          </g>
        );
      case 'PDF':
        return (
          <g fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5v3H8v-3h1.5zm3.5 1.5c0 1.1-.9 2-2 2h-1.5v-5H11c1.1 0 2 .9 2 2v1zm3 0h-2.5v1.5H16v1.5h-1.5v-1.5h-1v-4.5H16v1.5h-1.5v1.5zM9 10.5H7.5v4H9c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5zm1 1.5v1h-1v-1h1zm2-1.5h-1v4h1c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1zm-.5 1h.5v2h-.5v-2z"/>
          </g>
        );"""
content = content.replace(old_2, new_2)

# Add to PRESET_LOGO_BRAND_COLORS
old_3 = """  Yelp: "#FF1A1A"
};"""
new_3 = """  Yelp: "#FF1A1A",
  Docs: "#4285F4",
  PDF: "#F40F02"
};"""
content = content.replace(old_3, new_3)

# Add to iconSvgs
old_4 = """    ScanMe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" stroke="${color}" stroke-width="2" fill="none" /><text x="12" y="11.5" font-size="4.5" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">SCAN</text><text x="12" y="17" font-size="4.5" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">ME</text></svg>`
  };"""
new_4 = """    ScanMe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" stroke="${color}" stroke-width="2" fill="none" /><text x="12" y="11.5" font-size="4.5" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">SCAN</text><text x="12" y="17" font-size="4.5" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">ME</text></svg>`,
    Docs: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818v1.364zm0-3.273H7.091V9.273h9.818v1.363zM14.727 6h6l-6-6v6z"/></svg>`,
    PDF: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5v3H8v-3h1.5zm3.5 1.5c0 1.1-.9 2-2 2h-1.5v-5H11c1.1 0 2 .9 2 2v1zm3 0h-2.5v1.5H16v1.5h-1.5v-1.5h-1v-4.5H16v1.5h-1.5v1.5zM9 10.5H7.5v4H9c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5zm1 1.5v1h-1v-1h1zm2-1.5h-1v4h1c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1zm-.5 1h.5v2h-.5v-2z"/></svg>`
  };"""
content = content.replace(old_4, new_4)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Docs and PDF to SvgIcons.tsx")
