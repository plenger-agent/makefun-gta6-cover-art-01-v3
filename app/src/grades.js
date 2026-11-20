// Colour grades: every cover is unified by one grade, the way one photo shoot
// is unified by one film stock. A grade is a canvas filter chain applied while
// a panel photo is drawn, plus a tint wash laid over the whole frame, so the
// bundled samples and a visitor's own photos read as a single shoot.

export const GRADES = [
  {
    id: 'vice-sunset',
    label: 'Vice Sunset',
    filter: 'saturate(1.22) contrast(1.06) brightness(1.03) sepia(0.16) hue-rotate(-6deg)',
    washTop: 'rgba(255, 94, 58, 0.10)',
    washBottom: 'rgba(146, 22, 116, 0.14)',
    blend: 'soft-light',
  },
  {
    id: 'neon-night',
    label: 'Neon Night',
    filter: 'saturate(1.3) contrast(1.14) brightness(0.96) hue-rotate(4deg)',
    washTop: 'rgba(18, 190, 220, 0.10)',
    washBottom: 'rgba(214, 28, 160, 0.16)',
    blend: 'soft-light',
  },
  {
    id: 'golden-hour',
    label: 'Golden Hour',
    filter: 'saturate(1.12) contrast(1.02) brightness(1.08) sepia(0.3) hue-rotate(-10deg)',
    washTop: 'rgba(255, 176, 66, 0.14)',
    washBottom: 'rgba(255, 94, 58, 0.10)',
    blend: 'soft-light',
  },
  {
    id: 'teal-dusk',
    label: 'Teal Dusk',
    filter: 'saturate(1.05) contrast(1.1) brightness(0.99) hue-rotate(10deg)',
    washTop: 'rgba(10, 140, 150, 0.14)',
    washBottom: 'rgba(8, 40, 90, 0.16)',
    blend: 'soft-light',
  },
  {
    id: 'rose-noir',
    label: 'Rose Noir',
    filter: 'saturate(0.92) contrast(1.22) brightness(0.97) sepia(0.12) hue-rotate(-14deg)',
    washTop: 'rgba(120, 10, 40, 0.12)',
    washBottom: 'rgba(10, 4, 18, 0.22)',
    blend: 'multiply',
  },
  {
    id: 'chrome-mono',
    label: 'Chrome Mono',
    filter: 'grayscale(0.72) contrast(1.24) brightness(1.04)',
    washTop: 'rgba(190, 200, 215, 0.08)',
    washBottom: 'rgba(20, 24, 34, 0.18)',
    blend: 'soft-light',
  },
];

export function gradeById(id) {
  return GRADES.find((grade) => grade.id === id) ?? GRADES[0];
}

// Extra punch the sliders add on top of the chosen grade: saturation and
// contrast scale around the grade's own chain.
export function filterFor(grade, sliders) {
  const sat = (sliders.saturation / 100).toFixed(2);
  const con = (sliders.contrast / 100).toFixed(2);
  return `${grade.filter} saturate(${sat}) contrast(${con})`;
}

// A soft vertical wash in the grade's two tints, laid over the panels before
// the lettering goes on.
export function paintGradeWash(ctx, width, height, grade) {
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, grade.washTop);
  wash.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
  wash.addColorStop(1, grade.washBottom);
  ctx.save();
  ctx.globalCompositeOperation = grade.blend;
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Deterministic film grain: one shared noise tile, stamped at low alpha so a
// whole cover shares one grain field.
let grainTile = null;

function buildGrainTile() {
  const tile = document.createElement('canvas');
  tile.width = 180;
  tile.height = 180;
  const tctx = tile.getContext('2d');
  const image = tctx.createImageData(tile.width, tile.height);
  let seed = 20261120;
  for (let i = 0; i < image.data.length; i += 4) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const value = 96 + (seed % 128);
    image.data[i] = value;
    image.data[i + 1] = value;
    image.data[i + 2] = value;
    image.data[i + 3] = 255;
  }
  tctx.putImageData(image, 0, 0);
  return tile;
}

export function paintGrain(ctx, width, height, amount) {
  if (amount <= 0) return;
  if (!grainTile) grainTile = buildGrainTile();
  ctx.save();
  ctx.globalAlpha = Math.min(0.34, amount / 260);
  ctx.globalCompositeOperation = 'overlay';
  const pattern = ctx.createPattern(grainTile, 'repeat');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// A gentle darkening toward the corners so the lettering sits on the art.
export function paintVignette(ctx, width, height, amount) {
  if (amount <= 0) return;
  const radius = Math.hypot(width, height) / 2;
  const shade = ctx.createRadialGradient(
    width / 2, height / 2, radius * 0.42,
    width / 2, height / 2, radius,
  );
  shade.addColorStop(0, 'rgba(6, 2, 10, 0)');
  shade.addColorStop(1, `rgba(6, 2, 10, ${Math.min(0.62, amount / 130)})`);
  ctx.save();
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
