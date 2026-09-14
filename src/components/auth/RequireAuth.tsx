import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthProvider';
import { Container } from '../layout/Container';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { isAuthenticated, isBootstrapping, openAuth } = useAuth();

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      openAuth('login');
    }
  }, [isAuthenticated, isBootstrapping, openAuth]);

  if (isBootstrapping) {
    return (
      <Container className="py-16">
        <p className="text-sm text-text-secondary">{t('auth.pleaseWait')}</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-navy">{t('nav.signIn')}</h1>
        <p className="mt-2 max-w-lg text-sm text-text-secondary">{t('auth.loginBody')}</p>
        <button
          type="button"
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => openAuth('login')}
        >
          {t('nav.signIn')}
        </button>
      </Container>
    );
  }

  return children;
}
