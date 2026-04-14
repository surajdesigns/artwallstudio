import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const OUTPUT_PATH = path.join(__dirname, 'public', 'images', 'home', 'visualizer-after.webp');

  // A very nice interior photography image showing a framed painting on a wall
  const imageUrl = "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=100&w=1600";
  
  try {
    console.log('Downloading image...');
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Converting to WebP and saving to', OUTPUT_PATH);
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 90, force: true })
      .toFile(OUTPUT_PATH);

    console.log('✅ visualizer-after.webp generated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
