// Regenerates public/favicon/lockdraft-*.png from
// public/assets/images/avatar.svg, matching the sizes referenced in
// src/config/siteConfig.ts's `favicon` array. Run manually with
// `node scripts/generate-favicon.mjs` whenever avatar.svg changes — this
// is not part of the build pipeline (favicons don't need to regenerate on
// every build, only when the source art changes).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svgPath = path.join(siteRoot, "public/assets/images/avatar.svg");
const outDir = path.join(siteRoot, "public/favicon");

const svg = fs.readFileSync(svgPath);
const sizes = [32, 128, 180, 192];

for (const size of sizes) {
	const outPath = path.join(outDir, `lockdraft-${size}.png`);
	// Rasterize at a higher density than the target size so downscaling
	// (rather than upscaling a low-res render) keeps edges crisp — matters
	// most for the thin network lines at the 32px size.
	await sharp(svg, { density: 384 }).resize(size, size).png().toFile(outPath);
	console.log("wrote", path.relative(siteRoot, outPath));
}
