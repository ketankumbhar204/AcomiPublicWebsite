import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:5174';
const report = [];
const screenshots = path.join(root, '_auth_test_shots');
fs.mkdirSync(screenshots, { recursive: true });

function record(name, passed, detail) {
  report.push({ name, passed, detail });
  const mark = passed ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function clickText(page, selector, pattern) {
  const clicked = await page.evaluate(
    (sel, source) => {
      const re = new RegExp(source, 'i');
      const nodes = [...document.querySelectorAll(sel)];
      const el = nodes.find((node) => re.test((node.textContent || '').replace(/\s+/g, ' ').trim()));
      if (!el) return false;
      el.click();
      return true;
    },
    selector,
    pattern,
  );
  if (!clicked) {
    throw new Error(`Could not click ${selector} matching /${pattern}/`);
  }
}

async function fillInput(page, selector, value) {
  await page.waitForSelector(selector);
  await page.$eval(
    selector,
    (el, next) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      setter?.call(el, next);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    value,
  );
}

async function submitDialog(page) {
  await page.click('[role="dialog"] button[type="submit"]');
}

async function waitForAlert(page) {
  await page.waitForFunction(() => {
    const alert = document.querySelector('[role="dialog"] [role="alert"]');
    return Boolean(alert && alert.textContent.trim());
  });
  return page.$eval('[role="dialog"] [role="alert"]', (el) => el.textContent.trim());
}

async function dialogText(page) {
  return page.$eval('[role="dialog"]', (el) => el.innerText);
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(screenshots, `${name}.png`), fullPage: false });
}

const suffix = String(Date.now()).slice(-8);
const mobile = `98${suffix}`.slice(0, 10);
const password = 'Secret12';
const name = 'Public Auth Tester';

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
page.setDefaultTimeout(15000);

