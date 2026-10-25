import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { sendOtp, verifyOtp } from '../../api/authApi';
import { createMessRegistration } from '../../api/messRegistrationApi';
import { createPropertyRegistration } from '../../api/propertyRegistrationApi';
import { useAuth } from '../../auth/AuthProvider';
import {
  updateLiveListing,
  updateMessLead,
  updatePropertyLead,
  type ListingCatalogUpdate,
  type MeListing,
} from '../../auth/mySpacesApi';
import { IS_LOCAL_DEV, LOCAL_LISTING_OTP_SKIP_TOKEN } from '../../config/env';
import { normalizeMobile } from '../../lib/indianMobile';
import {
  isVerificationExpired,
  sendOtpErrorMessage,
  submitErrorMessage,
  verifyOtpErrorMessage,
} from '../../lib/registrationErrors';
import { Modal } from '../common/Modal';
import { CtaButton, SecondaryButton } from './RegistrationButtons';
import { RegistrationStepper } from './RegistrationStepper';
import { RegistrationSuccess } from './RegistrationSuccess';
import { fileToDataUrl, listingPhotoError } from './listingPhotos';
import { StepDetails } from './StepDetails';
import { StepPhotos, type SelectedListingPhoto } from './StepPhotos';
import { StepProperty } from './StepProperty';
import { StepReview } from './StepReview';
import { StepVerify } from './StepVerify';
import type { VerifyPhase } from './StepVerify';
import {
  EMPTY_FORM,
  buildMessRequest,
  buildRequest,
  clearDraft,
  formCoordinate,
  readDraft,
  registrationAddress,
  validateDetailsStep,
  validateMobile,
  validatePropertyStep,
  writeDraft,
} from './registrationForm';
import type { FieldErrors, RegistrationForm } from './registrationForm';
import { normalizeAmenityAssignments } from '../../lib/amenities';
import { defaultPriceBasis, isPriceBasis } from '../../lib/priceBasis';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import type { PriceBasis, PropertyType } from '../../api/types';
import type { ListingKind } from '../../constants/listing';
import { LISTING_COPY } from '../../constants/listing';

const LAST_STEP = 5;
const PROPERTY_OTP_PURPOSE = 'PROPERTY_REGISTRATION' as const;
const MESS_OTP_PURPOSE = 'MESS_REGISTRATION' as const;

/** Property type renders as a radio group, so it has no element carrying the field id. */
function focusField(key: string): void {
  const target =
    document.getElementById(key) ??
    document.querySelector<HTMLElement>(`[name="${key}"]`);
  target?.focus();
  target?.scrollIntoView({ block: 'center' });
}

function secondsUntil(target: number | null): number {
  if (target === null) {
    return 0;
  }
  return Math.max(0, Math.ceil((target - Date.now()) / 1000));
}

