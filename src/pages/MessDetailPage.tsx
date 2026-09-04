import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, MessageCircle, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../components/common/ActionButton';
import { ButtonLink } from '../components/common/ButtonLink';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { ListingGallery } from '../components/discovery/ListingGallery';
import { ListingMapLink } from '../components/discovery/ListingMapLink';
import { Container } from '../components/layout/Container';
import { formatInr, getMessListing } from '../data/listings';
import { applySeo } from '../lib/seo';

export function MessDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const listing = getMessListing(id);
  const [enquireOpen, setEnquireOpen] = useState(false);

  useEffect(() => {
    if (!listing) {
      applySeo({
        title: t('messDetail.seoNotFound.title'),
        description: t('messDetail.seoNotFound.description'),
        path: `/meals/${id}`,
      });
      return;
    }
    applySeo({
      title: `${listing.name} — ACOMI`,
      description: `${listing.name} in ${listing.locality}, ${listing.city}.`,
      path: `/meals/${listing.id}`,
    });
  }, [id, listing, t]);

  if (!listing) {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <h1 className="text-[2rem] font-semibold tracking-tight text-navy">
            {t('messDetail.notFoundTitle')}
          </h1>
          <p className="mt-3 text-[15px] text-text-secondary">{t('messDetail.notFoundBody')}</p>
          <div className="mt-8">
            <ButtonLink href="/meals" variant="ghost" external={false}>
              {t('messDetail.back')}
            </ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  const meta = listing.listingMetadata;

  return (
    <section className="bg-[#FFF8F1]/40 py-10 sm:py-12">
      <Container>
        <p className="text-[13px] text-text-secondary">
          <Link to="/meals" className="font-medium text-primary hover:underline">
            {t('messDetail.breadcrumb')}
          </Link>
          <span aria-hidden> / </span>
          {listing.name}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <ListingGallery images={meta.images} name={listing.name} />

          <div className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy">
              <Star aria-hidden className="h-3.5 w-3.5 fill-orange text-orange" />
              {meta.rating.toFixed(1)}
            </span>
            <h1 className="mt-3 text-[1.75rem] font-semibold tracking-tight text-navy">{listing.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-[14px] text-text-secondary">
              <MapPin aria-hidden className="h-4 w-4 text-muted" />
              {listing.addressLine}, {listing.locality}, {listing.city}, {listing.state} {listing.pincode}
            </p>
            <p className="mt-5 text-[1.5rem] font-semibold text-navy">
              {formatInr(listing.monthlyPrice)}
              <span className="ml-1 text-[13px] font-medium text-muted">{t('discovery.perMonth')}</span>
            </p>
            <p className="mt-1 text-[16px] font-medium text-navy">
              {formatInr(listing.mealPrice)}
              <span className="ml-1 text-[13px] font-medium text-muted">{t('discovery.perMeal')}</span>
            </p>
            {meta.mealsServed.length > 0 ? (
              <p className="mt-3 text-[14px] text-text-secondary">
                {meta.mealsServed
                  .map((meal) => t(`meals.${meal.toLowerCase()}`))
                  .join(' • ')}
              </p>
            ) : null}
            <p className="mt-2 text-[14px] text-text-secondary">
              {t('discovery.customersAbout', { count: listing.capacityEstimate })}
            </p>
            <div className="mt-6">
              <ActionButton onClick={() => setEnquireOpen(true)} className="w-full">
                <MessageCircle aria-hidden className="h-4 w-4" />
                {t('discovery.contactEnquire')}
              </ActionButton>
            </div>
            <p className="mt-3 text-[12px] text-muted">{t('discovery.sampleScores')}</p>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold text-navy">{t('discovery.aboutMess')}</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-secondary">{listing.description}</p>
        </div>

        <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold text-navy">{t('discovery.location')}</h2>
          <div className="mt-3">
            <ListingMapLink listing={listing} />
          </div>
        </div>
      </Container>
      <EnquireDialog
        open={enquireOpen}
        title={t('discovery.enquireAbout', { name: listing.name })}
        onClose={() => setEnquireOpen(false)}
      />
    </section>
  );
}
