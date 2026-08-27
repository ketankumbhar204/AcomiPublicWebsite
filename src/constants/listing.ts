export type ListingKind = 'property' | 'mess';

export type ListingCopy = {
  title: string;
  titleId: string;
  stepper: readonly [string, string, string];
  typeLegend: string;
  nameLabel: string;
  namePlaceholder: string;
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
    stepper: ['Property', 'Details', 'Verify & Submit'],
    typeLegend: 'What type of property do you manage?',
    nameLabel: 'Property name',
    namePlaceholder: 'e.g. Sunrise PG',
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
    stepper: ['Mess', 'Details', 'Verify & Submit'],
    typeLegend: 'What type of food service do you run?',
    nameLabel: 'Mess name',
    namePlaceholder: 'e.g. Sunrise Mess',
    descriptionPlaceholder: 'Describe your mess in a few words',
    reviewNameLabel: 'Mess',
    successTitle: 'Mess registration received',
    successBody:
      'Thanks! We’ve received your mess details. Our team may contact you for verification.',
    draftKey: 'acomi.messRegistrationDraft',
  },
};
