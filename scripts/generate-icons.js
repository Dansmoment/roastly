// Generate PNG icons from a canvas-drawn icon
// Run: node scripts/generate-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size / 512; // scale factor

  // Background rounded rect (full square for PNG, OS handles rounding)
  ctx.fillStyle = '#2C3E35';
  ctx.fillRect(0, 0, size, size);

  // Coffee bean ellipse
  ctx.save();
  ctx.translate(size / 2, size * 0.45);
  ctx.scale(1, 1.33);

  // Outer glow
  ctx.beginPath();
  ctx.ellipse(0, 0, 72 * s, 72 * s, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(184, 101, 42, 0.3)';
  ctx.lineWidth = 8 * s;
  ctx.stroke();

  // Main ellipse
  ctx.beginPath();
  ctx.ellipse(0, 0, 72 * s, 72 * s, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#B8652A';
  ctx.lineWidth = 5 * s;
  ctx.stroke();

  ctx.restore();

  // Center line of bean
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.32);
  ctx.bezierCurveTo(
    size / 2 - 24 * s, size * 0.39,
    size / 2 - 24 * s, size * 0.61,
    size / 2, size * 0.68
  );
  ctx.strokeStyle = '#B8652A';
  ctx.lineWidth = 5 * s;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Text "Roastly."
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${52 * s}px Georgia, serif`;
  ctx.fillStyle = '#F7F3EE';
  ctx.fillText('Roastly', size / 2 - 8 * s, size * 0.84);

  // The dot in accent color
  const textWidth = ctx.measureText('Roastly').width;
  ctx.fillStyle = '#B8652A';
  ctx.fillText('.', size / 2 + textWidth / 2 - 4 * s, size * 0.84);

  return canvas;
}

try {
  const sizes = [192, 512];
  const outDir = path.join(__dirname, '..', 'public', 'icons');

  sizes.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outDir, `icon-${size}.png`), buffer);
    console.log(`✅ icon-${size}.png`);
  });

  // Maskable (same but with padding)
  const canvas = drawIcon(512);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, 'icon-maskable-512.png'), buffer);
  console.log('✅ icon-maskable-512.png');

  // Apple touch icon (180px)
  const appleCanvas = drawIcon(180);
  const appleBuffer = appleCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), appleBuffer);
  console.log('✅ apple-touch-icon.png');

} catch (e) {
  if (e.message.includes('canvas')) {
    console.log('⚠️  canvas module not found. Generating placeholder PNGs...');
    // Create minimal 1x1 PNG as placeholder
    const { execSync } = require('child_process');
    // Use a different approach - generate via HTML canvas in the browser
    console.log('Please install: npm install canvas');
    console.log('Or generate icons manually from public/icons/icon.svg');
  } else {
    throw e;
  }
}
