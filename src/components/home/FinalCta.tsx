import { APP } from '../../constants/links';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';

export function FinalCta() {
  return (
    <section id="cta" className="bg-cta-band py-16 sm:py-20" aria-labelledby="cta-heading">
      <Container className="text-center">
        <h2
          id="cta-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-white sm:text-[2.4rem]"
        >
          Run your space from one place.
        </h2>
        <p className="mt-3 text-[15px] text-white/75">
          Occupancy, meals, headcount and payments — together.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={APP.register} variant="onDark">
            Get started free
          </ButtonLink>
          <ButtonLink href={APP.login} variant="ghostDark">
            Sign in
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
