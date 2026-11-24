export type ListingKind = 'property' | 'mess';

/** Stable stepper ids — never compare against translated labels. */
export type RegistrationStepId = 'property' | 'mess' | 'details' | 'verify' | 'photos' | 'review';

export type ListingCopy = {
  titleId: string;
  stepper: readonly RegistrationStepId[];
  draftKey: string;
};

export const LISTING_COPY: Record<ListingKind, ListingCopy> = {
  property: {
    titleId: 'property-registration-title',
    stepper: ['property', 'details', 'verify', 'photos', 'review'],
    draftKey: 'acomi.propertyRegistrationDraft',
  },
  mess: {
    titleId: 'mess-registration-title',
    stepper: ['mess', 'details', 'verify', 'photos', 'review'],
    draftKey: 'acomi.messRegistrationDraft',
  },
};
