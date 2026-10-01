import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  getInquiredIds,
  listingAlreadyInquired,
  loadInquiredListings,
  markInquired,
  resetInquiredListings,
} from '../src/auth/inquiredListings.ts';

resetInquiredListings();
assert.equal(listingAlreadyInquired([], 'space-a'), false);

let calls = 0;
const pending = loadInquiredListings('user-1', async () => {
  calls += 1;
  return ['space-a', 'mess-1'];
});
await loadInquiredListings('user-1', async () => {
  calls += 1;
  return ['should-not-load'];
});
await pending;

assert.equal(calls, 1);
assert.equal(listingAlreadyInquired(getInquiredIds(), 'space-a'), true);
assert.equal(listingAlreadyInquired(getInquiredIds(), 'mess-1'), true);
assert.equal(listingAlreadyInquired(getInquiredIds(), 'space-b'), false);

markInquired('space-a');
await loadInquiredListings('user-1', async () => ['mess-1']);
assert.equal(getInquiredIds().has('space-a'), false);
assert.equal(getInquiredIds().has('mess-1'), true);

markInquired('space-new');
assert.equal(getInquiredIds().has('space-new'), true);
assert.equal(getInquiredIds().has('space-b'), false);

resetInquiredListings();
assert.equal(getInquiredIds().has('space-a'), false);
await loadInquiredListings('user-2', async () => []);
assert.equal(getInquiredIds().has('space-a'), false);

const files = [
  'src/components/discovery/PropertyCard.tsx',
  'src/components/discovery/MessCard.tsx',
  'src/components/discovery/PropertyDetailPanel.tsx',
  'src/components/discovery/MessDetailPanel.tsx',
  'src/pages/PropertyDetailPage.tsx',
  'src/pages/MessDetailPage.tsx',
  'src/components/discovery/EnquireDialog.tsx',
  'src/auth/useAlreadyInquired.ts',
];

for (const file of files) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  if (file.endsWith('EnquireDialog.tsx')) {
    assert.match(source, /markInquired\(/);
  } else if (file.endsWith('useAlreadyInquired.ts')) {
    assert.match(source, /\/enquiries\/me\/listing-ids/);
    assert.doesNotMatch(source, /\/enquiries\/me['"`]/);
  } else {
    assert.match(source, /useAlreadyInquired\(/);
    assert.match(source, /InquirySent/);
    assert.match(source, /alreadyInquired/);
  }
}

console.log('inquired listing checks passed');
