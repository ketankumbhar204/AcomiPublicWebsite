import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { APP, NAV_LINKS } from '../../constants/links';
import { useUserType } from '../../context/UserTypeContext';
import { ActionButton } from '../common/ActionButton';
import { BrandMark } from '../common/BrandMark';
import { UserTypeSwitcher } from '../onboarding/UserTypeSwitcher';
import { Container } from './Container';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { openUserTypeModal } = useUserType();
  const showSwitcher = pathname !== '/';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur-xl">
      <Container className="flex h-16 !max-w-none items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-text" onClick={() => setOpen(false)}>
          <BrandMark size={30} className="!rounded-md" />
          <span className="text-[15px] tracking-tight">ACOMI</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-soft text-text' : 'text-text-secondary hover:text-text'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          {showSwitcher ? <UserTypeSwitcher /> : null}
          <a href={APP.login} className="text-sm font-medium text-text-secondary transition hover:text-text">
            Sign in
          </a>
          <ActionButton onClick={openUserTypeModal} className="!px-4 !py-2 bg-register hover:bg-register-hover">
            Get started
          </ActionButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ActionButton
            onClick={() => {
              setOpen(false);
              openUserTypeModal();
            }}
            className="!px-3.5 !py-2 bg-register hover:bg-register-hover"
          >
            Get started
          </ActionButton>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
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
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="px-1 py-3 text-sm font-medium text-text"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <a href={APP.login} className="px-1 py-3 text-sm font-medium text-text-secondary">
              Sign in
            </a>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
