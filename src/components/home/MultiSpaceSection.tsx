import { BedDouble, Building2, UtensilsCrossed } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { Container } from '../layout/Container';

export function MultiSpaceSection() {
  const b = DEMO.lodging.beds;
  const h = DEMO.hostel.beds;

  return (
    <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="multi-heading">
      <Container>
        <h2
          id="multi-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          One owner. Multiple spaces.
        </h2>
        <div className="mt-8 max-w-2xl rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold text-navy">{DEMO.ownerName}&apos;s ACOMI</p>
          <ul className="mt-4 space-y-3">
            <SpaceRow
              Icon={BedDouble}
              name={DEMO.lodging.name}
              metric={`${b.occupied} / ${b.total} occupied`}
              tone="bg-mint text-primary"
            />
            <SpaceRow
              Icon={UtensilsCrossed}
              name={DEMO.mess.name}
              metric={`${DEMO.mess.meals[0].prepare} breakfast · ${DEMO.mess.meals[1].prepare} lunch · ${DEMO.mess.meals[2].prepare} dinner`}
              tone="bg-[#FFF8F1] text-orange"
            />
            <SpaceRow
              Icon={Building2}
              name={DEMO.hostel.name}
              metric={`${h.occupied} / ${h.total} occupied`}
              tone="bg-[#F4F8FF] text-blue"
            />
          </ul>
        </div>
        <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
      </Container>
    </section>
  );
}

function SpaceRow({
  Icon,
  name,
  metric,
  tone,
}: {
  Icon: typeof BedDouble;
  name: string;
  metric: string;
  tone: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-[#F8FBFA] px-4 py-3">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span>
        <span className="block text-sm font-semibold text-navy">{name}</span>
        <span className="text-xs text-muted">{metric}</span>
      </span>
    </li>
  );
}
