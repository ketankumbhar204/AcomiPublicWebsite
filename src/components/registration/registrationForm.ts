import type {
  CreateMessRegistrationRequest,
  CreatePropertyRegistrationRequest,
  PriceBasis,
  PropertyType,
} from '../../api/types';
import { normalizeAmenityAssignments, type AmenityAssignment } from '../../lib/amenities';
import { defaultPriceBasis, isPriceBasis } from '../../lib/priceBasis';
import { REGISTRATION_DRAFT_KEY, getPropertyTypeOption } from '../../constants/propertyRegistration';
import { googleMapsLink } from '../../data/listings/locationAutocomplete';
import { isValidMobile, isValidPincode } from '../../lib/indianMobile';
import { readStored, removeStored, writeStored } from '../../lib/storage';

export const DESCRIPTION_MAX = 200;

export type RegistrationForm = {
  propertyType: PropertyType | null;
  propertyName: string;
  buildingName: string;
  /** True after the visitor edits the building name, so a later property-name change does not overwrite it. */
  buildingNameEdited: boolean;
  ownerName: string;
  description: string;
  addressLine: string;
  locationQuery: string;
  locationSelected: boolean;
  locality: string;
  district: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl: string;
  latitude: string;
  longitude: string;
  startingPrice: string;
  priceBasis: PriceBasis | null;
  mealPrice: string;
  capacityEstimate: string;
  /** Selected preset and custom amenities. Rental and mess leave this empty. */
  amenities: AmenityAssignment[];
  mobileNumber: string;
};

export type FieldErrors = Partial<Record<keyof RegistrationForm, string>>;

export const EMPTY_FORM: RegistrationForm = {
  propertyType: null,
  propertyName: '',
  buildingName: '',
  buildingNameEdited: false,
  ownerName: '',
  description: '',
  addressLine: '',
  locationQuery: '',
  locationSelected: false,
  locality: '',
  district: '',
  city: '',
  state: '',
  pincode: '',
  mapUrl: '',
  latitude: '',
  longitude: '',
  startingPrice: '',
  priceBasis: null,
  mealPrice: '',
  capacityEstimate: '',
  amenities: [],
  mobileNumber: '',
};

export function validatePropertyStep(form: RegistrationForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.propertyType) {
    errors.propertyType = 'Select a property type.';
  }
  if (!form.propertyName.trim()) {
    errors.propertyName = form.propertyType === 'MESS' ? 'Mess name is required.' : 'Property name is required.';
  }
  if (!form.ownerName.trim()) {
    errors.ownerName = 'Owner name is required.';
  }
  return errors;
}

export function validateDetailsStep(form: RegistrationForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.buildingName.trim()) {
    errors.buildingName = 'Property / Apartment / Building name is required.';
  }
  const locationText = (form.locationSelected ? form.addressLine : form.locationQuery).trim();
  if (!locationText) {
    errors.locationQuery = 'Enter a location.';
  }
  if (form.pincode.trim() && !isValidPincode(form.pincode)) {
    errors.pincode = 'Enter a valid 6-digit pincode.';
  }

  const price = Number(form.startingPrice);
  if (form.propertyType === 'CORPORATE_STAY' && !isPriceBasis(form.priceBasis)) {
    errors.startingPrice = 'Choose per bed, per room, or per unit for Corporate Stay.';
  } else if (!form.startingPrice.trim() || !Number.isFinite(price) || price <= 0) {
    errors.startingPrice = 'Enter a valid monthly price.';
  }

  if (form.propertyType === 'MESS') {
    const mealPrice = Number(form.mealPrice);
    if (!form.mealPrice.trim() || !Number.isFinite(mealPrice) || mealPrice <= 0) {
      errors.mealPrice = 'Enter a valid per meal / tiffin price.';
    }
  }

  if (form.capacityEstimate.trim()) {
    const capacity = Number(form.capacityEstimate);
    if (!Number.isInteger(capacity) || capacity < 0) {
      errors.capacityEstimate = 'Enter a whole number.';
    }
  }

  const mapUrl = form.mapUrl.trim();
  if (mapUrl && !/^https?:\/\//i.test(mapUrl)) {
    errors.mapUrl = 'Enter a link starting with http:// or https://';
  }

  const latRaw = form.latitude.trim();
  const lngRaw = form.longitude.trim();
  if (latRaw || lngRaw) {
    const latitude = Number(latRaw);
    const longitude = Number(lngRaw);
    if (!latRaw || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.latitude = 'Enter a valid latitude between -90 and 90.';
    }
    if (!lngRaw || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      errors.longitude = 'Enter a valid longitude between -180 and 180.';
    }
  }

  return errors;
}

