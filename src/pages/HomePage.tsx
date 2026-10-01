import { useEffect } from 'react';
import { ComplaintsSection } from '../components/home/ComplaintsSection';
import { DiscoveryStepsSection } from '../components/home/DiscoveryStepsSection';
import { FinalCta } from '../components/home/FinalCta';
import { FindMealsSection } from '../components/home/FindMealsSection';
import { FindPlaceSection } from '../components/home/FindPlaceSection';
import { HeadcountSection } from '../components/home/HeadcountSection';
import { Hero } from '../components/home/Hero';
import { HeroMetricStrip } from '../components/home/HeroMetricStrip';
import { HowItWorksHomeSection } from '../components/home/HowItWorksHomeSection';
import { InventorySection } from '../components/home/InventorySection';
import { MultiSpaceSection } from '../components/home/MultiSpaceSection';
import { OperatorBridgeSection } from '../components/home/OperatorBridgeSection';
import { OwnerMemberSection } from '../components/home/OwnerMemberSection';
import { PaymentsSection } from '../components/home/PaymentsSection';
import { PersonSection } from '../components/home/PersonSection';
import { PlatformsSection } from '../components/home/PlatformsSection';
import { PropertyRunSection } from '../components/home/PropertyRunSection';
import { ScreenshotsSection } from '../components/home/ScreenshotsSection';
import { SpaceTypesSection } from '../components/home/SpaceTypesSection';
import { TwoModesSection } from '../components/home/TwoModesSection';
import { WhatsAppSection } from '../components/home/WhatsAppSection';
import { applySeo } from '../lib/seo';

export function HomePage() {
  useEffect(() => {
    applySeo({
      title: 'ACOMI — Find a place or meals, or run your space',
      description:
        'Find a PG, hostel, co-living, rental, or mess. Owners and operators run occupancy, meals, headcount, and payments.',
      path: '/',
    });
  }, []);

  return (
    <>
      <Hero />
      <FindPlaceSection />
      <FindMealsSection />
      <DiscoveryStepsSection />
      <HeroMetricStrip className="pt-12 sm:pt-14" />
      <OperatorBridgeSection />
      <TwoModesSection />
      <PropertyRunSection />
      <PaymentsSection />
      <PersonSection />
      <HeadcountSection framed />
      <ScreenshotsSection />
      <WhatsAppSection />
      <SpaceTypesSection />
      <HowItWorksHomeSection />
      <OwnerMemberSection includeSeekers />
      <MultiSpaceSection />
      <InventorySection />
      <ComplaintsSection />
      <PlatformsSection />
      <FinalCta balanced />
    </>
  );
}
