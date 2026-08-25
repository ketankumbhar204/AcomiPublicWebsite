import { useEffect } from 'react';
import { FeaturesHero } from '../components/features/FeaturesHero';
import { ComplaintsSection } from '../components/home/ComplaintsSection';
import { FinalCta } from '../components/home/FinalCta';
import { HeadcountSection } from '../components/home/HeadcountSection';
import { HeroMetricStrip } from '../components/home/HeroMetricStrip';
import { InventorySection } from '../components/home/InventorySection';
import { MultiSpaceSection } from '../components/home/MultiSpaceSection';
import { PaymentsSection } from '../components/home/PaymentsSection';
import { PersonSection } from '../components/home/PersonSection';
import { ProblemSection } from '../components/home/ProblemSection';
import { ScreenshotsSection } from '../components/home/ScreenshotsSection';
import { TwoModesSection } from '../components/home/TwoModesSection';
import { applySeo } from '../lib/seo';

export function FeaturesPage() {
  useEffect(() => {
    applySeo({
      title: 'Features — ACOMI',
      description:
        'Mess menus, participation, and headcount. Lodging occupancy and members. Dues proofs, complaints, inventory, multi-space.',
      path: '/features',
    });
  }, []);

  return (
    <>
      <FeaturesHero />
      <HeroMetricStrip />
      <TwoModesSection />
      <div id="occupancy" className="scroll-mt-20">
        <ProblemSection />
      </div>
      <div id="headcount" className="scroll-mt-20">
        <div id="meals">
          <HeadcountSection />
        </div>
      </div>
      <div id="dues" className="scroll-mt-20">
        <PaymentsSection />
      </div>
      <div id="members" className="scroll-mt-20">
        <PersonSection />
      </div>
      <ScreenshotsSection />
      <div id="complaints" className="scroll-mt-20">
        <ComplaintsSection />
      </div>
      <div id="inventory" className="scroll-mt-20">
        <InventorySection />
      </div>
      <MultiSpaceSection />
      <FinalCta />
    </>
  );
}
