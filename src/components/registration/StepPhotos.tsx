import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { MAX_LISTING_PHOTOS, listingPhotoError } from './listingPhotos';

export type SelectedListingPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

type StepPhotosProps = {
  photos: SelectedListingPhoto[];
  onChange: (photos: SelectedListingPhoto[]) => void;
  note?: string;
};

export function StepPhotos({ photos, onChange, note }: StepPhotosProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const atLimit = photos.length >= MAX_LISTING_PHOTOS;

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) {
      return;
    }
    const next = [...photos];
    let rejection: string | null = null;
    for (const file of Array.from(list)) {
      const error = listingPhotoError(file, next.length);
      if (error) {
        rejection = error;
        break;
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${next.length}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
    setMessage(rejection);
    onChange(next);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function remove(id: string) {
    const target = photos.find((photo) => photo.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setMessage(null);
    onChange(photos.filter((photo) => photo.id !== id));
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-semibold text-text">Upload photos</h3>
        <p className="mt-1 text-[13px] text-muted">Add up to 3 photos. Maximum 3 MB per photo.</p>
        {note ? <p className="mt-1 text-[13px] text-muted">{note}</p> : null}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={atLimit}
        className="reg-focus flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-6 text-center text-[13px] font-medium text-text-secondary transition hover:border-register hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ImagePlus aria-hidden className="h-5 w-5 text-register" />
        {atLimit ? '3 photos added' : 'Choose photos'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        className="sr-only"
        onChange={(event) => addFiles(event.target.files)}
      />

      <p className="text-[12px] text-muted" aria-live="polite">
        {photos.length} of 3 photos added.
      </p>

      {message ? (
        <p role="alert" className="text-[12px] text-danger">
          {message}
        </p>
      ) : null}

      {photos.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <li key={photo.id} className="relative overflow-hidden rounded-xl border border-border">
              <img src={photo.previewUrl} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(photo.id)}
                aria-label={`Remove ${photo.file.name}`}
                className="reg-focus absolute top-1.5 right-1.5 rounded-full bg-white/95 p-1 text-text shadow-sm"
              >
                <X aria-hidden className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-muted">Photos are optional. You can continue without any.</p>
      )}
    </div>
  );
}
