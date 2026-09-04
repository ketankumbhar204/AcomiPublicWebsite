import { BedDouble, Check, IndianRupee, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserType } from '../../context/UserTypeContext';
import { SHOTS } from '../../data/shots';
import { ActionButton } from '../common/ActionButton';
import { ButtonLink } from '../common/ButtonLink';
import { PhoneMock } from '../common/PhoneMock';
import { HeroValueRow } from '../home/HeroValueRow';
import { Container } from '../layout/Container';

export function FeaturesHero() {
  const { t } = useTranslation();
  const { openUserTypeModal } = useUserType();

  const lines = [
    {
      Icon: BedDouble,
      text: t('features.lines.staying'),
      iconBg: 'bg-[#E7F4EE]',
      iconFg: 'text-primary',
    },
    {
      Icon: UtensilsCrossed,
      text: t('features.lines.eating'),
      iconBg: 'bg-[#FFF1E0]',
      iconFg: 'text-orange',
    },
    {
      Icon: IndianRupee,
      text: t('features.lines.due'),
      iconBg: 'bg-[#E8F0FF]',
      iconFg: 'text-blue',
    },
  ];

  return (
    <section
      className="overflow-x-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white pt-10 pb-10 sm:pt-14 sm:pb-12"
      aria-labelledby="features-hero-heading"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div className="max-w-[34rem]">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
              {t('features.eyebrow')}
            </p>
            <h1 id="features-hero-heading" className="mt-3 space-y-2 sm:mt-5 sm:space-y-5">
              {lines.map((line) => (
                <HeroValueRow key={line.text} {...line} />
              ))}
            </h1>
            <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-text-secondary sm:text-[16px]">
              {t('features.body')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton onClick={openUserTypeModal}>{t('hero.getStartedFree')}</ActionButton>
              <ButtonLink href="/how-it-works" variant="ghost" external={false}>
                {t('hero.seeHowItWorks')}
              </ButtonLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E7F4EE] text-primary">
                <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden />
              </span>
              {t('features.footnote')}
            </p>
          </div>
          <FeaturesHeroPhones />
        </div>
      </Container>
    </section>
  );
}

function FeaturesHeroPhones() {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-8 lg:h-[580px] lg:block">
      <div
        className="pointer-events-none absolute inset-x-[10%] top-[18%] hidden h-[58%] rounded-full bg-[#b8f0c8]/22 blur-3xl lg:block"
        aria-hidden
      />
      <div className="lg:absolute lg:top-[10%] lg:left-0 lg:z-10">
        <PhoneMock
          src={SHOTS.occupancy.src}
          alt={SHOTS.occupancy.alt}
          caption={t('features.captionPg')}
          size="hero"
          tilt={-6}
          priority
        />
      </div>
      <div className="lg:absolute lg:top-0 lg:right-0 lg:z-20">
        <PhoneMock
          src={SHOTS.mess.src}
          alt={SHOTS.mess.alt}
          caption={t('features.captionMess')}
          size="hero"
          tilt={6}
          priority
        />
      </div>
    </div>
  );
}
