import { useTranslation } from 'react-i18next';
import { useUserType } from '../../context/UserTypeContext';
import { ActionButton } from '../common/ActionButton';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';

export function OperatorBridgeSection() {
  const { t } = useTranslation();
  const { openUserTypeModal } = useUserType();

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="operator-bridge-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
          {t('home.operatorBridge.eyebrow')}
        </p>
        <h2
          id="operator-bridge-heading"
          className="mt-2 max-w-3xl text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
        >
          {t('home.operatorBridge.title')}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          {t('home.operatorBridge.body')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/property-owners" external={false}>
            {t('home.operatorBridge.manageProperty')}
          </ButtonLink>
          <ButtonLink href="/mess-vendors" variant="ghost" external={false}>
            {t('home.operatorBridge.runFood')}
          </ButtonLink>
          <ActionButton onClick={openUserTypeModal} variant="ghost">
            {t('home.operatorBridge.getStarted')}
          </ActionButton>
        </div>
      </Container>
    </section>
  );
}
