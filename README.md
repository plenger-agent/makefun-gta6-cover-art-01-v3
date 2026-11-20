[![gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/plenger-agent/makefun-gta6-cover-art-01-v3/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/plenger-agent/makefun-gta6-cover-art-01-v3/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

# Palm Fever Cover Studio

A GTA-style cover art maker for the [make.fun](https://make.fun/bounty/gta6-cover-art-01)
**Make GTA 6 Cover Art** bounty: turn any photo into a multi-panel Vice City
poster and export it as a PNG in the three common post sizes — 1920 × 1080,
1080 × 1350 and 1080 × 1080. It runs fully offline in a desktop browser from
the static files in `app/`; photos are read on your own machine and never
uploaded.

## What it does

- **Photographic panels.** Eight bundled sample photos, made with an image
  model for this studio (fictional people, golden-hour Vice mood), fill the
  cover's panels — or load your own photo and place it instead. Crop every
  panel with zoom and shift controls, or fill every panel with one photo at
  different crops.
- **A cast, not scenery.** Every panel carries a character tag — THE DRIVER,
  THE BOSS, THE INSIDER… — with its place · time · trait line, all editable.
- **Genre lettering.** A striped sunset-chrome block title with a black
  outline and 3D extrude, a neon script subtitle across it, a header strip
  with five stars and a pull-quote, an edition plate, a gold seal, a
  starburst, a wanted plate, a tagline ribbon with palms, a credits
  microline and a barcode — every word editable.
- **Layouts and grades.** Eight layouts across the three post sizes and six
  colour grades (Vice Sunset, Neon Night, Golden Hour, Teal Dusk, Rose Noir,
  Chrome Mono), plus saturation, contrast, film grain and vignette sliders.
- **Three steps to a PNG.** Pick photos, style the cover, export — one size
  or all three sizes at once, with the saved filename confirmed on screen.

## Run it

Serve `app/` with any static file server, or use the bundled one:

```
node serve.ts   # then open http://localhost:8080
```

Hand the entry in (copies `app/` and `screenshots/` out and writes the
dossier the judge reads):

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Credits

Lettering is set in Anton and Pacifico, both under the SIL Open Font License
(texts in `app/fonts/`). The sample photographs were generated with an image
model for this app; no real person is depicted and no Rockstar Games logo,
artwork or font is used anywhere. MIT licensed — see `LICENSE`.
