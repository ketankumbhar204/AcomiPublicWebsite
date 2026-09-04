import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USER_TYPE_OPTIONS, getUserTypeOption } from '../../constants/userTypes';
import type { UserType } from '../../constants/userTypes';
import { useUserType } from '../../context/UserTypeContext';
import { ActionButton } from '../common/ActionButton';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';
import { UserTypeCard } from '../onboarding/UserTypeCard';
import { HeroPhones } from './HeroPhones';

export function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openUserTypeModal, selectUserType } = useUserType();

  function handleSelect(id: UserType) {
    selectUserType(id);
    navigate(getUserTypeOption(id).to);
  }

  return (
    <section
      className="overflow-x-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white pt-10 pb-10 sm:pt-14 sm:pb-12"
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div>
            <h1
              id="hero-heading"
              className="text-[1.7rem] leading-[1.15] font-semibold tracking-tight text-navy sm:text-[2rem]"
            >
              {t('hero.heading')}
            </h1>
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {USER_TYPE_OPTIONS.map((option) => (
                <UserTypeCard
                  key={option.id}
                  option={option}
                  selected={false}
                  onSelect={handleSelect}
                />
              ))}
            </div>
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
              {t('hero.builtFor')}
            </p>
          </div>
          <HeroPhones />
        </div>
      </Container>
    </section>
  );
}
