import { useEffect } from 'react';
import { ComplaintsSection } from '../components/home/ComplaintsSection';
import { FinalCta } from '../components/home/FinalCta';
import { HeadcountSection } from '../components/home/HeadcountSection';
import { Hero } from '../components/home/Hero';
import { HeroMetricStrip } from '../components/home/HeroMetricStrip';
import { HowItWorksHomeSection } from '../components/home/HowItWorksHomeSection';
import { InventorySection } from '../components/home/InventorySection';
import { MultiSpaceSection } from '../components/home/MultiSpaceSection';
import { OwnerMemberSection } from '../components/home/OwnerMemberSection';
import { PaymentsSection } from '../components/home/PaymentsSection';
import { PersonSection } from '../components/home/PersonSection';
import { PlatformsSection } from '../components/home/PlatformsSection';
import { ProblemSection } from '../components/home/ProblemSection';
import { ScreenshotsSection } from '../components/home/ScreenshotsSection';
import { SpaceTypesSection } from '../components/home/SpaceTypesSection';
import { TwoModesSection } from '../components/home/TwoModesSection';
import { WhatsAppSection } from '../components/home/WhatsAppSection';
import { applySeo } from '../lib/seo';

export function HomePage() {
  useEffect(() => {
    applySeo({
      title: 'ACOMI — Know who’s staying, who’s eating, what’s due',
      description:
        'Run your PG or mess from one place — occupancy, meals, headcount and payments.',
      path: '/',
    });
  }, []);

  return (
    <>
      <Hero />
      <HeroMetricStrip />
      <ProblemSection />
      <TwoModesSection />
      <HeadcountSection />
      <PaymentsSection />
      <PersonSection />
      <ScreenshotsSection />
      <WhatsAppSection />
      <SpaceTypesSection />
      <HowItWorksHomeSection />
      <OwnerMemberSection />
      <MultiSpaceSection />
      <InventorySection />
      <ComplaintsSection />
      <PlatformsSection />
      <FinalCta />
    </>
  );
}
