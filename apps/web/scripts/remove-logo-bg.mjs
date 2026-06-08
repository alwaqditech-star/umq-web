import fs from "node:fs";
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoInput = path.join(webRoot, "image/الاسم مع الشعار .jpg");
const logoPublic = path.join(webRoot, "public/brand-logo.png");
const logoAsset = path.join(webRoot, "assets/brand-logo.png");

fs.mkdirSync(path.dirname(logoAsset), { recursive: true });

async function removeLightBackground(input, output, { solidCutoff = 248, featherCutoff = 225 } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;

    if (lightness >= solidCutoff) {
      pixels[i + 3] = 0;
    } else if (lightness >= featherCutoff) {
      pixels[i + 3] = Math.round(((solidCutoff - lightness) / (solidCutoff - featherCutoff)) * 255);
    }
  }

  await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log(`Saved: ${output} (${info.width}x${info.height})`);
}

await removeLightBackground(logoInput, logoPublic);
await sharp(logoPublic).toFile(logoAsset);
console.log(`Saved: ${logoAsset}`);

const iconRaw = path.join(webRoot, ".tmp-brand-icon.png");
const iconPublic = path.join(webRoot, "public/brand-icon.png");
const iconAsset = path.join(webRoot, "assets/brand-icon.png");

fs.mkdirSync(path.dirname(iconAsset), { recursive: true });

await removeLightBackground(
  path.join(webRoot, "image/شعار الموقع.jpg"),
  iconRaw,
  { solidCutoff: 235, featherCutoff: 210 },
);

await sharp(iconRaw)
  .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(iconAsset);

await sharp(iconAsset).toFile(iconPublic);
fs.unlinkSync(iconRaw);

console.log(`Saved: ${iconAsset} (256x256)`);
console.log(`Saved: ${iconPublic} (256x256)`);
