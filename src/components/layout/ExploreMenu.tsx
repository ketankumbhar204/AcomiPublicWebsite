import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { NAV_LINKS } from '../../constants/links';

type ExploreMenuProps = {
  onNavigate?: () => void;
};

/** Desktop dropdown for marketing pages — keeps the header clean. */
export function ExploreMenu({ onNavigate }: ExploreMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-soft hover:text-text"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {t('nav.explore')}
        <ChevronDown
          className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 z-50 mt-2 min-w-[12.5rem] overflow-hidden rounded-xl border border-border bg-white py-1.5 shadow-lg"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              role="menuitem"
              className={({ isActive }) =>
                `block px-3.5 py-2.5 text-sm font-medium transition hover:bg-soft ${
                  isActive ? 'bg-soft text-text' : 'text-text-secondary hover:text-text'
                }`
              }
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
