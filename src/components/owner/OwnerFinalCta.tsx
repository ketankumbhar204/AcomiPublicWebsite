import { useTranslation } from 'react-i18next';
import { SignInCta } from '../auth/SignInCta';
import { useListingDrawer } from '../../context/ListingDrawerContext';
import { Container } from '../layout/Container';
import { REGISTER_CTA_CLS } from './OwnerHero';

export function OwnerFinalCta() {
  const { t } = useTranslation();
  const { openListing } = useListingDrawer();

  return (
    <section className="bg-cta-band py-16 sm:py-20" aria-labelledby="owner-cta-heading">
      <Container className="text-center">
        <h2
          id="owner-cta-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-white sm:text-[2.4rem]"
        >
          {t('owner.finalCta.title')}
        </h2>
        <p className="mt-3 text-[15px] text-white/75">
          {t('owner.finalCta.subtitle')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => openListing('property')} className={REGISTER_CTA_CLS}>
            {t('listing.listProperty')}
          </button>
          <SignInCta variant="ghostDark" />
        </div>
      </Container>
    </section>
  );
}
