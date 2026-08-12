import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./frontend/public/previews/templates');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function generateAll() {
    const m = await import('../frontend/src/data/templates.js');
    const TEMPLATES = m.TEMPLATES || m.default?.TEMPLATES || Object.values(m)[0];
    console.log('Found', TEMPLATES.length, 'templates.');
    for (const t of TEMPLATES) {
        const name = t.name.toLowerCase().replace(/ /g, '_');
        console.log(`Generating ${name}...`);
        const settings = { ...t.settings, data: 'https://example.com' };
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/generator/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (!response.ok) {
                console.error(`Failed to generate ${name}:`, await response.text());
                continue;
            }
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const outPath = path.join(outDir, `${name}.png`);
            fs.writeFileSync(outPath, buffer);
            console.log(`Saved ${name}.png`);
        } catch (err) {
            console.error(`Error generating ${name}:`, err);
        }
    }
    console.log("Done generating all template previews.");
}

generateAll();
