import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { appHref, showsAccommodation, showsMeals, showsPublicListing } from '../src/auth/mySpacesActions.ts';

const menu = readFileSync(new URL('../src/components/layout/AccountMenu.tsx', import.meta.url), 'utf8');
const dashboardAt = menu.indexOf("t('nav.dashboard')");
const spacesAt = menu.indexOf('to="/my-spaces"');
const enquiriesAt = menu.indexOf('APP.enquiries');
assert.ok(dashboardAt > 0 && spacesAt > dashboardAt && enquiriesAt > spacesAt);

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
assert.match(app, /path="\/my-spaces"/);
assert.match(app, /MySpacesPage/);

const page = readFileSync(new URL('../src/pages/MySpacesPage.tsx', import.meta.url), 'utf8');
assert.match(page, /RequireAuth/);
assert.match(page, /listMyListings/);
assert.match(page, /showsPublicListing/);
assert.match(page, /showsAccommodation/);
assert.match(page, /showsMeals/);
assert.doesNotMatch(page, /localhost:5173|localhost:8080/);

const api = readFileSync(new URL('../src/auth/mySpacesApi.ts', import.meta.url), 'utf8');
assert.match(api, /\/me\/listings/);

for (const locale of ['en', 'hi', 'mr']) {
  const json = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${locale}.json`, import.meta.url), 'utf8'));
  assert.equal(typeof json.nav.mySpaces, 'string');
  assert.equal(typeof json.mySpaces.title, 'string');
  assert.equal(typeof json.mySpaces.pending, 'string');
  assert.equal(typeof json.mySpaces.listProperty, 'string');
}

const pending = {
  publication: 'PENDING',
  kind: 'PROPERTY',
  spaceId: null,
  publicPath: null,
  managePath: null,
  accommodationPath: null,
  mealsPath: null,
  operationalManagementAvailable: false,
};
assert.equal(showsPublicListing(pending), false);
assert.equal(showsAccommodation(pending), false);
assert.equal(showsMeals(pending), false);
assert.equal(appHref('https://app.acomi.in/', pending.managePath), null);

const liveMess = {
  publication: 'LIVE',
  kind: 'MESS',
  spaceType: 'MESS',
  spaceId: 'space-1',
  publicPath: '/meals/space-1',
  managePath: '/spaces/space-1/dashboard',
  accommodationPath: null,
  mealsPath: '/spaces/space-1/meals',
  operationalManagementAvailable: true,
};
assert.equal(showsPublicListing(liveMess), true);
assert.equal(showsAccommodation(liveMess), false);
assert.equal(showsMeals(liveMess), true);
assert.equal(appHref('https://app.acomi.in/', liveMess.managePath), 'https://app.acomi.in/spaces/space-1/dashboard');
assert.equal(appHref('https://app.acomi.in', 'https://evil.example/spaces'), null);

const livePg = {
  publication: 'LIVE',
  kind: 'PROPERTY',
  spaceType: 'PG',
  accommodationPath: '/spaces/space-2/accommodation',
  mealsPath: null,
  operationalManagementAvailable: true,
};
assert.equal(showsAccommodation(livePg), true);
assert.equal(showsMeals(livePg), false);

console.log('my spaces checks passed');
