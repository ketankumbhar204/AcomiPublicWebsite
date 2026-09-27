import { useEffect, useRef } from 'react';

type ListingInfiniteSentinelProps = {
  onVisible: () => void;
  disabled?: boolean;
};

export function ListingInfiniteSentinel({ onVisible, disabled = false }: ListingInfiniteSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      return;
    }
    const node = ref.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onVisible();
        }
      },
      { root: null, rootMargin: '400px 0px', threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, onVisible]);

  return <div ref={ref} aria-hidden className="h-8 w-full" />;
}
