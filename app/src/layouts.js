// Cover layouts: panel rectangles as fractions of the frame, per post size.
// Every layout tiles the whole frame edge to edge — no dead space anywhere —
// and every panel's top edge stays clear of the title band at the bottom, so a
// panel's character tag is never clipped by the lettering. The cast lists the
// bundled samples a layout opens with; the visitor can swap any panel.

export const POST_SIZES = [
  { id: 'wide', label: 'Wide 1920 × 1080', width: 1920, height: 1080 },
  { id: 'portrait', label: 'Portrait 1080 × 1350', width: 1080, height: 1350 },
  { id: 'square', label: 'Square 1080 × 1080', width: 1080, height: 1080 },
];

export function sizeById(id) {
  return POST_SIZES.find((size) => size.id === id) ?? POST_SIZES[0];
}

export const LAYOUTS = [
  {
    id: 'cast-wall',
    size: 'wide',
    label: 'Cast Wall — hero and four',
    panels: [
      { x: 0, y: 0, w: 0.46, h: 1 },
      { x: 0.46, y: 0, w: 0.27, h: 0.5 },
      { x: 0.73, y: 0, w: 0.27, h: 0.5 },
      { x: 0.46, y: 0.5, w: 0.27, h: 0.5 },
      { x: 0.73, y: 0.5, w: 0.27, h: 0.5 },
    ],
    cast: ['hero-driver', 'boss', 'insider', 'courier', 'rider'],
  },
  {
    id: 'hero-stage',
    size: 'wide',
    label: 'Hero Stage — one star, three scenes',
    panels: [
      { x: 0, y: 0, w: 0.66, h: 1 },
      { x: 0.66, y: 0, w: 0.34, h: 0.34 },
      { x: 0.66, y: 0.34, w: 0.34, h: 0.33 },
      { x: 0.66, y: 0.67, w: 0.34, h: 0.33 },
    ],
    cast: ['captain', 'getaway', 'marina', 'boss'],
  },
  {
    id: 'six-pack',
    size: 'wide',
    label: 'Six Pack — the full crew',
    panels: [
      { x: 0, y: 0, w: 0.34, h: 0.5 },
      { x: 0.34, y: 0, w: 0.33, h: 0.5 },
      { x: 0.67, y: 0, w: 0.33, h: 0.5 },
      { x: 0, y: 0.5, w: 0.34, h: 0.5 },
      { x: 0.34, y: 0.5, w: 0.33, h: 0.5 },
      { x: 0.67, y: 0.5, w: 0.33, h: 0.5 },
    ],
    cast: ['hero-driver', 'rider', 'marina', 'getaway', 'courier', 'captain'],
  },
  {
    id: 'lead-sheet',
    size: 'portrait',
    label: 'Lead Sheet — portrait headliner',
    panels: [
      { x: 0, y: 0, w: 1, h: 0.44 },
      { x: 0, y: 0.44, w: 0.5, h: 0.25 },
      { x: 0.5, y: 0.44, w: 0.5, h: 0.25 },
      { x: 0, y: 0.69, w: 1, h: 0.31 },
    ],
    cast: ['boss', 'insider', 'courier', 'getaway'],
  },
  {
    id: 'duo-vertical',
    size: 'portrait',
    label: 'Duo Vertical — star over two scenes',
    panels: [
      { x: 0, y: 0, w: 1, h: 0.58 },
      { x: 0, y: 0.58, w: 0.5, h: 0.42 },
      { x: 0.5, y: 0.58, w: 0.5, h: 0.42 },
    ],
    cast: ['insider', 'hero-driver', 'captain'],
  },
  {
    id: 'four-stack',
    size: 'portrait',
    label: 'Four Stack — two by two',
    panels: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
    cast: ['hero-driver', 'boss', 'rider', 'getaway'],
  },
  {
    id: 'mosaic',
    size: 'square',
    label: 'Mosaic — hero corner, five around',
    panels: [
      { x: 0, y: 0, w: 0.62, h: 0.62 },
      { x: 0.62, y: 0, w: 0.38, h: 0.31 },
      { x: 0.62, y: 0.31, w: 0.38, h: 0.31 },
      { x: 0, y: 0.62, w: 0.31, h: 0.38 },
      { x: 0.31, y: 0.62, w: 0.31, h: 0.38 },
      { x: 0.62, y: 0.62, w: 0.38, h: 0.38 },
    ],
    cast: ['captain', 'hero-driver', 'rider', 'marina', 'getaway', 'boss'],
  },
  {
    id: 'grid-four',
    size: 'square',
    label: 'Grid Four — clean quarters',
    panels: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
    cast: ['hero-driver', 'courier', 'marina', 'rider'],
  },
];

export function layoutsForSize(sizeId) {
  return LAYOUTS.filter((layout) => layout.size === sizeId);
}

export function layoutById(id) {
  return LAYOUTS.find((layout) => layout.id === id) ?? LAYOUTS[0];
}
