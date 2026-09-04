import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OwnerFinalCta } from '../components/owner/OwnerFinalCta';
import { OwnerHero } from '../components/owner/OwnerHero';
import { OwnerHowItWorksSection } from '../components/owner/OwnerHowItWorksSection';
import { OwnerMultiSpaceSection } from '../components/owner/OwnerMultiSpaceSection';
import { OwnerOccupancySection } from '../components/owner/OwnerOccupancySection';
import { OwnerOperationsSection } from '../components/owner/OwnerOperationsSection';
import { OwnerPaymentsSection } from '../components/owner/OwnerPaymentsSection';
import { OwnerPlatformsSection } from '../components/owner/OwnerPlatformsSection';
import { OwnerProblemSection } from '../components/owner/OwnerProblemSection';
import { OwnerSpaceTypesSection } from '../components/owner/OwnerSpaceTypesSection';
import { OwnerTrustSection } from '../components/owner/OwnerTrustSection';
import { OwnerWhatsAppSection } from '../components/owner/OwnerWhatsAppSection';
import { applySeo } from '../lib/seo';

export function PropertyOwnersPage() {
  const { t } = useTranslation();

  useEffect(() => {
    applySeo({
      title: t('owner.seo.title'),
      description: t('owner.seo.description'),
      path: '/property-owners',
    });
  }, [t]);

  return (
    <>
      <OwnerHero />
      <OwnerProblemSection />
      <OwnerSpaceTypesSection />
      <OwnerOccupancySection />
      <OwnerPaymentsSection />
      <OwnerOperationsSection />
      <OwnerMultiSpaceSection />
      <OwnerPlatformsSection />
      <OwnerWhatsAppSection />
      <OwnerHowItWorksSection />
      <OwnerTrustSection />
      <OwnerFinalCta />
    </>
  );
}
