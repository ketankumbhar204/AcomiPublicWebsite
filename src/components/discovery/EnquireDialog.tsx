import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';
import { useUserType } from '../../context/UserTypeContext';

type EnquireDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
};

export function EnquireDialog({ open, title, onClose }: EnquireDialogProps) {
  const { openUserTypeModal } = useUserType();

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="enquire-title"
      closeOnBackdrop
      className="max-w-md p-6"
    >
      <h2 id="enquire-title" className="text-xl font-semibold tracking-tight text-navy">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
        Direct enquiries are not connected yet. When listings go live, you will be able to contact the operator from this page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ActionButton
          onClick={() => {
            onClose();
            openUserTypeModal();
          }}
        >
          Get started
        </ActionButton>
        <ActionButton onClick={onClose} variant="ghost">
          Close
        </ActionButton>
      </div>
    </Modal>
  );
}
