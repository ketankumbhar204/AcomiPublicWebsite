import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canViewContactDirectly } from '../src/auth/contactViewQuota.ts';

const base = {
  dailyFreeLimit: 5,
  freeUsedToday: 5,
  freeRemainingToday: 0,
  availableCredits: 0,
  viewHereDailyLimit: 5,
  viewHereUsedToday: 0,
  viewHereRemainingToday: 2,
};

assert.equal(canViewContactDirectly(base), true);
assert.equal(canViewContactDirectly({ ...base, viewHereRemainingToday: 0 }), false);
assert.equal(canViewContactDirectly({ ...base, viewHereDailyLimit: 0 }), false);
assert.equal(canViewContactDirectly(null), false);

const dialog = readFileSync('src/components/discovery/EnquireDialog.tsx', 'utf8');
assert.match(dialog, /canViewContactDirectly\(quota\)/);
assert.match(dialog, /directViewRef/);
assert.match(dialog, /deliveryChannel: 'VIEW_HERE'/);
assert.doesNotMatch(dialog, /showViewHere = viewHereLimit > 0 && viewHereRemaining > 0 && !remainingExhausted/);

for (const page of [
  'src/pages/PlacesPage.tsx',
  'src/pages/MealsPage.tsx',
  'src/pages/PropertyDetailPage.tsx',
  'src/pages/MessDetailPage.tsx',
]) {
  assert.match(readFileSync(page, 'utf8'), /EnquireDialog/);
}
