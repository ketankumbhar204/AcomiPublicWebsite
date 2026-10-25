import { useEffect, useState } from 'react';
import { Building2, Pencil, Settings2, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthProvider';
import { listMyListings, type MeListing } from '../../auth/mySpacesApi';
import { appHref, showsAccommodation, showsManage, showsMeals } from '../../auth/mySpacesActions';
import { ActionButton } from '../common/ActionButton';
import { BUTTON_BASE, BUTTON_VARIANTS } from '../common/ButtonLink';
import { APP } from '../../constants/links';
import { useListingDrawer } from '../../context/ListingDrawerContext';

type OwnerListingActionsProps = {
  listing: MeListing | null;
  onUpdated?: () => void;
};

/** The signed-in member's listing when they own or manage this space. */
export function useMyListing(spaceId: string | null | undefined): MeListing | null {
  const { isAuthenticated } = useAuth();
  const { subscribeListingSaved } = useListingDrawer();
  const [mine, setMine] = useState<MeListing | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => subscribeListingSaved(() => setReload((value) => value + 1)), [subscribeListingSaved]);

  useEffect(() => {
    if (!isAuthenticated || !spaceId) {
      setMine(null);
      return;
    }
    let cancelled = false;
    setMine(null);
    void listMyListings()
      .then((items) => {
        if (cancelled) return;
        setMine(items.find((item) => item.spaceId === spaceId) ?? null);
      })
      .catch(() => {
        if (!cancelled) setMine(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, reload, spaceId]);

  return mine;
}

/** Owner actions from My Spaces: edit the public listing, and open operations. */
export function OwnerListingActions({ listing, onUpdated }: OwnerListingActionsProps) {
  const { t } = useTranslation();
  const { openListingEdit, subscribeListingSaved } = useListingDrawer();

  useEffect(() => subscribeListingSaved(() => onUpdated?.()), [onUpdated, subscribeListingSaved]);

  if (!listing) return null;
  const mine = listing;

  const manage = showsManage(mine) ? appHref(APP.web, mine.managePath) : null;
  const accommodation = showsAccommodation(mine) ? appHref(APP.web, mine.accommodationPath) : null;
  const meals = showsMeals(mine) ? appHref(APP.web, mine.mealsPath) : null;
  const linkClass = `${BUTTON_BASE} ${BUTTON_VARIANTS.outline} !h-11 !rounded-xl !px-3 !text-[13px]`;
  const primaryClass =
    'inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-register px-3 text-[13px] font-semibold whitespace-nowrap text-white hover:bg-register-hover';

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <ActionButton
        variant="outline"
        onClick={() => openListingEdit(mine)}
        className="!h-11 !rounded-xl !px-3 !text-[13px]"
      >
        <Pencil aria-hidden className="h-4 w-4" />
        {t('mySpaces.edit')}
      </ActionButton>
      {accommodation ? (
        <a href={accommodation} className={primaryClass}>
          <Building2 aria-hidden className="h-4 w-4" />
          {t('mySpaces.accommodation')}
        </a>
      ) : null}
      {meals ? (
        <a href={meals} className={primaryClass}>
          <UtensilsCrossed aria-hidden className="h-4 w-4" />
          {t('mySpaces.mealManagement')}
        </a>
      ) : null}
      {manage ? (
        <a href={manage} className={linkClass}>
          <Settings2 aria-hidden className="h-4 w-4" />
          {t('mySpaces.manage')}
        </a>
      ) : null}
    </div>
  );
}
