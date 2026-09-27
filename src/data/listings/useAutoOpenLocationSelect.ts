import { useEffect, useRef, useState } from 'react';

/** Opens the location selector once when the page is opened without a location. */
export function useAutoOpenLocationSelect(hasLocation: boolean, skip = false) {
  const [locationOpen, setLocationOpen] = useState(false);
  const prompted = useRef(false);

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    if (hasLocation || skip) {
      prompted.current = true;
      return;
    }
    prompted.current = true;
    setLocationOpen(true);
  }, [hasLocation, skip]);

  return [locationOpen, setLocationOpen] as const;
}
