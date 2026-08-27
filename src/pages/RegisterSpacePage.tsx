import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ButtonLink } from '../components/common/ButtonLink';
import { PageHero } from '../components/common/PageHero';
import { CtaButton } from '../components/registration/RegistrationButtons';
import { useListingDrawer } from '../context/ListingDrawerContext';
import { useUserType } from '../context/UserTypeContext';
import { applySeo } from '../lib/seo';

const DESCRIPTION =
  'PG, hostel, rental or co-living. Share your property details and our team will take it forward.';

export function RegisterSpacePage() {
  const { isModalOpen } = useUserType();
  const { openListing } = useListingDrawer();

  useEffect(() => {
    applySeo({
      title: 'Register your property — ACOMI',
      description: DESCRIPTION,
      path: '/register-space',
    });
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      openListing('property');
    }
  }, [isModalOpen, openListing]);

  return (
    <PageHero
      eyebrow="Property registration"
      title="List your property in 3 simple steps"
      description={DESCRIPTION}
    >
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CtaButton onClick={() => openListing('property')}>List your property</CtaButton>
        <ButtonLink href="/" variant="ghost" external={false}>
          Back to home
        </ButtonLink>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[13px] text-text-secondary">
        <CheckCircle2 aria-hidden className="h-4 w-4 text-register" />
        It&rsquo;s free to register your property.
      </p>
    </PageHero>
  );
}
