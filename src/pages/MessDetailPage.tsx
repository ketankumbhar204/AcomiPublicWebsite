import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, MessageCircle, Star } from 'lucide-react';
import { ActionButton } from '../components/common/ActionButton';
import { ButtonLink } from '../components/common/ButtonLink';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { ListingGallery } from '../components/discovery/ListingGallery';
import { ListingMapLink } from '../components/discovery/ListingMapLink';
import { Container } from '../components/layout/Container';
import { formatInr, getMessListing } from '../data/listings';
import { applySeo } from '../lib/seo';

export function MessDetailPage() {
  const { id = '' } = useParams();
  const listing = getMessListing(id);
  const [enquireOpen, setEnquireOpen] = useState(false);

  useEffect(() => {
    if (!listing) {
      applySeo({
        title: 'Mess not found — ACOMI',
        description: 'That meal listing is not available.',
        path: `/meals/${id}`,
      });
      return;
    }
    applySeo({
      title: `${listing.name} — ACOMI`,
      description: `${listing.name} in ${listing.locality}, ${listing.city}.`,
      path: `/meals/${listing.id}`,
    });
  }, [id, listing]);

  if (!listing) {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <h1 className="text-[2rem] font-semibold tracking-tight text-navy">Mess not found</h1>
          <p className="mt-3 text-[15px] text-text-secondary">This listing is not in the current preview set.</p>
          <div className="mt-8">
            <ButtonLink href="/meals" variant="ghost" external={false}>
              Back to meals
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
            Meals
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
              <span className="ml-1 text-[13px] font-medium text-muted">/ month</span>
            </p>
            <p className="mt-1 text-[16px] font-medium text-navy">
              {formatInr(listing.mealPrice)}
              <span className="ml-1 text-[13px] font-medium text-muted">/ meal</span>
            </p>
            {meta.mealsServed.length > 0 ? (
              <p className="mt-3 text-[14px] text-text-secondary">{meta.mealsServed.join(' • ')}</p>
            ) : null}
            <p className="mt-2 text-[14px] text-text-secondary">About {listing.capacityEstimate} customers</p>
            <div className="mt-6">
              <ActionButton onClick={() => setEnquireOpen(true)} className="w-full">
                <MessageCircle aria-hidden className="h-4 w-4" />
                Contact / Enquire
              </ActionButton>
            </div>
            <p className="mt-3 text-[12px] text-muted">Listing scores are sample preview data, not live reviews.</p>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold text-navy">About this mess</h2>
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
