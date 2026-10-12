import { clearPendingEnquiryEmail } from './inquiredListings';
import { publicApi } from '../lib/apiClient';

type EmailStatusResponse = {
  status?: string;
  recipientEmail?: string | null;
  sentAt?: string | null;
};

type WatchEnquiryEmailInput = {
  enquiryId: string;
  listingId: string;
  beginSend: (listingId: string) => void;
  endSend: (listingId: string) => void;
  onSent: (sentAt: string | null, recipientEmail: string | null) => void;
  onFailed: () => void;
};

const active = new Set<string>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function watchEnquiryEmail(input: WatchEnquiryEmailInput): void {
  const enquiryId = input.enquiryId.trim();
  const listingId = input.listingId.trim();
  if (!enquiryId || !listingId || active.has(enquiryId)) return;
  active.add(enquiryId);
  input.beginSend(listingId);

  void (async () => {
    let terminal: 'sent' | 'failed' | 'stopped' = 'stopped';
    let sentAt: string | null = null;
    let recipientEmail: string | null = null;
    try {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const status = await publicApi<EmailStatusResponse>(`/enquiries/${enquiryId}/email-status`);
        if (status.status === 'SENT') {
          terminal = 'sent';
          sentAt = status.sentAt?.trim() || new Date().toISOString();
          recipientEmail = status.recipientEmail?.trim() || null;
          break;
        }
        if (status.status === 'FAILED' || status.status === 'NONE') {
          terminal = status.status === 'FAILED' ? 'failed' : 'stopped';
          break;
        }
        await sleep(1500);
      }
    } catch {
      terminal = 'failed';
    } finally {
      if (terminal === 'sent') {
        input.onSent(sentAt, recipientEmail);
      } else if (terminal === 'failed') {
        input.onFailed();
      }
      clearPendingEnquiryEmail(enquiryId);
      input.endSend(listingId);
      active.delete(enquiryId);
    }
  })();
}
