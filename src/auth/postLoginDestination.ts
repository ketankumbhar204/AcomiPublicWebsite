/**
 * Post-login destination for the public website.
 *
 * Role layers (existing ACOMI model, not a new system):
 * - systemRole ADMIN → operations admin landing
 * - any space membership OWNER | MANAGER | STAFF → operations app root
 * - otherwise (USER with TENANT/CUSTOMER/no spaces) → stay on the public site
 *
 * Ownership is space membership / spaces.owner_id, not systemRole === OWNER.
 */
export type PostLoginDestination = { kind: 'public' } | { kind: 'operations'; href: string };

const OPERATIONAL_MEMBERSHIP_ROLES = new Set(['OWNER', 'MANAGER', 'STAFF']);

export function isPlatformAdmin(systemRole?: string | null): boolean {
  return systemRole === 'ADMIN';
}

export function isOperationalMembershipRole(role?: string | null): boolean {
  return Boolean(role && OPERATIONAL_MEMBERSHIP_ROLES.has(role));
}

export function getPostLoginDestination(input: {
  systemRole?: string | null;
  membershipRoles: Array<string | null | undefined>;
  adminHref: string;
  operationsHref: string;
}): PostLoginDestination {
  if (isPlatformAdmin(input.systemRole)) {
    return { kind: 'operations', href: input.adminHref };
  }
  if (input.membershipRoles.some((role) => isOperationalMembershipRole(role))) {
    return { kind: 'operations', href: input.operationsHref };
  }
  return { kind: 'public' };
}

/** Only the compile-time APP admin/root URLs are valid operational destinations. */
export function trustedOperationsHref(
  href: string,
  allowed: { adminHref: string; operationsHref: string },
): string | null {
  if (href === allowed.adminHref || href === allowed.operationsHref) {
    return href;
  }
  return null;
}
