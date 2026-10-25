import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { appHref, showsAccommodation, showsMeals, showsPublicListing } from '../src/auth/mySpacesActions.ts';
import { applyListingFilters, listingFacetCounts, paginateListings } from '../src/auth/mySpacesView.ts';

const menu = readFileSync(new URL('../src/components/layout/AccountMenu.tsx', import.meta.url), 'utf8');
const dashboardAt = menu.indexOf("t('nav.dashboard')");
const spacesAt = menu.indexOf('to="/my-spaces"');
const enquiriesAt = menu.indexOf('APP.enquiries');
assert.ok(dashboardAt > 0 && spacesAt > dashboardAt && enquiriesAt > spacesAt);
assert.match(menu, /spaceCount > 0/);
assert.match(menu, /enquiryCount > 0/);

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

const detail = readFileSync(new URL('../src/pages/PropertyDetailPage.tsx', import.meta.url), 'utf8');
const mess = readFileSync(new URL('../src/pages/MessDetailPage.tsx', import.meta.url), 'utf8');
const actions = readFileSync(new URL('../src/components/discovery/OwnerListingActions.tsx', import.meta.url), 'utf8');
assert.match(detail, /OwnerListingActions/);
assert.match(mess, /OwnerListingActions/);
assert.match(actions, /openListingEdit/);
assert.match(actions, /showsManage/);
assert.match(actions, /mySpaces\.edit/);
assert.match(actions, /mySpaces\.manage/);

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

const listings = [
  { name: 'LK PG', kind: 'PROPERTY', publication: 'LIVE', city: 'Pune', spaceType: 'PG', address: 'Laxmi Chowk', registrationReference: 'SPC00001', startingPrice: 7500, updatedAt: '2026-10-01' },
  { name: 'Test 0001', kind: 'PROPERTY', publication: 'LIVE', city: 'Pune', spaceType: 'PG', address: 'Blue Ridge', registrationReference: 'SPC00002', startingPrice: 8000, updatedAt: '2026-10-02' },
  { name: 'Test 0000', kind: 'MESS', publication: 'PENDING', city: 'Pune', spaceType: 'MESS', address: 'hinjewadi', registrationReference: 'SPC00003', monthlyPrice: 3500, updatedAt: '2026-09-01' },
];
const counts = listingFacetCounts(listings, { search: '', city: '', spaceType: '' });
assert.deepEqual(counts, { all: 3, properties: 2, messes: 1, live: 2, pending: 1 });
const searched = applyListingFilters(listings, {
  kind: 'PROPERTY',
  status: 'LIVE',
  search: 'blue',
  city: 'Pune',
  spaceType: 'PG',
  sort: 'name',
});
assert.equal(searched.length, 1);
assert.equal(searched[0].registrationReference, 'SPC00002');
const byPrice = applyListingFilters(listings, {
  kind: 'ALL',
  status: 'ALL',
  search: '',
  city: '',
  spaceType: '',
  sort: 'priceAsc',
});
assert.deepEqual(byPrice.map((item) => item.registrationReference), ['SPC00003', 'SPC00001', 'SPC00002']);
const secondPage = paginateListings(byPrice, 2, 2);
assert.equal(secondPage.from, 3);
assert.equal(secondPage.to, 3);
assert.equal(secondPage.slice.length, 1);
const pendingOnly = applyListingFilters(listings, {
  kind: 'ALL',
  status: 'PENDING',
  search: 'spc00003',
  city: '',
  spaceType: '',
  sort: 'updated',
});
assert.equal(pendingOnly.length, 1);
assert.equal(showsPublicListing(pendingOnly[0]), false);
assert.equal(showsAccommodation(pendingOnly[0]), false);

console.log('my spaces checks passed');
