import { BedDouble, Boxes, IndianRupee, UserRound, Warehouse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';

const CAPABILITIES = [
  { key: 'layout', Icon: Warehouse },
  { key: 'occupancy', Icon: BedDouble },
  { key: 'members', Icon: UserRound },
  { key: 'payments', Icon: IndianRupee },
  { key: 'issues', Icon: Boxes },
] as const;

export function PropertyRunSection() {
  const { t } = useTranslation();
  const beds = DEMO.lodging.beds;

  return (
    <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="property-run-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              {t('home.propertyRun.eyebrow')}
            </p>
            <h2
              id="property-run-heading"
              className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
            >
              {t('home.propertyRun.title')}
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
              {t('home.propertyRun.body')}
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {CAPABILITIES.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2.5 text-sm font-semibold text-navy shadow-[var(--shadow-sm)]"
                >
                  <item.Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {t(`home.propertyRun.capabilities.${item.key}`)}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Stat n={beds.occupied} label={t('home.propertyRun.occupied')} tone="bg-[#E7F6EE] text-[#0F6B4C]" />
              <Stat n={beds.vacant} label={t('home.propertyRun.vacant')} tone="bg-[#E8F1FF] text-[#2563EB]" />
              <Stat n={beds.reserved} label={t('home.propertyRun.reserved')} tone="bg-[#FFF1E0] text-[#D97706]" />
            </div>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
            <div className="mt-6">
              <ButtonLink href="/property-owners" external={false}>
                {t('home.propertyRun.cta')}
              </ButtonLink>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMock {...SHOTS.occupancy} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone: string }) {
  return (
    <div className={`rounded-xl px-2 py-3 text-center ${tone}`}>
      <p className="text-lg font-semibold tabular-nums">{n}</p>
      <p className="text-[11px] opacity-80">{label}</p>
    </div>
  );
}
