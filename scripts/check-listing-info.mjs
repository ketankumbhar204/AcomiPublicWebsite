import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INFO_GRID_KEYS, listingInfoFlags } from '../src/data/listings/listingInfo.ts';

assert.deepEqual(
  listingInfoFlags({
    hasContact: true,
    addressLine: 'Hinjewadi Rajiv Gandhi Infotech Park',
    mapUrl: 'https://maps.google.com/?q=Hinjewadi',
    startingPrice: 8000,
    amenityCodes: ['WIFI', 'FOOD_INCLUDED'],
    foodIncludedInRent: true,
  }),
  { contact: true, address: true, map: true, rent: true, amenities: true, food: true },
);

assert.deepEqual(
  listingInfoFlags({
    hasContact: true,
    addressLine: 'Aundh Road, Pune',
    mapUrl: '',
    startingPrice: null,
    amenityCodes: [],
  }),
  { contact: true, address: true, map: false, rent: false, amenities: false, food: false },
);

assert.deepEqual(
  listingInfoFlags({
    hasContact: false,
    addressLine: 'Balewadi High Street',
    mapUrl: undefined,
    startingPrice: 0,
    amenityCodes: ['FOOD_INCLUDED'],
    foodIncludedInRent: false,
  }),
  { contact: false, address: true, map: false, rent: false, amenities: false, food: true },
);

assert.deepEqual(
  listingInfoFlags({
    hasContact: false,
    addressLine: '',
    amenityCodes: [],
  }),
  { contact: false, address: false, map: false, rent: false, amenities: false, food: false },
);

assert.equal(
  listingInfoFlags({ hasContact: true, hasMobileContact: false, addressLine: 'Wakad' }).contact,
  false,
);
assert.deepEqual([...INFO_GRID_KEYS], ['contact', 'address', 'map', 'rent', 'amenities', 'food']);

const chips = readFileSync(new URL('../src/components/discovery/ListingInfoChips.tsx', import.meta.url), 'utf8');
const card = readFileSync(new URL('../src/components/discovery/PropertyCard.tsx', import.meta.url), 'utf8');
const drawer = readFileSync(new URL('../src/components/discovery/PropertyDetailPanel.tsx', import.meta.url), 'utf8');
const places = readFileSync(new URL('../src/pages/PlacesPage.tsx', import.meta.url), 'utf8');
const messCard = readFileSync(new URL('../src/components/discovery/MessCard.tsx', import.meta.url), 'utf8');
const messDrawer = readFileSync(new URL('../src/components/discovery/MessDetailPanel.tsx', import.meta.url), 'utf8');
assert.match(card, /getContactDetails/);
assert.match(card, /onEnquire/);
assert.match(drawer, /getContactDetails/);
assert.match(drawer, /ListingInfoChips/);
assert.match(readFileSync(new URL('../src/components/discovery/ListingCardMeta.tsx', import.meta.url), 'utf8'), /infoAvailable/);
assert.match(places, /setEnquireOpen\(true\)/);
assert.match(messCard, /getContactDetails/);
assert.match(messDrawer, /getContactDetails/);
assert.doesNotMatch(card, /mobileNumber|Contact 1|9991/);
assert.doesNotMatch(drawer, /mobileNumber|Contact 1/);
assert.doesNotMatch(messCard, /mobileNumber|Contact 1/);
assert.doesNotMatch(messDrawer, /mobileNumber|Contact 1/);
assert.match(chips, /grid-cols-2/);
assert.match(chips, /INFO_GRID_KEYS/);
assert.match(chips, /#F4F5F7/);
assert.match(chips, /#F3FBF7/);
assert.match(card, /showMaps=\{false\}/);
assert.match(card, /whitespace-nowrap/);
assert.match(card, /discovery\.view/);
assert.match(card, /@min-\[260px\]:flex-row/);
assert.match(messCard, /whitespace-nowrap/);
assert.match(messCard, /@min-\[260px\]:flex-row/);
assert.match(messCard, /showMaps=\{false\}/);
assert.doesNotMatch(card, /href=.*maps/);

console.log('listing info checks passed');
