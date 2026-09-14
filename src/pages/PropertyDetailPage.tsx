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
import { toPropertyListing } from '../data/listings/mapDiscoverListing';
import type { PropertyListing } from '../data/listings/types';
import { applySeo } from '../lib/seo';
import { readEnquireIntent } from '../auth/enquireIntent';

export function PropertyDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [enquireOpen, setEnquireOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setListing(null);
    void getDiscoverSpaceDetail(id)
      .then((detail) => {
        if (cancelled) return;
        const mapped = toPropertyListing(detail);
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
    const intent = readEnquireIntent();
    if (intent?.listingId === listing?.id) {
      setEnquireOpen(true);
    }
  }, [listing?.id]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status !== 'ready' || !listing) {
      applySeo({
        title: t('propertyDetail.seoNotFound.title'),
        description: t('propertyDetail.seoNotFound.description'),
        path: `/places/${id}`,
      });
      return;
    }
    applySeo({
      title: `${listing.name} — ACOMI`,
      description: `${listing.name}${listing.city ? ` in ${listing.city}` : ''}.`,
      path: `/places/${listing.id}`,
    });
  }, [id, listing, status, t]);

  if (status === 'loading') {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <p className="text-[15px] text-text-secondary">{t('places.loading')}</p>
        </Container>
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <h1 className="text-[2rem] font-semibold tracking-tight text-navy">
            {t('propertyDetail.notFoundTitle')}
          </h1>
          <p className="mt-3 text-[15px] text-text-secondary">{t('propertyDetail.notFoundBody')}</p>
          <div className="mt-8">
            <ButtonLink href="/places" variant="ghost" external={false}>
              {t('propertyDetail.back')}
            </ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  const meta = listing.listingMetadata;
  const address = formatListingAddress(listing);

  return (
    <section className="bg-background py-10 sm:py-12">
      <Container>
        <p className="text-[13px] text-text-secondary">
          <Link to="/places" className="font-medium text-primary hover:underline">
            {t('propertyDetail.breadcrumb')}
          </Link>
          <span aria-hidden> / </span>
          {listing.name}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <ListingGallery images={meta.images} name={listing.name} />

          <div className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                {t(`discovery.propertyTypes.${listing.type}`)}
              </span>
            </div>
            <h1 className="mt-3 text-[1.75rem] font-semibold tracking-tight text-navy">{listing.name}</h1>
            {address ? (
              <p className="mt-2 flex items-center gap-1.5 text-[14px] text-text-secondary">
                <MapPin aria-hidden className="h-4 w-4 text-muted" />
                {address}
              </p>
            ) : null}
            <p className="mt-5 text-[1.5rem] font-semibold text-navy">
              <ListingPrice
                amount={listing.startingPrice}
                suffix={t(`discovery.priceSuffix.${listing.type}`)}
                fallback={t('discovery.priceOnRequest')}
                size="detail"
              />
            </p>
            {listing.sharingNotes ? (
              <p className="mt-2 text-[14px] text-text-secondary">{listing.sharingNotes}</p>
            ) : null}
            <div className="mt-6">
              <ActionButton onClick={() => setEnquireOpen(true)} className="w-full">
                <MessageCircle aria-hidden className="h-4 w-4" />
                {t('discovery.contactEnquire')}
              </ActionButton>
            </div>
          </div>
        </div>

        {listing.amenityCodes.length > 0 ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">{t('discovery.amenities')}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {listing.amenityCodes.map((code) => (
                <li
                  key={code}
                  className="rounded-full border border-border bg-soft px-3 py-1.5 text-[12px] font-medium text-text-secondary"
                >
                  {t(`discovery.amenity.${code}`)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {listing.description ? (
          <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">{t('discovery.aboutPlace')}</h2>
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
        listingKind="places"
        onClose={() => setEnquireOpen(false)}
      />
    </section>
  );
}