/** Ticks once a second while a resend cooldown is running. */
function useSecondsLeft(target: number | null): number {
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(target));

  useEffect(() => {
    setSecondsLeft(secondsUntil(target));
    if (target === null) {
      return;
    }
    const id = window.setInterval(() => {
      const next = secondsUntil(target);
      setSecondsLeft(next);
      if (next <= 0) {
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return secondsLeft;
}

const PROPERTY_TYPES: readonly PropertyType[] = ['PG', 'HOSTEL', 'CO_LIVING', 'RENTAL', 'CORPORATE_STAY', 'MESS'];

function capacityField(form: RegistrationForm): Pick<ListingCatalogUpdate, 'capacityEstimate'> {
  const capacity = Number(form.capacityEstimate);
  if (!form.capacityEstimate.trim() || !Number.isInteger(capacity) || capacity < 0) return {};
  return { capacityEstimate: capacity };
}

function amenityField(form: RegistrationForm, include: boolean): Pick<ListingCatalogUpdate, 'amenities'> {
  const option = form.propertyType ? getPropertyTypeOption(form.propertyType) : null;
  if (!include || !option?.supportsAmenities) return {};
  return { amenities: normalizeAmenityAssignments(form.amenities) };
}

type PropertyRegistrationDrawerProps = {
  open: boolean;
  kind: ListingKind;
  editListing?: MeListing | null;
  onClose: () => void;
  onSaved?: () => void;
};

function asPropertyType(value: string | null | undefined): PropertyType | null {
  return PROPERTY_TYPES.find((type) => type === value) ?? null;
}

function money(value: number | string | null | undefined): string {
  if (value == null || value === '') return '';
  return String(value);
}

function formFromListing(kind: ListingKind, listing: MeListing, ownerName: string, mobile: string): RegistrationForm {
  const mess = kind === 'mess';
  const type = mess ? 'MESS' : asPropertyType(listing.spaceType);
  const address = listing.address?.trim() ?? '';
  const buildingName = listing.buildingName?.trim() ?? '';
  return {
    ...EMPTY_FORM,
    propertyType: type,
    propertyName: listing.name ?? '',
    buildingName,
    buildingNameEdited: Boolean(buildingName),
    ownerName: listing.ownerName?.trim() || ownerName,
    description: listing.description ?? '',
    addressLine: address,
    locationQuery: address,
    locationSelected: Boolean(address),
    city: listing.city ?? '',
    state: listing.state ?? '',
    pincode: listing.pincode ?? '',
    mapUrl: listing.mapUrl ?? '',
    latitude: listing.latitude != null ? String(listing.latitude) : '',
    longitude: listing.longitude != null ? String(listing.longitude) : '',
    startingPrice: money(mess ? listing.monthlyPrice : listing.startingPrice),
    priceBasis: isPriceBasis(listing.priceBasis) ? listing.priceBasis : defaultPriceBasis(type),
    mealPrice: money(listing.mealPrice),
    capacityEstimate: listing.capacityEstimate != null ? String(listing.capacityEstimate) : '',
    amenities: normalizeAmenityAssignments(listing.amenities ?? []),
    mobileNumber: normalizeMobile(listing.contactNumber || mobile),
  };
}

function editedAddress(form: RegistrationForm): string {
  if (form.locationSelected) return form.addressLine.trim().slice(0, 500);
  return registrationAddress(form);
}

function formForKind(kind: ListingKind, form: RegistrationForm): RegistrationForm {
  if (kind === 'mess') {
    return {
      ...form,
      propertyType: 'MESS',
      priceBasis: form.propertyType === 'MESS' && form.priceBasis ? form.priceBasis : 'PER_UNIT',
    };
  }
  if (form.propertyType === 'MESS') {
    return { ...form, propertyType: null, priceBasis: null };
  }
  return form;
}

export function PropertyRegistrationDrawer({
  open,
  kind,
  editListing = null,
  onClose,
  onSaved,
}: PropertyRegistrationDrawerProps) {
  const editing = editListing != null;
  const copy = LISTING_COPY[kind];
  const { user } = useAuth();
  const restored = useRef(readDraft(copy.draftKey)).current;

  const [step, setStep] = useState(restored.step);
  const [form, setForm] = useState<RegistrationForm>(() => formForKind(kind, restored.form));
  const [errors, setErrors] = useState<FieldErrors>({});

  const [phase, setPhase] = useState<VerifyPhase>('idle');
  const [otp, setOtp] = useState('');
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState<number | null>(null);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<SelectedListingPhoto[]>([]);
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const editBaseline = useRef({ ownerName: '', buildingName: '' });
  const amenitiesKnown = useRef(false);
  const amenitiesTouched = useRef(false);
  const [localSkipChecked, setLocalSkipChecked] = useState(false);
  const otpPurpose = kind === 'mess' ? MESS_OTP_PURPOSE : PROPERTY_OTP_PURPOSE;

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const resendSeconds = useSecondsLeft(resendAt);
  const kindRef = useRef(kind);
  const skipPersist = useRef(false);
  const modeKey = editing
    ? `edit:${editListing?.spaceId ?? ''}:${editListing?.registrationId ?? ''}`
    : `create:${kind}`;
  const modeRef = useRef(modeKey);
  const openRef = useRef(open);
  if (modeRef.current !== modeKey) {
    modeRef.current = modeKey;
    skipPersist.current = true;
  }
  if (openRef.current !== open) {
    openRef.current = open;
    if (open) skipPersist.current = true;
  }

  // Typed fields survive a refresh; the OTP and the token deliberately do not.
  // Edit mode never writes the create draft.
  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    if (editing || result || !open) {
      return;
    }
    writeDraft(form, Math.min(step, 3), copy.draftKey);
  }, [form, step, result, open, copy.draftKey, editing]);

  const updateField = useCallback(
    <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => {
      if (key === 'amenities') amenitiesTouched.current = true;
      setForm((current) => {
        if (key === 'propertyType' && value) {
          return {
            ...current,
            propertyType: value as RegistrationForm['propertyType'],
            priceBasis: defaultPriceBasis(value as RegistrationForm['propertyType']),
          };
        }
        return { ...current, [key]: value };
      });
      setErrors((current) => {
        if (!(key in current)) {
          return current;
        }
        const next = { ...current };
        delete next[key];
        return next;
      });
    },
    [],
  );

  function previousStep(current: number): number {
    if (editing && current === 4) return 2;
    return current - 1;
  }

  function nextStep(current: number): number {
    if (editing && current === 2) return 4;
    return current + 1;
  }

  function goToStep(next: number) {
    const safe = !editing && next > 3 && phase !== 'verified' ? 3 : next;
    setStep(safe);
    setErrors({});
    bodyRef.current?.scrollTo({ top: 0 });
  }

  function handleContinue() {
    if (step === 3) {
      if (phase !== 'verified' || !verificationToken) {
        setVerifyError('Verify your mobile number before continuing.');
        return;
      }
      goToStep(4);
      return;
    }
    if (step === 4) {
      const rejection = photos.map((photo) => listingPhotoError(photo.file, 0)).find(Boolean);
      if (rejection) {
        setSubmitError(rejection);
        return;
      }
      if (photos.length > 3) {
        setSubmitError('You can add up to 3 photos.');
        return;
      }
      setSubmitError(null);
      goToStep(5);
      return;
    }
    const found = step === 1 ? validatePropertyStep(form) : validateDetailsStep(form);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setErrors(found);
      // Step 2 is taller than the drawer, so move to the problem instead of letting
      // Continue look unresponsive.
      requestAnimationFrame(() => focusField(firstInvalid));
      return;
    }
    if (step === 1) {
      setForm((current) =>
        current.buildingNameEdited ? current : { ...current, buildingName: current.propertyName },
      );
    }
    goToStep(nextStep(step));
  }

  function resetVerification() {
    setPhase('idle');
    setOtp('');
    setVerificationToken(null);
    setResendAt(null);
    setSendError(null);
    setVerifyError(null);
    setSubmitError(null);
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    skipPersist.current = true;
    if (editListing) {
      const nextForm = formFromListing(kind, editListing, user?.fullName ?? '', user?.mobileNumber ?? '');
      amenitiesKnown.current = Array.isArray(editListing.amenities);
      amenitiesTouched.current = false;
      editBaseline.current = {
        ownerName: nextForm.ownerName,
        buildingName: nextForm.buildingName,
      };
      setForm(nextForm);
      setStep(1);
      setLocalSkipChecked(false);
      setPhotos((current) => {
        current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
        return [];
      });
      setErrors({});
      setResult(null);
      resetVerification();
      kindRef.current = kind;
      return;
    }
    const restoredDraft = readDraft(copy.draftKey);
    const nextForm = formForKind(kind, restoredDraft.form);
    if (!nextForm.mobileNumber && user?.mobileNumber) {
      nextForm.mobileNumber = normalizeMobile(user.mobileNumber);
    }
    setForm(nextForm);
    setStep(kind === kindRef.current ? Math.min(restoredDraft.step, 3) : 1);
    setLocalSkipChecked(false);
    setPhotos((current) => {
      current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      return [];
    });
    setErrors({});
    setResult(null);
    resetVerification();
    kindRef.current = kind;
  }, [open, kind, copy.draftKey, user?.mobileNumber, user?.fullName, editListing]);

  async function handleSendOtp() {
    const found = validateMobile(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setSending(true);
    setSendError(null);
    setVerifyError(null);
    try {
      const response = await sendOtp(form.mobileNumber, otpPurpose);
      setOtp('');
      setPhase('sent');
      // Cooldown comes from the backend so the provider's policy stays server-side.
      setResendAt(Date.now() + Math.max(0, response.resendAfter) * 1000);
    } catch (error) {
      setSendError(sendOtpErrorMessage(error));
    } finally {
      setSending(false);
    }
  }

  function handleSkipOtp() {
    if (!IS_LOCAL_DEV || !localSkipChecked) {
      return;
    }
    const found = validateMobile(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setSendError(null);
    setVerifyError(null);
    setOtp('');
    setVerificationToken(LOCAL_LISTING_OTP_SKIP_TOKEN);
    setPhase('verified');
    goToStep(4);
  }

  async function handleVerifyOtp(candidate = otp) {
    if (candidate.length !== 6) {
      setVerifyError('Enter the 6-digit OTP.');
      return;
    }
    setVerifying(true);
    setVerifyError(null);
    try {
      const response = await verifyOtp(form.mobileNumber, candidate, otpPurpose);
      setVerificationToken(response.verificationToken);
      setPhase('verified');
      setSendError(null);
    } catch (error) {
      // Kept separate from sendError so a verify failure can never surface send copy.
      setVerifyError(verifyOtpErrorMessage(error));
    } finally {
      setVerifying(false);
    }
  }

  async function saveListingEdit(listing: MeListing) {
    const encoded = photos.length > 0 ? await Promise.all(photos.map((photo) => fileToDataUrl(photo.file))) : undefined;
    const owner = form.ownerName.trim();
    const building = form.buildingName.trim();
    const price = Number(form.startingPrice);
    const meal = Number(form.mealPrice);
    const latitude = formCoordinate(form.latitude);
    const longitude = formCoordinate(form.longitude);
    const shared: ListingCatalogUpdate = {
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      description: form.description.trim(),
      mapUrl: form.mapUrl.trim(),
      ...(latitude !== undefined ? { latitude } : {}),
      ...(longitude !== undefined ? { longitude } : {}),
      ...(encoded ? { photos: encoded } : {}),
      ...(owner && owner !== editBaseline.current.ownerName ? { ownerName: owner } : {}),
      ...(building && building !== editBaseline.current.buildingName ? { buildingName: building } : {}),
      ...capacityField(form),
      ...amenityField(form, amenitiesKnown.current || amenitiesTouched.current),
    };
    const address = editedAddress(form);
    const basis: PriceBasis | undefined = form.priceBasis ?? undefined;
    if (listing.publication === 'LIVE' && listing.spaceId) {
      await updateLiveListing(listing.spaceId, {
        ...shared,
        name: form.propertyName.trim(),
        address,
        ...(kind === 'mess'
          ? {
              monthlyPrice: price,
              ...(form.mealPrice.trim() ? { mealPrice: meal } : {}),
              monthlyPriceBasis: basis ?? 'PER_UNIT',
            }
          : { startingPrice: price, priceBasis: basis }),
      });
      return;
    }
    if (!listing.registrationId) {
      throw new Error('This listing cannot be edited.');
    }
    if (kind === 'mess') {
      await updateMessLead(listing.registrationId, {
        ...shared,
        messName: form.propertyName.trim(),
        addressLine: address,
        monthlyPrice: price,
        ...(form.mealPrice.trim() ? { mealPrice: meal } : {}),
        monthlyPriceBasis: basis ?? 'PER_UNIT',
      });
      return;
    }
    await updatePropertyLead(listing.registrationId, {
      ...shared,
      propertyName: form.propertyName.trim(),
      addressLine: address,
      startingPrice: price,
      priceBasis: basis,
    });
  }

  async function handleSubmit() {
    if (editListing) {
      if (step !== LAST_STEP) return;
      setSubmitting(true);
      setSubmitError(null);
      try {
        await saveListingEdit(editListing);
        onSaved?.();
        onClose();
      } catch (error) {
        const message = submitErrorMessage(error);
        setSubmitError(
          message === "We couldn't submit your property. Please try again."
            ? "We couldn't save this listing. Please try again."
            : message,
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (step !== LAST_STEP || !verificationToken || phase !== 'verified') {
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const encoded = await Promise.all(photos.map((photo) => fileToDataUrl(photo.file)));
      const response =
        kind === 'mess'
          ? await createMessRegistration(buildMessRequest(form, verificationToken, encoded))
          : await createPropertyRegistration(buildRequest(form, verificationToken, encoded));
      clearDraft(copy.draftKey);
      setResult(response);
    } catch (error) {
      setSubmitError(submitErrorMessage(error));
      if (isVerificationExpired(error)) {
        // The token is single-use, so a rejected one can never succeed on retry.
        resetVerification();
        setStep(3);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (result) {
      // A submitted registration must not reappear when the drawer is opened again.
      setResult(null);
      setForm(formForKind(kind, EMPTY_FORM));
      setPhotos((current) => {
        current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
        return [];
      });
      setStep(1);
      setErrors({});
      resetVerification();
    }
    onClose();
  }

  const visibleSteps = editing ? copy.stepper.filter((label) => label !== 'Verify') : copy.stepper;
  const displayStep = editing && step >= 4 ? step - 1 : step;
  const pastVerify = editing || phase === 'verified';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy={copy.titleId}
      variant="drawer"
      closeOnBackdrop
      className="sm:max-w-[480px] lg:max-w-[500px]"
    >
      {result ? (
        <RegistrationSuccess
          titleId={copy.titleId}
          title={copy.successTitle}
          body={copy.successBody}
          reference={result.reference}
          onClose={handleClose}
        />
      ) : (
        <>
          <header className="shrink-0 border-b border-border px-5 pt-4 pb-3.5 sm:px-6">
            <div className="flex items-center gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(previousStep(step))}
                  aria-label="Back to previous step"
                  className="reg-focus -ml-1.5 rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-text"
                >
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                </button>
              ) : null}
              <h2 id={copy.titleId} className="flex-1 text-[16px] font-semibold text-text">
                {editing ? 'Edit listing' : copy.title}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="reg-focus -mr-1.5 rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-text"
              >
                <X aria-hidden className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3.5">
              <RegistrationStepper current={displayStep} steps={visibleSteps} />
            </div>
          </header>

          <div ref={bodyRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            {step === 1 ? (
              <StepProperty
                form={form}
                errors={errors}
                copy={copy}
                showTypeSelect={kind === 'property'}
                onChange={updateField}
              />
            ) : null}
            {step === 2 ? (
              <StepDetails form={form} errors={errors} kind={kind} onChange={updateField} />
            ) : null}
            {!editing && step === 3 ? (
              <StepVerify
                form={form}
                errors={errors}
                kind={kind}
                onChange={updateField}
                phase={phase}
                otp={otp}
                onOtpChange={(value) => {
                  setOtp(value);
                  setVerifyError(null);
                }}
                sending={sending}
                verifying={verifying}
                sendError={sendError}
                verifyError={verifyError}
                resendSeconds={resendSeconds}
                onSendOtp={handleSendOtp}
                onVerifyOtp={handleVerifyOtp}
                onChangeNumber={resetVerification}
                allowLocalSkip={IS_LOCAL_DEV}
                localSkipChecked={localSkipChecked}
                onLocalSkipChange={setLocalSkipChecked}
              />
            ) : null}
            {step === 4 && pastVerify ? (
              <StepPhotos
                photos={photos}
                onChange={setPhotos}
                note={editing ? 'New photos replace the current ones. Leave this empty to keep them.' : undefined}
              />
            ) : null}
            {step === 5 && pastVerify ? (
              <StepReview
                form={form}
                kind={kind}
                photos={photos}
                keepCurrentPhotos={editing && (editListing?.gallery?.length ?? 0) > 0}
                onEditStep={goToStep}
              />
            ) : null}
          </div>

          <footer className="shrink-0 border-t border-border px-5 py-4 sm:px-6">
            {submitError ? (
              <p role="alert" className="mb-3 text-[12px] text-danger">
                {submitError}
              </p>
            ) : null}
            <div className="flex gap-2.5">
              {step > 1 ? (
                <SecondaryButton onClick={() => goToStep(previousStep(step))}>
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  Back
                </SecondaryButton>
              ) : null}
              {IS_LOCAL_DEV && !editing && step === 3 && phase !== 'verified' ? (
                <SecondaryButton
                  onClick={handleSkipOtp}
                  disabled={!localSkipChecked || form.mobileNumber.length !== 10}
                >
                  Skip OTP
                </SecondaryButton>
              ) : null}
              {step < LAST_STEP ? (
                <CtaButton
                  onClick={handleContinue}
                  disabled={!editing && step === 3 && phase !== 'verified'}
                  className="flex-1"
                >
                  Continue
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </CtaButton>
              ) : (
                <CtaButton
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={!editing && (phase !== 'verified' || !verificationToken)}
                  className="flex-1"
                >
                  {submitting ? 'Saving…' : editing ? 'Save listing' : kind === 'mess' ? 'Submit mess' : 'Submit property'}
                </CtaButton>
              )}
            </div>
          </footer>
        </>
      )}
    </Modal>
  );
}
