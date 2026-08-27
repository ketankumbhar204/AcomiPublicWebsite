import { useEffect } from 'react';
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
  useEffect(() => {
    applySeo({
      title: 'ACOMI for property owners — occupancy, members and dues',
      description:
        'Operations software for PG, hostel, co-living and rental owners. Track occupancy, members, rent dues and complaints — on web and Android.',
      path: '/property-owners',
    });
  }, []);

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
