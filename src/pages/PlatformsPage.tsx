import { useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP } from '../constants/links';
import { ButtonLink } from '../components/common/ButtonLink';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { BrowserChrome } from '../components/product/BrowserChrome';
import { OperationsDashboard } from '../components/product/OperationsDashboard';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function PlatformsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    applySeo({
      title: t('platformsPage.seo.title'),
      description: t('platformsPage.seo.description'),
      path: '/platforms',
    });
  }, [t]);

  return (
    <>
      <PageHero
        eyebrow={t('platformsPage.eyebrow')}
        title={t('platformsPage.title')}
        description={t('platformsPage.description')}
      />
      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="platforms-heading">
        <Container>
          <PageSectionHead id="platforms-heading" title={t('platformsPage.sectionTitle')} />
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
            <div className="grid gap-4">
              <article className="rounded-[20px] border border-black/5 bg-mint p-6 shadow-[var(--shadow-sm)]">
                <IconBadge icon={Monitor} tone="teal" />
                <h2 className="mt-4 text-lg font-semibold text-navy">{t('platformsPage.web.title')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {t('platformsPage.web.body')}
                </p>
                <div className="mt-5">
                  <ButtonLink href={APP.web}>{t('platformsPage.web.cta')}</ButtonLink>
                </div>
              </article>
              <article className="rounded-[20px] border border-black/5 bg-[#F4F8FF] p-6 shadow-[var(--shadow-sm)]">
                <IconBadge icon={Smartphone} tone="blue" />
                <h2 className="mt-4 text-lg font-semibold text-navy">{t('platformsPage.android.title')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {t('platformsPage.android.body')}
                </p>
                <p className="mt-4 text-sm text-muted">{t('platformsPage.android.note')}</p>
              </article>
            </div>
            <BrowserChrome url="app.acomi.in">
              <OperationsDashboard compact />
            </BrowserChrome>
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
