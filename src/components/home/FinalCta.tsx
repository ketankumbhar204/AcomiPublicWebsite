import { ArrowRight } from 'lucide-react';
import { APP } from '../../constants/links';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';

export function FinalCta() {
  return (
    <section id="cta" className="pb-20 sm:pb-24" aria-labelledby="cta-heading">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cta-band via-slate-900 to-emerald-950 px-8 py-14 text-center shadow-2xl sm:px-12">
          <div className="pointer-events-none absolute top-0 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">ACOMI</p>
            <h2 id="cta-heading" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start with one space
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Create your first PG, mess, hostel, co-living space, or rental and run occupancy, meals, and dues from
              there.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={APP.register} className="gap-2">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href={APP.login} variant="ghostDark">
                Sign in
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
