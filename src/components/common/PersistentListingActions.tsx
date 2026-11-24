import { Building2, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useListingDrawer } from '../../context/ListingDrawerContext';
import { useListingPreview } from '../../context/ListingPreviewContext';

const BASE =
  'reg-focus inline-flex w-full items-center rounded-l-full rounded-r-none py-2.5 text-[12px] font-semibold shadow-[var(--shadow-md)] transition-[padding,gap] duration-300 ease-out sm:text-[13px]';

const COLLAPSE_DELAY_MS = 2000;

/**
 * Site-wide listing CTAs, pinned to the right edge below the navbar.
 * Opens the registration drawer in place instead of leaving the current page.
 */

function FloatingLabel({ expanded, children }: { expanded: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden={!expanded}
      className={`grid transition-[grid-template-columns] duration-300 ease-out ${
        expanded ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'
      }`}
    >
      <span
        className={`overflow-hidden whitespace-nowrap transition-opacity duration-300 ease-out ${
          expanded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </span>
    </span>
  );
}

export function PersistentListingActions() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { openListing } = useListingDrawer();
  const { previewOpen } = useListingPreview();
  const [scrollExpanded, setScrollExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const expanded = scrollExpanded || hovered;

  useEffect(() => {
    if (previewOpen) {
      return undefined;
    }

    let collapseTimer: ReturnType<typeof setTimeout> | null = null;
    let scrolling = false;

    const clearCollapseTimer = () => {
      if (collapseTimer != null) {
        clearTimeout(collapseTimer);
        collapseTimer = null;
      }
    };

    const scheduleCollapse = () => {
      clearCollapseTimer();
      collapseTimer = setTimeout(() => {
        scrolling = false;
        setScrollExpanded(false);
        collapseTimer = null;
      }, COLLAPSE_DELAY_MS);
    };

    const onScroll = () => {
      if (!scrolling) {
        scrolling = true;
        setScrollExpanded(true);
      }
      scheduleCollapse();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearCollapseTimer();
    };
  }, [pathname, previewOpen]);

  if (previewOpen) {
    return null;
  }

  const propertyLabel = t('listing.listProperty');
  const messLabel = t('listing.listMess');
  const pad = expanded ? 'gap-2 pr-3.5 pl-3.5 sm:pr-4' : 'gap-0 px-3';

  return (
    <nav
      aria-label={propertyLabel}
      className="fixed top-20 right-0 z-40 flex flex-col items-stretch gap-2 md:top-[4.75rem]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHovered(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => openListing('property')}
        aria-label={propertyLabel}
        className={`${BASE} ${pad} bg-register text-white hover:bg-register-hover`}
      >
        <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.9} aria-hidden />
        <FloatingLabel expanded={expanded}>{propertyLabel}</FloatingLabel>
      </button>
      <button
        type="button"
        onClick={() => openListing('mess')}
        aria-label={messLabel}
        className={`${BASE} ${pad} border border-r-0 border-register bg-white text-text hover:bg-register-soft`}
      >
        <UtensilsCrossed className="h-4 w-4 shrink-0 text-orange" strokeWidth={1.9} aria-hidden />
        <FloatingLabel expanded={expanded}>{messLabel}</FloatingLabel>
      </button>
    </nav>
  );
}
