// Poster furniture: everything on a genre cover that is not a photo or the
// title — the header strip with its stars and pull-quote, the character tag
// on every panel, the seal, the starburst, the wanted plate, the tagline
// ribbon with its palms, the credits microline and the barcode. Every piece
// is drawn from the cover's editable text fields, so what the screenshots
// show is exactly what the app prints.

function drawStar(ctx, cx, cy, radius, colour) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
  ctx.restore();
}

export function drawStarRow(ctx, { x, y, size, count = 5, colour = '#ffcf3f' }) {
  for (let i = 0; i < count; i++) {
    drawStar(ctx, x + size * 0.62 + i * size * 1.24, y, size * 0.58, colour);
  }
  return count * size * 1.24;
}

// A small palm silhouette for the tagline ribbon: one curved trunk and five
// fronds, drawn as strokes so it reads at any size.
export function drawPalm(ctx, { x, y, height, colour }) {
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.lineCap = 'round';
  const trunkWidth = Math.max(2, height * 0.07);
  ctx.lineWidth = trunkWidth;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + height * 0.1, y - height * 0.55, x + height * 0.3, y - height * 0.92);
  ctx.stroke();
  const topX = x + height * 0.3;
  const topY = y - height * 0.92;
  ctx.lineWidth = Math.max(1.6, height * 0.05);
  for (const angle of [-2.9, -2.35, -1.85, -1.3, -0.75]) {
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(
      topX + Math.cos(angle) * height * 0.3,
      topY + Math.sin(angle) * height * 0.3 - height * 0.08,
      topX + Math.cos(angle) * height * 0.46,
      topY + Math.sin(angle) * height * 0.46 + height * 0.13,
    );
    ctx.stroke();
  }
  ctx.restore();
}

// Top strip: stars + pull-quote on the left, the edition plate on the right,
// over a soft dark band so it reads over any photo.
export function drawHeaderStrip(ctx, { width, height, quote, source, edition }) {
  const bandH = height * 0.078;
  const band = ctx.createLinearGradient(0, 0, 0, bandH * 1.5);
  band.addColorStop(0, 'rgba(5, 2, 10, 0.82)');
  band.addColorStop(1, 'rgba(5, 2, 10, 0)');
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, width, bandH * 1.5);
  const starSize = height * 0.02;
  const starsWidth = drawStarRow(ctx, { x: width * 0.018, y: bandH * 0.52, size: starSize });
  ctx.save();
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fdf6e3';
  ctx.font = `${Math.round(height * 0.027)}px Anton`;
  ctx.textAlign = 'left';
  const quoteX = width * 0.018 + starsWidth + width * 0.012;
  ctx.fillText(`“${quote}”`, quoteX, bandH * 0.52);
  const quoteWidth = ctx.measureText(`“${quote}”`).width;
  ctx.font = `${Math.round(height * 0.017)}px Anton`;
  ctx.fillStyle = '#ffb3d9';
  ctx.fillText(`— ${source}`, quoteX + quoteWidth + width * 0.01, bandH * 0.54);
  // Edition plate: a bordered box at the right end of the strip.
  const plateText = edition;
  ctx.font = `${Math.round(height * 0.024)}px Anton`;
  const plateW = ctx.measureText(plateText).width + width * 0.024;
  const plateH = bandH * 0.62;
  const plateX = width - plateW - width * 0.016;
  const plateY = bandH * 0.19;
  ctx.strokeStyle = '#ffcf3f';
  ctx.lineWidth = Math.max(2, height * 0.0022);
  ctx.strokeRect(plateX, plateY, plateW, plateH);
  ctx.fillStyle = '#ffcf3f';
  ctx.textAlign = 'center';
  ctx.fillText(plateText, plateX + plateW / 2, plateY + plateH * 0.54);
  ctx.restore();
}

// The character tag: a name chip at a panel's top-left corner with the
// place · time · trait micro-line under the name. This is the genre's cast
// convention — every panel names its character.
export function drawCharacterTag(ctx, { x, y, maxWidth, name, line, frameHeight }) {
  if (!name) return;
  const nameSize = Math.round(frameHeight * 0.03);
  const lineSize = Math.round(frameHeight * 0.0155);
  ctx.save();
  ctx.font = `${nameSize}px Anton`;
  const nameWidth = ctx.measureText(name).width;
  const padX = frameHeight * 0.014;
  // The micro-line shrinks to fit its panel rather than running off the
  // chip's edge on a narrow panel.
  let lineFontSize = lineSize;
  let lineWidth = 0;
  if (line) {
    ctx.font = `600 ${lineFontSize}px system-ui, sans-serif`;
    lineWidth = ctx.measureText(line).width;
    const room = maxWidth - padX * 2;
    if (lineWidth > room) {
      lineFontSize = Math.max(9, Math.floor(lineFontSize * (room / lineWidth)));
      ctx.font = `600 ${lineFontSize}px system-ui, sans-serif`;
      lineWidth = ctx.measureText(line).width;
    }
  }
  const chipW = Math.min(maxWidth, Math.max(nameWidth, lineWidth) + padX * 2);
  const chipH = frameHeight * (line ? 0.082 : 0.052);
  ctx.fillStyle = 'rgba(5, 2, 10, 0.78)';
  ctx.fillRect(x, y, chipW, chipH);
  ctx.fillStyle = '#ffcf3f';
  ctx.fillRect(x, y, frameHeight * 0.006, chipH);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = `${nameSize}px Anton`;
  ctx.fillText(name, x + padX, y + frameHeight * 0.04);
  if (line) {
    ctx.fillStyle = '#ffd9ec';
    ctx.font = `600 ${lineFontSize}px system-ui, sans-serif`;
    ctx.fillText(line, x + padX, y + frameHeight * 0.068);
  }
  ctx.restore();
}

