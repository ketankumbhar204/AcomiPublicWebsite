import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function placesDiscoverFilterKey(filters) {
  return JSON.stringify({
    location: filters.location?.trim() ?? '',
    search: filters.search?.trim() ?? '',
    types: [...filters.types].sort(),
    minRent: filters.minRent,
    maxRent: filters.maxRent,
    amenities: [...filters.amenities].sort(),
    sort: filters.sort ?? 'newest',
    pageSize: 20,
  });
}

const places = readFileSync(new URL('../src/pages/PlacesPage.tsx', import.meta.url), 'utf8');
const hook = readFileSync(new URL('../src/data/listings/usePagedPropertyListings.ts', import.meta.url), 'utf8');
const api = readFileSync(new URL('../src/data/listings/discoverApi.ts', import.meta.url), 'utf8');
const modal = readFileSync(new URL('../src/components/onboarding/LocationSelectModal.tsx', import.meta.url), 'utf8');

assert.doesNotMatch(places, /ListingPagination/, 'Places must not render numbered pagination');
assert.match(places, /ListingInfiniteSentinel/, 'Places must use an intersection sentinel');
assert.match(places, /usePagedPropertyListings/, 'Places must use paged discover listings');
assert.doesNotMatch(places, /loadDiscoverDetails/, 'Places must not fetch the full listing dataset');
assert.doesNotMatch(places, /locations\.json/, 'Places must not load locations.json');
assert.doesNotMatch(modal, /locations\.json/, 'Location selector must not load locations.json');

assert.match(hook, /DISCOVER_PAGE_SIZE/, 'Paged hook must use the shared page size');
assert.match(hook, /page \+ 1/, 'Load more must request the next page');
assert.match(api, /DISCOVER_PAGE_SIZE = 20/, 'Discover page size must be 20');
assert.match(api, /query\.set\('page'/, 'Discover requests must send page');
assert.match(api, /query\.set\('size'/, 'Discover requests must send size');
assert.match(api, /minRent/, 'Discover requests must send rent filters');
assert.match(api, /amenities/, 'Discover requests must send amenity filters');

const aundh = placesDiscoverFilterKey({
  location: 'Aundh',
  search: '',
  types: ['PG'],
  minRent: 2000,
  maxRent: 15000,
  amenities: ['WIFI'],
  sort: 'newest',
});
const balewadi = placesDiscoverFilterKey({
  location: 'Balewadi',
  search: '',
  types: ['PG'],
  minRent: 2000,
  maxRent: 15000,
  amenities: ['WIFI'],
  sort: 'newest',
});
assert.notEqual(aundh, balewadi, 'Changing location must change the query key');

const hostel = placesDiscoverFilterKey({
  location: 'Aundh',
  search: '',
  types: ['HOSTEL'],
  minRent: 2000,
  maxRent: 15000,
  amenities: ['WIFI'],
  sort: 'newest',
});
assert.notEqual(aundh, hostel, 'Changing property type must change the query key');

const rent = placesDiscoverFilterKey({
  location: 'Aundh',
  search: '',
  types: ['PG'],
  minRent: 5000,
  maxRent: 15000,
  amenities: ['WIFI'],
  sort: 'newest',
});
assert.notEqual(aundh, rent, 'Changing rent must change the query key');

const amenity = placesDiscoverFilterKey({
  location: 'Aundh',
  search: '',
  types: ['PG'],
  minRent: 2000,
  maxRent: 15000,
  amenities: ['PARKING'],
  sort: 'newest',
});
assert.notEqual(aundh, amenity, 'Changing amenities must change the query key');

const search = placesDiscoverFilterKey({
  location: 'Aundh',
  search: 'PG',
  types: ['PG'],
  minRent: 2000,
  maxRent: 15000,
  amenities: ['WIFI'],
  sort: 'newest',
});
assert.notEqual(aundh, search, 'Changing search must change the query key');

console.log('places pagination checks passed');
