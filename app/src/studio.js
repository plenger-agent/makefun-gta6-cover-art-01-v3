// Palm Fever Cover Studio — the editor. A dark three-zone studio: the photo
// rail on the left, the live cover in the middle, every control on the right.
// It opens on a finished cover, exports PNGs at the three post sizes, and
// works fully offline: photos are read from the visitor's own machine and
// never leave it. The ?shot= modes preset a cover or the editor so the maker
// can photograph the app for its screenshots.

import { SAMPLE_PHOTOS, sampleById } from './samples.js';
import { GRADES } from './grades.js';
import { POST_SIZES, layoutsForSize, layoutById, sizeById } from './layouts.js';
import { renderCover, coverFileName } from './renderCover.js';

// The three covers the studio opens with — one per post size, each with its
// own title, layout, grade and cast, the way a cover line ships variants.
const PRESETS = {
  wide: {
    sizeId: 'wide', layoutId: 'cast-wall', gradeId: 'vice-sunset',
    title: 'PALM FEVER', subtitle: 'one last summer',
    tagline: 'FIVE FRIENDS · ONE COAST · NO WAY BACK',
    quote: 'PURE GOLDEN-HOUR MAYHEM', quoteSource: 'THE HARBOR GAZETTE',
    edition: 'VOL. 1', hudWord: 'WANTED',
    sealTop: 'ORIGINAL', sealBottom: 'COVER ART',
    burstLines: ['HOT', 'SUMMER ’26'],
    credits: 'STARRING THE DRIVER · THE BOSS · THE INSIDER · THE COURIER · THE RIDER — A PALM FEVER PICTURE · LEONIDA · MMXXVI',
    barcode: '8 901126 420261',
    sliders: { saturation: 104, contrast: 103, grain: 42, vignette: 46, titleScale: 90 },
  },
  portrait: {
    sizeId: 'portrait', layoutId: 'duo-vertical', gradeId: 'neon-night',
    title: 'HIGH TIDE', subtitle: 'the coast is never clear',
    tagline: 'EVERY TIDE BRINGS TROUBLE',
    quote: 'A NEON-SOAKED TRIUMPH', quoteSource: 'VICE CITY WEEKLY',
    edition: 'VOL. 2', hudWord: 'WANTED',
    sealTop: 'ORIGINAL', sealBottom: 'COVER ART',
    burstLines: ['NEW', 'FOR ’26'],
    credits: 'STARRING THE INSIDER · THE DRIVER · THE CAPTAIN — A PALM FEVER PICTURE · LEONIDA · MMXXVI',
    barcode: '8 901126 420262',
    sliders: { saturation: 106, contrast: 105, grain: 48, vignette: 52, titleScale: 100 },
  },
  square: {
    sizeId: 'square', layoutId: 'mosaic', gradeId: 'golden-hour',
    title: 'AMBER HOUR', subtitle: 'no brakes on the coast',
    tagline: 'ONE CAR · SIX STORIES · ZERO BRAKES',
    quote: 'SUNSET NEVER LOOKED THIS FAST', quoteSource: 'THE COAST REVIEW',
    edition: 'VOL. 3', hudWord: 'WANTED',
    sealTop: 'ORIGINAL', sealBottom: 'COVER ART',
    burstLines: ['HOT', 'SUMMER ’26'],
    credits: 'STARRING THE CAPTAIN · THE DRIVER · THE RIDER · THE MARINA · THE GETAWAY · THE BOSS — A PALM FEVER PICTURE · LEONIDA · MMXXVI',
    barcode: '8 901126 420263',
    sliders: { saturation: 103, contrast: 102, grain: 40, vignette: 44, titleScale: 92 },
  },
};

// A fresh panel for a layout slot, playing the layout's cast member with the
// character tag that sample carries.
function panelFor(sampleId) {
  const sample = sampleById(sampleId);
  return {
    photoId: sample.id,
    zoom: 1.06, offX: 0, offY: sample.focus ?? 0,
    tagName: sample.tagName, tagLine: sample.tagLine,
  };
}

function stateFromPreset(preset) {
  const layout = layoutById(preset.layoutId);
  return {
    ...structuredClone(preset),
    panels: layout.cast.map(panelFor),
  };
}

// The photo library: every photo the studio can place, bundled samples first,
// then any photos the visitor adds. Values hold the loaded image element.
const library = new Map();
let userPhotoCount = 0;

function loadSample(sample) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = sample.file;
    library.set(sample.id, { img, label: sample.label });
  });
}

const canvas = document.getElementById('cover-canvas');
let state = stateFromPreset(PRESETS.wide);
let selectedPanel = 0;