// The gold seal: a scalloped medallion with two lines of type.
export function drawSeal(ctx, { cx, cy, radius, topText, bottomText }) {
  ctx.save();
  ctx.beginPath();
  const teeth = 18;
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.88;
    const a = (Math.PI / teeth) * i;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#e8a91c';
  ctx.fill();
  ctx.strokeStyle = '#7a5200';
  ctx.lineWidth = radius * 0.045;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.74, 0, Math.PI * 2);
  ctx.strokeStyle = '#fff3b0';
  ctx.stroke();
  ctx.fillStyle = '#3a2400';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.round(radius * 0.34)}px Anton`;
  ctx.fillText(topText, cx, cy - radius * 0.2);
  ctx.font = `${Math.round(radius * 0.3)}px Anton`;
  ctx.fillText(bottomText, cx, cy + radius * 0.24);
  ctx.restore();
}

// The starburst flash: a spiked burst with a short shout inside.
export function drawStarburst(ctx, { cx, cy, radius, lines }) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.16);
  ctx.beginPath();
  const spikes = 12;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.78;
    const a = (Math.PI / spikes) * i;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#ff2e88';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = radius * 0.05;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const size = radius * 0.36;
  ctx.font = `${Math.round(size)}px Anton`;
  lines.forEach((line, i) => {
    ctx.fillText(line, 0, (i - (lines.length - 1) / 2) * size * 1.08);
  });
  ctx.restore();
}

// The wanted plate: the HUD corner box with its word and heat stars. Its
// width is capped against the frame width so it never crowds the script
// subtitle on the narrow portrait frame.
export function drawWantedPlate(ctx, { x, y, word, frameHeight, frameWidth }) {
  const w = Math.min(frameHeight * 0.21, frameWidth * 0.19);
  const h = frameHeight * 0.075;
  ctx.save();
  ctx.fillStyle = 'rgba(5, 2, 10, 0.8)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#fdf6e3';
  ctx.lineWidth = Math.max(1.6, frameHeight * 0.002);
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#fdf6e3';
  ctx.font = `${Math.round(frameHeight * 0.024)}px Anton`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word, x + w / 2, y + h * 0.3);
  drawStarRow(ctx, { x: x + w / 2 - frameHeight * 0.052, y: y + h * 0.68, size: frameHeight * 0.016 });
  ctx.restore();
}

// The tagline ribbon: a dark strip across the frame with a palm at each end
// and the tagline lettered along it.
export function drawTaglineRibbon(ctx, { width, y, height, tagline }) {
  ctx.save();
  ctx.fillStyle = 'rgba(8, 3, 14, 0.88)';
  ctx.fillRect(0, y, width, height);
  ctx.fillStyle = '#ff5e7a';
  ctx.fillRect(0, y, width, Math.max(2, height * 0.07));
  ctx.fillRect(0, y + height - Math.max(2, height * 0.07), width, Math.max(2, height * 0.07));
  drawPalm(ctx, { x: width * 0.03, y: y + height * 0.92, height: height * 0.8, colour: '#ffcf3f' });
  drawPalm(ctx, { x: width * 0.945, y: y + height * 0.92, height: height * 0.8, colour: '#ffcf3f' });
  ctx.fillStyle = '#fdf6e3';
  ctx.font = `${Math.round(height * 0.42)}px Anton`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagline, width / 2, y + height * 0.54);
  ctx.restore();
}

// The credits microline along the very bottom of the cover. The font shrinks
// to fit when a long cast line would otherwise run under the corner
// furniture on a narrow frame.
export function drawCreditsLine(ctx, { width, y, credits, frameHeight }) {
  ctx.save();
  ctx.fillStyle = 'rgba(253, 246, 227, 0.85)';
  let size = Math.round(frameHeight * 0.0145);
  ctx.font = `${size}px system-ui, sans-serif`;
  const textWidth = ctx.measureText(credits).width;
  if (textWidth > width * 0.6) {
    size = Math.max(9, Math.floor(size * ((width * 0.6) / textWidth)));
    ctx.font = `${size}px system-ui, sans-serif`;
  }
  // Centred in the clear water between COMING SOON on the left and the
  // barcode on the right, never underneath either.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(credits, width * 0.535, y);
  ctx.restore();
}

// A barcode block with its number, bottom-right corner furniture.
export function drawBarcode(ctx, { x, y, width, height, code }) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#111111';
  let seed = 7;
  let bx = x + width * 0.06;
  const barArea = width * 0.88;
  while (bx < x + barArea) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const barW = 1 + (seed % 4);
    if (seed % 3 !== 0) ctx.fillRect(bx, y + height * 0.1, barW, height * 0.62);
    bx += barW + 1 + (seed % 3);
  }
  ctx.font = `${Math.round(height * 0.2)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(code, x + width / 2, y + height * 0.86);
  ctx.restore();
}

export function drawComingSoon(ctx, { x, y, frameHeight }) {
  ctx.save();
  ctx.fillStyle = '#fdf6e3';
  ctx.font = `${Math.round(frameHeight * 0.02)}px Anton`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('C O M I N G   S O O N', x, y);
  ctx.restore();
}
