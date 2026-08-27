import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * `drawer` keeps the identical dialog semantics and focus behaviour, and only changes
 * where the panel sits: right edge on desktop, full screen on mobile.
 */
export type ModalVariant = 'center' | 'drawer';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog */
  labelledBy: string;
  /** id of the element that describes the dialog */
  describedBy?: string;
  /** Onboarding dialogs deliberately opt out of backdrop dismissal. */
  closeOnBackdrop?: boolean;
  variant?: ModalVariant;
  className?: string;
  children: ReactNode;
};

const VARIANT_VIEWPORT: Record<ModalVariant, string> = {
  center: 'flex items-start justify-center overflow-y-auto p-4 sm:p-6',
  drawer: 'flex justify-end',
};

const VARIANT_PANEL: Record<ModalVariant, string> = {
  center:
    'modal-panel my-auto w-full rounded-[24px] border border-black/5 shadow-[0_24px_64px_rgba(11,28,22,0.18)]',
  // Full-bleed on mobile so the keyboard and the sticky footer both have room.
  drawer:
    'drawer-panel flex h-full w-full flex-col border-l border-black/5 shadow-[-16px_0_48px_rgba(11,28,22,0.16)] sm:rounded-l-[24px]',
};

function focusableWithin(node: HTMLElement): HTMLElement[] {
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
  );
}

export function Modal({
  open,
  onClose,
  labelledBy,
  describedBy,
  closeOnBackdrop = false,
  variant = 'center',
  className = '',
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Lock page scroll and reserve the scrollbar width so the fixed header does not jump.
  useEffect(() => {
    if (!open) {
      return;
    }
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-gap', `${gap}px`);
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-gap');
    };
  }, [open]);

  // Move focus into the dialog on open, and back to the trigger on close.
  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.activeElement;
    returnFocusRef.current =
      previous instanceof HTMLElement && previous !== document.body ? previous : null;

    // Focus the dialog itself rather than the first control, so a keyboard user
    // does not land on Close and dismiss the choice by pressing Enter.
    panelRef.current?.focus();

    return () => {
      const target = returnFocusRef.current;
      if (target && target.isConnected) {
        target.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      const items = focusableWithin(panel);
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className={`fixed inset-0 z-[100] overscroll-contain ${VARIANT_VIEWPORT[variant]}`}>
      <div
        className="modal-backdrop fixed inset-0 bg-ink/55"
        aria-hidden
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`relative bg-white focus:outline-none ${VARIANT_PANEL[variant]} ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
