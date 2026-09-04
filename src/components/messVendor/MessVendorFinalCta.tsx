import { useTranslation } from 'react-i18next';
import { APP } from '../../constants/links';
import { useListingDrawer } from '../../context/ListingDrawerContext';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';
import { REGISTER_CTA_CLS } from './MessVendorHero';

export function MessVendorFinalCta() {
  const { t } = useTranslation();
  const { openListing } = useListingDrawer();

  return (
    <section className="bg-cta-band py-16 sm:py-20" aria-labelledby="mess-cta-heading">
      <Container className="text-center">
        <h2
          id="mess-cta-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-white sm:text-[2.4rem]"
        >
          {t('messVendor.finalCta.title')}
        </h2>
        <p className="mt-3 text-[15px] text-white/75">
          {t('messVendor.finalCta.subtitle')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => openListing('mess')} className={REGISTER_CTA_CLS}>
            {t('listing.listMess')}
          </button>
          <ButtonLink href={APP.login} variant="ghostDark">
            {t('nav.signIn')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