let failed = false;
try {
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });
  record('Logged-out home loads', !page.url().includes('app.acomi.in'), page.url());

  await clickText(page, 'header button, header a', 'sign in|साइन इन|साइन इन');
  await page.waitForSelector('[role="dialog"]');
  await shot(page, '01-login-modal');
  const loginUrl = page.url();
  record('Sign in opens public-site modal', Boolean(await page.$('[role="dialog"]')), 'dialog visible');
  record('Sign in does not redirect to app.acomi.in', !loginUrl.includes('app.acomi.in') && !loginUrl.includes('/login'), loginUrl);

  const loginEye = await page.$('button[aria-label*="password" i], button[aria-label*="पासवर्ड"]');
  record('Login password eye icon is present', Boolean(loginEye), loginEye ? 'aria-label toggle found' : 'missing');

  await fillInput(page, '#public-auth-password', 'Secret12');
  const beforeType = await page.$eval('#public-auth-password', (el) => el.type);
  await page.click('[role="dialog"] button[aria-label*="password" i], [role="dialog"] button[aria-label*="पासवर्ड"]');
  const afterType = await page.$eval('#public-auth-password', (el) => el.type);
  record('Login eye toggle reveals password', beforeType === 'password' && afterType === 'text', `${beforeType} → ${afterType}`);
  await shot(page, '02-login-password-visible');

  await fillInput(page, 'input[autocomplete="tel"]', '12345');
  await fillInput(page, '#public-auth-password', 'Secret12');
  await submitDialog(page);
  const invalidMobile = await waitForAlert(page);
  record('Invalid mobile is rejected', /mobile|मोबाइल|मोबाईल/i.test(invalidMobile), invalidMobile);

  await fillInput(page, 'input[autocomplete="tel"]', '9876543210');
  await fillInput(page, '#public-auth-password', 'short');
  await submitDialog(page);
  const invalidPassword = await waitForAlert(page);
  record('Short password is rejected', /password|पासवर्ड/i.test(invalidPassword), invalidPassword);

  await fillInput(page, 'input[autocomplete="tel"]', '9876543210');
  await fillInput(page, '#public-auth-password', 'WrongPass9');
  await submitDialog(page);
  await page.waitForFunction(() => {
    const alert = document.querySelector('[role="dialog"] [role="alert"]');
    return Boolean(alert && /incorrect|wrong|invalid|गलत|चुकी/i.test(alert.textContent));
  }).catch(() => null);
  const wrongCreds = await page.$eval('[role="dialog"] [role="alert"]', (el) => el.textContent.trim()).catch(() => '');
  record('Wrong password is rejected by API', Boolean(wrongCreds), wrongCreds || 'no API error shown');

  await clickText(page, '[role="dialog"] button', 'create account|खाता|खाते');
  await page.waitForFunction(() => document.getElementById('public-auth-confirm-password'));
  await shot(page, '03-register-modal');
  record('Create account stays on public website', !page.url().includes('app.acomi.in'), page.url());

  const registerEyes = await page.$$('#public-auth-password, #public-auth-confirm-password');
  const eyeButtons = await page.$$('[role="dialog"] button[aria-label*="password" i], [role="dialog"] button[aria-label*="पासवर्ड"]');
  record('Register has password and confirm fields', registerEyes.length === 2, `fields=${registerEyes.length}`);
  record('Register shows two eye icons', eyeButtons.length >= 2, `toggles=${eyeButtons.length}`);

  await submitDialog(page);
  const nameRequired = await waitForAlert(page);
  record('Register requires full name', /name|नाम|नाव/i.test(nameRequired), nameRequired);

  await fillInput(page, 'input[autocomplete="name"]', name);
  await fillInput(page, 'input[autocomplete="tel"]', mobile);
  await fillInput(page, '#public-auth-password', password);
  await fillInput(page, '#public-auth-confirm-password', 'Different9');
  await submitDialog(page);
  const mismatch = await waitForAlert(page);
  record('Mismatched passwords are rejected', /match|मेल|जुळ/i.test(mismatch), mismatch);

  await fillInput(page, '#public-auth-confirm-password', password);
  await submitDialog(page);
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 20000 });
  const afterRegister = page.url();
  record(
    'Successful register stays on public website',
    !afterRegister.includes('app.acomi.in') && !afterRegister.includes('/login'),
    afterRegister,
  );
  await page.click('header button[aria-haspopup="menu"]');
  const menuAfterRegister = await page.$eval('header [role="menu"]', (el) => el.innerText);
  record(
    'Header shows Dashboard after register',
    /dashboard|डैशबोर्ड|डॅशबोर्ड/i.test(menuAfterRegister),
    menuAfterRegister.replace(/\s+/g, ' ').slice(0, 180),
  );
  record(
    'Header shows Sign out after register',
    /sign out|साइन आउट/i.test(menuAfterRegister),
    'authenticated chrome',
  );
  await shot(page, '04-registered-header');

  await clickText(page, 'header [role="menu"] button', 'sign out|साइन आउट');
  await page.waitForFunction(() => /sign in|साइन इन/i.test(document.querySelector('header')?.innerText || ''));
  record('Logout returns Sign in on public header', true, 'signed out');

  await clickText(page, 'header button, header a', 'sign in|साइन इन');
  await page.waitForSelector('#public-auth-password');
  await fillInput(page, 'input[autocomplete="tel"]', mobile);
  await fillInput(page, '#public-auth-password', password);
  const loginHrefBefore = page.url();
  await submitDialog(page);
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 20000 });
  record('Password login succeeds on public website', !page.url().includes('app.acomi.in'), page.url());
  record('Password login does not change the public origin', new URL(loginHrefBefore).origin === new URL(page.url()).origin, page.url());
  await shot(page, '05-logged-in');

  await page.click('header button[aria-haspopup="menu"]');
  const dashboardHref = await page.evaluate(() => {
    const link = [...document.querySelectorAll('header [role="menu"] a')].find((a) =>
      /dashboard|डैशबोर्ड|डॅशबोर्ड/i.test(a.textContent || ''),
    );
    return link?.href || '';
  });
  record(
    'Dashboard link points at AcomiWeb',
    /localhost:5173|app\.acomi\.in/i.test(dashboardHref),
    dashboardHref || 'missing',
  );
  record('Dashboard click was not required for login', !page.url().includes('localhost:5173'), page.url());

  await clickText(page, 'header [role="menu"] button', 'sign out|साइन आउट');
  await page.waitForFunction(() => /sign in|साइन इन/i.test(document.querySelector('header')?.innerText || ''));
  await clickText(page, 'header button, header a', 'create account|खाता बना|खाते तयार');
  await page.waitForSelector('#public-auth-confirm-password');
  await fillInput(page, 'input[autocomplete="name"]', name);
  await fillInput(page, 'input[autocomplete="tel"]', mobile);
  await fillInput(page, '#public-auth-password', password);
  await fillInput(page, '#public-auth-confirm-password', password);
  await submitDialog(page);
  const duplicate = await waitForAlert(page).catch(() => '');
  record('Duplicate register is rejected', /already|account|खाता|खाते|409|registered/i.test(duplicate), duplicate || 'no duplicate message');

  await clickText(page, '[role="dialog"] button', 'sign in|साइन इन|already have');
  await page.waitForSelector('#public-auth-password');
  await clickText(page, '[role="dialog"] button', 'use otp|otp|ओटीपी');
  await fillInput(page, 'input[autocomplete="tel"]', mobile);
  await submitDialog(page);
  await page.waitForFunction(() => /verification|otp|कोड|कोड/i.test(document.querySelector('[role="dialog"]')?.innerText || ''), { timeout: 15000 }).catch(() => null);
  const otpCopy = await dialogText(page).catch(() => '');
  record('OTP login stays on public website and asks for code', /verification|otp|कोड/i.test(otpCopy) && !page.url().includes('app.acomi.in'), otpCopy.slice(0, 160));
  await shot(page, '05b-otp');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 5000 }).catch(() => undefined);

  try {
    await page.goto(`${baseUrl}/places`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForFunction(() => /find your new place/i.test(document.body.innerText), { timeout: 10000 });
    await page.waitForSelector('article h2');
    await page.evaluate(() => {
      const title = document.querySelector('article h2');
      const button = title?.closest('button') || title?.closest('article')?.querySelector('button');
      button?.click();
    });
    await page.waitForFunction(
      () => [...document.querySelectorAll('button')].some((el) => /contact \/ enquire/i.test(el.textContent || '')),
      { timeout: 10000 },
    );
    record('Places listings are browsable while logged out or in', true, page.url());
    await page.evaluate(() => {
      const enquire = [...document.querySelectorAll('button')].find(
        (el) => el.textContent.replace(/\s+/g, ' ').trim() === 'Contact / Enquire',
      );
      enquire?.click();
    });
    await page.waitForFunction(
      () => /sign in to enquire|request contact details/i.test(document.body.innerText),
      { timeout: 8000 },
    );
    const enquireCopy = await page.evaluate(() => document.body.innerText);
    record(
      'Contact / Enquire stays on public website',
      !page.url().includes('app.acomi.in') && /sign in to enquire|request contact details/i.test(enquireCopy),
      enquireCopy.includes('Sign in to enquire') ? 'Sign in to enquire modal' : 'enquiry form',
    );
    await shot(page, '06-enquire');
  } catch (error) {
    record('Places listings are browsable while logged out or in', false, error instanceof Error ? error.message : String(error));
    record('Contact / Enquire stays on public website', false, page.url());
    await shot(page, '06-enquire-error');
  }
} catch (error) {
  failed = true;
  record('Runner', false, error instanceof Error ? error.message : String(error));
  await shot(page, 'zz-error').catch(() => undefined);
} finally {
  await browser.close();
}

const passed = report.filter((row) => row.passed).length;
const total = report.length;
console.log(`\n${passed}/${total} scenarios passed`);
if (failed || report.some((row) => !row.passed)) {
  process.exitCode = 1;
}
