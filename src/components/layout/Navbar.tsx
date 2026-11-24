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
import { FavoritesMenu } from './FavoritesMenu';
import { NotificationBell } from './NotificationBell';

function MenuToggle({
  open,
  onToggle,
  openLabel,
  closeLabel,
}: {
  open: boolean;
  onToggle: () => void;
  openLabel: string;
  closeLabel: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text"
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? closeLabel : openLabel}
      onClick={onToggle}
    >
      {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
}

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

  const toggleMenu = () => setOpen((value) => !value);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur-xl">
      <Container className="flex h-[4.5rem] !max-w-none items-center justify-between gap-3 md:gap-4">
        <NavLink
          to="/"
          className="flex shrink-0 flex-col items-center gap-0.5 font-bold text-text md:flex-row md:items-center md:gap-2.5"
          aria-label={t('nav.home')}
          title={t('nav.home')}
          onClick={() => setOpen(false)}
        >
          <BrandMark
            size={52}
            className="!h-10 !w-10 !rounded-xl md:!h-[52px] md:!w-[52px]"
          />
          <span className="text-[11px] leading-none tracking-tight md:text-xl">{t('brand')}</span>
        </NavLink>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('nav.primary')}>
          <NavLink to="/" end className={linkClass}>
            {t('nav.home')}
          </NavLink>
          <ExploreMenu />
          <NavLink to="/places" className={linkClass}>
            {t('nav.places', { defaultValue: 'Rental properties' })}
          </NavLink>
          <NavLink to="/meals" className={linkClass}>
            {t('nav.meals', { defaultValue: 'Tiffin and meal services' })}
          </NavLink>
        </nav>

        {/* Mobile header actions — phone widths only */}
        <div className="flex items-center gap-0.5 md:hidden">
          <FavoritesMenu />
          <LanguageSelect variant="icon" />
          <MenuToggle
            open={open}
            onToggle={toggleMenu}
            openLabel={t('nav.openMenu')}
            closeLabel={t('nav.closeMenu')}
          />
        </div>

        {/* Tablet + desktop header actions — unchanged */}
        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          {showSwitcher ? (
            <div className="hidden lg:block">
              <UserTypeSwitcher />
            </div>
          ) : null}

          <FavoritesMenu />

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

          <div className="lg:hidden">
            <MenuToggle
              open={open}
              onToggle={toggleMenu}
              openLabel={t('nav.openMenu')}
              closeLabel={t('nav.closeMenu')}
            />
          </div>
        </div>
      </Container>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-white lg:hidden">
          <Container className="flex flex-col py-3">
            {isAuthenticated ? (
              <div className="mb-1 flex items-center gap-2 border-b border-border/70 px-1 pb-3 md:hidden">
                <NotificationBell />
                <AccountMenu onNavigate={() => setOpen(false)} />
              </div>
            ) : null}
            {showSwitcher ? <UserTypeSwitcher variant="menu" onOpen={() => setOpen(false)} /> : null}
            <NavLink to="/" end className="px-1 py-3 text-sm font-medium text-text" onClick={() => setOpen(false)}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/places" className="px-1 py-3 text-sm font-medium text-text" onClick={() => setOpen(false)}>
              {t('nav.places', { defaultValue: 'Rental properties' })}
            </NavLink>
            <NavLink to="/meals" className="px-1 py-3 text-sm font-medium text-text" onClick={() => setOpen(false)}>
              {t('nav.meals', { defaultValue: 'Tiffin and meal services' })}
            </NavLink>
            <NavLink to="/favorites" className="px-1 py-3 text-sm font-medium text-text" onClick={() => setOpen(false)}>
              {t('favorites.open', { defaultValue: 'Favorites' })}
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
                  className="px-1 py-3 text-left text-sm font-medium text-text-secondary md:hidden"
                  onClick={() => {
                    setOpen(false);
                    openAuth('login');
                  }}
                >
                  {t('nav.signIn')}
                </button>
                <button
                  type="button"
                  className="px-1 py-3 text-left text-sm font-medium text-text-secondary md:hidden"
                  onClick={() => {
                    setOpen(false);
                    openAuth('register');
                  }}
                >
                  {t('auth.createAccount')}
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
