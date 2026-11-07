// Generates every PWA icon from the Collage logo: the mark as a taped-on sticker on yellow.
// Run with: node scripts/generate-icons.js
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
const VERSION = 'v3';

const YELLOW = '#FFD84D';
const INK = '#1E1E1E';

const markPng = await sharp(path.join(publicDir, 'brand/mark.png'))
  .resize({ width: 360 })
  .png()
  .toBuffer();
const markData = `data:image/png;base64,${markPng.toString('base64')}`;
const MARK_RATIO = 332 / 363;

/** A 512×512 canvas: yellow background (rounded or full-bleed) with the tilted logo sticker. */
const iconSvg = ({ rounded, stickerWidth }) => {
  const stickerHeight = Math.round(stickerWidth * 0.92);
  const x = 256 - stickerWidth / 2;
  const y = 256 - stickerHeight / 2;
  const markWidth = Math.round(stickerWidth * 0.72);
  const markHeight = Math.round(markWidth * MARK_RATIO);
  const shadow = Math.round(stickerWidth * 0.045);
  const stroke = Math.round(stickerWidth * 0.036);
  const radius = Math.round(stickerWidth * 0.2);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="${YELLOW}"/>
    <g transform="rotate(-6 256 256)">
      <rect x="${x + shadow}" y="${y + shadow}" width="${stickerWidth}" height="${stickerHeight}" rx="${radius}" fill="${INK}"/>
      <rect x="${x}" y="${y}" width="${stickerWidth}" height="${stickerHeight}" rx="${radius}" fill="#FFFFFF" stroke="${INK}" stroke-width="${stroke}"/>
      <image x="${256 - markWidth / 2}" y="${256 - markHeight / 2}" width="${markWidth}" height="${markHeight}" href="${markData}" xlink:href="${markData}"/>
    </g>
  </svg>`;
};

const render = (svg, size, out) =>
  sharp(Buffer.from(svg), { density: 144 }).resize(size, size).png({ compressionLevel: 9 }).toFile(out);

// "any": rounded corners, sticker fills most of the icon.
const anySvg = iconSvg({ rounded: true, stickerWidth: 350 });
// "maskable": full bleed, sticker inside the central safe circle (radius 40% of the icon).
const maskableSvg = iconSvg({ rounded: false, stickerWidth: 280 });
// Apple adds its own rounded corners and needs an opaque image.
const appleSvg = iconSvg({ rounded: false, stickerWidth: 330 });

fs.mkdirSync(iconsDir, { recursive: true });

for (const size of [48, 72, 96, 128, 144, 192, 384, 512]) {
  await render(anySvg, size, path.join(iconsDir, `qiventra-icon-${VERSION}-${size}.png`));
}
for (const size of [192, 512]) {
  await render(maskableSvg, size, path.join(iconsDir, `qiventra-maskable-${VERSION}-${size}.png`));
}
await render(appleSvg, 180, path.join(iconsDir, `qiventra-apple-touch-${VERSION}-180.png`));

// Favicon: at 32px only the plain mark stays readable.
await sharp(path.join(publicDir, 'brand/mark.png'))
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(iconsDir, `qiventra-favicon-${VERSION}-32.png`));

// Legacy unversioned names, kept for anything that still links to them.
await render(anySvg, 192, path.join(publicDir, 'pwa-192x192.png'));
await render(anySvg, 512, path.join(publicDir, 'pwa-512x512.png'));
await render(maskableSvg, 512, path.join(publicDir, 'pwa-maskable-512x512.png'));
await render(appleSvg, 180, path.join(publicDir, 'apple-touch-icon.png'));

console.log(`PWA icons (${VERSION}) created from public/brand/mark.png`);
