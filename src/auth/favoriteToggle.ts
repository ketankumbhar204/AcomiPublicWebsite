/** Pure favorite-list transitions so a failed or stale request cannot stick. */

export function favoriteIdsAfterToggle(
  current: readonly string[],
  spaceId: string,
): { ids: string[]; wantSaved: boolean } {
  const wantSaved = !current.includes(spaceId);
  const rest = current.filter((id) => id !== spaceId);
  return { wantSaved, ids: wantSaved ? [spaceId, ...rest] : rest };
}

export function favoriteIdsAfterRollback(
  current: readonly string[],
  spaceId: string,
  wantSaved: boolean,
): string[] {
  const rest = current.filter((id) => id !== spaceId);
  return wantSaved ? rest : [spaceId, ...rest];
}

export function shouldHydrateFavorites(
  requestStamp: number,
  currentStamp: number,
  requestUserId: string,
  currentUserId: string | null,
): boolean {
  return requestStamp === currentStamp && requestUserId === currentUserId;
}
