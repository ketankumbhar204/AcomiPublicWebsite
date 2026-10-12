import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  AMENITY_ICONS,
  PRESET_AMENITY_CODES,
  PRESET_AMENITY_LABELS,
  addCustomAmenity,
  normalizeAmenityAssignments,
  togglePresetAmenity,
} from '../src/lib/amenities.ts';

assert.deepEqual([...PRESET_AMENITY_CODES], [
  'WIFI',
  'FOOD_INCLUDED',
  'WASHING_MACHINE',
  'HOT_WATER',
  'PARKING',
  'REFRIGERATOR',
  'HOUSEKEEPING',
  'CCTV',
  'POWER_BACKUP',
  'RO_WATER',
  'BEDS',
  'WARDROBE',
]);

for (const code of PRESET_AMENITY_CODES) {
  assert.equal(typeof AMENITY_ICONS[code], 'object');
  assert.ok(PRESET_AMENITY_LABELS[code]);
}
assert.equal(typeof AMENITY_ICONS.CUSTOM, 'object');

const selected = togglePresetAmenity([], 'BEDS');
assert.deepEqual(selected, [{ code: 'BEDS', label: 'Beds' }]);
assert.deepEqual(togglePresetAmenity(selected, 'BEDS'), []);

const restored = normalizeAmenityAssignments(['WIFI', { code: 'CUSTOM', label: ' Gym ' }]);
assert.deepEqual(restored, [
  { code: 'WIFI', label: 'WiFi' },
  { code: 'CUSTOM', label: 'Gym' },
]);

assert.equal(addCustomAmenity(restored, 'gym').error, 'duplicate');
assert.equal(addCustomAmenity(restored, '  ').error, 'required');
assert.equal(addCustomAmenity(restored, 'WiFi').error, 'duplicate');

const added = addCustomAmenity(selected, 'Gym access');
assert.equal(added.error, null);
assert.equal(added.amenities.at(-1)?.label, 'Gym access');

const source = readFileSync(new URL('../src/constants/propertyRegistration.ts', import.meta.url), 'utf8');
assert.match(source, /PRESET_AMENITY_CODES/);
assert.doesNotMatch(source, /PRIMARY_AMENITIES/);

console.log('registration amenities ok');