export function registrationAddress(form: RegistrationForm): string {
  if (form.locationSelected) return form.addressLine.trim().slice(0, 255);
  let line = form.locationQuery.trim();
  for (const extra of [form.locality.trim(), form.district.trim()]) {
    if (!extra || line.toLowerCase().includes(extra.toLowerCase())) continue;
    line = line ? `${line}, ${extra}` : extra;
  }
  return line.slice(0, 255);
}

export function locationSummary(form: RegistrationForm): string {
  if (form.locationSelected) return form.addressLine.trim() || form.locationQuery.trim();
  const parts = [form.locationQuery, form.locality, form.city, form.district, form.state, form.pincode]
    .map((part) => part.trim())
    .filter(Boolean);
  const unique: string[] = [];
  for (const part of parts) {
    if (unique.some((item) => item.toLowerCase().includes(part.toLowerCase()))) continue;
    unique.push(part);
  }
  return unique.join(', ');
}

export function formCoordinate(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function validateMobile(form: RegistrationForm): FieldErrors {
  return isValidMobile(form.mobileNumber)
    ? {}
    : { mobileNumber: 'Enter a valid 10-digit mobile number.' };
}

export function buildRequest(
  form: RegistrationForm,
  verificationToken: string,
  photos: string[] = [],
): CreatePropertyRegistrationRequest {
  if (!form.propertyType) {
    throw new Error('Property type is required before submitting');
  }
  const option = getPropertyTypeOption(form.propertyType);
  const mapUrl = form.mapUrl.trim();
  const latitude = formCoordinate(form.latitude);
  const longitude = formCoordinate(form.longitude);
  const capacity = form.capacityEstimate.trim();
  const description = form.description.trim();
  const city = form.city.trim();
  const state = form.state.trim();
  const pincode = form.pincode.trim();
  const addressLine = registrationAddress(form);

  return {
    propertyType: form.propertyType,
    propertyName: form.propertyName.trim(),
    ...(form.buildingName.trim() ? { buildingName: form.buildingName.trim() } : {}),
    ownerName: form.ownerName.trim(),
    ...(description ? { description } : {}),
    mobileNumber: form.mobileNumber,
    verificationToken,
    addressLine,
    ...(city ? { city } : {}),
    ...(state ? { state } : {}),
    ...(pincode ? { pincode } : {}),
    ...(mapUrl ? { mapUrl } : {}),
    ...(latitude !== undefined ? { latitude } : {}),
    ...(longitude !== undefined ? { longitude } : {}),
    startingPrice: Number(form.startingPrice),
    priceBasis: form.priceBasis ?? defaultPriceBasis(form.propertyType) ?? undefined,
    ...(capacity ? { capacityEstimate: Number(capacity) } : {}),
    // The backend ignores amenities for types that do not support them; not sending
    // them keeps the payload honest about what the visitor actually chose.
    amenities: option.supportsAmenities ? normalizeAmenityAssignments(form.amenities) : [],
    photos,
  };
}

export function buildMessRequest(
  form: RegistrationForm,
  verificationToken: string,
  photos: string[] = [],
): CreateMessRegistrationRequest {
  const mapUrl = form.mapUrl.trim();
  const latitude = formCoordinate(form.latitude);
  const longitude = formCoordinate(form.longitude);
  const capacity = form.capacityEstimate.trim();
  const description = form.description.trim();
  const state = form.state.trim();
  const city = form.city.trim();
  const pincode = form.pincode.trim();
  const addressLine = registrationAddress(form);

  return {
    messName: form.propertyName.trim(),
    ...(form.buildingName.trim() ? { buildingName: form.buildingName.trim() } : {}),
    ownerName: form.ownerName.trim(),
    ...(description ? { description } : {}),
    mobileNumber: form.mobileNumber,
    verificationToken,
    addressLine,
    ...(city ? { city } : {}),
    ...(state ? { state } : {}),
    ...(pincode ? { pincode } : {}),
    ...(mapUrl ? { mapUrl } : {}),
    ...(latitude !== undefined ? { latitude } : {}),
    ...(longitude !== undefined ? { longitude } : {}),
    monthlyPrice: Number(form.startingPrice),
    monthlyPriceBasis: form.priceBasis ?? 'PER_UNIT',
    mealPrice: Number(form.mealPrice),
    ...(capacity ? { capacityEstimate: Number(capacity) } : {}),
    photos,
  };
}

type Draft = {
  form: RegistrationForm;
  step: number;
};

/**
 * Persists typed form fields only. The OTP and the verification token are never written,
 * so a restored draft always has to re-verify the mobile number.
 */
export function writeDraft(
  form: RegistrationForm,
  step: number,
  key: string = REGISTRATION_DRAFT_KEY,
): void {
  writeStored(key, JSON.stringify({ form, step } satisfies Draft));
}

export function clearDraft(key: string = REGISTRATION_DRAFT_KEY): void {
  removeStored(key);
}

export function readDraft(key: string = REGISTRATION_DRAFT_KEY): Draft {
  const raw = readStored(key);
  if (!raw) {
    return { form: EMPTY_FORM, step: 1 };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<Draft>;
    const form = { ...EMPTY_FORM, ...parsed.form };
    // Drop anything that is not a string field we recognise, and keep amenities an array.
    form.amenities = normalizeAmenityAssignments(form.amenities);
    form.latitude = typeof form.latitude === 'string' ? form.latitude : '';
    form.longitude = typeof form.longitude === 'string' ? form.longitude : '';
    form.locationQuery = typeof form.locationQuery === 'string' ? form.locationQuery : '';
    form.buildingName = typeof form.buildingName === 'string' ? form.buildingName : '';
    form.buildingNameEdited = form.buildingNameEdited === true;
    form.priceBasis = isPriceBasis(form.priceBasis)
      ? form.priceBasis
      : form.propertyType
        ? defaultPriceBasis(form.propertyType)
        : null;
    if (!form.buildingName.trim() && form.propertyName.trim()) {
      form.buildingName = form.propertyName;
    }
    form.locality = typeof form.locality === 'string' ? form.locality : '';
    form.district = typeof form.district === 'string' ? form.district : '';
    form.locationSelected =
      form.locationSelected === true ||
      Boolean(
        form.addressLine.trim() &&
          form.city.trim() &&
          form.state.trim() &&
          form.latitude.trim() &&
          form.longitude.trim(),
      );
    if (!form.locationQuery.trim() && form.addressLine.trim()) {
      form.locationQuery = form.addressLine;
    }
    if (form.locationSelected && !form.mapUrl.trim()) {
      const latitude = Number(form.latitude);
      const longitude = Number(form.longitude);
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        form.mapUrl = googleMapsLink(latitude, longitude);
      }
    }
    const step = parsed.step === 2 || parsed.step === 3 ? parsed.step : 1;
    return { form, step };
  } catch {
    return { form: EMPTY_FORM, step: 1 };
  }
}
