// Generate minimal PNG icons using pure Node.js (no dependencies)
// These are solid-color placeholder icons - good enough for PWA install
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createPNG(width, height, r, g, b) {
  // Minimal valid PNG with solid color
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let c = 0xFFFFFFFF;
    const table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let cr = n;
      for (let k = 0; k < 8; k++) cr = (cr & 1) ? (0xEDB88320 ^ (cr >>> 1)) : (cr >>> 1);
      table[n] = cr;
    }
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const typeB = Buffer.from(type);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const combined = Buffer.concat([typeB, data]);
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crc32(combined));
    return Buffer.concat([len, combined, crcB]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - raw image data with zlib
  const rowSize = 1 + width * 3; // filter byte + RGB per pixel
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // no filter
    for (let x = 0; x < width; x++) {
      const offset = y * rowSize + 1 + x * 3;
      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
    }
  }

  // Simple zlib deflate (store method - no compression)
  const blocks = [];
  let pos = 0;
  const maxBlock = 65535;
  while (pos < rawData.length) {
    const remaining = rawData.length - pos;
    const blockSize = Math.min(remaining, maxBlock);
    const isLast = pos + blockSize >= rawData.length;
    const header = Buffer.alloc(5);
    header[0] = isLast ? 1 : 0;
    header.writeUInt16LE(blockSize, 1);
    header.writeUInt16LE(blockSize ^ 0xFFFF, 3);
    blocks.push(header, rawData.subarray(pos, pos + blockSize));
    pos += blockSize;
  }

  // Adler-32 checksum
  let a = 1, b2 = 0;
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521;
    b2 = (b2 + a) % 65521;
  }
  const adler = Buffer.alloc(4);
  adler.writeUInt32BE((b2 << 16) | a);

  // Zlib wrapper
  const zlibHeader = Buffer.from([0x78, 0x01]); // deflate, no dict
  const idat = Buffer.concat([zlibHeader, ...blocks, adler]);

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', iend),
  ]);
}

// Draw a nicer icon with the coffee bean shape using a pixel-level approach
function createRoastlyIcon(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let c = 0xFFFFFFFF;
    const table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let cr = n;
      for (let k = 0; k < 8; k++) cr = (cr & 1) ? (0xEDB88320 ^ (cr >>> 1)) : (cr >>> 1);
      table[n] = cr;
    }
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const typeB = Buffer.from(type);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const combined = Buffer.concat([typeB, data]);
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crc32(combined));
    return Buffer.concat([len, combined, crcB]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = 1 + size * 3;
  const rawData = Buffer.alloc(rowSize * size);

  const cx = size / 2, cy = size * 0.46;
  const rx = size * 0.14, ry = size * 0.19;
  const bg = [44, 62, 53]; // #2C3E35
  const accent = [184, 101, 42]; // #B8652A
  const lineW = Math.max(2, size * 0.01);

  for (let y = 0; y < size; y++) {
    rawData[y * rowSize] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const offset = y * rowSize + 1 + x * 3;

      // Start with background
      let pr = bg[0], pg = bg[1], pb = bg[2];

      // Check if on ellipse border
      const ex = (x - cx) / rx;
      const ey = (y - cy) / ry;
      const dist = Math.sqrt(ex * ex + ey * ey);

      if (Math.abs(dist - 1) < lineW / Math.min(rx, ry)) {
        pr = accent[0]; pg = accent[1]; pb = accent[2];
      }

      // Center crease line of the bean
      const normY = (y - (cy - ry)) / (2 * ry);
      if (normY > 0.05 && normY < 0.95) {
        const curveX = cx - Math.sin(normY * Math.PI) * size * 0.04;
        if (Math.abs(x - curveX) < lineW && dist < 1) {
          pr = accent[0]; pg = accent[1]; pb = accent[2];
        }
      }

      rawData[offset] = pr;
      rawData[offset + 1] = pg;
      rawData[offset + 2] = pb;
    }
  }

  // Zlib store
  const blocks = [];
  let pos = 0;
  const maxBlock = 65535;
  while (pos < rawData.length) {
    const remaining = rawData.length - pos;
    const blockSize = Math.min(remaining, maxBlock);
    const isLast = pos + blockSize >= rawData.length;
    const header = Buffer.alloc(5);
    header[0] = isLast ? 1 : 0;
    header.writeUInt16LE(blockSize, 1);
    header.writeUInt16LE(blockSize ^ 0xFFFF, 3);
    blocks.push(header, rawData.subarray(pos, pos + blockSize));
    pos += blockSize;
  }

  let a = 1, b2 = 0;
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521;
    b2 = (b2 + a) % 65521;
  }
  const adlerVal = ((b2 & 0xFFFF) << 16) | (a & 0xFFFF);
  const adler = Buffer.alloc(4);
  adler.writeUInt32BE(adlerVal >>> 0);

  const zlibHeader = Buffer.from([0x78, 0x01]);
  const idat = Buffer.concat([zlibHeader, ...blocks, adler]);
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', iend),
  ]);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');

for (const size of [192, 512]) {
  const png = createRoastlyIcon(size);
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png);
  console.log(`✅ icon-${size}.png (${(png.length / 1024).toFixed(1)} KB)`);
}

// Maskable = same
fs.copyFileSync(path.join(outDir, 'icon-512.png'), path.join(outDir, 'icon-maskable-512.png'));
console.log('✅ icon-maskable-512.png');

// Apple touch icon 180px
const apple = createRoastlyIcon(180);
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), apple);
console.log(`✅ apple-touch-icon.png (${(apple.length / 1024).toFixed(1)} KB)`);

console.log('\nDone! Icons generated in public/icons/');
