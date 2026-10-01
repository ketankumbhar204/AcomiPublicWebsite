/**
 * Unit checks for enquire intent resume behaviour (no browser).
 */
import assert from 'node:assert/strict';

const INTENT_KEY = 'acomi.public.enquireIntent';
const memory = new Map();

const sessionStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: (key) => memory.delete(key),
};

function saveEnquireIntent(intent) {
  sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent));
}
function readEnquireIntent() {
  const raw = sessionStorage.getItem(INTENT_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}
function clearEnquireIntent() {
  sessionStorage.removeItem(INTENT_KEY);
}
function takeEnquireResumeIntent(listingKind) {
  const intent = readEnquireIntent();
  if (!intent) return null;
  if (!intent.resumeAfterAuth) {
    clearEnquireIntent();
    return null;
  }
  if (intent.listingKind !== listingKind) return null;
  clearEnquireIntent();
  return intent;
}

// Stale open-intent (old bug) must not reopen on refresh
saveEnquireIntent({
  listingId: 'sunrise',
  listingName: 'Sunrise PG',
  listingKind: 'places',
  path: '/places/sunrise',
});
assert.equal(takeEnquireResumeIntent('places'), null);
assert.equal(readEnquireIntent(), null);

// Post-login resume works once
saveEnquireIntent({
  listingId: 'sunrise',
  listingName: 'Sunrise PG',
  listingKind: 'places',
  path: '/places',
  resumeAfterAuth: true,
});
const first = takeEnquireResumeIntent('places');
assert.equal(first.listingId, 'sunrise');
assert.equal(takeEnquireResumeIntent('places'), null);
assert.equal(readEnquireIntent(), null);

// Wrong kind left intact for the other page
saveEnquireIntent({
  listingId: 'mess-1',
  listingName: 'Mess',
  listingKind: 'mess',
  path: '/meals',
  resumeAfterAuth: true,
});
assert.equal(takeEnquireResumeIntent('places'), null);
assert.equal(readEnquireIntent().listingKind, 'mess');
assert.equal(takeEnquireResumeIntent('mess').listingId, 'mess-1');

console.log('PASS enquire intent resume unit checks');
