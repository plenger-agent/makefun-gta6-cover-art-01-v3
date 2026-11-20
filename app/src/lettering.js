// Lettering: the two-part cover title the genre is known for — a huge
// sunset-chrome block title with a black outline and a hard 3D extrude, and a
// neon script subtitle glowing across its lower edge. The block title is
// built on an offscreen plate first so the stripes, outline and extrude stay
// crisp at every post size, then stamped onto the cover by its centre.

export const TITLE_FONT = 'Anton';
export const SCRIPT_FONT = 'Pacifico';

// Sunset chrome: bands of colour from pale gold at the top to deep magenta at
// the baseline, the striped gradient of an eighties beach poster.
const CHROME_STOPS = [
  [0, '#fff3b0'],
  [0.22, '#ffd23f'],
  [0.42, '#ff8c42'],
  [0.6, '#ff5e7a'],
  [0.78, '#c93a92'],
  [1, '#5b2a9d'],
];

function fitFontSize(ctx, text, fontFamily, maxWidth, startSize) {
  let size = startSize;
  ctx.font = `${size}px ${fontFamily}`;
  const width = ctx.measureText(text).width;
  if (width > maxWidth) size = Math.floor(size * (maxWidth / width));
  ctx.font = `${size}px ${fontFamily}`;
  return size;
}

// Builds the block title plate: black outline, striped chrome fill, thin
// darker pinstripes across the letters. Returns the plate, the font size and
// the glyph height (the part of the plate the letters themselves occupy).
export function buildCoverTitle({ title, frameWidth, frameHeight, scale = 1 }) {
  const text = title.toUpperCase();
  const scratch = document.createElement('canvas').getContext('2d');
  const size = fitFontSize(scratch, text, TITLE_FONT, frameWidth * 0.96, frameHeight * 0.335 * scale);
  const pad = Math.ceil(size * 0.2);
  const plate = document.createElement('canvas');
  plate.width = Math.ceil(scratch.measureText(text).width) + pad * 2;
  plate.height = Math.ceil(size * 1.18) + pad * 2;
  const ctx = plate.getContext('2d');
  ctx.font = `${size}px ${TITLE_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cx = plate.width / 2;
  const cy = plate.height / 2;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#0a0510';
  ctx.lineWidth = size * 0.16;
  ctx.strokeText(text, cx, cy);
  const chrome = ctx.createLinearGradient(0, cy - size * 0.55, 0, cy + size * 0.55);
  for (const [stop, colour] of CHROME_STOPS) chrome.addColorStop(stop, colour);
  ctx.fillStyle = chrome;
  ctx.fillText(text, cx, cy);
  // Pinstripes: darker hairlines across the fill, kept inside the letters.
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = 'rgba(40, 4, 30, 0.28)';
  const stripeGap = Math.max(5, size * 0.13);
  for (let y = cy - size * 0.55; y < cy + size * 0.55; y += stripeGap) {
    ctx.fillRect(0, y, plate.width, Math.max(1.4, size * 0.028));
  }
  ctx.restore();
  return { plate, size, glyphHeight: size * 0.74 };
}

// A solid dark silhouette of the plate, used for the extrude stack.
function silhouetteOf(plate, colour) {
  const copy = document.createElement('canvas');
  copy.width = plate.width;
  copy.height = plate.height;
  const ctx = copy.getContext('2d');
  ctx.drawImage(plate, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, copy.width, copy.height);
  return copy;
}

// Stamps a built title plate centred at (cx, centerY): five dark silhouette
// steps down-right for the extrude, then the chrome plate on top.
export function drawCoverTitle(ctx, { plate, cx, centerY, frameHeight }) {
  const shadow = silhouetteOf(plate, '#2a0714');
  const x = cx - plate.width / 2;
  const y = centerY - plate.height / 2;
  const depth = Math.max(3, frameHeight * 0.013);
  for (let i = 5; i >= 1; i--) {
    ctx.drawImage(shadow, x + (depth * i) / 5, y + (depth * i) / 5);
  }
  ctx.drawImage(plate, x, y);
}

// The neon script subtitle: a pink glow pass under a pale core, tilted a few
// degrees so it leans across the block title like a hand-painted sign.
export function drawScriptSubtitle(ctx, { text, cx, y, frameWidth }) {
  if (!text) return 0;
  const scratch = document.createElement('canvas').getContext('2d');
  const size = fitFontSize(scratch, text, SCRIPT_FONT, frameWidth * 0.62, frameWidth * 0.052);
  ctx.save();
  ctx.translate(cx, y);
  ctx.rotate(-0.035);
  ctx.font = `${size}px ${SCRIPT_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff2ea6';
  ctx.shadowBlur = size * 0.55;
  ctx.fillStyle = '#ff5fc8';
  ctx.fillText(text, 0, 0);
  ctx.fillText(text, 0, 0);
  ctx.shadowBlur = size * 0.18;
  ctx.fillStyle = '#ffe3f4';
  ctx.fillText(text, 0, 0);
  ctx.restore();
  return size;
}
