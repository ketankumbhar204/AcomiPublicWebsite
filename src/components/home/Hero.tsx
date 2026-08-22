import { ArrowRight } from 'lucide-react';
import { APP } from '../../constants/links';
import { ButtonLink } from '../common/ButtonLink';
import { PhoneScreenshot } from '../common/PhoneScreenshot';
import { Container } from '../layout/Container';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white pt-10 pb-20 sm:pt-14 sm:pb-24"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,211,102,0.15),transparent)]" />
      <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="inline-flex items-center rounded-full border border-primary/20 bg-white/90 px-3 py-1 text-xs font-semibold text-primary-dark shadow-sm">
            For PG, hostel, mess, co-living, and rental owners
          </p>
          <h1
            id="hero-heading"
            className="mt-6 text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            Run occupancy, meals, and dues
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            ACOMI is operations software for PGs, hostels, co-living spaces, rentals, and messes.
            Create a space, invite people, and operate from the web app or Android.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={APP.register} className="gap-2 !px-6">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href={APP.login} variant="ghost">
              Sign in
            </ButtonLink>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative flex items-end justify-center">
            <div className="hidden -rotate-6 sm:block lg:absolute lg:top-8 lg:right-40 lg:rotate-[-8deg]">
              <PhoneScreenshot
                src="/screenshots/accommodation.png"
                alt="ACOMI accommodation screen showing buildings, rooms, and beds for a PG space"
                className="w-[220px] opacity-90 sm:w-[240px]"
              />
            </div>
            <div className="relative z-10 sm:translate-x-6 lg:translate-x-0">
              <PhoneScreenshot
                src="/screenshots/dashboard.png"
                alt="ACOMI dashboard showing space health, setup readiness, and payment summary"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
