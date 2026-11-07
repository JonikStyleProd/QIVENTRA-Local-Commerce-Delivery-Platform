// Makes the smaller copies of the photos that cards and phones use.
// Run with: node scripts/generate-thumbnails.js
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 480;
const photosDir = path.resolve('public/photos');
const thumbsDir = path.join(photosDir, String(WIDTH));

fs.mkdirSync(thumbsDir, { recursive: true });

for (const file of fs.readdirSync(photosDir)) {
  if (!file.endsWith('.webp')) continue;
  const source = path.join(photosDir, file);
  const target = path.join(thumbsDir, file);
  await sharp(source).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 72 }).toFile(target);
  console.log(file, fs.statSync(source).size, '->', fs.statSync(target).size);
}
