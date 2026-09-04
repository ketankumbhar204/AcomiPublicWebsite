import { Lock, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { UserType } from '../../constants/userTypes';
import { USER_TYPE_OPTIONS } from '../../constants/userTypes';
import { Modal } from '../common/Modal';
import { UserTypeCard } from './UserTypeCard';

type UserTypeModalProps = {
  open: boolean;
  /** null on the first visit, set when the visitor is switching. */
  selectedType: UserType | null;
  onClose: () => void;
  onSelect: (id: UserType) => void;
};

export function UserTypeModal({ open, selectedType, onClose, onSelect }: UserTypeModalProps) {
  const { t } = useTranslation();
  const isSwitching = selectedType !== null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="user-type-title"
      describedBy="user-type-description"
      className="max-w-[760px]"
    >
      <div className="px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-7">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('common.close')}
          className="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:top-4 sm:right-4"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="px-6 text-center sm:px-8">
          <h2
            id="user-type-title"
            className="text-[1.5rem] leading-[1.15] font-semibold tracking-tight text-navy sm:text-[1.9rem]"
          >
            {t('userTypeModal.welcome')}
          </h2>
          <p className="mt-2 text-sm font-semibold text-navy sm:text-[15px]">
            {t('userTypeModal.howUse')}
          </p>
          <p
            id="user-type-description"
            className="mt-1.5 text-xs leading-relaxed text-text-secondary sm:text-[13px]"
          >
            {t('userTypeModal.choose')}
          </p>
        </div>

        <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
          {USER_TYPE_OPTIONS.map((option) => (
            <UserTypeCard
              key={option.id}
              option={option}
              selected={option.id === selectedType}
              onSelect={onSelect}
            />
          ))}
        </div>

        {isSwitching ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-text-secondary ring-1 ring-border transition hover:bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('userTypeModal.close')}
            </button>
          </div>
        ) : (
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <Lock className="h-3 w-3" aria-hidden />
            {t('userTypeModal.changeAnytime')}
          </p>
        )}
      </div>
    </Modal>
  );
}
