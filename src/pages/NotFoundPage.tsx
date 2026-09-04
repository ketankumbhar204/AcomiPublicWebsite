import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { APP } from '../constants/links';
import { ButtonLink } from '../components/common/ButtonLink';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function NotFoundPage() {
  const { t } = useTranslation();

  useEffect(() => {
    applySeo({
      title: t('notFound.seo.title'),
      description: t('notFound.seo.description'),
      path: '/404',
    });
  }, [t]);

  return (
    <section className="bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white py-20 sm:py-24">
      <Container className="max-w-xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">404</p>
        <h1 className="mt-3 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]">
          {t('notFound.title')}
        </h1>
        <p className="mt-3 text-[15px] text-text-secondary">{t('notFound.body')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="ghost" external={false}>
            {t('common.home')}
          </ButtonLink>
          <ButtonLink href={APP.register}>{t('nav.getStarted')}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
