export function formatRelativeTime(iso: string | undefined, locale: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat(locale || 'en', { numeric: 'auto' });
  if (Math.abs(minutes) < 1) {
    return rtf.format(0, 'minute');
  }
  if (Math.abs(minutes) < 60) {
    return rtf.format(-minutes, 'minute');
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(-hours, 'hour');
  }
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) {
    return rtf.format(-days, 'day');
  }
  return new Intl.DateTimeFormat(locale || 'en', { month: 'short', day: 'numeric' }).format(date);
}
