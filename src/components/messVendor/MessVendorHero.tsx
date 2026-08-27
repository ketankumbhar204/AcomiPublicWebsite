import { Check, ClipboardList, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SHOTS } from '../../data/shots';
import { useListingDrawer } from '../../context/ListingDrawerContext';
import { ButtonLink } from '../common/ButtonLink';
import { PhoneMock } from '../common/PhoneMock';
import { Container } from '../layout/Container';

export const REGISTER_CTA_CLS =
  'reg-focus inline-flex items-center justify-center gap-2 rounded-lg bg-register px-5 py-3 text-sm font-semibold text-cta-band transition hover:bg-register-hover';

const lines: Array<{ Icon: LucideIcon; text: string; iconBg: string; iconFg: string }> = [
  {
    Icon: UtensilsCrossed,
    text: "Know who's eating.",
    iconBg: 'bg-[#FFF1E0]',
    iconFg: 'text-orange',
  },
  {
    Icon: ClipboardList,
    text: 'Know how many plates.',
    iconBg: 'bg-[#E7F4EE]',
    iconFg: 'text-primary',
  },
];

export function MessVendorHero() {
  const { openListing } = useListingDrawer();

  return (
    <section
      className="overflow-x-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white pt-10 pb-10 sm:pt-14 sm:pb-12"
      aria-labelledby="mess-hero-heading"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div className="max-w-[34rem]">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-orange uppercase">
              Mess · Tiffin · Meal service
            </p>
            <h1 id="mess-hero-heading" className="mt-3 space-y-2 sm:mt-5 sm:space-y-5">
              {lines.map((line) => (
                <span key={line.text} className="flex items-center gap-2.5 sm:gap-4">
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl ${line.iconBg} ${line.iconFg}`}
                  >
                    <line.Icon className="h-5 w-5 sm:h-9 sm:w-9" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-[1.15rem] leading-[1.15] font-semibold tracking-[-0.03em] whitespace-nowrap text-navy sm:text-[1.85rem]">
                    {line.text}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-text-secondary sm:text-[16px]">
              Customers, menus, headcount and meal dues — one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => openListing('mess')} className={REGISTER_CTA_CLS}>
                List your mess
              </button>
              <ButtonLink href="/how-it-works" variant="ghost" external={false}>
                See how it works
              </ButtonLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E7F4EE] text-primary">
                <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden />
              </span>
              Built for Indian mess, tiffin and meal-service operators.
            </p>
          </div>

          <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-8 lg:block lg:h-[580px]">
            <div
              className="pointer-events-none absolute inset-x-[10%] top-[18%] hidden h-[58%] rounded-full bg-[#b8f0c8]/22 blur-3xl lg:block"
              aria-hidden
            />
            <div className="lg:absolute lg:top-[10%] lg:left-0 lg:z-10">
              <PhoneMock
                src={SHOTS.mess.src}
                alt={SHOTS.mess.alt}
                caption="MESS · Know who's eating"
                size="hero"
                tilt={-6}
                priority
              />
            </div>
            <div className="lg:absolute lg:top-0 lg:right-0 lg:z-20">
              <PhoneMock
                src={SHOTS.messPayments.src}
                alt={SHOTS.messPayments.alt}
                caption="Meal dues at a glance"
                size="hero"
                tilt={6}
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
