import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserType } from '../constants/userTypes';
import {
  USER_TYPE_PROMPT_KEY,
  USER_TYPE_STORAGE_KEY,
  getUserTypeOption,
  isUserType,
} from '../constants/userTypes';
import { readStored, writeStored } from '../lib/storage';
import { UserTypeModal } from '../components/onboarding/UserTypeModal';

type UserTypeContextValue = {
  userType: UserType | null;
  isModalOpen: boolean;
  openUserTypeModal: () => void;
  closeUserTypeModal: () => void;
  selectUserType: (id: UserType) => void;
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
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(readStoredUserType);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(shouldPromptOnLoad);

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

  const selectUserType = useCallback(
    (id: UserType) => {
      setIsModalOpen(false);

      // Re-picking the active type just dismisses the dialog: no navigation, no
      // rewrite, so the visitor stays exactly where they were.
      if (id === userType) {
        return;
      }

      writeStored(USER_TYPE_STORAGE_KEY, id);
      markPromptSeen();
      setUserType(id);
      navigate(getUserTypeOption(id).to);
    },
    [markPromptSeen, navigate, userType],
  );

  const value = useMemo<UserTypeContextValue>(
    () => ({
      userType,
      isModalOpen,
      openUserTypeModal,
      closeUserTypeModal,
      selectUserType,
    }),
    [userType, isModalOpen, openUserTypeModal, closeUserTypeModal, selectUserType],
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
