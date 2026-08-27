import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, MessageCircle, Star } from 'lucide-react';
import { ActionButton } from '../components/common/ActionButton';
import { ButtonLink } from '../components/common/ButtonLink';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { ListingGallery } from '../components/discovery/ListingGallery';
import { ListingMapLink } from '../components/discovery/ListingMapLink';
import { Container } from '../components/layout/Container';
import { getPropertyTypeOption } from '../constants/propertyRegistration';
import { amenityLabel, formatInr, getPropertyListing } from '../data/listings';
import { applySeo } from '../lib/seo';

export function PropertyDetailPage() {
  const { id = '' } = useParams();
  const listing = getPropertyListing(id);
  const [enquireOpen, setEnquireOpen] = useState(false);

  useEffect(() => {
    if (!listing) {
      applySeo({
        title: 'Place not found — ACOMI',
        description: 'That property listing is not available.',
        path: `/places/${id}`,
      });
      return;
    }
    applySeo({
      title: `${listing.name} — ACOMI`,
      description: `${listing.name} in ${listing.locality}, ${listing.city}.`,
      path: `/places/${listing.id}`,
    });
  }, [id, listing]);

  if (!listing) {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <h1 className="text-[2rem] font-semibold tracking-tight text-navy">Place not found</h1>
          <p className="mt-3 text-[15px] text-text-secondary">This listing is not in the current preview set.</p>
          <div className="mt-8">
            <ButtonLink href="/places" variant="ghost" external={false}>
              Back to places
            </ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  const type = getPropertyTypeOption(listing.type);
  const meta = listing.listingMetadata;

  return (
    <section className="bg-background py-10 sm:py-12">
      <Container>
        <p className="text-[13px] text-text-secondary">
          <Link to="/places" className="font-medium text-primary hover:underline">
            Places
          </Link>
          <span aria-hidden> / </span>
          {listing.name}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <ListingGallery images={meta.images} name={listing.name} />

          <div className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                {type.title}
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy">
                <Star aria-hidden className="h-3.5 w-3.5 fill-register text-register" />
                {meta.rating.toFixed(1)}
              </span>
            </div>
            <h1 className="mt-3 text-[1.75rem] font-semibold tracking-tight text-navy">{listing.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-[14px] text-text-secondary">
              <MapPin aria-hidden className="h-4 w-4 text-muted" />
              {listing.addressLine}, {listing.locality}, {listing.city}, {listing.state} {listing.pincode}
            </p>
            <p className="mt-5 text-[1.5rem] font-semibold text-navy">
              {formatInr(listing.startingPrice)}
              <span className="ml-1 text-[13px] font-medium text-muted">{type.priceSuffix}</span>
            </p>
            <p className="mt-2 text-[14px] text-text-secondary">
              {listing.type === 'RENTAL'
                ? `${meta.availableCount > 0 ? 'Available now' : 'Currently occupied'} · ${listing.capacityEstimate} ${type.capacityLabel.toLowerCase()}`
                : `${meta.availableCount} available · about ${listing.capacityEstimate} ${type.capacityLabel.toLowerCase()}`}
            </p>
            <div className="mt-6">
              <ActionButton onClick={() => setEnquireOpen(true)} className="w-full">
                <MessageCircle aria-hidden className="h-4 w-4" />
                Contact / Enquire
              </ActionButton>
            </div>
            <p className="mt-3 text-[12px] text-muted">Listing scores are sample preview data, not live reviews.</p>
          </div>
        </div>

        {listing.amenityCodes.length > 0 ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">Amenities</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {listing.amenityCodes.map((code) => (
                <li
                  key={code}
                  className="rounded-full border border-border bg-soft px-3 py-1.5 text-[12px] font-medium text-text-secondary"
                >
                  {amenityLabel(code)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold text-navy">About this place</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-secondary">{listing.description}</p>
        </div>

        <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold text-navy">Location</h2>
          <div className="mt-3">
            <ListingMapLink listing={listing} />
          </div>
        </div>
      </Container>
      <EnquireDialog open={enquireOpen} title={`Enquire about ${listing.name}`} onClose={() => setEnquireOpen(false)} />
    </section>
  );
}
