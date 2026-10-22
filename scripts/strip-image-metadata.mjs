import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const imageFolders = ["src/assets/photos", "public"];
const imagePattern = /\.(png|jpe?g|webp)$/i;

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const pngKeptChunks = new Set(["IHDR", "PLTE", "IDAT", "IEND", "tRNS", "sRGB", "gAMA", "cHRM", "iCCP", "pHYs"]);
const jpegKeptAppMarkers = new Set([0xe0, 0xe2, 0xee]);
const webpDroppedChunks = new Set(["EXIF", "XMP ", "C2PA"]);
const webpExifFlag = 0x08;
const webpXmpFlag = 0x04;

const stripPng = (data) => {
  const kept = [pngSignature];
  let position = pngSignature.length;
  while (position < data.length) {
    const length = data.readUInt32BE(position);
    const kind = data.toString("latin1", position + 4, position + 8);
    const end = position + 12 + length;
    if (pngKeptChunks.has(kind)) kept.push(data.subarray(position, end));
    position = end;
  }
  return Buffer.concat(kept);
};

const stripJpeg = (data) => {
  const kept = [data.subarray(0, 2)];
  let position = 2;
  while (position < data.length) {
    const marker = data[position + 1];
    if (marker === 0xda) {
      kept.push(data.subarray(position));
      break;
    }
    const end = position + 2 + data.readUInt16BE(position + 2);
    const isMetadata = (marker >= 0xe0 && marker <= 0xef && !jpegKeptAppMarkers.has(marker)) || marker === 0xfe;
    if (!isMetadata) kept.push(data.subarray(position, end));
    position = end;
  }
  return Buffer.concat(kept);
};

const stripWebp = (data) => {
  const kept = [];
  let position = 12;
  while (position < data.length) {
    const kind = data.toString("latin1", position, position + 4);
    const length = data.readUInt32LE(position + 4);
    const end = position + 8 + length + (length % 2);
    if (!webpDroppedChunks.has(kind)) {
      const chunk = Buffer.from(data.subarray(position, end));
      if (kind === "VP8X") chunk[8] &= ~(webpExifFlag | webpXmpFlag);
      kept.push(chunk);
    }
    position = end;
  }
  const body = Buffer.concat([Buffer.from("WEBP"), ...kept]);
  const header = Buffer.alloc(8);
  header.write("RIFF", 0, "latin1");
  header.writeUInt32LE(body.length, 4);
  return Buffer.concat([header, body]);
};

const stripMetadata = (data) => {
  if (data.subarray(0, 8).equals(pngSignature)) return stripPng(data);
  if (data[0] === 0xff && data[1] === 0xd8) return stripJpeg(data);
  if (data.toString("latin1", 0, 4) === "RIFF" && data.toString("latin1", 8, 12) === "WEBP") return stripWebp(data);
  return data;
};

for (const folder of imageFolders) {
  const files = (await readdir(`${root}${folder}`)).filter((name) => imagePattern.test(name));
  for (const name of files) {
    const path = `${root}${folder}/${name}`;
    const original = await readFile(path);
    const cleaned = stripMetadata(original);
    const saved = original.length - cleaned.length;
    if (saved > 0) await writeFile(path, cleaned);
    const savedLabel = saved >= 1024 ? `${Math.round(saved / 1024)} KB` : `${saved} B`;
    console.log(`${folder}/${name}: ${saved > 0 ? `usunięto ${savedLabel} metadanych` : "bez metadanych"}`);
  }
}
