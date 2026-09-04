import { Monitor, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP } from '../../constants/links';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { IconBadge } from '../common/IconBadge';
import { BrowserChrome } from '../product/BrowserChrome';
import { Container } from '../layout/Container';

export function MessVendorPlatformsSection() {
  const { t } = useTranslation();

  return (
    <section
      className="border-t border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="mess-platforms-heading"
    >
      <Container>
        <h2
          id="mess-platforms-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('platformsPage.title')}
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {t('platformsPage.description')}
        </p>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div className="grid gap-3">
            <article className="rounded-[20px] border border-black/5 bg-mint p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={Monitor} tone="teal" />
              <h3 className="mt-3 text-lg font-semibold text-navy">{t('common.web')}</h3>
              <p className="mt-1 text-sm text-text-secondary">app.acomi.in</p>
              <a href={APP.web} className="mt-3 inline-block text-sm font-semibold text-primary">
                {t('common.openWebApp')}
              </a>
            </article>
            <article className="rounded-[20px] border border-black/5 bg-[#F4F8FF] p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={Smartphone} tone="blue" />
              <h3 className="mt-3 text-lg font-semibold text-navy">{t('common.android')}</h3>
              <p className="mt-1 text-sm text-text-secondary">{t('home.platforms.androidApp')}</p>
            </article>
          </div>
          <BrowserChrome url="app.acomi.in">
            <MessDashboardMock />
          </BrowserChrome>
        </div>
      </Container>
    </section>
  );
}

function MessDashboardMock() {
  const { t } = useTranslation();
  const { mess } = DEMO;

  return (
    <div className="overflow-hidden rounded-xl bg-[#FFF8F1] text-left">
      <div className="flex items-center justify-between border-b border-border/80 bg-white px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-orange uppercase">
            {t('owner.dashboard.todaysOps')}
          </p>
          <p className="truncate text-sm font-bold text-text">{mess.name}</p>
        </div>
        <span className="rounded-full bg-[#FFF1E0] px-2 py-0.5 text-[10px] font-semibold text-orange">
          {t('owner.dashboard.ownerView')}
        </span>
      </div>
      <div className="space-y-3 p-3">
        <section className="rounded-xl bg-white p-3 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold text-text">{t('labels.headcount')}</h3>
            <p className="text-xs font-bold tabular-nums text-orange">
              {t('messVendor.headcount.customersCount', { count: mess.customers })}
            </p>
          </div>
          <ul className="mt-2 space-y-2">
            {mess.meals.map((m) => (
              <li key={m.name} className="flex items-center justify-between text-xs">
                <span className="font-medium text-text">{m.name}</span>
                <span className="font-semibold tabular-nums">
                  {m.prepare}
                  <span className="font-medium text-muted"> / {m.expected}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-muted">
            {t('messVendor.dashboard.noResponseLine', {
              poll: mess.poll,
              count: mess.noResponse,
            })}
          </p>
        </section>
        <section className="rounded-xl bg-white p-3 ring-1 ring-border">
          <h3 className="text-xs font-semibold text-text">
            {t('meals.breakfast')} · {mess.breakfastDetail.date}
          </h3>
          <ul className="mt-2 space-y-1.5">
            {mess.breakfastDetail.options.map((o) => (
              <li key={o.name} className="flex justify-between text-xs">
                <span className="text-text">{o.name}</span>
                <span className="font-semibold tabular-nums">{o.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <DemoLabel className="px-4 pb-3">{DEMO_LABEL}</DemoLabel>
    </div>
  );
}
