/**
 * Renders scripts/site-images/og-compose.html to public/og-image.jpg.
 *
 *   node scripts/site-images/og-render.mjs media-src/og/flywheel.png
 *
 * Needs Playwright's Chromium (npx playwright install chromium, once).
 */

import { chromium } from "playwright";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const art = process.argv[2];
if (!art) {
  console.error("Pass the background art, e.g. media-src/og/flywheel.png");
  process.exit(1);
}
const out = resolve(process.argv[3] ?? "public/og-image.jpg");
const page_url = `${pathToFileURL(resolve("scripts/site-images/og-compose.html"))}?bg=${encodeURIComponent(pathToFileURL(resolve(art)).href)}`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(page_url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: "jpeg", quality: 88 });
await browser.close();
console.log(`wrote ${out}`);
