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
  webFreeDailyLimit?: number;
  androidBillingMode?: string;
  androidFreeDailyLimit?: number;
  androidHourlyRateLimit?: number;
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

export type InquiryQuota = {
  channel?: string;
  dailyFreeLimit: number;
  freeUsedToday: number;
  freeRemainingToday: number;
  availableCredits: number;
  androidBillingMode?: string;
  purchasesEnabled?: boolean;
  unlimited?: boolean;
};

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

function readNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** Accept camelCase or snake_case quota payloads; ignore empty objects. */
export function parseInquiryQuota(raw: unknown): InquiryQuota | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const dailyFreeLimit = readNumber(row.dailyFreeLimit, row.daily_free_limit);
  if (dailyFreeLimit == null) return null;
  const freeUsedToday = readNumber(row.freeUsedToday, row.free_used_today) ?? 0;
  const remaining = readNumber(row.freeRemainingToday, row.free_remaining_today);
  return {
    channel: typeof row.channel === 'string' ? row.channel : undefined,
    dailyFreeLimit,
    freeUsedToday,
    freeRemainingToday: remaining ?? Math.max(0, dailyFreeLimit - freeUsedToday),
    availableCredits: readNumber(row.availableCredits, row.available_credits) ?? 0,
    androidBillingMode:
      typeof row.androidBillingMode === 'string'
        ? row.androidBillingMode
        : typeof row.android_billing_mode === 'string'
          ? row.android_billing_mode
          : undefined,
    purchasesEnabled: readBoolean(row.purchasesEnabled, row.purchases_enabled),
    unlimited: readBoolean(row.unlimited),
  };
}

function readBoolean(...values: unknown[]): boolean | undefined {
  for (const value of values) {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return undefined;
}

export function isUnlimitedQuota(quota: InquiryQuota | null | undefined): boolean {
  if (!quota) return false;
  return quota.unlimited === true || quota.purchasesEnabled === false;
}

export function paidCreditsOf(quota: InquiryQuota | null | undefined): number {
  const credits = Number(quota?.availableCredits ?? 0);
  return Number.isFinite(credits) && credits > 0 ? credits : 0;
}

export function canSendEmailEnquiry(quota: InquiryQuota | null | undefined): boolean {
  if (!quota || isUnlimitedQuota(quota)) return true;
  return Number(quota.freeRemainingToday) > 0 || paidCreditsOf(quota) > 0;
}

export function needsInquiryPayment(quota: InquiryQuota | null | undefined): boolean {
  return quota != null && !isUnlimitedQuota(quota) && !canSendEmailEnquiry(quota);
}

export async function fetchInquiryQuota(): Promise<InquiryQuota> {
  const parsed = parseInquiryQuota(await publicApi<unknown>('/inquiry-credits/quota'));
  if (!parsed) {
    throw new Error('Invalid inquiry quota response');
  }
  return parsed;
}

export async function resetInquiryQuota(): Promise<InquiryQuota> {
  const parsed = parseInquiryQuota(
    await publicApi<unknown>('/inquiry-credits/quota/reset', { method: 'POST' }),
  );
  if (!parsed) {
    throw new Error('Invalid inquiry quota response');
  }
  return parsed;
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
