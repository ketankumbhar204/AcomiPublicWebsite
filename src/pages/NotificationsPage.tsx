import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { isSafeEnquiryId, listMyNotifications, markMyNotificationRead } from '../auth/inboxApi';
import type { UserNotification } from '../auth/types';
import { RequireAuth } from '../components/auth/RequireAuth';
import { Container } from '../components/layout/Container';
import { formatRelativeTime } from '../lib/relativeTime';
import { applySeo } from '../lib/seo';

export function NotificationsPage() {
  return (
    <RequireAuth>
      <NotificationsView />
    </RequireAuth>
  );
}

function NotificationsView() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applySeo({
      title: t('notifications.title'),
      description: t('notifications.subtitle'),
      path: '/notifications',
    });
  }, [t]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listMyNotifications(0, 50);
      setItems(data.notifications ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openItem(item: UserNotification) {
    if (!item.read) {
      try {
        await markMyNotificationRead(item.notificationId);
        setItems((current) =>
          current.map((row) => (row.notificationId === item.notificationId ? { ...row, read: true } : row)),
        );
      } catch {
        // Continue to My Enquiries.
      }
    }
    const enquiryId = isSafeEnquiryId(item.enquiryId) ? item.enquiryId : null;
    navigate(enquiryId ? `/my-enquiries?id=${enquiryId}` : '/my-enquiries');
  }

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">{t('notifications.title')}</h1>
      <p className="mt-1 text-sm text-text-secondary">{t('notifications.subtitle')}</p>
      {loading ? (
        <p className="mt-8 text-sm text-text-secondary">{t('auth.pleaseWait')}</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-text-secondary">{t('notifications.empty')}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item.notificationId}>
              <button
                type="button"
                className={`w-full rounded-2xl border px-4 py-3 text-left ${
                  item.read ? 'border-border bg-white' : 'border-primary/30 bg-mint/40'
                }`}
                onClick={() => void openItem(item)}
              >
                <p className={`text-sm text-navy ${item.read ? 'font-medium' : 'font-semibold'}`}>{item.title}</p>
                {item.message ? <p className="mt-1 text-sm text-text-secondary">{item.message}</p> : null}
                <p className="mt-2 text-xs text-text-secondary">
                  {formatRelativeTime(item.createdAt, i18n.language)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/my-enquiries" className="mt-8 inline-block text-sm font-semibold text-primary">
        {t('nav.myEnquiries')}
      </Link>
    </Container>
  );
}
