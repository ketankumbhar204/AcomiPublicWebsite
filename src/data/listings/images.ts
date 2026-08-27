/** Remote listing photos. Product screenshots elsewhere on the site are left untouched. */
export function listingPhoto(id: string, w = 900): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
}
