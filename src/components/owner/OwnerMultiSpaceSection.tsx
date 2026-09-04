import { BedDouble, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { Container } from '../layout/Container';

export function OwnerMultiSpaceSection() {
  const { t } = useTranslation();
  const b = DEMO.lodging.beds;
  const h = DEMO.hostel.beds;

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="owner-multi-heading">
      <Container>
        <h2
          id="owner-multi-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('home.multiSpace.title')}
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {t('owner.multiSpace.subtitle')}
        </p>
        <div className="mt-8 max-w-2xl rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold text-navy">
            {t('home.multiSpace.ownersAcomi', { name: DEMO.ownerName })}
          </p>
          <ul className="mt-4 space-y-3">
            <SpaceRow
              Icon={BedDouble}
              name={DEMO.lodging.name}
              metric={t('home.multiSpace.occupiedOf', { occupied: b.occupied, total: b.total })}
              tone="bg-mint text-primary"
            />
            <SpaceRow
              Icon={Building2}
              name={DEMO.hostel.name}
              metric={t('home.multiSpace.occupiedOf', { occupied: h.occupied, total: h.total })}
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
  Icon: LucideIcon;
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
