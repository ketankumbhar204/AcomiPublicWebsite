export type PublicUser = {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string | null;
  enquiryEmails?: string[] | null;
  systemRole?: 'USER' | 'ADMIN' | null;
};

/** Space membership roles from GET /spaces/my — same values as the operations app. */
export type MembershipRole = 'OWNER' | 'MANAGER' | 'TENANT' | 'CUSTOMER' | 'STAFF';

export type MySpaceMembership = {
  spaceId: string;
  membershipRole: MembershipRole;
};

export type AuthTokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: PublicUser;
};

export type SendOtpResponse = {
  mobileNumber: string;
  purpose: string;
  expiresIn: number;
  resendAfter: number;
  message: string;
  otpSkipped?: boolean;
  verificationToken?: string;
};

export type VerifyOtpResponse = {
  verified: boolean;
  verificationToken: string;
  expiresIn: number;
};

export type DiscoverSpaceCard = {
  spaceId: string;
  name: string;
  type: string;
  address?: string | null;
  amenityCodes?: string[];
  amenityLabels?: string[];
  foodIncludedInRent?: boolean;
  genderPolicy?: string | null;
  alreadyMember?: boolean;
  testSpace?: boolean;
};

export type DiscoverSpaceDetail = DiscoverSpaceCard & {
  ownedByCurrentUser?: boolean;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  mapUrl?: string | null;
  description?: string | null;
  startingPrice?: number | string | null;
  priceBasis?: string | null;
  monthlyPrice?: number | string | null;
  mealPrice?: number | string | null;
  sharingNotes?: string | null;
};

export type SpaceEnquiryResponse = {
  enquiryId: string;
  spaceId: string;
  spaceName: string;
  spaceType?: string | null;
  locationLabel?: string | null;
  sharingNotes?: string | null;
  amenityLabels?: string[] | null;
  foodIncludedInRent?: boolean | null;
  status: 'PENDING' | 'SHARED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED' | string;
  requesterEmail: string;
  detailsShared: boolean;
  requestedAt?: string;
  expiresAt?: string;
  sharedAt?: string | null;
  reusedExisting?: boolean;
};

export type UserNotification = {
  notificationId: string;
  spaceId: string;
  enquiryId?: string | null;
  notificationType: string;
  title: string;
  message?: string | null;
  actionLabel?: string | null;
  actionRoute?: string | null;
  read: boolean;
  createdAt: string;
};

export type UserNotificationList = {
  notifications: UserNotification[];
  unreadCount: number;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};
