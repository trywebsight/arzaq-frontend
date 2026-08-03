/**
 * Generate tiny WebP blurDataURL map for every PNG/JPG in `public/`.
 * Uses the sharp install nested under Next.js (no extra dependency).
 *
 * Run: `node scripts/generate-blur-map.mjs`
 * Output: `lib/generated/blur-map.json`
 */

import { createRequire } from "node:module";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outDir = path.join(root, "lib", "generated");
const outFile = path.join(outDir, "blur-map.json");

const require = createRequire(import.meta.url);

function loadSharp() {
  try {
    return require("sharp");
  } catch {
    // Resolve the pnpm-nested sharp that ships with Next.
    const { createRequire: cr } = require("node:module");
    const nextRequire = cr(require.resolve("next/package.json"));
    return nextRequire("sharp");
  }
}

const sharp = loadSharp();

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

async function blurForFile(filePath) {
  const buffer = await sharp(filePath)
    .rotate()
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

async function main() {
  const entries = await readdir(publicDir);
  const map = {};

  for (const name of entries) {
    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const abs = path.join(publicDir, name);
    const key = `/${name}`;
    map[key] = await blurForFile(abs);
    console.log("blur", key);
  }

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, `${JSON.stringify(map, null, 2)}\n`, "utf8");
  console.log(`wrote ${Object.keys(map).length} entries → ${path.relative(root, outFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
