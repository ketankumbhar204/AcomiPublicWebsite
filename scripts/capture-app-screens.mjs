import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(root, '../public/screenshots');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const screens = [
  { file: 'dashboard.html', out: 'dashboard.png' },
  { file: 'occupancy.html', out: 'accommodation.png' },
  { file: 'meals.html', out: 'meals.png' },
  { file: 'mess.html', out: 'mess.png' },
  { file: 'members.html', out: 'members.png' },
  { file: 'payments.html', out: 'payments.png' },
];

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });

for (const screen of screens) {
  const url = `file://${path.resolve(root, 'app-screens', screen.file).replace(/\\/g, '/')}`;
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(outDir, screen.out),
    type: 'png',
    clip: { x: 0, y: 0, width: 390, height: 844 },
  });
  console.log('wrote', screen.out);
}

await browser.close();
