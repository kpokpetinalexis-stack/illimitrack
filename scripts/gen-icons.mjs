import { PNG } from 'pngjs';
import { writeFileSync, mkdirSync } from 'fs';

// #111827 background with a simple signal-bars icon
function createIcon(size) {
  const png = new PNG({ width: size, height: size });

  // Background color #111827
  const bg = { r: 17, g: 24, b: 39 };
  // Accent color (white)
  const fg = { r: 255, g: 255, b: 255 };

  // Fill background with rounded feel (just fill all, CSS handles rounding)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Rounded corners
      const cx = x - size / 2, cy = y - size / 2;
      const radius = size * 0.22;
      const corner = size / 2 - radius;
      const inCorner =
        Math.abs(cx) > corner && Math.abs(cy) > corner &&
        Math.sqrt((Math.abs(cx) - corner) ** 2 + (Math.abs(cy) - corner) ** 2) > radius;

      if (inCorner) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0; // transparent
      } else {
        png.data[idx] = bg.r;
        png.data[idx + 1] = bg.g;
        png.data[idx + 2] = bg.b;
        png.data[idx + 3] = 255;
      }
    }
  }

  // Draw 4 signal bars (bottom-aligned, center of icon)
  const bars = 4;
  const barW = Math.round(size * 0.07);
  const gap = Math.round(size * 0.04);
  const totalW = bars * barW + (bars - 1) * gap;
  const startX = Math.round((size - totalW) / 2);
  const baseY = Math.round(size * 0.72);
  const maxH = Math.round(size * 0.42);

  for (let b = 0; b < bars; b++) {
    const barH = Math.round(maxH * ((b + 1) / bars));
    const bx = startX + b * (barW + gap);
    const by = baseY - barH;
    for (let y = by; y < baseY; y++) {
      for (let x = bx; x < bx + barW; x++) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
          const idx = (y * size + x) * 4;
          if (png.data[idx + 3] > 0) { // only on non-transparent pixels
            png.data[idx] = fg.r;
            png.data[idx + 1] = fg.g;
            png.data[idx + 2] = fg.b;
            png.data[idx + 3] = 255;
          }
        }
      }
    }
  }

  return PNG.sync.write(png);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', createIcon(192));
writeFileSync('public/icons/icon-512.png', createIcon(512));
console.log('Icons generated: public/icons/icon-192.png, public/icons/icon-512.png');
