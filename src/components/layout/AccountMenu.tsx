import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  UserRound,
} from 'lucide-react';
import { listMyNotifications } from '../../auth/inboxApi';
import { useAuth } from '../../auth/AuthProvider';
import { APP } from '../../constants/links';
import {
  changeAppLanguage,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from '../../i18n';

function initialsFromName(name: string | undefined): string {
  if (!name?.trim()) return 'A';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'A';
}

type AccountMenuProps = {
  /** Closes a parent mobile drawer when a menu action runs. */
  onNavigate?: () => void;
};

export function AccountMenu({ onNavigate }: AccountMenuProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = (i18n.language?.split('-')[0] ?? 'en') as AppLanguage;
  const language = SUPPORTED_LANGUAGES.includes(current) ? current : 'en';

  const refreshUnread = useCallback(async () => {
    try {
      const data = await listMyNotifications(0, 1);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    void refreshUnread();
    const timer = window.setInterval(() => {
      void refreshUnread();
    }, 45000);
    return () => window.clearInterval(timer);
  }, [refreshUnread]);

  useEffect(() => {
    if (!open) return undefined;
    void refreshUnread();
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
  }, [open, refreshUnread]);

  function close() {
    setOpen(false);
    onNavigate?.();
  }

  const displayName = user?.fullName?.trim() || t('nav.account');
  const badge = unreadCount > 9 ? '9+' : String(unreadCount);

  const itemClass =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-text transition hover:bg-soft';

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="inline-flex max-w-[14rem] items-center gap-2 rounded-full border border-border bg-white py-1 pr-2.5 pl-1 text-sm font-semibold text-navy shadow-sm transition hover:border-text/20 hover:bg-soft"
        aria-label={t('nav.accountMenu')}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold tracking-wide text-white">
          {initialsFromName(user?.fullName)}
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="min-w-0 truncate">{displayName}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t('nav.accountMenu')}
          className="absolute right-0 z-50 mt-2 w-[min(18.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-navy">{displayName}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{t('nav.accountMenuHint')}</p>
          </div>

          <div className="space-y-0.5 p-2">
            <NavLink to="/" end role="menuitem" className={itemClass} onClick={close}>
              <Home className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
              {t('nav.home')}
            </NavLink>

            <label className="flex items-center gap-2.5 rounded-lg px-3 py-2.5">
              <span className="text-sm font-medium text-text-secondary">{t('language.title')}</span>
              <select
                value={language}
                aria-label={t('language.select')}
                onChange={(event) => {
                  const next = event.target.value as AppLanguage;
                  if (next === language) return;
                  void changeAppLanguage(next);
                }}
                className="ml-auto h-8 max-w-[9rem] rounded-lg border border-border bg-white px-2 text-sm font-medium text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {SUPPORTED_LANGUAGES.map((code) => (
                  <option key={code} value={code}>
                    {t(`language.names.${code}`)}
                  </option>
                ))}
              </select>
            </label>

            <NavLink
              to="/notifications"
              role="menuitem"
              className={itemClass}
              onClick={close}
            >
              <Bell className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
              <span className="flex-1">{t('nav.notifications')}</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-4 text-white">
                  {badge}
                </span>
              ) : null}
            </NavLink>

            <a href={APP.web} role="menuitem" className={itemClass} onClick={close}>
              <LayoutDashboard className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
              {t('nav.dashboard')}
            </a>

            <NavLink to="/my-enquiries" role="menuitem" className={itemClass} onClick={close}>
              <Inbox className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
              {t('nav.myEnquiries')}
            </NavLink>

            <a href={APP.profile} role="menuitem" className={itemClass} onClick={close}>
              <UserRound className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
              {t('nav.account')}
            </a>
          </div>

          <div className="border-t border-border p-2">
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-red-600 hover:bg-red-50`}
              onClick={() => {
                close();
                void logout();
              }}
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              {t('nav.signOut')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
