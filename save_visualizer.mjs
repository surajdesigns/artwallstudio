import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IN_DIR = path.join(__dirname, 'public', 'visualiser');
const OUT_DIR = path.join(__dirname, 'public', 'images', 'home');

const processImage = async (inFile, outFile) => {
  const inputPath = path.join(IN_DIR, inFile);
  const outputPath = path.join(OUT_DIR, outFile);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Image not found: ${inputPath}`);
    return;
  }

  await sharp(inputPath)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(outputPath);
    
  console.log(`✅ Compressed and saved: ${outFile}`);
};

async function main() {
  await processImage('visualizer-before-raw.png', 'visualizer-before.webp');
  await processImage('visualizer-after-raw.jpeg', 'visualizer-after.webp');
  console.log('All done!');
}

main().catch(console.error);
