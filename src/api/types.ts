/** Mirrors the backend OtpPurpose values the public website is allowed to use. */
export type OtpPurpose = 'PROPERTY_REGISTRATION' | 'MESS_REGISTRATION';

export type SendOtpResponse = {
  mobileNumber: string;
  purpose: OtpPurpose;
  /** Seconds until the OTP itself expires. */
  expiresIn: number;
  /** Seconds the visitor must wait before a resend is accepted. */
  resendAfter: number;
  message?: string;
  /** True only when the local API skipped SMS and issued a token. */
  otpSkipped?: boolean;
  /** Present only when otpSkipped is true. */
  verificationToken?: string;
};

export type VerifyOtpResponse = {
  verified: boolean;
  /** Short-lived, purpose-bound proof that the mobile number was verified. */
  verificationToken: string;
  expiresIn: number;
};

export type PropertyType = 'PG' | 'HOSTEL' | 'CO_LIVING' | 'RENTAL' | 'CORPORATE_STAY' | 'MESS';

export type PriceBasis = 'PER_BED' | 'PER_ROOM' | 'PER_UNIT';

export type AmenityAssignment = {
  code: string;
  label: string;
};

export type CreatePropertyRegistrationRequest = {
  propertyType: PropertyType;
  propertyName: string;
  buildingName?: string;
  ownerName: string;
  description?: string;
  mobileNumber: string;
  verificationToken: string;
  addressLine: string;
  city?: string;
  state?: string;
  pincode?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  startingPrice: number;
  priceBasis?: PriceBasis;
  capacityEstimate?: number;
  amenities: AmenityAssignment[];
  /** Data-URL images. Optional. At most 3, each at most 3 MB. */
  photos?: string[];
};

export type PropertyRegistrationResponse = {
  reference: string;
  priceBasis: PriceBasis;
  submittedAt: string;
};

export type CreateMessRegistrationRequest = {
  messName: string;
  buildingName?: string;
  ownerName: string;
  description?: string;
  mobileNumber: string;
  verificationToken: string;
  addressLine: string;
  city?: string;
  state?: string;
  pincode?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  monthlyPrice: number;
  monthlyPriceBasis?: PriceBasis;
  mealPrice: number;
  capacityEstimate?: number;
  /** Data-URL images. Optional. At most 3, each at most 3 MB. */
  photos?: string[];
};

export type MessRegistrationResponse = {
  reference: string;
  submittedAt: string;
};
