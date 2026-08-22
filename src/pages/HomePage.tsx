import { useEffect } from 'react';
import { FinalCta } from '../components/home/FinalCta';
import { Hero } from '../components/home/Hero';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ModulesSection } from '../components/home/ModulesSection';
import { OwnerMemberSection } from '../components/home/OwnerMemberSection';
import { PlatformsSection } from '../components/home/PlatformsSection';
import { ProblemsSection } from '../components/home/ProblemsSection';
import { ScreenshotsSection } from '../components/home/ScreenshotsSection';
import { SpaceTypesSection } from '../components/home/SpaceTypesSection';
import { TrustSection } from '../components/home/TrustSection';
import { applySeo } from '../lib/seo';

export function HomePage() {
  useEffect(() => {
    applySeo({
      title: 'ACOMI — Run occupancy, meals, and dues',
      description:
        'Operations software for Indian PGs, hostels, co-living spaces, rentals, and messes. Web and Android.',
      path: '/',
    });
  }, []);

  return (
    <>
      <Hero />
      <ProblemsSection />
      <ModulesSection />
      <ScreenshotsSection />
      <SpaceTypesSection />
      <OwnerMemberSection />
      <HowItWorksSection />
      <PlatformsSection />
      <TrustSection />
      <FinalCta />
    </>
  );
}
