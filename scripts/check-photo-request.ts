import assert from 'node:assert/strict';
import {
  buildPhotoRequestMessage,
  hasActualListingPhotos,
  photoRequestActionLabel,
  whatsAppChatUrl,
  whatsAppPhoneDigits,
} from '../src/lib/photoRequest.ts';

const real = 'https://cdn.acomi.app/listings/room.jpg';
const representative = '/images/representative/co-living-1.png';
const stock = 'https://images.unsplash.com/photo-1';

assert.equal(hasActualListingPhotos([]), false);
assert.equal(hasActualListingPhotos(null), false);
assert.equal(hasActualListingPhotos([null, '', '   ', 'not a url']), false);
assert.equal(hasActualListingPhotos([representative, stock, 'representative:pg']), false);
assert.equal(photoRequestActionLabel(false), 'Request photos on WhatsApp');
assert.equal(hasActualListingPhotos([real]), true);
assert.equal(hasActualListingPhotos([representative, real]), true);
assert.equal(photoRequestActionLabel(true), 'Request more photos on WhatsApp');

const propertyEmpty = buildPhotoRequestMessage({
  kind: 'property',
  hasPhotos: false,
  name: 'Stanza Living Positano House',
  spaceType: 'CO_LIVING',
  location: 'Hinjawadi',
});
assert.match(propertyEmpty, /looking for a Co-living in Hinjawadi/);
assert.match(propertyEmpty, /actual photos of Stanza Living Positano House/);
assert.match(propertyEmpty, /room, bathroom and common areas/);
assert.doesNotMatch(propertyEmpty, /null|undefined/);

const propertyPhotos = buildPhotoRequestMessage({
  kind: 'property',
  hasPhotos: true,
  name: 'Stanza Living Positano House',
  spaceType: 'PG',
  location: 'Hinjawadi',
});
assert.match(propertyPhotos, /interested in Stanza Living Positano House/);
assert.match(propertyPhotos, /some more photos/);
assert.doesNotMatch(propertyPhotos, /looking for a/);

const noLocation = buildPhotoRequestMessage({
  kind: 'property',
  hasPhotos: false,
  name: 'Green PG',
  spaceType: 'PG',
  location: '  ',
});
assert.match(noLocation, /looking for a PG\./);
assert.doesNotMatch(noLocation, / in \./);

const messEmpty = buildPhotoRequestMessage({
  kind: 'mess',
  hasPhotos: false,
  name: 'Annapurna Mess',
});
assert.match(messEmpty, /mess service, Annapurna Mess/);
assert.match(messEmpty, /meals, food portions and menu/);
assert.doesNotMatch(messEmpty, /bathroom/);

const messPhotos = buildPhotoRequestMessage({
  kind: 'mess',
  hasPhotos: true,
  name: 'Annapurna Mess',
});
assert.match(messPhotos, /more photos of your meals/);

const edited = 'Hi, please send the kitchen photo.';
const url = whatsAppChatUrl('9876543210', edited);
assert.ok(url);
assert.match(url!, /^https:\/\/wa\.me\/919876543210\?text=/);
assert.equal(decodeURIComponent(url!.split('?text=')[1]), edited);

const punctuated = whatsAppChatUrl('+91 98765 43210', 'Line one.\nRoom, bath & hall?');
assert.match(punctuated!, /919876543210/);
assert.equal(decodeURIComponent(punctuated!.split('?text=')[1]), 'Line one.\nRoom, bath & hall?');

assert.equal(whatsAppPhoneDigits('+1 415 555 2671'), '14155552671');
assert.equal(whatsAppPhoneDigits('00919876543210'), '919876543210');
assert.equal(whatsAppPhoneDigits('09876543210'), '919876543210');
assert.equal(whatsAppChatUrl('', 'Hello'), null);
assert.equal(whatsAppChatUrl('123', 'Hello'), null);
assert.equal(whatsAppChatUrl(null, 'Hello'), null);
assert.equal(whatsAppPhoneDigits(representative), null);

console.log('photo request checks ok');
