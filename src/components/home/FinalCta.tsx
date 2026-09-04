import { useTranslation } from 'react-i18next';
import { APP } from '../../constants/links';
import { useUserType } from '../../context/UserTypeContext';
import { ActionButton } from '../common/ActionButton';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';

export function FinalCta() {
  const { t } = useTranslation();
  const { openUserTypeModal } = useUserType();

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
          <ButtonLink href={APP.login} variant="ghostDark">
            {t('nav.signIn')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
