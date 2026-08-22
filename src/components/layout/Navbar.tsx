import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { APP, NAV_LINKS } from '../../constants/links';
import { BrandMark } from '../common/BrandMark';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from './Container';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-text" onClick={() => setOpen(false)}>
          <BrandMark size={36} />
          <span className="text-base tracking-tight">ACOMI</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-soft text-text' : 'text-text-secondary hover:bg-slate-100 hover:text-text'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href={APP.login} variant="ghost" className="!py-2.5 !text-sm">
            Sign in
          </ButtonLink>
          <ButtonLink href={APP.register} className="!py-2.5 !text-sm">
            Get started
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-text lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-3 text-sm font-medium text-text hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <ButtonLink href={APP.login} variant="ghost" className="w-full">
                Sign in
              </ButtonLink>
              <ButtonLink href={APP.register} className="w-full">
                Get started
              </ButtonLink>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
