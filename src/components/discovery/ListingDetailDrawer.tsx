import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useListingPreview } from '../../context/ListingPreviewContext';
import { Modal } from '../common/Modal';

type ListingDetailDrawerProps = {
  open: boolean;
  titleId: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function ListingDetailDrawer({ open, titleId, title, onClose, children }: ListingDetailDrawerProps) {
  const { setPreviewOpen } = useListingPreview();

  useEffect(() => {
    setPreviewOpen(open);
    return () => setPreviewOpen(false);
  }, [open, setPreviewOpen]);

  return (
    <Modal
      open={open}
      onClose={onClose}
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
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-white/70"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </Modal>
  );
}
