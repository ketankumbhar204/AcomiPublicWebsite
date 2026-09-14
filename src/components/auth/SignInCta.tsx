import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthProvider';
import { APP } from '../../constants/links';
import { ActionButton } from '../common/ActionButton';
import { ButtonLink } from '../common/ButtonLink';

type SignInCtaProps = {
  variant?: 'link' | 'ghostDark';
  className?: string;
};

export function SignInCta({ variant = 'link', className = '' }: SignInCtaProps) {
  const { t } = useTranslation();
  const { isAuthenticated, openAuth } = useAuth();

  if (isAuthenticated) {
    if (variant === 'ghostDark') {
      return (
        <ButtonLink href={APP.web} variant="ghostDark" className={className}>
          {t('nav.dashboard')}
        </ButtonLink>
      );
    }
    return (
      <a href={APP.web} className={className || 'text-text-secondary transition hover:text-primary'}>
        {t('nav.dashboard')}
      </a>
    );
  }

  if (variant === 'ghostDark') {
    return (
      <ActionButton onClick={() => openAuth('login')} variant="ghostDark" className={className}>
        {t('nav.signIn')}
      </ActionButton>
    );
  }

  return (
    <button
      type="button"
      className={className || 'text-left text-text-secondary transition hover:text-primary'}
      onClick={() => openAuth('login')}
    >
      {t('nav.signIn')}
    </button>
  );
}
