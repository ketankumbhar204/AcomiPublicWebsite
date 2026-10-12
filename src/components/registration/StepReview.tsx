import type { ListingKind } from '../../constants/listing';
import { LISTING_COPY } from '../../constants/listing';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import { formatRupees } from '../../lib/indianMobile';
import { priceBasisLabel } from '../../lib/priceBasis';
import { locationSummary, type RegistrationForm } from './registrationForm';
import type { SelectedListingPhoto } from './StepPhotos';

type StepReviewProps = {
  form: RegistrationForm;
  kind: ListingKind;
  photos: SelectedListingPhoto[];
  onEditStep: (step: number) => void;
};

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="flex items-baseline gap-2 text-right text-[13px] font-medium text-text">
        <span>{value}</span>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="reg-focus rounded text-[11px] font-semibold text-register hover:underline"
          >
            Edit
          </button>
        ) : null}
      </dd>
    </div>
  );
}

export function StepReview({ form, kind, photos, onEditStep }: StepReviewProps) {
  const option = form.propertyType ? getPropertyTypeOption(form.propertyType) : null;
  const price = Number(form.startingPrice);
  const mealPrice = Number(form.mealPrice);
  const copy = LISTING_COPY[kind];

  return (
    <div className="space-y-4">
      <h3 className="text-[15px] font-semibold text-text">Review and submit</h3>
      <dl className="divide-y divide-border rounded-xl border border-border px-3 py-1">
        <ReviewRow label={copy.reviewNameLabel} value={form.propertyName} onEdit={() => onEditStep(1)} />
        <ReviewRow label="Building" value={form.buildingName} onEdit={() => onEditStep(2)} />
        {kind === 'property' ? (
          <ReviewRow label="Type" value={option?.title ?? '—'} onEdit={() => onEditStep(1)} />
        ) : null}
        <ReviewRow label="Location" value={locationSummary(form) || '—'} onEdit={() => onEditStep(2)} />
        <ReviewRow
          label={kind === 'mess' ? 'Monthly price' : 'Starting price'}
          value={
            Number.isFinite(price)
              ? `₹${formatRupees(price)} ${priceBasisLabel(form.priceBasis, form.propertyType)}`
              : '—'
          }
          onEdit={() => onEditStep(2)}
        />
        {kind === 'mess' ? (
          <ReviewRow
            label="Per meal / tiffin"
            value={Number.isFinite(mealPrice) ? `₹${formatRupees(mealPrice)} per meal / tiffin` : '—'}
            onEdit={() => onEditStep(2)}
          />
        ) : null}
        {form.capacityEstimate ? <ReviewRow label="Capacity" value={form.capacityEstimate} /> : null}
        <ReviewRow
          label="Photos"
          value={photos.length === 0 ? 'None' : `${photos.length} of 3`}
          onEdit={() => onEditStep(4)}
        />
      </dl>
      {photos.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <li key={photo.id} className="overflow-hidden rounded-xl border border-border">
              <img src={photo.previewUrl} alt="" className="aspect-square w-full object-cover" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
