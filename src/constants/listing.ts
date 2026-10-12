export type ListingKind = 'property' | 'mess';

export type ListingCopy = {
  title: string;
  titleId: string;
  stepper: readonly string[];
  typeLegend: string;
  nameLabel: string;
  namePlaceholder: string;
  buildingLabel: string;
  buildingPlaceholder: string;
  descriptionPlaceholder: string;
  reviewNameLabel: string;
  successTitle: string;
  successBody: string;
  draftKey: string;
};

export const LISTING_COPY: Record<ListingKind, ListingCopy> = {
  property: {
    title: 'Register your property for free',
    titleId: 'property-registration-title',
    stepper: ['Property', 'Details', 'Verify', 'Photos', 'Review'],
    typeLegend: 'What type of property do you manage?',
    nameLabel: 'Property name',
    namePlaceholder: 'e.g. Sunrise PG',
    buildingLabel: 'Property / Apartment / Building name',
    buildingPlaceholder: 'e.g. Sunrise Residency, ABC Apartments',
    descriptionPlaceholder: 'Describe your property in a few words',
    reviewNameLabel: 'Property',
    successTitle: 'Property registration received',
    successBody:
      'Thanks! We’ve received your property details. Our team may contact you for verification.',
    draftKey: 'acomi.propertyRegistrationDraft',
  },
  mess: {
    title: 'Register your mess for free',
    titleId: 'mess-registration-title',
    stepper: ['Mess', 'Details', 'Verify', 'Photos', 'Review'],
    typeLegend: 'What type of food service do you run?',
    nameLabel: 'Mess name',
    namePlaceholder: 'e.g. Sunrise Mess',
    buildingLabel: 'Property / Apartment / Building name',
    buildingPlaceholder: 'e.g. Sunrise Residency, ABC Apartments',
    descriptionPlaceholder: 'Describe your mess in a few words',
    reviewNameLabel: 'Mess',
    successTitle: 'Mess registration received',
    successBody:
      'Thanks! We’ve received your mess details. Our team may contact you for verification.',
    draftKey: 'acomi.messRegistrationDraft',
  },
};
