import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useListingPreview } from '../../context/ListingPreviewContext';
import { Modal } from '../common/Modal';

const HISTORY_KEY = 'acomiListingDetail';

type ListingDetailDrawerProps = {
  open: boolean;
  titleId: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

type DetailHistoryState = {
  [HISTORY_KEY]?: boolean;
};

function isDetailHistoryState(state: unknown): state is DetailHistoryState {
  return Boolean(state && typeof state === 'object' && (state as DetailHistoryState)[HISTORY_KEY]);
}

/**
 * Listing detail overlay. On mobile it is full-screen; on larger screens it is a
 * right drawer. Either way, browser/device Back must close it like the X control
 * and stay on the places/meals list — not leave the page.
 */
export function ListingDetailDrawer({ open, titleId, title, onClose, children }: ListingDetailDrawerProps) {
  const { t } = useTranslation();
  const { setPreviewOpen } = useListingPreview();
  const closingFromPopRef = useRef(false);

  useEffect(() => {
    setPreviewOpen(open);
    return () => setPreviewOpen(false);
  }, [open, setPreviewOpen]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    if (!isDetailHistoryState(window.history.state)) {
      window.history.pushState({ [HISTORY_KEY]: true }, '');
    }

    const onPopState = () => {
      closingFromPopRef.current = true;
      onClose();
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      closingFromPopRef.current = false;
    }
  }, [open]);

  const requestClose = () => {
    if (closingFromPopRef.current) {
      closingFromPopRef.current = false;
      onClose();
      return;
    }
    if (isDetailHistoryState(window.history.state)) {
      window.history.back();
      return;
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={requestClose}
      labelledBy={titleId}
      closeOnBackdrop
      variant="drawer"
      className="w-full max-w-xl lg:max-w-2xl"
    >
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-navy">
            {title}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-full p-2 text-muted hover:bg-white/70"
            aria-label={t('discovery.closeDetails')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </Modal>
  );
}
