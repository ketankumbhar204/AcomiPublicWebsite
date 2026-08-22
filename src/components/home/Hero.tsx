import { BedDouble, Check, IndianRupee, UtensilsCrossed } from 'lucide-react';
import { APP } from '../../constants/links';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';
import { HeroPhones } from './HeroPhones';
import { HeroValueRow } from './HeroValueRow';

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

export function Hero() {
  return (
    <section
      className="overflow-x-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white pt-10 pb-10 sm:pt-14 sm:pb-12"
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div className="max-w-[34rem]">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
              Accommodation + Meals
            </p>
            <h1 id="hero-heading" className="mt-3 space-y-2 sm:mt-5 sm:space-y-5">
              {lines.map((line) => (
                <HeroValueRow key={line.text} {...line} />
              ))}
            </h1>
            <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-text-secondary sm:text-[16px]">
              Occupancy, meals, headcount and payments — one place.
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
              Built for Indian PG, hostel, mess and co-living operators.
            </p>
          </div>
          <HeroPhones />
        </div>
      </Container>
    </section>
  );
}
