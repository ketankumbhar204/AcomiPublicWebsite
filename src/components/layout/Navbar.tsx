import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { NAV_LINKS } from '../../constants/links';
import { useUserType } from '../../context/UserTypeContext';
import { ActionButton } from '../common/ActionButton';
import { BrandMark } from '../common/BrandMark';
import { LanguageSelect } from '../common/LanguageSelect';
import { UserTypeSwitcher } from '../onboarding/UserTypeSwitcher';
import { AccountMenu } from './AccountMenu';
import { Container } from './Container';
import { ExploreMenu } from './ExploreMenu';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { openUserTypeModal } = useUserType();
  const { isAuthenticated, openAuth } = useAuth();
  const isHome = pathname === '/';
  const isDiscovery = pathname === '/places' || pathname === '/meals';
  const showSwitcher = !isHome && !isDiscovery;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-soft text-text' : 'text-text-secondary hover:text-text'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur-xl">
      <Container className="flex h-16 !max-w-none items-center justify-between gap-4">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 font-bold text-text"
          aria-label={t('nav.home')}
          title={t('nav.home')}
          onClick={() => setOpen(false)}
        >
          <BrandMark size={30} className="!rounded-md" />
          <span className="text-[15px] tracking-tight">{t('brand')}</span>
        </NavLink>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('nav.primary')}>
          <NavLink to="/" end className={linkClass}>
            {t('nav.home')}
          </NavLink>
          <ExploreMenu />
          <NavLink to="/places" className={linkClass}>
            {t('nav.places', { defaultValue: 'Places' })}
          </NavLink>
          <NavLink to="/meals" className={linkClass}>
            {t('nav.meals', { defaultValue: 'Meals' })}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {showSwitcher ? (
            <div className="hidden lg:block">
              <UserTypeSwitcher />
            </div>
          ) : null}

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <AccountMenu onNavigate={() => setOpen(false)} />
            </>
          ) : (
            <>
              <LanguageSelect />
              <button
                type="button"
                className="hidden text-sm font-medium text-text-secondary transition hover:text-text sm:inline"
                onClick={() => openAuth('login')}
              >
                {t('nav.signIn')}
              </button>
              <ActionButton
                onClick={() => {
                  setOpen(false);
                  openAuth('register');
                }}
                className="!px-3.5 !py-2 bg-register hover:bg-register-hover sm:!px-4"
              >
                {t('auth.createAccount')}
              </ActionButton>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-white lg:hidden">
          <Container className="flex flex-col py-3">
            {showSwitcher ? <UserTypeSwitcher variant="menu" onOpen={() => setOpen(false)} /> : null}
            <NavLink to="/" end className="px-1 py-3 text-sm font-medium text-text" onClick={() => setOpen(false)}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/places" className="px-1 py-3 text-sm font-medium text-text" onClick={() => setOpen(false)}>
              {t('nav.places', { defaultValue: 'Places' })}
            </NavLink>
            <NavLink to="/meals" className="px-1 py-3 text-sm font-medium text-text" onClick={() => setOpen(false)}>
              {t('nav.meals', { defaultValue: 'Meals' })}
            </NavLink>
            <p className="mt-2 px-1 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              {t('nav.explore')}
            </p>
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="px-1 py-3 text-sm font-medium text-text"
                onClick={() => setOpen(false)}
              >
                {t(l.labelKey)}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="px-1 py-3 text-left text-sm font-medium text-text-secondary sm:hidden"
                  onClick={() => {
                    setOpen(false);
                    openAuth('login');
                  }}
                >
                  {t('nav.signIn')}
                </button>
                <button
                  type="button"
                  className="px-1 py-3 text-left text-sm font-medium text-text-secondary"
                  onClick={() => {
                    setOpen(false);
                    openUserTypeModal();
                  }}
                >
                  {t('nav.getStarted')}
                </button>
              </>
            ) : null}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
