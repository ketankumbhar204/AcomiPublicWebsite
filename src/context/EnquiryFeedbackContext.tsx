import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type EnquiryToast = {
  id: number;
  title: string;
  body?: string;
  tone: 'success' | 'error';
};

type ShowToastInput = {
  title: string;
  body?: string;
  tone?: 'success' | 'error';
};

type EnquirySendKind = 'view' | 'email';

type EnquiryFeedbackValue = {
  isSending: (listingId: string) => boolean;
  sendKind: (listingId: string) => EnquirySendKind | null;
  beginSend: (listingId: string, kind?: EnquirySendKind) => void;
  endSend: (listingId: string) => void;
  showToast: (toast: ShowToastInput) => void;
};

const EnquiryFeedbackContext = createContext<EnquiryFeedbackValue | null>(null);

export function EnquiryFeedbackProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [sendingIds, setSendingIds] = useState<ReadonlyMap<string, EnquirySendKind>>(() => new Map());
  const [toasts, setToasts] = useState<EnquiryToast[]>([]);

  const beginSend = useCallback((listingId: string, kind: EnquirySendKind = 'email') => {
    if (!listingId) return;
    setSendingIds((current) => {
      const next = new Map(current);
      next.set(listingId, kind);
      return next;
    });
  }, []);

  const endSend = useCallback((listingId: string) => {
    setSendingIds((current) => {
      if (!current.has(listingId)) return current;
      const next = new Map(current);
      next.delete(listingId);
      return next;
    });
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: ShowToastInput) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const next: EnquiryToast = {
        id,
        title: toast.title,
        body: toast.body,
        tone: toast.tone ?? 'success',
      };
      setToasts((current) => [...current, next]);
      window.setTimeout(() => dismissToast(id), 7000);
    },
    [dismissToast],
  );

  const isSending = useCallback((listingId: string) => sendingIds.has(listingId), [sendingIds]);
  const sendKind = useCallback(
    (listingId: string) => sendingIds.get(listingId) ?? null,
    [sendingIds],
  );

  const value = useMemo(
    () => ({ isSending, sendKind, beginSend, endSend, showToast }),
    [beginSend, endSend, isSending, sendKind, showToast],
  );

  return (
    <EnquiryFeedbackContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[130] flex flex-col items-center gap-2 px-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_16px_40px_rgba(11,28,22,0.22)] ${
              toast.tone === 'error'
                ? 'border-[#F5B4B4] bg-[#FDECEC]'
                : 'border-[#8FCBAB] bg-[#D8F3E4]'
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
                toast.tone === 'error' ? 'bg-red-600' : 'bg-[#0F6B4C]'
              }`}
            >
              {toast.tone === 'error' ? <X className="h-4 w-4" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-navy">{toast.title}</span>
              {toast.body ? <span className="mt-0.5 block text-[13px] leading-snug text-text-secondary">{toast.body}</span> : null}
            </span>
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-soft"
              aria-label={t('common.close', { defaultValue: 'Close' })}
              onClick={() => dismissToast(toast.id)}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </EnquiryFeedbackContext.Provider>
  );
}

export function useEnquiryFeedback(): EnquiryFeedbackValue {
  const value = useContext(EnquiryFeedbackContext);
  if (!value) {
    throw new Error('useEnquiryFeedback must be used within EnquiryFeedbackProvider');
  }
  return value;
}

export function useIsEnquirySending(listingId: string): boolean {
  return useEnquiryFeedback().isSending(listingId);
}

export function useEnquirySendKind(listingId: string): 'view' | 'email' | null {
  return useEnquiryFeedback().sendKind(listingId);
}
