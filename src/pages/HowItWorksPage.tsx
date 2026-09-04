import { useEffect } from 'react';
import { ArrowRight, CalendarDays, Settings2, UserPlus, Warehouse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function HowItWorksPage() {
  const { t } = useTranslation();

  const steps = [
    {
      n: '01',
      title: t('howItWorksPage.steps.create.title'),
      line: t('howItWorksPage.steps.create.line'),
      Icon: Warehouse,
      tone: 'teal' as const,
    },
    {
      n: '02',
      title: t('howItWorksPage.steps.setUp.title'),
      line: t('howItWorksPage.steps.setUp.line'),
      Icon: Settings2,
      tone: 'blue' as const,
    },
    {
      n: '03',
      title: t('howItWorksPage.steps.addPeople.title'),
      line: t('howItWorksPage.steps.addPeople.line'),
      Icon: UserPlus,
      tone: 'violet' as const,
    },
    {
      n: '04',
      title: t('howItWorksPage.steps.runDay.title'),
      line: t('howItWorksPage.steps.runDay.line'),
      Icon: CalendarDays,
      tone: 'amber' as const,
    },
  ];

  const lodgingFlow = [
    t('howItWorksPage.flow.pg.0'),
    t('howItWorksPage.flow.pg.1'),
    t('howItWorksPage.flow.pg.2'),
    t('howItWorksPage.flow.pg.3'),
    t('howItWorksPage.flow.pg.4'),
  ];
  const messFlow = [
    t('howItWorksPage.flow.mess.0'),
    t('howItWorksPage.flow.mess.1'),
    t('howItWorksPage.flow.mess.2'),
    t('howItWorksPage.flow.mess.3'),
    t('howItWorksPage.flow.mess.4'),
  ];

  const invite = [
    t('howItWorksPage.invite.0'),
    t('howItWorksPage.invite.1'),
    t('howItWorksPage.invite.2'),
    t('howItWorksPage.invite.3'),
  ];

  useEffect(() => {
    applySeo({
      title: t('howItWorksPage.seo.title'),
      description: t('howItWorksPage.seo.description'),
      path: '/how-it-works',
    });
  }, [t]);

  return (
    <>
      <PageHero
        eyebrow={t('howItWorksPage.eyebrow')}
        title={t('howItWorksPage.title')}
        description={t('howItWorksPage.description')}
      />

      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="steps-heading">
        <Container>
          <PageSectionHead id="steps-heading" title={t('howItWorksPage.fourSteps')} />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
                <IconBadge icon={s.Icon} tone={s.tone} />
                <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted">{s.n}</p>
                <p className="mt-1 text-lg font-semibold text-navy">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.line}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-14" aria-labelledby="setup-heading">
        <Container>
          <PageSectionHead id="setup-heading" title={t('howItWorksPage.setupTitle')} />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-black/5 bg-[#FFF8F1] p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-orange uppercase">
                {t('howItWorksPage.messEyebrow')}
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">{t('howItWorksPage.messTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t('howItWorksPage.messBody')}</p>
              <Flow label="MESS" steps={messFlow} />
            </article>
            <article className="rounded-[24px] border border-black/5 bg-mint p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                {t('howItWorksPage.lodgingEyebrow')}
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">{t('howItWorksPage.lodgingTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t('howItWorksPage.lodgingBody')}</p>
              <Flow label="PG" steps={lodgingFlow} />
            </article>
          </div>
        </Container>
      </section>

      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="invite-heading">
        <Container>
          <PageSectionHead
            id="invite-heading"
            eyebrow={t('howItWorksPage.inviteEyebrow')}
            eyebrowClass="text-blue"
            title={t('howItWorksPage.inviteTitle')}
            intro={t('howItWorksPage.inviteIntro')}
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {invite.map((line, i) => (
              <li key={line} className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">0{i + 1}</p>
                <p className="mt-2 text-sm leading-relaxed font-medium text-navy">{line}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}

function Flow({ label, steps }: { label: string; steps: readonly string[] }) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-navy">
      <span className="mr-1 text-[11px] tracking-[0.12em] text-muted">{label}</span>
      {steps.map((s, i) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          {s}
          {i < steps.length - 1 ? <ArrowRight className="h-3 w-3 text-muted" aria-hidden /> : null}
        </span>
      ))}
    </p>
  );
}
