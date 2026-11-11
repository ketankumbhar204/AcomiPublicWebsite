import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  ChefHat,
  ClipboardList,
  CreditCard,
  Layers,
  LayoutGrid,
  UserRound,
  Users,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';

const MEALS_STEPS: readonly { key: string; Icon: LucideIcon }[] = [
  { key: 'customer', Icon: Users },
  { key: 'menu', Icon: UtensilsCrossed },
  { key: 'poll', Icon: ClipboardList },
  { key: 'participation', Icon: UsersRound },
  { key: 'headcount', Icon: BarChart3 },
  { key: 'kitchen', Icon: ChefHat },
];

const LODGING_STEPS: readonly { key: string; Icon: LucideIcon }[] = [
  { key: 'building', Icon: Building2 },
  { key: 'floor', Icon: Layers },
  { key: 'room', Icon: LayoutGrid },
  { key: 'bed', Icon: BedDouble },
  { key: 'member', Icon: UserRound },
  { key: 'payment', Icon: CreditCard },
];

export function TwoModesSection() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden border-t border-border/60 bg-[#F7FBF9] py-10 sm:py-12"
      aria-labelledby="modes-heading"
    >
      <div
        className="pointer-events-none absolute -left-16 top-0 h-40 w-56 rounded-full bg-[#D8F0E4]/70 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-36 w-48 rounded-full bg-[#E7F6EE]/80 blur-2xl"
        aria-hidden
      />

      <Container className="relative">
        <p className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white uppercase">
          {t('home.twoModes.eyebrow', { defaultValue: 'The ACOMI platform' })}
        </p>
        <h2
          id="modes-heading"
          className="mt-3 max-w-3xl text-[1.75rem] leading-[1.12] font-semibold tracking-tight text-navy sm:text-[2.1rem]"
        >
          {t('home.twoModes.title')}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-[15px]">
          <Trans
            i18nKey="home.twoModes.subtitle"
            defaults="Everything you need to <highlight>manage accommodation and meals</highlight> in one place."
            components={{
              highlight: <span className="font-semibold text-primary" />,
            }}
          />
        </p>

        <div className="mt-7 grid items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
          <ProductCard
            tone="orange"
            illustration="/images/two-operations/meals-illustration.png"
            illustrationAlt={t('home.twoModes.mealsTitle')}
            eyebrow={t('home.twoModes.mealsEyebrow')}
            title={t('home.twoModes.mealsTitle')}
            body={t('home.twoModes.mealsBody', {
              defaultValue: 'Run your mess or meal service end to end.',
            })}
            steps={MEALS_STEPS.map((step) => ({
              ...step,
              label: t(`home.twoModes.steps.${step.key}`),
            }))}
          />
          <ProductCard
            tone="teal"
            illustration="/images/two-operations/accommodation-illustration.png"
            illustrationAlt={t('home.twoModes.lodgingTitle')}
            eyebrow={t('home.twoModes.lodgingEyebrow')}
            title={t('home.twoModes.lodgingTitle')}
            body={t('home.twoModes.lodgingBody', {
              defaultValue: 'Manage your property, members and payments easily.',
            })}
            steps={LODGING_STEPS.map((step) => ({
              ...step,
              label: t(`home.twoModes.steps.${step.key}`),
            }))}
          />
        </div>
      </Container>
    </section>
  );
}

function ProductCard({
  tone,
  illustration,
  illustrationAlt,
  eyebrow,
  title,
  body,
  steps,
}: {
  tone: 'teal' | 'orange';
  illustration: string;
  illustrationAlt: string;
  eyebrow: string;
  title: string;
  body: string;
  steps: readonly { key: string; Icon: LucideIcon; label: string }[];
}) {
  const shell =
    tone === 'teal'
      ? 'border-[#B7DFC8] bg-[#EEF8F2]'
      : 'border-[#F0D2B4] bg-[#FFF6EC]';
  const eyebrowColor = tone === 'teal' ? 'text-primary' : 'text-orange';
  const divider = tone === 'teal' ? 'bg-[#C9E8D9]' : 'bg-[#F0DCC6]';
  const iconColor = tone === 'teal' ? 'text-primary' : 'text-orange';
  const tile =
    tone === 'teal'
      ? 'border-[#C9E8D9]/80 bg-white'
      : 'border-[#F0DCC6]/80 bg-white';

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[24px] border p-5 shadow-[var(--shadow-sm)] sm:p-6 ${shell}`}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex h-[88px] w-[118px] shrink-0 items-center justify-center sm:h-[104px] sm:w-[140px]">
          <img
            src={illustration}
            alt={illustrationAlt}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className={`hidden h-16 w-px shrink-0 self-center sm:block ${divider}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className={`text-[10px] font-semibold tracking-[0.14em] uppercase ${eyebrowColor}`}>
            {eyebrow}
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-navy sm:text-[1.4rem]">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{body}</p>
        </div>
      </div>

      <Workflow steps={steps} iconColor={iconColor} tileClass={tile} labelColor={iconColor} />
    </article>
  );
}

function Workflow({
  steps,
  iconColor,
  tileClass,
  labelColor,
}: {
  steps: readonly { key: string; Icon: LucideIcon; label: string }[];
  iconColor: string;
  tileClass: string;
  labelColor: string;
}) {
  return (
    <ol className="mt-5 grid grid-cols-3 gap-x-2 gap-y-3 sm:flex sm:items-start sm:justify-between sm:gap-0">
      {steps.map((step, index) => (
        <li key={step.key} className="flex min-w-0 items-start sm:flex-1">
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-[12px] border shadow-sm sm:h-12 sm:w-12 ${tileClass}`}
            >
              <step.Icon className={`h-[18px] w-[18px] sm:h-5 sm:w-5 ${iconColor}`} strokeWidth={1.9} aria-hidden />
            </span>
            <span className={`max-w-[5.2rem] text-[10px] leading-tight font-semibold sm:text-[11px] ${labelColor}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 ? (
            <ArrowRight
              className="mt-3.5 hidden h-3.5 w-3.5 shrink-0 text-muted/65 sm:block"
              strokeWidth={2.2}
              aria-hidden
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
