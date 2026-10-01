import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(full, files);
    } else if (/\.(ts|tsx|js|jsx|json)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const hero = read('src/components/home/Hero.tsx');
const modal = read('src/components/onboarding/LocationSelectModal.tsx');
const api = read('src/api/locationsApi.ts');
const context = read('src/context/UserTypeContext.tsx');
const places = read('src/pages/PlacesPage.tsx');

assert(hero.includes('openLocationSelector'), 'Home rental card must open the location popup');
assert(hero.includes("id === 'ACCOMMODATION_SEEKER'"), 'Search rental property card must intercept navigation');
assert(hero.includes("id === 'MEAL_SEEKER'"), 'Search meal service card must intercept navigation');
assert(hero.includes('openLocationSelector(id)'), 'Home meal card must open the same location popup');
assert(modal.includes('AUTOCOMPLETE_DEBOUNCE_MS'), 'Location search must be debounced');
assert(modal.includes('AUTOCOMPLETE_MIN_LENGTH'), 'Autocomplete must wait for a meaningful query');
assert(modal.includes('locationsApi'), 'Popup must call backend location APIs');
assert(modal.includes('.autocomplete('), 'Popup must call the ACOMI autocomplete endpoint');
assert(modal.includes('listStates'), 'Popup must keep the structured location selector');
assert(!modal.includes('locations.json'), 'Popup must not fetch locations.json');
assert(!modal.includes('api.geoapify.com'), 'Popup must not call Geoapify directly');
assert(api.includes('/locations/search'), 'API client must keep /locations/search');
assert(api.includes('/locations/autocomplete'), 'API client must use /locations/autocomplete');
assert(!api.includes('api.geoapify.com'), 'API client must not call Geoapify directly');
assert(!api.includes('locations.json'), 'API client must not request locations.json');
assert(context.includes('LocationSelectModal'), 'Location popup must be mounted once for reopen');
assert(context.includes("params.set('location'"), 'Home location confirm must write location query param');
assert(!context.includes("params.set('q'"), 'Home location confirm must not overload q as the location');
assert(context.includes("'/meals'"), 'Meal location confirm must navigate to /meals');
assert(context.includes('MEAL_SEEKER'), 'Location popup must support meal seekers');
assert(places.includes('useSearchParams'), 'Places page must read the selected location from the URL');
assert(places.includes('LocationSelectModal'), 'Places page must reuse the home location popup');
assert(places.includes('useAutoOpenLocationSelect'), 'Places must prompt for location when opened directly');
const meals = read('src/pages/MealsPage.tsx');
assert(meals.includes('useAutoOpenLocationSelect'), 'Meals must prompt for location when opened directly');
assert(places.includes('location=' ) || places.includes("location"), 'Places page must persist a location query param');
assert(!places.includes('uniqueCities'), 'Places page must not derive the chip from listing cities');

const placesLocation = read('src/data/listings/placesLocation.ts');
assert(placesLocation.includes('legacyLocationInQ'), 'Places URL parser must accept legacy q+pincode location links');
assert(placesLocation.includes('addressContainsLocation'), 'Places must match selected location against listing address');
assert(places.includes('loadDiscoverDetails') || read('src/data/listings/useDiscoverListings.ts').includes('location'), 'Places listings fetch must pass the selected location to the API');

const srcFiles = walk(path.join(root, 'src'));
for (const file of srcFiles) {
  const text = fs.readFileSync(file, 'utf8');
  assert(
    !text.includes('reference/locations.json'),
    `${path.relative(root, file)} must not download reference/locations.json`,
  );
}

console.log('location selector checks passed');
