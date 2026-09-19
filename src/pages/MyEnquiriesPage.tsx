import { useEffect } from 'react';
import { ExternalLink, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RequireAuth } from '../components/auth/RequireAuth';
import { BUTTON_BASE, BUTTON_VARIANTS } from '../components/common/ButtonLink';
import { Container } from '../components/layout/Container';
import { openAcomiAndroidApp } from '../lib/openAcomiAndroidApp';
import { applySeo } from '../lib/seo';

/**
 * Public site never lists enquiry details. Direct /my-enquiries visits
 * (bookmarks, old links) get the same Android app download prompt.
 */
export function MyEnquiriesPage() {
  return (
    <RequireAuth>
      <MyEnquiriesAppOnlyView />
    </RequireAuth>
  );
}

function MyEnquiriesAppOnlyView() {
  const { t } = useTranslation();

  useEffect(() => {
    applySeo({
      title: t('enquiries.title'),
      description: t('enquiries.appOnlyBody'),
      path: '/my-enquiries',
    });
  }, [t]);

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-lg rounded-[24px] border border-border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-navy">
          {t('enquiries.appOnlyTitle')}
        </h1>
        <p className="mt-2 text-center text-[14px] text-text-secondary">{t('enquiries.appOnlyBody')}</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => openAcomiAndroidApp()}
            className="flex w-full items-center gap-3 rounded-2xl border border-primary/25 bg-[#E7F6EE] px-3.5 py-3 text-left transition hover:border-primary/50"
          >
            <span className="shrink-0 text-primary">
              <Smartphone className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-navy">
                {t('discovery.enquireOpenApp')}
              </span>
              <span className="block text-[12px] text-text-secondary">
                {t('discovery.enquireAppHint')}
              </span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-primary/70" aria-hidden />
          </button>

          <div className="rounded-2xl border border-primary/20 bg-[#E7F6EE] px-4 py-3.5 text-center">
            <p className="text-[15px] font-bold leading-snug tracking-tight text-navy">
              {t('discovery.enquireAppPromoTitle')}
            </p>
            <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">
              {t('discovery.enquireAppPromoBody')}
            </p>
          </div>
        </div>

        <Link to="/places" className={`${BUTTON_BASE} ${BUTTON_VARIANTS.ghost} mt-5 w-full`}>
          {t('enquiries.appOnlyBrowse')}
        </Link>
      </div>
    </Container>
  );
}
