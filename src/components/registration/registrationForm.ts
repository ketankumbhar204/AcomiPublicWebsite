import type {
  CreateMessRegistrationRequest,
  CreatePropertyRegistrationRequest,
  PropertyType,
} from '../../api/types';
import {
  ALL_AMENITIES,
  REGISTRATION_DRAFT_KEY,
  getPropertyTypeOption,
} from '../../constants/propertyRegistration';
import { isValidMobile, isValidPincode } from '../../lib/indianMobile';
import { readStored, removeStored, writeStored } from '../../lib/storage';

export const DESCRIPTION_MAX = 200;

export type RegistrationForm = {
  propertyType: PropertyType | null;
  propertyName: string;
  ownerName: string;
  description: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl: string;
  startingPrice: string;
  mealPrice: string;
  capacityEstimate: string;
  /** Backend amenity codes. */
  amenities: string[];
  mobileNumber: string;
};

export type FieldErrors = Partial<Record<keyof RegistrationForm, string>>;

export const EMPTY_FORM: RegistrationForm = {
  propertyType: null,
  propertyName: '',
  ownerName: '',
  description: '',
  addressLine: '',
  city: '',
  state: '',
  pincode: '',
  mapUrl: '',
  startingPrice: '',
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
    errors.propertyName =
      form.propertyType === 'MESS' ? 'Mess name is required.' : 'Property name is required.';
  }
  if (!form.ownerName.trim()) {
    errors.ownerName = 'Owner name is required.';
  }
  return errors;
}

export function validateDetailsStep(form: RegistrationForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.addressLine.trim()) {
    errors.addressLine = 'Address is required.';
  }
  if (!form.city.trim()) {
    errors.city = 'City is required.';
  }
  if (!form.state.trim()) {
    errors.state = 'State is required.';
  }
  if (!isValidPincode(form.pincode)) {
    errors.pincode = 'Enter a valid 6-digit pincode.';
  }

  const price = Number(form.startingPrice);
  if (!form.startingPrice.trim() || !Number.isFinite(price) || price <= 0) {
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

  return errors;
}

export function validateMobile(form: RegistrationForm): FieldErrors {
  return isValidMobile(form.mobileNumber)
    ? {}
    : { mobileNumber: 'Enter a valid 10-digit mobile number.' };
}

function amenityLabel(code: string): string {
  return ALL_AMENITIES.find((amenity) => amenity.code === code)?.label ?? code;
}

export function buildRequest(
  form: RegistrationForm,
  verificationToken: string,
): CreatePropertyRegistrationRequest {
  if (!form.propertyType) {
    throw new Error('Property type is required before submitting');
  }
  const option = getPropertyTypeOption(form.propertyType);
  const mapUrl = form.mapUrl.trim();
  const capacity = form.capacityEstimate.trim();
  const description = form.description.trim();

  return {
    propertyType: form.propertyType,
    propertyName: form.propertyName.trim(),
    ownerName: form.ownerName.trim(),
    ...(description ? { description } : {}),
    mobileNumber: form.mobileNumber,
    verificationToken,
    addressLine: form.addressLine.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.trim(),
    ...(mapUrl ? { mapUrl } : {}),
    startingPrice: Number(form.startingPrice),
    ...(capacity ? { capacityEstimate: Number(capacity) } : {}),
    // The backend ignores amenities for types that do not support them; not sending
    // them keeps the payload honest about what the visitor actually chose.
    amenities: option.supportsAmenities
      ? form.amenities.map((code) => ({ code, label: amenityLabel(code) }))
      : [],
  };
}

export function buildMessRequest(
  form: RegistrationForm,
  verificationToken: string,
): CreateMessRegistrationRequest {
  const mapUrl = form.mapUrl.trim();
  const capacity = form.capacityEstimate.trim();
  const description = form.description.trim();

  return {
    messName: form.propertyName.trim(),
    ownerName: form.ownerName.trim(),
    ...(description ? { description } : {}),
    mobileNumber: form.mobileNumber,
    verificationToken,
    addressLine: form.addressLine.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.trim(),
    ...(mapUrl ? { mapUrl } : {}),
    monthlyPrice: Number(form.startingPrice),
    mealPrice: Number(form.mealPrice),
    ...(capacity ? { capacityEstimate: Number(capacity) } : {}),
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
    form.amenities = Array.isArray(form.amenities)
      ? form.amenities.filter((code) => ALL_AMENITIES.some((amenity) => amenity.code === code))
      : [];
    const step = parsed.step === 2 || parsed.step === 3 ? parsed.step : 1;
    return { form, step };
  } catch {
    return { form: EMPTY_FORM, step: 1 };
  }
}
