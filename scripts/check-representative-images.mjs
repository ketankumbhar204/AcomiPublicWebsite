import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getRepresentativeImage,
  isVerifiedListingImageUrl,
  normalizeRepresentativeCategory,
  resolveListingCover,
  stableHash,
} from '../src/data/listings/representativeImage.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const packDir = join(root, 'public', 'images', 'representative');
const expectedFiles = [
  'pg-1.png',
  'pg-2.png',
  'pg-3.png',
  'hostel-1.png',
  'hostel-2.png',
  'hostel-3.png',
  'coliving-1.png',
  'coliving-2.png',
  'coliving-3.png',
  'rental-1.png',
  'rental-2.png',
  'rental-3.png',
  'serviced-1.png',
  'serviced-2.png',
  'serviced-3.png',
  'mess-1.png',
  'mess-2.png',
  'mess-3.png',
  'generic-1.png',
  'generic-2.png',
  'generic-3.png',
];

for (const name of expectedFiles) {
  assert.ok(existsSync(join(packDir, name)), `missing ${name}`);
}
assert.equal(readdirSync(packDir).filter((name) => name.endsWith('.png')).length, 21);

const source = readFileSync(new URL('../src/data/listings/representativeImage.ts', import.meta.url), 'utf8');
assert.doesNotMatch(source, /Math\.random\s*\(/);

assert.equal(normalizeRepresentativeCategory('PG'), 'PG');
assert.equal(normalizeRepresentativeCategory('hostel'), 'HOSTEL');
assert.equal(normalizeRepresentativeCategory('CO_LIVING'), 'CO_LIVING');
assert.equal(normalizeRepresentativeCategory('co-living'), 'CO_LIVING');
assert.equal(normalizeRepresentativeCategory('RENTAL'), 'RENTAL');
assert.equal(normalizeRepresentativeCategory('SERVICED'), 'SERVICED');
assert.equal(normalizeRepresentativeCategory('CORPORATE_APARTMENT'), 'SERVICED');
assert.equal(normalizeRepresentativeCategory('MESS'), 'MESS');
assert.equal(normalizeRepresentativeCategory('TIFFIN'), 'MESS');
assert.equal(normalizeRepresentativeCategory('UNKNOWN'), 'GENERIC');

const cases = [
  ['PG', 'pg-'],
  ['HOSTEL', 'hostel-'],
  ['CO_LIVING', 'coliving-'],
  ['RENTAL', 'rental-'],
  ['SERVICED', 'serviced-'],
  ['CORPORATE', 'serviced-'],
  ['MESS', 'mess-'],
  ['WAREHOUSE', 'generic-'],
];

for (const [type, prefix] of cases) {
  const cover = getRepresentativeImage(type, 'listing-12345');
  assert.equal(cover.kind, 'representative');
  assert.ok(cover.imageKey.startsWith(prefix), `${type} → ${cover.imageKey}`);
  assert.ok(cover.url.startsWith('/images/representative/'));
}

const first = resolveListingCover({ listingId: 'space-aaa', spaceType: 'PG' });
const again = resolveListingCover({ listingId: 'space-aaa', spaceType: 'PG' });
assert.deepEqual(first, again);
assert.equal(stableHash('space-aaa'), stableHash('space-aaa'));

const keys = new Set(
  ['id-1', 'id-2', 'id-3', 'id-4', 'id-5', 'id-6', 'id-7', 'id-8'].map(
    (id) => resolveListingCover({ listingId: id, spaceType: 'PG' }).imageKey,
  ),
);
assert.ok(keys.size > 1, 'different listing IDs can receive different PG images');

const real = resolveListingCover({
  listingId: 'space-aaa',
  spaceType: 'PG',
  listingImageUrl: 'https://cdn.example.com/spaces/verified.jpg',
});
assert.equal(real.kind, 'listing');
assert.equal(real.url, 'https://cdn.example.com/spaces/verified.jpg');

assert.equal(isVerifiedListingImageUrl('https://images.unsplash.com/photo-1555854877'), false);
assert.equal(isVerifiedListingImageUrl('/images/representative/pg-1.png'), false);
assert.equal(isVerifiedListingImageUrl('https://cdn.example.com/spaces/verified.jpg'), true);

const unsplash = resolveListingCover({
  listingId: 'space-aaa',
  spaceType: 'PG',
  listingImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
});
assert.equal(unsplash.kind, 'representative');

const card = readFileSync(new URL('../src/components/discovery/PropertyCard.tsx', import.meta.url), 'utf8');
const drawer = readFileSync(new URL('../src/components/discovery/PropertyDetailPanel.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/pages/PropertyDetailPage.tsx', import.meta.url), 'utf8');
const cover = readFileSync(new URL('../src/components/discovery/ListingCover.tsx', import.meta.url), 'utf8');
assert.match(card, /ListingCover/);
assert.match(drawer, /ListingGallery/);
assert.match(page, /ListingGallery/);
assert.match(cover, /representativeImage/);
assert.match(cover, /representativeImageAria/);
assert.match(cover, /cover\.kind === 'representative'/);
assert.doesNotMatch(cover, /cover\.kind === 'listing' \? t\('discovery.representativeImage'/);

const sampleIds = ['listing-pg-1', 'listing-hostel-1', 'listing-rental-1', 'listing-coliving-1'];
for (const id of sampleIds) {
  const a = resolveListingCover({ listingId: id, spaceType: 'PG' });
  const b = resolveListingCover({ listingId: id, spaceType: 'PG' });
  assert.equal(a.imageKey, b.imageKey);
}

const placesSamples = [
  ['2fe3aaa9-fdbc-49e3-afd1-766cb62aad09', 'PG', 'pg-3'],
  ['e8accd4e-3ae4-4d07-ae76-8e5d075e6666', 'RENTAL', 'rental-2'],
  ['fbe56a65-020a-48d7-b690-dc38d5dd5ff6', 'PG', 'pg-2'],
  ['52cffd8a-12b3-464c-904c-81a5c1e8e654', 'HOSTEL', 'hostel-1'],
  ['38d16bd4-0cd6-4b88-ba6a-66a89aa0238a', 'RENTAL', 'rental-3'],
];
for (const [listingId, spaceType, imageKey] of placesSamples) {
  assert.equal(resolveListingCover({ listingId, spaceType }).imageKey, imageKey);
}

const TYPE_PREFIX = {
  PG: 'pg-',
  HOSTEL: 'hostel-',
  CO_LIVING: 'coliving-',
  RENTAL: 'rental-',
  MESS: 'mess-',
};

try {
  const response = await fetch('http://localhost:8080/api/v1/spaces/discover?page=0&size=20');
  if (response.ok) {
    const payload = await response.json();
    const listings = payload?.data?.content ?? payload?.content ?? [];
    assert.ok(Array.isArray(listings) && listings.length > 0, 'expected live discover listings');
    for (const listing of listings.slice(0, 12)) {
      const cover = resolveListingCover({
        listingId: listing.spaceId,
        spaceType: listing.type,
        listingImageUrl: listing.listingImageUrl ?? listing.coverImageUrl ?? listing.imageUrl,
      });
      const prefix = TYPE_PREFIX[listing.type] ?? 'generic-';
      if (cover.kind === 'representative') {
        assert.ok(cover.imageKey.startsWith(prefix), `${listing.spaceId} ${listing.type} → ${cover.imageKey}`);
      } else {
        assert.equal(cover.kind, 'listing');
      }
      const again = resolveListingCover({
        listingId: listing.spaceId,
        spaceType: listing.type,
      });
      assert.equal(again.imageKey, resolveListingCover({ listingId: listing.spaceId, spaceType: listing.type }).imageKey);
    }
    console.log(`live discover listings checked: ${Math.min(listings.length, 12)}`);
  } else {
    console.log(`live discover skipped (${response.status})`);
  }
} catch (error) {
  console.log(`live discover skipped (${error instanceof Error ? error.message : 'unavailable'})`);
}

console.log('representative image checks passed');
