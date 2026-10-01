/**
 * Browser check: enquire dialog must NOT open on refresh.
 * Requires Public Website at PUBLIC_SITE_URL (default http://localhost:5174).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:5174';
const shots = path.join(root, '_enquire_refresh_shots');
fs.mkdirSync(shots, { recursive: true });

function record(name, passed, detail) {
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  return passed;
}

async function dialogVisible(page) {
  return page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const text = (dialog.innerText || '').replace(/\s+/g, ' ');
    return (
      /Get owner contact details/i.test(text) ||
      /Sign in to enquire/i.test(text) ||
      /Enquiry sent/i.test(text) ||
      /Send on ACOMI App/i.test(text)
    );
  });
}

async function seedStaleIntent(page) {
  await page.evaluate(() => {
    sessionStorage.setItem(
      'acomi.public.enquireIntent',
      JSON.stringify({
        listingId: 'any',
        listingName: 'Stale',
        listingKind: 'places',
        path: '/places',
      }),
    );
  });
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu'],
});

let failed = 0;
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

try {
  // Logged-out: plain visit must not show enquire popup
  await page.goto(`${baseUrl}/places`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('body');
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(shots, '01-logged-out-fresh.png') });
  if (!record('logged-out fresh load has no enquire dialog', !(await dialogVisible(page)))) failed += 1;

  // Stale intent without resumeAfterAuth must be cleared and must not open dialog
  await seedStaleIntent(page);
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(shots, '02-stale-intent-reload.png') });
  const staleGone = await page.evaluate(() => sessionStorage.getItem('acomi.public.enquireIntent'));
  if (!record('stale intent cleared on reload', staleGone == null)) failed += 1;
  if (!record('stale intent does not open dialog', !(await dialogVisible(page)))) failed += 1;

  // Detail page: dismiss optional welcome dialog, then Contact / Enquire
  await page.goto(`${baseUrl}/places/3ebb6eac-dbd9-4cad-9de1-4e926f7826cc`, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 1000));
  if (await dialogVisible(page)) {
    if (!record('detail page fresh load has no enquire dialog', false, 'enquire dialog already open')) failed += 1;
  } else {
    record('detail page fresh load has no enquire dialog', true);
  }
  await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) return;
    const text = dlg.innerText || '';
    if (/Welcome to ACOMI|How would you like/i.test(text)) {
      const close = [...dlg.querySelectorAll('button')].find((b) =>
        /close|skip|continue|browse|later|x/i.test(b.textContent || b.getAttribute('aria-label') || ''),
      );
      close?.click();
      // backdrop click fallback
      dlg.parentElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 400));
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button, a')].find((el) =>
      /Contact\s*\/\s*Enquire/i.test((el.textContent || '').replace(/\s+/g, ' ')),
    );
    if (!btn) return false;
    btn.click();
    return true;
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(shots, '03-detail-click.png') });
  if (!record('click Contact/Enquire opens dialog', clicked && (await dialogVisible(page)))) failed += 1;
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('[role="dialog"] button')];
    const close = buttons.find((el) => /Done|Continue browsing|Cancel/i.test(el.textContent || ''));
    close?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(shots, '04-after-close-reload.png') });
  // Ignore non-enquire welcome dialogs on reload
  const enquireOpen = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const text = (dialog.innerText || '').replace(/\s+/g, ' ');
    return (
      /Get owner contact details/i.test(text) ||
      /Sign in to enquire/i.test(text) ||
      /Enquiry sent/i.test(text) ||
      /Send on ACOMI App/i.test(text)
    );
  });
  if (!record('after close+refresh enquire dialog stays closed', !enquireOpen)) failed += 1;

  // Logged-in path if credentials provided
  const mobile = process.env.ACOMI_E2E_PUBLIC_MOBILE || process.env.ACOMI_E2E_ANDROID_MOBILE;
  const password = process.env.ACOMI_E2E_PUBLIC_PASS || process.env.ACOMI_E2E_ANDROID_PASS;
  if (mobile && password) {
    await page.goto(`${baseUrl}/places`, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(() => sessionStorage.removeItem('acomi.public.enquireIntent'));
    // Open nav Sign in if present
    const signedIn = await page.evaluate(async (m, p) => {
      const openBtn = [...document.querySelectorAll('button, a')].find((el) =>
        /^Sign in$/i.test((el.textContent || '').trim()),
      );
      openBtn?.click();
      await new Promise((r) => setTimeout(r, 400));
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return 'no-dialog';
      const inputs = [...dialog.querySelectorAll('input')];
      const mobileInput = inputs.find((i) => /tel|mobile|phone/i.test(i.name + i.id + i.placeholder + i.type));
      const passInput = inputs.find((i) => i.type === 'password');
      if (!mobileInput || !passInput) return 'no-inputs';
      const setVal = (el, value) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        setter?.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      setVal(mobileInput, m);
      setVal(passInput, p);
      const submit = dialog.querySelector('button[type="submit"]');
      submit?.click();
      return 'submitted';
    }, mobile, password);
    await new Promise((r) => setTimeout(r, 2500));
    await page.evaluate(() => sessionStorage.removeItem('acomi.public.enquireIntent'));
    await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(shots, '05-logged-in-refresh.png') });
    if (!record(`logged-in refresh has no enquire dialog (${signedIn})`, !(await dialogVisible(page)))) failed += 1;
  } else {
    console.log('SKIP  logged-in refresh (set ACOMI_E2E_PUBLIC_MOBILE / ACOMI_E2E_PUBLIC_PASS to enable)');
  }
} catch (err) {
  console.error(err);
  failed += 1;
  record('browser harness', false, String(err?.message || err));
} finally {
  await browser.close();
}

process.exit(failed ? 1 : 0);
