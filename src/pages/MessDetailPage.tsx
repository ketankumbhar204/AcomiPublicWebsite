import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../components/common/ActionButton';
import { ButtonLink } from '../components/common/ButtonLink';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { ListingGallery } from '../components/discovery/ListingGallery';
import { ListingMapLink } from '../components/discovery/ListingMapLink';
import { ListingPrice } from '../components/discovery/ListingPrice';
import { Container } from '../components/layout/Container';
import { getDiscoverSpaceDetail } from '../data/listings/discoverApi';
import { formatListingAddress } from '../data/listings';
import { toMessListing } from '../data/listings/mapDiscoverListing';
import type { MessListing } from '../data/listings/types';
import { applySeo } from '../lib/seo';
import { takeEnquireResumeIntentForListing } from '../auth/enquireIntent';

export function MessDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const [listing, setListing] = useState<MessListing | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [enquireOpen, setEnquireOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setListing(null);
    void getDiscoverSpaceDetail(id)
      .then((detail) => {
        if (cancelled) return;
        const mapped = toMessListing(detail);
        setListing(mapped);
        setStatus(mapped ? 'ready' : 'missing');
      })
      .catch(() => {
        if (cancelled) return;
        setListing(null);
        setStatus('missing');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!listing?.id) return;
    const intent = takeEnquireResumeIntentForListing(listing.id);
    if (intent) {
      setEnquireOpen(true);
    }
  }, [listing?.id]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status !== 'ready' || !listing) {
      applySeo({
        title: t('messDetail.seoNotFound.title'),
        description: t('messDetail.seoNotFound.description'),
        path: `/meals/${id}`,
      });
      return;
    }
    applySeo({
      title: `${listing.name} — ACOMI`,
      description: `${listing.name}${listing.city ? ` in ${listing.city}` : ''}.`,
      path: `/meals/${listing.id}`,
    });
  }, [id, listing, status, t]);

  if (status === 'loading') {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <p className="text-[15px] text-text-secondary">{t('mealsPage.loading')}</p>
        </Container>
      </section>
    );
  }

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
  const address = formatListingAddress(listing);

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
            <h1 className="mt-1 text-[1.75rem] font-semibold tracking-tight text-navy">{listing.name}</h1>
            {address ? (
              <p className="mt-2 flex items-center gap-1.5 text-[14px] text-text-secondary">
                <MapPin aria-hidden className="h-4 w-4 text-muted" />
                {address}
              </p>
            ) : null}
            <p className="mt-5 text-[1.5rem] font-semibold text-navy">
              <ListingPrice
                amount={listing.monthlyPrice}
                suffix={t('discovery.perMonth')}
                fallback={t('discovery.priceOnRequest')}
                size="detail"
              />
            </p>
            {listing.mealPrice != null ? (
              <p className="mt-1 text-[16px] font-medium text-navy">
                <ListingPrice amount={listing.mealPrice} suffix={t('discovery.perMeal')} fallback={t('discovery.priceOnRequest')} />
              </p>
            ) : null}
            {meta.mealsServed.length > 0 ? (
              <p className="mt-3 text-[14px] text-text-secondary">
                {meta.mealsServed.map((meal) => t(`meals.${meal.toLowerCase()}`)).join(' • ')}
              </p>
            ) : null}
            <div className="mt-6">
              <ActionButton onClick={() => setEnquireOpen(true)} className="w-full">
                <MessageCircle aria-hidden className="h-4 w-4" />
                {t('discovery.contactEnquire')}
              </ActionButton>
            </div>
          </div>
        </div>

        {listing.description ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">{t('discovery.aboutMess')}</h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-secondary">{listing.description}</p>
          </div>
        ) : null}

        {address ? (
          <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">{t('discovery.location')}</h2>
            <div className="mt-3">
              <ListingMapLink listing={listing} />
            </div>
          </div>
        ) : null}
      </Container>
      <EnquireDialog
        open={enquireOpen}
        listingId={listing.id}
        listingName={listing.name}
        listingKind="mess"
        onClose={() => setEnquireOpen(false)}
      />
    </section>
  );
}
