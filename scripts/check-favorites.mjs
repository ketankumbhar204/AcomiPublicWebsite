import assert from 'node:assert/strict';
import {
  favoriteIdsAfterRollback,
  favoriteIdsAfterToggle,
  shouldHydrateFavorites,
} from '../src/auth/favoriteToggle.ts';

const added = favoriteIdsAfterToggle([], 'pg-1');
assert.equal(added.wantSaved, true);
assert.deepEqual(added.ids, ['pg-1']);

const removed = favoriteIdsAfterToggle(['pg-1', 'mess-1'], 'mess-1');
assert.equal(removed.wantSaved, false);
assert.deepEqual(removed.ids, ['pg-1']);

const rolledBack = favoriteIdsAfterRollback(added.ids, 'pg-1', true);
assert.deepEqual(rolledBack, []);

const restored = favoriteIdsAfterRollback(['pg-1'], 'mess-1', false);
assert.deepEqual(restored, ['mess-1', 'pg-1']);

assert.equal(shouldHydrateFavorites(2, 2, 'user-a', 'user-a'), true);
assert.equal(shouldHydrateFavorites(1, 2, 'user-a', 'user-a'), false);
assert.equal(shouldHydrateFavorites(2, 2, 'user-a', 'user-b'), false);
assert.equal(shouldHydrateFavorites(2, 2, 'user-a', null), false);

const navbar = await import('node:fs').then((fs) =>
  fs.readFileSync(new URL('../src/components/layout/FavoritesMenu.tsx', import.meta.url), 'utf8'),
);
assert.match(navbar, /to="\/favorites"/);
assert.match(navbar, /Favorites/);
assert.doesNotMatch(navbar, /localStorage|acomi\.favorites/);

const context = await import('node:fs').then((fs) =>
  fs.readFileSync(new URL('../src/context/FavoritesContext.tsx', import.meta.url), 'utf8'),
);
assert.match(context, /favoritesApi/);
assert.match(context, /openAuth\('login'\)/);
assert.doesNotMatch(context, /localStorage|acomi\.favorites/);

const route = await import('node:fs').then((fs) =>
  fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8'),
);
assert.match(route, /path="\/favorites"/);

console.log('favorites checks passed');
