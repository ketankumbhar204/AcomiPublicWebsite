import { useTranslation } from 'react-i18next';
import { SignInCta } from '../auth/SignInCta';
import { useUserType } from '../../context/UserTypeContext';
import { ActionButton } from '../common/ActionButton';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';

export function FinalCta({ balanced = false }: { balanced?: boolean }) {
  const { t } = useTranslation();
  const { openUserTypeModal } = useUserType();

  if (balanced) {
    return (
      <section id="cta" className="bg-cta-band py-16 sm:py-20" aria-labelledby="cta-heading">
        <Container className="text-center">
          <h2
            id="cta-heading"
            className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-white sm:text-[2.4rem]"
          >
            {t('finalCta.balancedTitle')}
          </h2>
          <p className="mt-3 text-[15px] text-white/75">{t('finalCta.balancedSubtitle')}</p>
          <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <ButtonLink href="/places" variant="onDark" external={false} className="w-full">
              {t('finalCta.findPlace')}
            </ButtonLink>
            <ButtonLink href="/meals" variant="onDark" external={false} className="w-full">
              {t('finalCta.findMeals')}
            </ButtonLink>
            <ButtonLink href="/property-owners" variant="onDark" external={false} className="w-full">
              {t('finalCta.manageProperty')}
            </ButtonLink>
            <ButtonLink href="/mess-vendors" variant="onDark" external={false} className="w-full">
              {t('finalCta.runFood')}
            </ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="cta" className="bg-cta-band py-16 sm:py-20" aria-labelledby="cta-heading">
      <Container className="text-center">
        <h2
          id="cta-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-white sm:text-[2.4rem]"
        >
          {t('finalCta.title')}
        </h2>
        <p className="mt-3 text-[15px] text-white/75">{t('finalCta.subtitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ActionButton onClick={openUserTypeModal} variant="onDark">
            {t('hero.getStartedFree')}
          </ActionButton>
          <SignInCta variant="ghostDark" />
        </div>
      </Container>
    </section>
  );
}
