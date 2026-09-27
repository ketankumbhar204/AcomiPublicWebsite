import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { UserType } from '../constants/userTypes';
import {
  USER_TYPE_PROMPT_KEY,
  USER_TYPE_STORAGE_KEY,
  getUserTypeOption,
  isUserType,
} from '../constants/userTypes';
import { readStored, writeStored } from '../lib/storage';
import { LocationSelectModal, type SelectedLocation } from '../components/onboarding/LocationSelectModal';
import { UserTypeModal } from '../components/onboarding/UserTypeModal';

type LocationSeeker = Extract<UserType, 'ACCOMMODATION_SEEKER' | 'MEAL_SEEKER'>;

function isLocationSeeker(id: UserType): id is LocationSeeker {
  return id === 'ACCOMMODATION_SEEKER' || id === 'MEAL_SEEKER';
}

type UserTypeContextValue = {
  userType: UserType | null;
  isModalOpen: boolean;
  openUserTypeModal: () => void;
  closeUserTypeModal: () => void;
  selectUserType: (id: UserType) => void;
  rememberUserType: (id: UserType) => void;
  openLocationSelector: (intent?: LocationSeeker) => void;
};

const UserTypeContext = createContext<UserTypeContextValue | null>(null);

function readStoredUserType(): UserType | null {
  const stored = readStored(USER_TYPE_STORAGE_KEY);
  return isUserType(stored) ? stored : null;
}

/**
 * First visit means: no type chosen yet and the prompt has never been dismissed.
 * Returning visitors are not interrupted again.
 */
function shouldPromptOnLoad(): boolean {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      return false;
    }
  }
  if (readStoredUserType()) {
    return false;
  }
  return readStored(USER_TYPE_PROMPT_KEY) === null;
}

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(readStoredUserType);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(shouldPromptOnLoad);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationIntent, setLocationIntent] = useState<LocationSeeker>('ACCOMMODATION_SEEKER');

  const markPromptSeen = useCallback(() => {
    writeStored(USER_TYPE_PROMPT_KEY, new Date().toISOString());
  }, []);

  const openUserTypeModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeUserTypeModal = useCallback(() => {
    setIsModalOpen(false);
    markPromptSeen();
  }, [markPromptSeen]);

  const rememberUserType = useCallback(
    (id: UserType) => {
      writeStored(USER_TYPE_STORAGE_KEY, id);
      markPromptSeen();
      setUserType(id);
      setIsModalOpen(false);
    },
    [markPromptSeen],
  );

  const openLocationSelector = useCallback((intent: LocationSeeker = 'ACCOMMODATION_SEEKER') => {
    setLocationIntent(intent);
    setIsModalOpen(false);
    setLocationOpen(true);
  }, []);

  const selectUserType = useCallback(
    (id: UserType) => {
      setIsModalOpen(false);

      if (isLocationSeeker(id)) {
        rememberUserType(id);
        setLocationIntent(id);
        setLocationOpen(true);
        return;
      }

      // Re-picking the active type just dismisses the dialog: no navigation, no
      // rewrite, so the visitor stays exactly where they were.
      if (id === userType) {
        return;
      }

      rememberUserType(id);
      navigate(getUserTypeOption(id).to);
    },
    [navigate, rememberUserType, userType],
  );

  const handleLocationConfirm = useCallback(
    (selected: SelectedLocation) => {
      setLocationOpen(false);
      rememberUserType(locationIntent);
      const params = new URLSearchParams();
      if (selected.location) {
        params.set('location', selected.location);
      }
      if (selected.pincode) {
        params.set('pincode', selected.pincode);
      }
      if (selected.district) {
        params.set('district', selected.district);
      }
      if (selected.state) {
        params.set('state', selected.state);
      }
      if (selected.cityTaluka) {
        params.set('taluk', selected.cityTaluka);
      }
      const path = locationIntent === 'MEAL_SEEKER' ? '/meals' : '/places';
      navigate(`${path}?${params.toString()}`);
    },
    [locationIntent, navigate, rememberUserType],
  );

  const value = useMemo<UserTypeContextValue>(
    () => ({
      userType,
      isModalOpen,
      openUserTypeModal,
      closeUserTypeModal,
      selectUserType,
      rememberUserType,
      openLocationSelector,
    }),
    [
      userType,
      isModalOpen,
      openUserTypeModal,
      closeUserTypeModal,
      selectUserType,
      rememberUserType,
      openLocationSelector,
    ],
  );

  return (
    <UserTypeContext.Provider value={value}>
      {children}
      {/*
        The only user-type selection UI in the app. Shared by the first-visit
        prompt, every "Get started" CTA, and the navbar switcher.
      */}
      <UserTypeModal
        open={isModalOpen}
        selectedType={userType}
        onClose={closeUserTypeModal}
        onSelect={selectUserType}
      />
      <LocationSelectModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        onConfirm={handleLocationConfirm}
        confirmLabel={
          locationIntent === 'MEAL_SEEKER'
            ? t('locationSelect.continueMeals', { defaultValue: 'See meals' })
            : undefined
        }
      />
    </UserTypeContext.Provider>
  );
}

export function useUserType(): UserTypeContextValue {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error('useUserType must be used inside UserTypeProvider');
  }
  return context;
}
