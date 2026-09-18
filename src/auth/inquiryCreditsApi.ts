import { publicApi } from '../lib/apiClient';

// ─── Types (mirroring backend DTOs) ────────────────────────────────────────

export type InquiryCreditPackage = {
  id: string;
  name: string;
  priceAmount: number;
  currency: string;
  credits: number;
  enabled: boolean;
  displayOrder: number;
};

export type InquiryPaymentConfig = {
  configId?: string;
  enabled: boolean;
  upiId?: string;
  qrFileId?: string;
  qrUrl?: string;
  whatsappNumber?: string;
  instructions?: string;
  packages: InquiryCreditPackage[];
};

export type InquiryWallet = {
  walletId: string;
  userId: string;
  availableCredits: number;
  lifetimeGranted: number;
  lifetimeUsed: number;
  updatedAt?: string;
};

export type PurchaseRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type PurchaseRequest = {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  currency: string;
  credits: number;
  paymentMethod?: string;
  status: PurchaseRequestStatus;
  utr?: string;
  requestedAt: string;
  verifiedAt?: string;
  verifiedByUserId?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
};

// ─── API helpers ────────────────────────────────────────────────────────────

export function fetchInquiryPaymentConfig(): Promise<InquiryPaymentConfig> {
  return publicApi<InquiryPaymentConfig>('/inquiry-credits/payment-config');
}

export function fetchInquiryWallet(): Promise<InquiryWallet> {
  return publicApi<InquiryWallet>('/inquiry-credits/wallet');
}

export function createPurchaseRequest(payload: {
  packageId: string;
  utr?: string;
}): Promise<PurchaseRequest> {
  return publicApi<PurchaseRequest>('/inquiry-credits/purchase-requests', {
    method: 'POST',
    body: payload,
  });
}

export function fetchMyPurchaseRequests(): Promise<PurchaseRequest[]> {
  return publicApi<PurchaseRequest[]>('/inquiry-credits/purchase-requests/me');
}
