import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { isSafeEnquiryId, listMyNotifications, markMyNotificationRead } from '../../auth/inboxApi';
import { useAuth } from '../../auth/AuthProvider';
import type { UserNotification } from '../../auth/types';
import { formatRelativeTime } from '../../lib/relativeTime';

export function NotificationBell() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await listMyNotifications(0, 8);
      setItems(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      setItems([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const timer = window.setInterval(() => {
      void refresh();
    }, 45000);
    return () => window.clearInterval(timer);
  }, [isAuthenticated, refresh]);

  useEffect(() => {
    if (!open) return undefined;
    void refresh();
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open, refresh]);

  if (!isAuthenticated) {
    return null;
  }

  async function openItem(item: UserNotification) {
    setOpen(false);
    if (!item.read) {
      try {
        await markMyNotificationRead(item.notificationId);
        setUnreadCount((count) => Math.max(0, count - 1));
        setItems((current) =>
          current.map((row) => (row.notificationId === item.notificationId ? { ...row, read: true } : row)),
        );
      } catch {
        // Navigation still proceeds.
      }
    }
    const enquiryId = isSafeEnquiryId(item.enquiryId) ? item.enquiryId : null;
    navigate(enquiryId ? `/my-enquiries?id=${enquiryId}` : '/my-enquiries');
  }

  const badge = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-soft hover:text-text"
        aria-label={
          unreadCount > 0 ? `${t('notifications.title')} (${unreadCount})` : t('notifications.title')
        }
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-red-500 px-1 text-[10px] font-bold leading-4 text-white">
            {badge}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold text-navy">
            {t('notifications.title')}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-text-secondary">{t('notifications.empty')}</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((item) => (
                <li key={item.notificationId}>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left hover:bg-soft ${item.read ? '' : 'bg-mint/40'}`}
                    onClick={() => void openItem(item)}
                  >
                    <p className={`text-sm text-navy ${item.read ? 'font-medium' : 'font-semibold'}`}>
                      {item.read ? '○' : '●'} {item.title}
                    </p>
                    {item.message ? (
                      <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{item.message}</p>
                    ) : null}
                    <p className="mt-1 text-[11px] text-text-secondary">
                      {formatRelativeTime(item.createdAt, i18n.language)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/notifications"
            className="block border-t border-border px-4 py-2.5 text-center text-sm font-semibold text-primary"
            onClick={() => setOpen(false)}
          >
            {t('notifications.viewAll')}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
