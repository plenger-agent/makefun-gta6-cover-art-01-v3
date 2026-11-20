// The bundled photo shoot: eight photographic samples made with an image model
// for this studio (fictional adults, no real person, no logos). Every cover the
// studio ships is composed from these files or from photos the visitor loads
// from their own machine. Each sample carries the character it plays on a
// cover, with the place, time and trait line the tag chip prints under the name.

export const SAMPLE_PHOTOS = [
  {
    id: 'hero-driver',
    file: 'samples/hero-driver.jpg',
    label: 'The Driver — hero shot',
    tagName: 'THE DRIVER',
    tagLine: 'PALM BOULEVARD · 6:42 PM · NEVER LOOKS BACK',
  },
  {
    id: 'boss',
    file: 'samples/boss.jpg',
    label: 'The Boss — rooftop portrait',
    tagName: 'THE BOSS',
    tagLine: 'ROOFTOP BAR · 9:05 PM · OWNS THE SKYLINE',
    focus: 1.0,
  },
  {
    id: 'courier',
    file: 'samples/courier.jpg',
    label: 'The Courier — neon street',
    tagName: 'THE COURIER',
    tagLine: 'NEON ROW · 11:48 PM · ASKS NO QUESTIONS',
    focus: 0.3,
  },
  {
    id: 'rider',
    file: 'samples/rider.jpg',
    label: 'The Rider — sunset highway',
    tagName: 'THE RIDER',
    tagLine: 'CAUSEWAY · 7:15 PM · BORN ON TWO WHEELS',
  },
  {
    id: 'insider',
    file: 'samples/insider.jpg',
    label: 'The Insider — club portrait',
    tagName: 'THE INSIDER',
    tagLine: 'CLUB AZURE · 12:20 AM · KNOWS EVERY NAME',
    focus: 0.15,
  },
  {
    id: 'getaway',
    file: 'samples/getaway.jpg',
    label: 'The Getaway — wet neon dock',
    tagName: 'THE GETAWAY',
    tagLine: 'PIER NINE · 2:03 AM · ENGINE ALWAYS RUNNING',
  },
  {
    id: 'marina',
    file: 'samples/marina.jpg',
    label: 'The Marina — golden hour',
    tagName: 'THE MARINA',
    tagLine: 'VICE MARINA · 6:05 PM · FAST WATER, SLOW SUNSETS',
  },
  {
    id: 'captain',
    file: 'samples/captain.jpg',
    label: 'The Captain — coastal run',
    tagName: 'THE CAPTAIN',
    tagLine: 'COAST ROAD · 5:57 PM · LAUGHS AT THE STORM',
  },
];

export function sampleById(id) {
  return SAMPLE_PHOTOS.find((photo) => photo.id === id) ?? SAMPLE_PHOTOS[0];
}
