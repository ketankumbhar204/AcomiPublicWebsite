import { Building2, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useListingDrawer } from '../../context/ListingDrawerContext';
import { useListingPreview } from '../../context/ListingPreviewContext';

const BASE =
  'reg-focus inline-flex items-center gap-2 rounded-l-full rounded-r-none py-2.5 pr-3.5 pl-3.5 text-[12px] font-semibold shadow-[var(--shadow-md)] sm:pr-4 sm:text-[13px]';

/**
 * Site-wide listing CTAs, pinned to the right edge below the navbar.
 * Opens the registration drawer in place instead of leaving the current page.
 */
export function PersistentListingActions() {
  const { t } = useTranslation();
  const { openListing } = useListingDrawer();
  const { previewOpen } = useListingPreview();

  if (previewOpen) {
    return null;
  }

  return (
    <nav
      aria-label={t('listing.listProperty')}
      className="fixed top-20 right-0 z-40 flex flex-col items-stretch gap-2 md:top-[4.75rem]"
    >
      <button
        type="button"
        onClick={() => openListing('property')}
        className={`${BASE} bg-register text-white hover:bg-register-hover`}
      >
        <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.9} aria-hidden />
        {t('listing.listProperty')}
      </button>
      <button
        type="button"
        onClick={() => openListing('mess')}
        className={`${BASE} border border-r-0 border-register bg-white text-text hover:bg-register-soft`}
      >
        <UtensilsCrossed className="h-4 w-4 shrink-0 text-orange" strokeWidth={1.9} aria-hidden />
        {t('listing.listMess')}
      </button>
    </nav>
  );
}
