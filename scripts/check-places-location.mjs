import assert from 'node:assert/strict';
import {
  addressContainsLocation,
  buildPlacesSearchParams,
  formatPlacesLocationLabel,
  locationFilterNeedles,
  parsePlacesUrlState,
} from '../src/data/listings/placesLocation.ts';

assert.equal(addressContainsLocation('Aundh Road, Pune', 'Aundh'), true);
assert.equal(addressContainsLocation('Baner Road, Pune', 'Aundh'), false);
assert.equal(addressContainsLocation('Balewadi High Street, Pune', 'Balewadi'), true);
assert.equal(
  addressContainsLocation('Hinjewadi Rajiv Gandhi Infotech Park, Pune', 'Infotech Park (Hinjawadi)'),
  true,
);
assert.equal(
  addressContainsLocation('Hinjewadi Rajiv Gandhi Infotech Park, Pune', 'Hinjawadi'),
  true,
);
assert.equal(
  addressContainsLocation('Hinjawadi Rajiv Gandhi Infotech Park, Pune', 'Hinjewadi'),
  true,
);
assert.equal(addressContainsLocation('Baner Road, Pune', 'Infotech Park (Hinjawadi)'), false);
assert.equal(
  addressContainsLocation('Hinjewadi Rajiv Gandhi Infotech Park, 110001', 'Infotech Park (Hinjawadi)'),
  true,
);
assert.equal(addressContainsLocation('Some other street, 411057', 'Infotech Park (Hinjawadi)'), false);
assert.deepEqual(locationFilterNeedles('Infotech Park (Hinjawadi)'), [
  'infotech park',
  'hinjawadi',
  'hinjewadi',
]);
assert.deepEqual(locationFilterNeedles('Aundh'), ['aundh']);
assert.ok(!locationFilterNeedles('Infotech Park (Hinjawadi)').includes('pune'));
assert.equal(
  formatPlacesLocationLabel({
    location: 'Infotech Park (Hinjawadi)',
    pincode: '411057',
    district: 'Pune',
    state: 'MAHARASHTRA',
  }),
  'Infotech Park (Hinjawadi), Pune',
);

const legacy = parsePlacesUrlState(new URLSearchParams('q=Aundh&pincode=411007'));
assert.equal(legacy.selectedLocation?.location, 'Aundh');
assert.equal(legacy.selectedLocation?.pincode, '411007');
assert.equal(legacy.query, '');
assert.equal(legacy.legacyLocationInQ, true);

const canonical = parsePlacesUrlState(new URLSearchParams('location=Aundh&pincode=411007&q=PG'));
assert.equal(canonical.selectedLocation?.location, 'Aundh');
assert.equal(canonical.query, 'PG');
assert.equal(canonical.legacyLocationInQ, false);

const noLocation = parsePlacesUrlState(new URLSearchParams('q=PG'));
assert.equal(noLocation.selectedLocation, null);
assert.equal(noLocation.query, 'PG');

assert.equal(
  formatPlacesLocationLabel({ location: 'Aundh', pincode: '411007', district: 'Pune', state: 'MAHARASHTRA' }),
  'Aundh, Pune',
);

const params = buildPlacesSearchParams({
  selectedLocation: { location: 'Aundh', pincode: '411007', district: 'Pune', state: 'MAHARASHTRA' },
  query: 'PG',
});
assert.equal(params.get('location'), 'Aundh');
assert.equal(params.get('pincode'), '411007');
assert.equal(params.get('q'), 'PG');
assert.equal(params.get('district'), 'Pune');

const cleared = buildPlacesSearchParams({ selectedLocation: null, query: 'PG' });
assert.equal(cleared.get('location'), null);
assert.equal(cleared.get('q'), 'PG');

console.log('places location checks passed');