function render() {
  renderCover(canvas, state, library);
  document.querySelectorAll('#panel-picker button').forEach((button, i) => {
    button.classList.toggle('active', i === selectedPanel);
  });
}

// ---------- control wiring ----------

const $ = (id) => document.getElementById(id);

function segButtons(container, items, activeId, onPick) {
  container.innerHTML = '';
  for (const item of items) {
    const button = document.createElement('button');
    button.textContent = item.label;
    button.classList.toggle('active', item.id === activeId);
    button.addEventListener('click', () => onPick(item.id));
    container.appendChild(button);
  }
}

function buildRail() {
  const rail = $('rail-thumbs');
  rail.innerHTML = '';
  for (const [id, entry] of library) {
    const button = document.createElement('button');
    button.className = 'thumb';
    const img = document.createElement('img');
    img.src = entry.img.src;
    img.alt = entry.label;
    const caption = document.createElement('small');
    caption.textContent = entry.label;
    button.append(img, caption);
    button.addEventListener('click', () => placePhoto(id));
    rail.appendChild(button);
  }
}

function placePhoto(photoId) {
  const panel = state.panels[selectedPanel];
  panel.photoId = photoId;
  const sample = SAMPLE_PHOTOS.find((photo) => photo.id === photoId);
  if (sample) {
    panel.tagName = sample.tagName;
    panel.tagLine = sample.tagLine;
    panel.offY = sample.focus ?? 0;
  }
  syncPanelFields();
  render();
}

function buildPanelPicker() {
  const picker = $('panel-picker');
  picker.innerHTML = '';
  state.panels.forEach((_, i) => {
    const button = document.createElement('button');
    button.textContent = String(i + 1);
    button.addEventListener('click', () => {
      selectedPanel = i;
      syncPanelFields();
      render();
    });
    picker.appendChild(button);
  });
}

function syncPanelFields() {
  const panel = state.panels[selectedPanel];
  $('f-tag-name').value = panel.tagName;
  $('f-tag-line').value = panel.tagLine;
  $('s-zoom').value = Math.round(panel.zoom * 100);
  $('s-offx').value = Math.round(panel.offX * 100);
  $('s-offy').value = Math.round(panel.offY * 100);
}

function syncTextFields() {
  $('f-title').value = state.title;
  $('f-subtitle').value = state.subtitle;
  $('f-tagline').value = state.tagline;
  $('f-quote').value = state.quote;
  $('f-quote-source').value = state.quoteSource;
  $('f-edition').value = state.edition;
  $('f-hud').value = state.hudWord;
  $('f-seal-top').value = state.sealTop;
  $('f-seal-bottom').value = state.sealBottom;
  $('f-burst').value = state.burstLines.join(' / ');
  $('f-credits').value = state.credits;
  $('s-title').value = state.sliders.titleScale;
  $('s-saturation').value = state.sliders.saturation;
  $('s-contrast').value = state.sliders.contrast;
  $('s-grain').value = state.sliders.grain;
  $('s-vignette').value = state.sliders.vignette;
}

function buildSegs() {
  segButtons($('size-seg'),
    POST_SIZES.map((size) => ({ id: size.id, label: size.label.split(' ')[0] })),
    state.sizeId,
    (sizeId) => {
      state = stateFromPreset(PRESETS[sizeId]);
      selectedPanel = 0;
      buildSegs(); buildPanelPicker(); syncTextFields(); syncPanelFields(); render();
    });
  segButtons($('layout-seg'),
    layoutsForSize(state.sizeId).map((layout) => ({ id: layout.id, label: layout.label.split(' — ')[0] })),
    state.layoutId,
    (layoutId) => {
      const layout = layoutById(layoutId);
      state.layoutId = layoutId;
      state.panels = layout.cast.map(panelFor);
      selectedPanel = 0;
      buildSegs(); buildPanelPicker(); syncPanelFields(); render();
    });
  segButtons($('grade-seg'),
    GRADES.map((grade) => ({ id: grade.id, label: grade.label })),
    state.gradeId,
    (gradeId) => {
      state.gradeId = gradeId;
      buildSegs(); render();
    });
}

function bindText(id, apply) {
  $(id).addEventListener('input', (event) => { apply(event.target.value); render(); });
}

