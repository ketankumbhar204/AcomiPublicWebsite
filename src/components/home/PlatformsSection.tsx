import { Monitor, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP } from '../../constants/links';
import { IconBadge } from '../common/IconBadge';
import { BrowserChrome } from '../product/BrowserChrome';
import { OperationsDashboard } from '../product/OperationsDashboard';
import { Container } from '../layout/Container';

export function PlatformsSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="platforms-heading">
      <Container>
        <h2
          id="platforms-heading"
          className="text-[1.7rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2rem]"
        >
          {t('home.platforms.title')}
        </h2>
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div className="grid gap-3">
            <article className="rounded-[20px] border border-black/5 bg-mint p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={Monitor} tone="teal" />
              <h3 className="mt-3 text-lg font-semibold text-navy">{t('home.platforms.web')}</h3>
              <p className="mt-1 text-sm text-text-secondary">app.acomi.in</p>
              <a href={APP.web} className="mt-3 inline-block text-sm font-semibold text-primary">
                {t('home.platforms.openWebApp')}
              </a>
            </article>
            <article className="rounded-[20px] border border-black/5 bg-[#F4F8FF] p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={Smartphone} tone="blue" />
              <h3 className="mt-3 text-lg font-semibold text-navy">{t('common.android')}</h3>
              <p className="mt-1 text-sm text-text-secondary">{t('home.platforms.androidApp')}</p>
            </article>
          </div>
          <BrowserChrome url="app.acomi.in">
            <OperationsDashboard compact />
          </BrowserChrome>
        </div>
      </Container>
    </section>
  );
}
