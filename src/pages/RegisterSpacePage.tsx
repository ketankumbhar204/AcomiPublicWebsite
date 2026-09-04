import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../components/common/ButtonLink';
import { PageHero } from '../components/common/PageHero';
import { CtaButton } from '../components/registration/RegistrationButtons';
import { useListingDrawer } from '../context/ListingDrawerContext';
import { useUserType } from '../context/UserTypeContext';
import { applySeo } from '../lib/seo';

export function RegisterSpacePage() {
  const { t } = useTranslation();
  const { isModalOpen } = useUserType();
  const { openListing } = useListingDrawer();

  useEffect(() => {
    applySeo({
      title: t('registerSpace.seo.title'),
      description: t('registerSpace.seo.description'),
      path: '/register-space',
    });
  }, [t]);

  useEffect(() => {
    if (!isModalOpen) {
      openListing('property');
    }
  }, [isModalOpen, openListing]);

  return (
    <PageHero
      eyebrow={t('registerSpace.eyebrow')}
      title={t('registerSpace.title')}
      description={t('registerSpace.description')}
    >
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CtaButton onClick={() => openListing('property')}>{t('listing.listProperty')}</CtaButton>
        <ButtonLink href="/" variant="ghost" external={false}>
          {t('registerSpace.backHome')}
        </ButtonLink>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[13px] text-text-secondary">
        <CheckCircle2 aria-hidden className="h-4 w-4 text-register" />
        {t('registerSpace.freeNote')}
      </p>
    </PageHero>
  );
}
