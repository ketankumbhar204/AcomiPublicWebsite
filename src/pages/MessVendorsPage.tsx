import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessVendorFinalCta } from '../components/messVendor/MessVendorFinalCta';
import { MessVendorHeadcountSection } from '../components/messVendor/MessVendorHeadcountSection';
import { MessVendorHero } from '../components/messVendor/MessVendorHero';
import { MessVendorHowItWorksSection } from '../components/messVendor/MessVendorHowItWorksSection';
import { MessVendorMenuSection } from '../components/messVendor/MessVendorMenuSection';
import { MessVendorOperationsSection } from '../components/messVendor/MessVendorOperationsSection';
import { MessVendorPaymentsSection } from '../components/messVendor/MessVendorPaymentsSection';
import { MessVendorPlatformsSection } from '../components/messVendor/MessVendorPlatformsSection';
import { MessVendorProblemSection } from '../components/messVendor/MessVendorProblemSection';
import { MessVendorServiceTypesSection } from '../components/messVendor/MessVendorServiceTypesSection';
import { MessVendorTrustSection } from '../components/messVendor/MessVendorTrustSection';
import { MessVendorWhatsAppSection } from '../components/messVendor/MessVendorWhatsAppSection';
import { applySeo } from '../lib/seo';

export function MessVendorsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    applySeo({
      title: t('messVendor.seo.title'),
      description: t('messVendor.seo.description'),
      path: '/mess-vendors',
    });
  }, [t]);

  return (
    <>
      <MessVendorHero />
      <MessVendorProblemSection />
      <MessVendorServiceTypesSection />
      <MessVendorHeadcountSection />
      <MessVendorMenuSection />
      <MessVendorOperationsSection />
      <MessVendorPaymentsSection />
      <MessVendorPlatformsSection />
      <MessVendorWhatsAppSection />
      <MessVendorHowItWorksSection />
      <MessVendorTrustSection />
      <MessVendorFinalCta />
    </>
  );
}
