// The cover composer: draws one finished cover onto a canvas at full post
// size — graded photo panels with character tags, the header strip, the seal
// and starburst, the chrome title with its neon script, the wanted plate, the
// tagline ribbon, credits and barcode. The editor previews with it and the
// export buttons ship exactly what it draws.

import { gradeById, filterFor, paintGradeWash, paintGrain, paintVignette } from './grades.js';
import { layoutById, sizeById } from './layouts.js';
import { buildCoverTitle, drawCoverTitle, drawScriptSubtitle } from './lettering.js';
import {
  drawHeaderStrip, drawCharacterTag, drawSeal, drawStarburst,
  drawWantedPlate, drawTaglineRibbon, drawCreditsLine, drawBarcode, drawComingSoon,
} from './furniture.js';

// Draws one photo into a panel rectangle, cover-fit: the photo fills the
// panel at its zoom, centred, then shifted by the panel's offsets (in
// fractions of the panel size, -1..1).
function drawPanelPhoto(ctx, img, rect, panel, filter) {
  const zoom = panel.zoom || 1;
  const scale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight) * zoom;
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = rect.x + (rect.w - dw) / 2 + (panel.offX || 0) * rect.w * 0.4;
  const dy = rect.y + (rect.h - dh) / 2 + (panel.offY || 0) * rect.h * 0.4;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.filter = filter;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
  ctx.filter = 'none';
  // Keylines: a dark outer rule and a faint light inner rule, the printed
  // poster edge between panels.
  ctx.save();
  ctx.strokeStyle = 'rgba(4, 1, 8, 0.92)';
  ctx.lineWidth = Math.max(3, rect.w * 0.006);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeStyle = 'rgba(255, 240, 210, 0.16)';
  ctx.lineWidth = Math.max(1, rect.w * 0.002);
  ctx.strokeRect(rect.x + 3, rect.y + 3, rect.w - 6, rect.h - 6);
  ctx.restore();
}

export function renderCover(canvas, state, library) {
  const size = sizeById(state.sizeId);
  const layout = layoutById(state.layoutId);
  const grade = gradeById(state.gradeId);
  const W = size.width;
  const H = size.height;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0a0510';
  ctx.fillRect(0, 0, W, H);

  const gutter = Math.max(3, W * 0.0035);
  const filter = filterFor(grade, state.sliders);
  const rects = layout.panels.map((panel) => ({
    x: panel.x * W + gutter / 2,
    y: panel.y * H + gutter / 2,
    w: panel.w * W - gutter,
    h: panel.h * H - gutter,
  }));
  rects.forEach((rect, i) => {
    const panel = state.panels[i];
    const entry = panel && library.get(panel.photoId);
    if (entry && entry.img && entry.img.naturalWidth) {
      drawPanelPhoto(ctx, entry.img, rect, panel, filter);
    } else {
      ctx.fillStyle = '#1b0f22';
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
  });

  paintGradeWash(ctx, W, H, grade);
  paintVignette(ctx, W, H, state.sliders.vignette);

  // The title plate is built before the tags are placed: a character tag is
  // only ever drawn where it fits whole — under the header strip and above
  // the title's glyph band — never half-cut by the lettering.
  const titleArt = buildCoverTitle({
    title: state.title, frameWidth: W, frameHeight: H,
    scale: state.sliders.titleScale / 100,
  });
  const glyphBottom = H * 0.862;
  const glyphTop = glyphBottom - titleArt.glyphHeight - titleArt.size * 0.17;
  const headerClear = H * 0.094;

  const stickerTags = [];
  rects.forEach((rect, i) => {
    const panel = state.panels[i];
    if (!panel || !panel.tagName) return;
    let tagY = rect.y + H * 0.01;
    if (rect.y < H * 0.02) tagY = Math.max(tagY, headerClear);
    const fullChipH = H * 0.082;
    const nameChipH = H * 0.052;
    const tag = {
      x: rect.x + W * 0.01, y: tagY, maxWidth: rect.w * 0.96,
      name: panel.tagName, line: panel.tagLine, frameHeight: H,
    };
    if (tagY + fullChipH <= glyphTop) {
      drawCharacterTag(ctx, tag);
    } else if (tagY + nameChipH <= glyphTop) {
      drawCharacterTag(ctx, { ...tag, line: '' });
    } else {
      // The panel lives inside the title band: its tag goes on after the
      // lettering, as a sticker over the poster's lower edge.
      stickerTags.push({ ...tag, y: rect.y + H * 0.01, line: '' });
    }
  });

  drawHeaderStrip(ctx, {
    width: W, height: H,
    quote: state.quote, source: state.quoteSource, edition: state.edition,
  });
  drawSeal(ctx, {
    cx: W * 0.945, cy: H * 0.52, radius: H * 0.058,
    topText: state.sealTop, bottomText: state.sealBottom,
  });
  drawStarburst(ctx, {
    cx: W * 0.068, cy: H * 0.315, radius: H * 0.057,
    lines: state.burstLines,
  });

  // The title block, stacked from the bottom: credits, ribbon, script, title.
  const titleCenterY = glyphBottom - titleArt.glyphHeight / 2;
  drawCoverTitle(ctx, { plate: titleArt.plate, cx: W / 2, centerY: titleCenterY, frameHeight: H });
  drawScriptSubtitle(ctx, {
    text: state.subtitle, cx: W / 2, y: glyphBottom + H * 0.016, frameWidth: W,
  });
  for (const tag of stickerTags) drawCharacterTag(ctx, tag);

  const ribbonTop = H * 0.905;
  drawWantedPlate(ctx, {
    x: W * 0.982 - Math.min(H * 0.21, W * 0.19), y: ribbonTop - H * 0.092,
    word: state.hudWord, frameHeight: H, frameWidth: W,
  });
  drawTaglineRibbon(ctx, { width: W, y: ribbonTop, height: H * 0.042, tagline: state.tagline });
  drawCreditsLine(ctx, { width: W, y: H * 0.972, credits: state.credits, frameHeight: H });
  drawBarcode(ctx, {
    x: W * 0.878, y: H * 0.952, width: W * 0.104, height: H * 0.04, code: state.barcode,
  });
  drawComingSoon(ctx, { x: W * 0.018, y: H * 0.97, frameHeight: H });

  paintGrain(ctx, W, H, state.sliders.grain);
  return canvas;
}

export function coverFileName(state, sizeId) {
  const slug = state.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const size = sizeById(sizeId);
  return `${slug}-${size.width}x${size.height}.png`;
}
