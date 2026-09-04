import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';

type FilterSheetProps<T> = {
  open: boolean;
  title: string;
  labelledBy: string;
  value: T;
  onClose: () => void;
  onApply: (value: T) => void;
  onClear: () => void;
  children: (draft: T, setDraft: (next: T) => void) => ReactNode;
};

export function FilterSheet<T>({
  open,
  title,
  labelledBy,
  value,
  onClose,
  onApply,
  onClear,
  children,
}: FilterSheetProps<T>) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={labelledBy}
      closeOnBackdrop
      variant="drawer"
      className="max-w-md"
    >
      <div className="flex h-full flex-col bg-[#d6f3e4]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id={labelledBy} className="text-lg font-semibold text-navy">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-soft"
            aria-label={t('discovery.closeFilters')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children(draft, setDraft)}</div>
        <div className="flex gap-3 border-t border-border px-5 py-4">
          <ActionButton onClick={onClear} variant="ghost" className="flex-1">
            {t('discovery.clearAll')}
          </ActionButton>
          <ActionButton
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="flex-1"
          >
            {t('discovery.apply')}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
