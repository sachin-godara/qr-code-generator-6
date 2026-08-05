import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_URL = "http://localhost:8000/api/generator/generate";
const OUTPUT_DIR = path.resolve('./public/previews/templates');

import { PRESET_TEMPLATES } from './src/data/templates.ts';

async function generate() {
    let count = 0;
    for (const tmpl of PRESET_TEMPLATES) {
        const clean_name = tmpl.name.toLowerCase().replace(/ /g, "_");
        const filename = `${clean_name}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        const payload = {
            data: "https://qrstream.com",
            error_correction: "Q",
            quiet_zone: 4,
            box_size: 10,
            ...tmpl.settings
        };
        
        // Map the new logo_icon_style to the backend properties so the preview PNGs have the right background!
        if (payload.logo_icon_style === "badge") {
            payload.logo_card_shape = "Rounded Square";
            payload.logo_bg_color = payload.preset_logo_color || "#000000"; // Background is the brand color
            payload.preset_logo_color = "#ffffff"; // SVG icon is white
        } else if (payload.logo_icon_style === "duotone") {
            payload.logo_card_shape = "Rounded Square";
            // duotone is brand color with 0x26 alpha.
            // As a mock for the preview, we'll use a white background or the qr bg_color.
            payload.logo_bg_color = payload.bg_color || "#ffffff"; 
        } else if (payload.logo_icon_style === "glyph") {
            payload.logo_card_shape = "None";
        }

        try {
            const resp = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                const buffer = await resp.arrayBuffer();
                fs.writeFileSync(filepath, Buffer.from(buffer));
                console.log(`[OK] ${filename}`);
                count++;
                await new Promise(r => setTimeout(r, 100)); // Prevent 429 Rate Limit
            } else {
                console.error(`[FAIL] ${filename} - ${resp.status}`);
            }
        } catch (e) {
            console.error(`[ERROR] ${filename} - ${e.message}`);
        }
    }
    console.log(`Done generating ${count} templates.`);
}

generate();
