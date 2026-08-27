import { useEffect } from 'react';
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
  useEffect(() => {
    applySeo({
      title: 'ACOMI for mess vendors — headcount, menus and meal dues',
      description:
        'Operations software for mess, tiffin and meal-service operators. Track customers, menus, headcount and meal dues — on web and Android.',
      path: '/mess-vendors',
    });
  }, []);

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
