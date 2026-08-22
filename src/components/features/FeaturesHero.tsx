import { BedDouble, Check, IndianRupee, UtensilsCrossed } from 'lucide-react';
import { APP } from '../../constants/links';
import { SHOTS } from '../../data/shots';
import { ButtonLink } from '../common/ButtonLink';
import { PhoneMock } from '../common/PhoneMock';
import { HeroValueRow } from '../home/HeroValueRow';
import { Container } from '../layout/Container';

const lines = [
  {
    Icon: BedDouble,
    text: "Know who's staying.",
    iconBg: 'bg-[#E7F4EE]',
    iconFg: 'text-primary',
  },
  {
    Icon: UtensilsCrossed,
    text: "Know who's eating.",
    iconBg: 'bg-[#FFF1E0]',
    iconFg: 'text-orange',
  },
  {
    Icon: IndianRupee,
    text: "Know what's due.",
    iconBg: 'bg-[#E8F0FF]',
    iconFg: 'text-blue',
  },
];

export function FeaturesHero() {
  return (
    <section
      className="overflow-x-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white pt-10 pb-10 sm:pt-14 sm:pb-12"
      aria-labelledby="features-hero-heading"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div className="max-w-[34rem]">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">Features</p>
            <h1 id="features-hero-heading" className="mt-3 space-y-2 sm:mt-5 sm:space-y-5">
              {lines.map((line) => (
                <HeroValueRow key={line.text} {...line} />
              ))}
            </h1>
            <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-text-secondary sm:text-[16px]">
              Lodging answers who is staying. Meals answer how many plates. Dues and issues stay in the same space.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={APP.register}>Get started free</ButtonLink>
              <ButtonLink href="/how-it-works" variant="ghost" external={false}>
                See how it works
              </ButtonLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E7F4EE] text-primary">
                <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden />
              </span>
              Occupancy, meals, headcount and payments — one place.
            </p>
          </div>
          <FeaturesHeroPhones />
        </div>
      </Container>
    </section>
  );
}

function FeaturesHeroPhones() {
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
          caption="PG · Occupancy"
          size="hero"
          tilt={-6}
          priority
        />
      </div>
      <div className="lg:absolute lg:top-0 lg:right-0 lg:z-20">
        <PhoneMock
          src={SHOTS.mess.src}
          alt={SHOTS.mess.alt}
          caption="MESS · Headcount"
          size="hero"
          tilt={6}
          priority
        />
      </div>
    </div>
  );
}
