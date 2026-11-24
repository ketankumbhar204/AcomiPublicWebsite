import { useTranslation } from 'react-i18next';
import type { ListingKind } from '../../constants/listing';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import { formatRupees } from '../../lib/indianMobile';
import { isPriceBasis, priceBasisLabel } from '../../lib/priceBasis';
import { locationSummary, type RegistrationForm } from './registrationForm';
import type { SelectedListingPhoto } from './StepPhotos';

type StepReviewProps = {
  form: RegistrationForm;
  kind: ListingKind;
  photos: SelectedListingPhoto[];
  keepCurrentPhotos?: boolean;
  onEditStep: (step: number) => void;
};

function ReviewRow({
  label,
  value,
  onEdit,
  editLabel,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  editLabel: string;
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
            {editLabel}
          </button>
        ) : null}
      </dd>
    </div>
  );
}

export function StepReview({ form, kind, photos, keepCurrentPhotos = false, onEditStep }: StepReviewProps) {
  const { t } = useTranslation();
  const option = form.propertyType ? getPropertyTypeOption(form.propertyType) : null;
  const price = Number(form.startingPrice);
  const mealPrice = Number(form.mealPrice);
  const dash = t('registration.emDash');
  const editLabel = t('registration.edit');
  const typeTitle = option
    ? t(`registration.propertyTypes.${option.id}.title`, { defaultValue: option.title })
    : dash;
  const basisText = (() => {
    if (isPriceBasis(form.priceBasis)) {
      return t(`registration.priceBasis.${form.priceBasis}`, {
        defaultValue: priceBasisLabel(form.priceBasis, form.propertyType),
      });
    }
    if (form.propertyType === 'CORPORATE_STAY') {
      return t('registration.priceBasis.chooseCorporate');
    }
    return t(`registration.priceBasis.${form.priceBasis ?? 'PER_UNIT'}`, {
      defaultValue: priceBasisLabel(form.priceBasis, form.propertyType),
    });
  })();

  return (
    <div className="space-y-4">
      <h3 className="text-[15px] font-semibold text-text">{t('registration.review.title')}</h3>
      <dl className="divide-y divide-border rounded-xl border border-border px-3 py-1">
        <ReviewRow
          label={t(`registration.${kind}.reviewNameLabel`)}
          value={form.propertyName}
          onEdit={() => onEditStep(1)}
          editLabel={editLabel}
        />
        <ReviewRow
          label={t('registration.review.building')}
          value={form.buildingName}
          onEdit={() => onEditStep(2)}
          editLabel={editLabel}
        />
        {kind === 'property' ? (
          <ReviewRow
            label={t('registration.review.type')}
            value={typeTitle}
            onEdit={() => onEditStep(1)}
            editLabel={editLabel}
          />
        ) : null}
        <ReviewRow
          label={t('registration.review.location')}
          value={locationSummary(form) || dash}
          onEdit={() => onEditStep(2)}
          editLabel={editLabel}
        />
        <ReviewRow
          label={
            kind === 'mess'
              ? t('registration.fields.monthlyPrice')
              : t('registration.fields.startingPrice')
          }
          value={Number.isFinite(price) ? `₹${formatRupees(price)} ${basisText}` : dash}
          onEdit={() => onEditStep(2)}
          editLabel={editLabel}
        />
        {kind === 'mess' ? (
          <ReviewRow
            label={t('registration.fields.perMealTiffin')}
            value={
              Number.isFinite(mealPrice)
                ? t('registration.review.mealPriceValue', { amount: formatRupees(mealPrice) })
                : dash
            }
            onEdit={() => onEditStep(2)}
            editLabel={editLabel}
          />
        ) : null}
        {form.capacityEstimate ? (
          <ReviewRow
            label={t('registration.review.capacity')}
            value={form.capacityEstimate}
            editLabel={editLabel}
          />
        ) : null}
        <ReviewRow
          label={t('registration.review.photos')}
          value={
            photos.length === 0
              ? keepCurrentPhotos
                ? t('registration.photos.currentKept')
                : t('registration.photos.none')
              : t('registration.photos.ofThree', { count: photos.length })
          }
          onEdit={() => onEditStep(4)}
          editLabel={editLabel}
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
