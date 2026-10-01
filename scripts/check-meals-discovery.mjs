import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { listingInfoFlags, listingMealInfoFlags } from '../src/data/listings/listingInfo.ts';
import {
  addressContainsLocation,
  buildPlacesSearchParams,
  parsePlacesUrlState,
} from '../src/data/listings/placesLocation.ts';

function mealsDiscoverFilterKey(filters) {
  return JSON.stringify({
    location: filters.location?.trim() ?? '',
    pincode: filters.pincode?.trim() ?? '',
    district: filters.district?.trim() ?? '',
    state: filters.state?.trim() ?? '',
    cityTaluka: filters.cityTaluka?.trim() ?? '',
    search: filters.search?.trim() ?? '',
    type: 'MESS',
    sort: filters.sort ?? 'newest',
    pageSize: 20,
  });
}

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

const meals = read('../src/pages/MealsPage.tsx');
const hook = read('../src/data/listings/usePagedMessListings.ts');
const api = read('../src/data/listings/discoverApi.ts');
const modal = read('../src/components/onboarding/LocationSelectModal.tsx');
const card = read('../src/components/discovery/MessCard.tsx');
const drawer = read('../src/components/discovery/MessDetailPanel.tsx');
const detail = read('../src/pages/MessDetailPage.tsx');
const cover = read('../src/data/listings/representativeImage.ts');

assert.doesNotMatch(meals, /ListingPagination/, 'Meals must not render numbered pagination');
assert.match(meals, /ListingInfiniteSentinel/, 'Meals must use an intersection sentinel');
assert.match(meals, /usePagedMessListings/, 'Meals must use paged discover listings');
assert.match(meals, /LocationSelectModal/, 'Meals must reuse the location selector');
assert.match(meals, /rankingContext/, 'Meals location search must pass ranking context');
assert.doesNotMatch(meals, /loadDiscoverDetails/, 'Meals must not fetch the full listing dataset');
assert.doesNotMatch(meals, /useMessListings/, 'Meals must not use the fetch-all mess hook');
assert.doesNotMatch(meals, /filterMesses/, 'Meals must not filter pages locally');
assert.doesNotMatch(meals, /uniqueLocalities/, 'Meals must not derive locality checkboxes from loaded pages');
assert.doesNotMatch(meals, /locations\.json/, 'Meals must not load locations.json');
assert.doesNotMatch(modal, /locations\.json/, 'Location selector must not load locations.json');
assert.doesNotMatch(meals, /reference\/locations\.json/, 'Meals must not request reference/locations.json');

assert.match(hook, /type: 'MESS'/, 'Meals discover requests must send type=MESS');
assert.match(hook, /DISCOVER_PAGE_SIZE/, 'Paged mess hook must use the shared page size');
assert.match(hook, /page \+ 1/, 'Load more must request the next page');
assert.doesNotMatch(hook, /minRent/, 'Meals must not send property rent filters');
assert.doesNotMatch(hook, /Math\.random/, 'Meals pagination must not use random assignment');
assert.match(api, /DISCOVER_PAGE_SIZE = 20/, 'Discover page size must be 20');
assert.match(api, /query\.set\('location'/, 'Discover requests must send location separately');
assert.match(api, /query\.set\('search'/, 'Discover requests must send search separately');

const aundh = mealsDiscoverFilterKey({ location: 'Aundh', search: '', sort: 'newest' });
const hinjewadi = mealsDiscoverFilterKey({ location: 'Hinjewadi', search: '', sort: 'newest' });
assert.notEqual(aundh, hinjewadi, 'Changing location must change the meals query key');

const search = mealsDiscoverFilterKey({ location: 'Aundh', search: 'tiffin', sort: 'newest' });
assert.notEqual(aundh, search, 'Changing search must change the meals query key');

const sort = mealsDiscoverFilterKey({ location: 'Aundh', search: '', sort: 'price-asc' });
assert.notEqual(aundh, sort, 'Changing sort must change the meals query key');

const pincode = mealsDiscoverFilterKey({ location: 'Aundh', pincode: '411007', search: '', sort: 'newest' });
assert.notEqual(aundh, pincode, 'Changing pincode must change the meals query key');

assert.equal(addressContainsLocation('Devi Chowk, Hinjawadi 411057', 'Hinjewadi'), true);
assert.equal(addressContainsLocation('Aundh Road, Pune', 'Hinjewadi'), false);

const parsed = parsePlacesUrlState(new URLSearchParams('location=Aundh&pincode=411007&q=tiffin'));
assert.equal(parsed.selectedLocation?.location, 'Aundh');
assert.equal(parsed.query, 'tiffin');
const params = buildPlacesSearchParams({
  selectedLocation: parsed.selectedLocation,
  query: 'tiffin',
});
assert.equal(params.get('location'), 'Aundh');
assert.equal(params.get('q'), 'tiffin');

assert.deepEqual(
  listingInfoFlags({
    hasContact: true,
    addressLine: 'Devi Chowk, Hinjawadi 411057',
    mapUrl: 'https://maps.google.com/?q=Hinjawadi',
    monthlyPrice: 3500,
  }),
  { contact: true, address: true, map: true, rent: true, amenities: false, food: false },
);

assert.deepEqual(
  listingMealInfoFlags({
    hasContact: true,
    addressLine: 'Devi Chowk, Hinjawadi 411057',
    mapUrl: '',
    monthlyPrice: null,
    mealPrice: 90,
    mealsServed: ['BREAKFAST', 'LUNCH'],
    mealTiming: '',
    foodType: 'Vegetarian',
    subscription: 'Monthly',
  }),
  {
    contact: true,
    address: true,
    map: false,
    rent: true,
    amenities: false,
    food: false,
    menu: true,
    mealTiming: false,
    foodType: true,
    subscription: true,
  },
);

assert.match(card, /getContactDetails/);
assert.match(card, /onEnquire/);
assert.match(card, /surface="meals"/);
assert.match(drawer, /getContactDetails/);
assert.match(drawer, /infoAvailable/);
assert.match(detail, /getContactDetails/);
assert.doesNotMatch(card, /mobileNumber|Contact 1|9991/);
assert.doesNotMatch(drawer, /mobileNumber|Contact 1/);
assert.doesNotMatch(detail, /discovery\.contactEnquire/);
assert.match(cover, /MESS/, 'Representative images must include a MESS pack');
assert.doesNotMatch(cover, /Math\.random\s*\(/, 'Representative images must be deterministic');

console.log('meals discovery checks passed');
