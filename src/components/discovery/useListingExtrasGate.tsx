import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '../common/Modal';
import {
  fetchInquiryQuota,
  isUnlimitedQuota,
  type InquiryQuota,
} from '../../auth/inquiryCreditsApi';
import { InquiryLimitModal } from './InquiryLimitModal';

type ExtraPurpose = 'map' | 'photos';

function quotaAllows(quota: InquiryQuota | null): boolean {
  return Boolean(quota && (isUnlimitedQuota(quota) || quota.freeRemainingToday > 0));
}

/**
 * Map and photo actions stay closed once today's free enquiry is used.
 * An existing enquiry, or a payment approved in this session, opens them.
 * Wallet credits do not skip the payment popup.
 */
export function useListingExtrasGate(listingId: string, alreadyUnlocked: boolean) {
  const [quota, setQuota] = useState<InquiryQuota | null>(null);
  const [fetched, setFetched] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [purpose, setPurpose] = useState<ExtraPurpose>('map');
  const [sessionPaid, setSessionPaid] = useState(false);
  const [photoOpenToken, setPhotoOpenToken] = useState(0);
  const mapHrefRef = useRef('');
  const purposeRef = useRef<ExtraPurpose>('map');
  const grantedRef = useRef(false);

  useEffect(() => {
    setQuota(null);
    setFetched(false);
    setPayOpen(false);
    setSessionPaid(false);
    setPhotoOpenToken(0);
    grantedRef.current = false;
    let cancelled = false;
    void fetchInquiryQuota()
      .then((next) => {
        if (!cancelled) setQuota(next);
      })
      .catch(() => {
        if (!cancelled) setQuota(null);
      })
      .finally(() => {
        if (!cancelled) setFetched(true);
      });
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const allowed = alreadyUnlocked || sessionPaid || (fetched && quotaAllows(quota));

  const release = useCallback((next: ExtraPurpose) => {
    if (grantedRef.current) return;
    grantedRef.current = true;
    setSessionPaid(true);
    setPayOpen(false);
    if (next === 'map') {
      const href = mapHrefRef.current.trim();
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    setPhotoOpenToken((token) => token + 1);
  }, []);

  const openPay = useCallback((next: ExtraPurpose) => {
    purposeRef.current = next;
    setPurpose(next);
    setPayOpen(true);
  }, []);

  const hold = useCallback(
    (next: ExtraPurpose) => {
      if (alreadyUnlocked || sessionPaid) return true;
      if (!fetched) {
        void fetchInquiryQuota()
          .then((nextQuota) => {
            setQuota(nextQuota);
            setFetched(true);
            if (quotaAllows(nextQuota)) {
              if (next === 'map') {
                const href = mapHrefRef.current.trim();
                if (href) window.open(href, '_blank', 'noopener,noreferrer');
                return;
              }
              setPhotoOpenToken((token) => token + 1);
              return;
            }
            openPay(next);
          })
          .catch(() => {
            setFetched(true);
            openPay(next);
          });
        return false;
      }
      if (quotaAllows(quota)) return true;
      openPay(next);
      return false;
    },
    [alreadyUnlocked, fetched, openPay, quota, sessionPaid],
  );

  const dialog = (
    <Modal
      open={payOpen}
      onClose={() => setPayOpen(false)}
      labelledBy="enquire-title"
      describedBy="enquire-body"
      closeOnBackdrop
      className="box-border max-h-[90vh] w-full max-w-[min(640px,calc(100vw-2rem))] overflow-y-auto overscroll-contain p-4 [scrollbar-width:none] [-ms-overflow-style:none] sm:px-5 sm:py-3.5 [&::-webkit-scrollbar]:hidden"
    >
      <InquiryLimitModal
        purpose={purpose}
        availableCredits={0}
        onClose={() => setPayOpen(false)}
        onPaymentConfirmed={() => release(purposeRef.current)}
      />
    </Modal>
  );

  return { allowed, hold, photoOpenToken, mapHrefRef, dialog };
}
