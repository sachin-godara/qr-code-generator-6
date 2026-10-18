import { dev } from 'astro';

console.log('Starting Astro dev server...');
const server = await dev({
  root: '.',
  server: {
    host: '0.0.0.0',
    port: 4321
  }
});
console.log('Astro dev server running at http://localhost:4321');
