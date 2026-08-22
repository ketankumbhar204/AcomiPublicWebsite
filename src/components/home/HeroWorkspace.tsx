import { DEMO_VIEW } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { BrowserChrome } from '../product/BrowserChrome';
import { MessOperationsCard, OperationsDashboard } from '../product/OperationsDashboard';

export function HeroWorkspace() {
  return (
    <div className="hero-float relative">
      <BrowserChrome url="app.acomi.in · Sunrise operations">
        <OperationsDashboard />
      </BrowserChrome>
      <div className="relative mt-3 lg:absolute lg:-right-2 lg:-bottom-6 lg:mt-0 lg:w-[220px]">
        <MessOperationsCard />
      </div>
      <DemoLabel className="mt-4 text-center lg:mt-10">{DEMO_VIEW}</DemoLabel>
    </div>
  );
}
