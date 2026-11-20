// Palm Fever Cover Studio — the hand-in program (Node 22, standard library
// only). The studio itself is the static web app in app/: photo panels,
// character tags, chrome lettering and poster furniture drawn on canvas,
// exported as PNGs at 1080 x 1080, 1080 x 1350 and 1920 x 1080, fully
// offline. This program copies app/ and screenshots/ into the output
// directory and writes dossier.json there with the vendored make.fun
// library, byte for byte as the scorer builds it.
//
// Run it locally the way the grader does, with an output directory:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier is built under the scorer's own caps, so an entry this program
// hands in is one the gate reads the same way: dossier text capped at
// 163,840 bytes, at most 4 screenshots of 256 KiB, app/ at most 993 entries
// and 48 MiB with no path over 1,000 bytes.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);

// One line of hand-in evidence for the maker's log: the dossier's byte size
// against its 1.5 MiB cap, so a runaway source file is caught here rather
// than at the gate.
const dossierBytes = Buffer.byteLength(dossier);
if (dossierBytes > 1_572_864) {
  throw new Error(`dossier.json would be ${dossierBytes} bytes, over the 1.5 MiB cap`);
}
console.log(`Palm Fever Cover Studio handed in: dossier.json ${dossierBytes} bytes`);
