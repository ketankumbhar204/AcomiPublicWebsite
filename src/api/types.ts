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
};

export type VerifyOtpResponse = {
  verified: boolean;
  /** Short-lived, purpose-bound proof that the mobile number was verified. */
  verificationToken: string;
  expiresIn: number;
};

export type PropertyType = 'PG' | 'HOSTEL' | 'CO_LIVING' | 'RENTAL' | 'MESS';

export type PriceBasis = 'PER_BED' | 'PER_ROOM' | 'PER_UNIT';

export type AmenityAssignment = {
  code: string;
  label: string;
};

export type CreatePropertyRegistrationRequest = {
  propertyType: PropertyType;
  propertyName: string;
  ownerName: string;
  description?: string;
  mobileNumber: string;
  verificationToken: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl?: string;
  startingPrice: number;
  capacityEstimate?: number;
  amenities: AmenityAssignment[];
};

export type PropertyRegistrationResponse = {
  reference: string;
  priceBasis: PriceBasis;
  submittedAt: string;
};

export type CreateMessRegistrationRequest = {
  messName: string;
  ownerName: string;
  description?: string;
  mobileNumber: string;
  verificationToken: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl?: string;
  monthlyPrice: number;
  mealPrice: number;
  capacityEstimate?: number;
};

export type MessRegistrationResponse = {
  reference: string;
  submittedAt: string;
};
