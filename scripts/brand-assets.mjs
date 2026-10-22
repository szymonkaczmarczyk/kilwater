import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { logoMark } from "../src/data/logo-mark.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = `${root}public`;

const colors = {
  sand: "#f7f2ea",
  navy: "#0b1b2b",
  brass: "#b08a4e",
  brassLight: "#d4b98a",
};

const { oval } = logoMark;

const markPaths = ({ color, sailColor, strokeWidth }) => `
    <ellipse cx="${oval.cx}" cy="${oval.cy}" rx="${oval.rx}" ry="${oval.ry}" stroke="${color}" stroke-width="${strokeWidth}"/>
    <path d="${logoMark.wake}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
    <path d="${logoMark.hull}" fill="${color}" stroke="${color}" stroke-width="0.6" stroke-linejoin="round"/>
    <path d="${logoMark.sail}" fill="${sailColor}" stroke="${sailColor}" stroke-width="0.6" stroke-linejoin="round"/>`;

const faviconSvg = (strokeWidth) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${colors.navy}"/>
  <g transform="translate(13.1 5) scale(1.35)" fill="none">${markPaths({ color: colors.sand, sailColor: colors.brassLight, strokeWidth })}
  </g>
</svg>
`;

const regularFavicon = faviconSvg(2.5);
const boldFavicon = faviconSvg(3.2);

const icoFromPngs = (pngs) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...pngs.map(({ data }) => data)]);
};

const renderPng = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();

const buildFavicons = async () => {
  await writeFile(`${publicDir}/favicon.svg`, regularFavicon);
  const pngs = await Promise.all([
    { size: 16, svg: boldFavicon },
    { size: 32, svg: regularFavicon },
    { size: 48, svg: regularFavicon },
  ].map(async ({ size, svg }) => ({ size, data: await renderPng(svg, size) })));
  await writeFile(`${publicDir}/favicon.ico`, icoFromPngs(pngs));
  await sharp(Buffer.from(regularFavicon), { density: 600 })
    .resize(180, 180)
    .flatten({ background: colors.navy })
    .png()
    .toFile(`${publicDir}/apple-touch-icon.png`);
};

const unicodeRanges = {
  latin:
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  latinExt:
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
};

const fontFace = async (family, file, range) => {
  const font = (await readFile(`${root}node_modules/${file}`)).toString("base64");
  return `@font-face { font-family: "${family}"; src: url("data:font/woff2;base64,${font}") format("woff2"); font-weight: 100 900; unicode-range: ${range}; }`;
};

const buildOgImage = async () => {
  const heroImage = (await readFile(`${root}src/assets/photos/hero-kilwater.png`)).toString("base64");
  const fonts = (
    await Promise.all([
      fontFace("Jost", "@fontsource-variable/jost/files/jost-latin-ext-wght-normal.woff2", unicodeRanges.latinExt),
      fontFace("Jost", "@fontsource-variable/jost/files/jost-latin-wght-normal.woff2", unicodeRanges.latin),
      fontFace("DM Sans", "@fontsource-variable/dm-sans/files/dm-sans-latin-ext-wght-normal.woff2", unicodeRanges.latinExt),
      fontFace("DM Sans", "@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", unicodeRanges.latin),
    ])
  ).join("\n");
  const html = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<style>
  ${fonts}
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: ${colors.sand}; color: ${colors.navy}; font-family: "DM Sans"; letter-spacing: -0.02em; overflow: hidden; }
  .copy { position: absolute; left: 80px; top: 72px; bottom: 72px; display: flex; flex-direction: column; justify-content: space-between; width: 600px; }
  .brand { display: flex; align-items: center; gap: 16px; font-family: "Jost"; font-size: 22px; letter-spacing: 0.24em; text-transform: uppercase; }
  .label { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; font-size: 15px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; }
  .label::before { content: ""; width: 40px; height: 1px; background: currentColor; opacity: 0.6; }
  h1 { font-family: "Jost"; font-weight: 300; font-size: 84px; line-height: 1.02; letter-spacing: -0.04em; }
  .places { font-size: 20px; color: rgba(11, 27, 43, 0.7); }
  .arch { position: absolute; right: 96px; top: 72px; width: 360px; height: 486px; border-radius: 180px 180px 6px 6px; overflow: hidden; }
  .arch img { width: 100%; height: 100%; object-fit: cover; object-position: 70% 60%; transform: scale(1.15); transform-origin: 70% 60%; }
  .outline { position: absolute; right: 82px; top: 58px; width: 388px; height: 514px; border: 1px solid ${colors.brass}; border-radius: 194px 194px 8px 8px; opacity: 0.8; }
</style>
</head>
<body>
  <div class="copy">
    <div class="brand">
      <svg width="24" height="34" viewBox="${logoMark.viewBox}" fill="none">${markPaths({ color: colors.navy, sailColor: colors.navy, strokeWidth: 1.1 })}
      </svg>
      Kilwater
    </div>
    <div>
      <p class="label">Czarter jachtów z załogą</p>
      <h1>Zostaw ślad<br />na wodzie</h1>
    </div>
    <p class="places">Chorwacja, Grecja, Włochy, Mazury</p>
  </div>
  <div class="outline"></div>
  <div class="arch"><img src="data:image/png;base64,${heroImage}" alt="" /></div>
</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const screenshot = await page.screenshot({ type: "png" });
  await browser.close();
  await sharp(screenshot).jpeg({ quality: 88, mozjpeg: true }).toFile(`${publicDir}/og-image.jpg`);
};

await mkdir(publicDir, { recursive: true });
await buildFavicons();
await buildOgImage();
console.log("Gotowe: favicon.ico, favicon.svg, apple-touch-icon.png, og-image.jpg");
