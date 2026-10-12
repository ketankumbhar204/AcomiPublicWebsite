export const MAX_LISTING_PHOTOS = 3;
export const MAX_LISTING_PHOTO_BYTES = 3 * 1024 * 1024;

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

export function listingPhotoError(file: File, alreadySelected: number): string | null {
  if (alreadySelected >= MAX_LISTING_PHOTOS) {
    return 'You can add up to 3 photos.';
  }
  const type = file.type.toLowerCase();
  const extensionOk = /\.(jpe?g|png|webp)$/.test(file.name.toLowerCase());
  if (!ACCEPTED_TYPES.has(type) && !(type === '' && extensionOk)) {
    return 'Use a JPEG, PNG, or WebP image.';
  }
  if (file.size > MAX_LISTING_PHOTO_BYTES) {
    return 'Each photo must be 3 MB or smaller.';
  }
  if (file.size <= 0) {
    return 'That photo is empty.';
  }
  return null;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Could not read the photo'));
    };
    reader.onerror = () => reject(new Error('Could not read the photo'));
    reader.readAsDataURL(file);
  });
}
