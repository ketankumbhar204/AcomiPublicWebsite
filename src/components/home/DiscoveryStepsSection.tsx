import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';

const STEPS = [
  {
    key: 'location' as const,
    image: '/images/discovery-steps/01-choose-location.png',
    panel: 'bg-[#EAF7F0]',
    badge: 'bg-[#E3F5EB] text-[#0F6B4C]',
  },
  {
    key: 'explore' as const,
    image: '/images/discovery-steps/02-explore-places.png',
    panel: 'bg-[#EAF1FF]',
    badge: 'bg-[#E4EDFF] text-[#2563EB]',
  },
  {
    key: 'review' as const,
    image: '/images/discovery-steps/03-review-listed.png',
    panel: 'bg-[#F1EBFF]',
    badge: 'bg-[#EDE4FF] text-[#7C3AED]',
  },
  {
    key: 'enquire' as const,
    image: '/images/discovery-steps/04-send-enquiry.png',
    panel: 'bg-[#FFF1E4]',
    badge: 'bg-[#FFE8D4] text-[#D97706]',
  },
] as const;

export function DiscoveryStepsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="how-finding-works"
      className="scroll-mt-20 bg-white py-10 sm:py-12 lg:py-14"
      aria-labelledby="discovery-steps-heading"
    >
      <Container className="pr-16 sm:pr-20 lg:pr-24">
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              {t('home.discoverySteps.eyebrow')}
            </p>
            <h2
              id="discovery-steps-heading"
              className="mt-2 max-w-3xl text-[1.9rem] leading-[1.15] font-bold tracking-tight text-navy sm:text-[2.35rem]"
            >
              {t('home.discoverySteps.title')}
            </h2>
          </div>

          <div className="relative self-start sm:mb-1 sm:self-auto">
            {/* Dashed curve toward the badge — matches mockup accent */}
            <svg
              className="pointer-events-none absolute -left-16 -top-3 hidden h-10 w-16 text-primary sm:block"
              viewBox="0 0 64 40"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 28 C 18 8, 40 4, 58 14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeDasharray="3.5 3.5"
                strokeLinecap="round"
              />
              <path d="M52 10 L58 14 L53 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#8FCBB0] bg-[#EAF7F0] px-3.5 py-1.5 text-[13px] font-semibold text-[#0F6B4C] shadow-[0_2px_8px_rgba(15,107,76,0.08)]">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.3} aria-hidden />
              {t('home.discoverySteps.badge', { defaultValue: 'In 4 simple steps' })}
            </p>
          </div>
        </div>

        <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {STEPS.map((step, index) => (
            <li key={step.key} className="relative min-w-0">
              <article className="flex h-full flex-col rounded-[24px] border border-black/[0.05] bg-white p-2.5 shadow-[0_10px_28px_rgba(15,27,22,0.06)] sm:p-3">
                {/* Inset illustration panel — rounded block inside white card */}
                <div
                  className={`flex h-[140px] items-center justify-center overflow-hidden rounded-[16px] px-2.5 py-2 sm:h-[152px] sm:rounded-[18px] sm:px-3 sm:py-2.5 lg:h-[160px] ${step.panel}`}
                >
                  <img
                    src={step.image}
                    alt={t(`home.discoverySteps.steps.${step.key}.title`)}
                    className="max-h-full max-w-full object-contain object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="flex flex-1 flex-col px-1 pt-3 pb-1.5 sm:px-1.5 sm:pt-3 sm:pb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex h-7 w-8 shrink-0 items-center justify-center rounded-[8px] text-[13px] leading-none font-bold tracking-wide ${step.badge}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="min-w-0 text-[1.05rem] leading-snug font-bold text-navy sm:text-[1.125rem]">
                      {t(`home.discoverySteps.steps.${step.key}.title`)}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-left text-[13px] leading-[1.45] text-text-secondary sm:text-[14px]">
                    {t(`home.discoverySteps.steps.${step.key}.line`)}
                  </p>
                </div>
              </article>

              {index < STEPS.length - 1 ? (
                <span
                  className="pointer-events-none absolute top-1/2 right-0 z-20 hidden h-9 w-9 -translate-y-1/2 translate-x-[calc(50%+0.625rem)] items-center justify-center rounded-full border border-[#8FCBB0] bg-white text-[#0F6B4C] shadow-[0_3px_10px_rgba(15,107,76,0.1)] lg:flex"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
