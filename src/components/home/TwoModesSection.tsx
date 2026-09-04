import {
  ArrowRight,
  BedDouble,
  Building2,
  ChefHat,
  ClipboardList,
  CreditCard,
  Layers,
  LayoutGrid,
  UserRound,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';

export function TwoModesSection() {
  const { t } = useTranslation();

  const lodging = [
    { label: t('home.twoModes.steps.building'), Icon: Building2 },
    { label: t('home.twoModes.steps.floor'), Icon: Layers },
    { label: t('home.twoModes.steps.room'), Icon: LayoutGrid },
    { label: t('home.twoModes.steps.bed'), Icon: BedDouble },
    { label: t('home.twoModes.steps.member'), Icon: UserRound },
    { label: t('home.twoModes.steps.payment'), Icon: CreditCard },
  ];

  const meals = [
    { label: t('home.twoModes.steps.customer'), Icon: Users },
    { label: t('home.twoModes.steps.menu'), Icon: UtensilsCrossed },
    { label: t('home.twoModes.steps.poll'), Icon: ClipboardList },
    { label: t('home.twoModes.steps.participation'), Icon: UserRound },
    { label: t('home.twoModes.steps.headcount'), Icon: Users },
    { label: t('home.twoModes.steps.kitchen'), Icon: ChefHat },
  ];

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="modes-heading">
      <Container>
        <h2
          id="modes-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
        >
          {t('home.twoModes.title')}
        </h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[24px] border border-black/5 bg-[#FFF8F1] p-6 shadow-[var(--shadow-sm)]">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-orange uppercase">
              {t('home.twoModes.mealsEyebrow')}
            </p>
            <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">{t('home.twoModes.mealsTitle')}</h3>
            <Workflow steps={meals} accent="orange" />
          </article>

          <article className="rounded-[24px] border border-black/5 bg-mint p-6 shadow-[var(--shadow-sm)]">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
              {t('home.twoModes.lodgingEyebrow')}
            </p>
            <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">{t('home.twoModes.lodgingTitle')}</h3>
            <Workflow steps={lodging} accent="teal" />
          </article>
        </div>
      </Container>
    </section>
  );
}

function Workflow({
  steps,
  accent,
}: {
  steps: readonly { label: string; Icon: typeof Building2 }[];
  accent: 'teal' | 'orange';
}) {
  const iconWrap = accent === 'teal' ? 'bg-white text-primary' : 'bg-white text-orange';

  return (
    <ol className="mt-6 flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <li key={s.label} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${iconWrap}`}>
              <s.Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden />
            </span>
            <span className="text-sm font-semibold text-navy">{s.label}</span>
          </span>
          {i < steps.length - 1 ? (
            <ArrowRight className="h-4 w-4 text-muted" aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
