// Run: node download_hero_images.mjs
// Downloads 8 varied art images into public/images/home/col-*.webp

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'public', 'images', 'home');

const IMAGES = [
  { id: 'photo-1578662996442-48f60103fc96', name: 'col-1.webp' },
  { id: 'photo-1541123437800-1bb1317badc2', name: 'col-2.webp' },
  { id: 'photo-1513519245088-0e12902e5a38', name: 'col-3.webp' },
  { id: 'photo-1579783902614-a3fb3927b6a5', name: 'col-4.webp' },
  { id: 'photo-1580136207865-c3f25c276ad3', name: 'col-5.webp' },
  { id: 'photo-1582561424760-0cecc28ad691', name: 'col-6.webp' },
  { id: 'photo-1563284687-0b165fb7bbcf', name: 'col-7.webp' },
  { id: 'photo-1615873968403-89e068629265', name: 'col-8.webp' },
];

for (const { id, name } of IMAGES) {
  const out = path.join(OUT, name);
  if (fs.existsSync(out)) { console.log(`✓ ${name} already exists`); continue; }
  try {
    const res = await fetch(`https://images.unsplash.com/${id}?w=500&q=80`);
    if (!res.ok) { console.warn(`✗ ${name}: HTTP ${res.status}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: 500 }).webp({ quality: 82 }).toFile(out);
    console.log(`✅ ${name}`);
  } catch (e) {
    console.warn(`✗ ${name}:`, e.message);
  }
}
console.log('Done!');