function bindControls() {
  bindText('f-title', (v) => { state.title = v; });
  bindText('f-subtitle', (v) => { state.subtitle = v; });
  bindText('f-tagline', (v) => { state.tagline = v; });
  bindText('f-quote', (v) => { state.quote = v; });
  bindText('f-quote-source', (v) => { state.quoteSource = v; });
  bindText('f-edition', (v) => { state.edition = v; });
  bindText('f-hud', (v) => { state.hudWord = v; });
  bindText('f-seal-top', (v) => { state.sealTop = v; });
  bindText('f-seal-bottom', (v) => { state.sealBottom = v; });
  bindText('f-burst', (v) => { state.burstLines = v.split('/').map((s) => s.trim()).filter(Boolean); });
  bindText('f-credits', (v) => { state.credits = v; });
  bindText('f-tag-name', (v) => { state.panels[selectedPanel].tagName = v; });
  bindText('f-tag-line', (v) => { state.panels[selectedPanel].tagLine = v; });

  const slider = (id, apply) => $(id).addEventListener('input', (event) => { apply(Number(event.target.value)); render(); });
  slider('s-title', (v) => { state.sliders.titleScale = v; });
  slider('s-saturation', (v) => { state.sliders.saturation = v; });
  slider('s-contrast', (v) => { state.sliders.contrast = v; });
  slider('s-grain', (v) => { state.sliders.grain = v; });
  slider('s-vignette', (v) => { state.sliders.vignette = v; });
  slider('s-zoom', (v) => { state.panels[selectedPanel].zoom = v / 100; });
  slider('s-offx', (v) => { state.panels[selectedPanel].offX = v / 100; });
  slider('s-offy', (v) => { state.panels[selectedPanel].offY = v / 100; });

  canvas.addEventListener('click', (event) => {
    const box = canvas.getBoundingClientRect();
    const fx = (event.clientX - box.left) / box.width;
    const fy = (event.clientY - box.top) / box.height;
    const layout = layoutById(state.layoutId);
    const hit = layout.panels.findIndex((p) => fx >= p.x && fx <= p.x + p.w && fy >= p.y && fy <= p.y + p.h);
    if (hit >= 0) {
      selectedPanel = hit;
      syncPanelFields();
      render();
    }
  });

  $('fill-all').addEventListener('click', () => {
    const photoId = state.panels[selectedPanel].photoId;
    state.panels.forEach((panel, i) => {
      panel.photoId = photoId;
      panel.zoom = 1.05 + i * 0.09;
      panel.offX = (i % 3 - 1) * 0.22;
      panel.offY = (i % 2 === 0 ? -0.08 : 0.08);
    });
    render();
  });

  $('add-photo').addEventListener('click', () => $('photo-file').click());
  $('photo-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      userPhotoCount += 1;
      const id = `user-${userPhotoCount}`;
      library.set(id, { img, label: `Your photo ${userPhotoCount}` });
      buildRail();
      placePhoto(id);
    };
    img.src = URL.createObjectURL(file);
  });

  const wireExport = (id, fn) => $(id).addEventListener('click', fn);
  wireExport('export-one', () => exportSizes([state.sizeId]));
  wireExport('export-one-top', () => exportSizes([state.sizeId]));
  wireExport('export-all', () => exportSizes(POST_SIZES.map((size) => size.id)));
  wireExport('export-all-top', () => exportSizes(POST_SIZES.map((size) => size.id)));
}

// ---------- export ----------

// A cover state for another post size: same words, grade and finish, laid
// out in that size's first layout with this cover's photos in order.
function exportStateFor(sizeId) {
  if (sizeId === state.sizeId) return state;
  const layout = layoutsForSize(sizeId)[0];
  return {
    ...state,
    sizeId,
    layoutId: layout.id,
    panels: layout.panels.map((_, i) => ({ ...state.panels[i % state.panels.length] })),
  };
}

function download(canvasEl, name) {
  canvasEl.toBlob((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  }, 'image/png');
}

function exportSizes(sizeIds) {
  const scratch = document.createElement('canvas');
  const saved = [];
  for (const sizeId of sizeIds) {
    const exportState = exportStateFor(sizeId);
    renderCover(scratch, exportState, library);
    const name = coverFileName(exportState, sizeId);
    download(scratch, name);
    saved.push(name);
  }
  $('saved-note').textContent = `Saved ${saved.join(', ')} ✓`;
}

// ---------- start ----------

async function start() {
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  const preset = PRESETS[params.get('preset')] ? params.get('preset') : 'wide';
  if (shot) state = stateFromPreset(PRESETS[preset]);

  await Promise.all(SAMPLE_PHOTOS.map(loadSample));
  await document.fonts.load('100px Anton');
  await document.fonts.load('40px Pacifico');
  await document.fonts.ready;

  buildRail();
  buildSegs();
  buildPanelPicker();
  bindControls();
  syncTextFields();
  syncPanelFields();
  if (shot === 'cover') document.body.classList.add('shot-cover');
  render();
  window.__SHOT_READY = true;
}

start();
