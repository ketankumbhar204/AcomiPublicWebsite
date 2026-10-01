import { MapPin, MessageSquare, Search, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconBadge } from '../common/IconBadge';
import { Container } from '../layout/Container';

const STEPS = [
  { key: 'location', Icon: MapPin, tone: 'teal' as const },
  { key: 'explore', Icon: Search, tone: 'blue' as const },
  { key: 'review', Icon: ClipboardList, tone: 'violet' as const },
  { key: 'enquire', Icon: MessageSquare, tone: 'amber' as const },
];

export function DiscoveryStepsSection() {
  const { t } = useTranslation();

  return (
    <section id="how-finding-works" className="scroll-mt-20 bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="discovery-steps-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
          {t('home.discoverySteps.eyebrow')}
        </p>
        <h2
          id="discovery-steps-heading"
          className="mt-2 max-w-3xl text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('home.discoverySteps.title')}
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.key} className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={step.Icon} tone={step.tone} />
              <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-1 text-lg font-semibold text-navy">{t(`home.discoverySteps.steps.${step.key}.title`)}</p>
              <p className="mt-2 text-sm text-text-secondary">{t(`home.discoverySteps.steps.${step.key}.line`)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
