import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const OPERATIONAL_MEMBERSHIP_ROLES = new Set(['OWNER', 'MANAGER', 'STAFF']);

function isPlatformAdmin(systemRole) {
  return systemRole === 'ADMIN';
}

function isOperationalMembershipRole(role) {
  return Boolean(role && OPERATIONAL_MEMBERSHIP_ROLES.has(role));
}

function getPostLoginDestination(input) {
  if (isPlatformAdmin(input.systemRole)) {
    return { kind: 'operations', href: input.adminHref };
  }
  if (input.membershipRoles.some((role) => isOperationalMembershipRole(role))) {
    return { kind: 'operations', href: input.operationsHref };
  }
  return { kind: 'public' };
}

function trustedOperationsHref(href, allowed) {
  if (href === allowed.adminHref || href === allowed.operationsHref) {
    return href;
  }
  return null;
}

const adminHref = 'http://localhost:5173/admin';
const operationsHref = 'http://localhost:5173/';
const allowed = { adminHref, operationsHref };

function dest(partial) {
  return getPostLoginDestination({
    adminHref,
    operationsHref,
    membershipRoles: [],
    ...partial,
  });
}

assert(dest({ systemRole: 'USER', membershipRoles: [] }).kind === 'public', 'customer with no spaces should stay public');
assert(
  dest({ systemRole: 'USER', membershipRoles: ['TENANT'] }).kind === 'public',
  'tenant membership should stay public',
);
assert(
  dest({ systemRole: 'USER', membershipRoles: ['CUSTOMER'] }).kind === 'public',
  'customer membership should stay public',
);
assert(dest({ systemRole: undefined, membershipRoles: [] }).kind === 'public', 'missing systemRole should stay public');

const owner = dest({ systemRole: 'USER', membershipRoles: ['OWNER'] });
assert(owner.kind === 'operations' && owner.href === operationsHref, 'owner should go to operations root');

const manager = dest({ systemRole: 'USER', membershipRoles: ['MANAGER'] });
assert(manager.kind === 'operations' && manager.href === operationsHref, 'manager should go to operations root');

const staff = dest({ systemRole: 'USER', membershipRoles: ['STAFF'] });
assert(staff.kind === 'operations' && staff.href === operationsHref, 'staff should go to operations root');

const admin = dest({ systemRole: 'ADMIN', membershipRoles: [] });
assert(admin.kind === 'operations' && admin.href === adminHref, 'admin should go to admin landing');

const adminOwner = dest({ systemRole: 'ADMIN', membershipRoles: ['OWNER', 'CUSTOMER'] });
assert(adminOwner.kind === 'operations' && adminOwner.href === adminHref, 'admin + owner should still go to admin');

const ownerCustomer = dest({ systemRole: 'USER', membershipRoles: ['CUSTOMER', 'OWNER'] });
assert(
  ownerCustomer.kind === 'operations' && ownerCustomer.href === operationsHref,
  'owner + customer should go to operations',
);

const managerCustomer = dest({ systemRole: 'USER', membershipRoles: ['TENANT', 'MANAGER'] });
assert(
  managerCustomer.kind === 'operations' && managerCustomer.href === operationsHref,
  'manager + tenant should go to operations',
);

assert(trustedOperationsHref(adminHref, allowed) === adminHref, 'admin href must be trusted');
assert(trustedOperationsHref(operationsHref, allowed) === operationsHref, 'operations href must be trusted');
assert(trustedOperationsHref('https://evil.example/admin', allowed) === null, 'untrusted href must be rejected');
assert(
  trustedOperationsHref('http://localhost:5173/admin?next=https://evil.example', allowed) === null,
  'query override must be rejected',
);
assert(trustedOperationsHref('/places/123', allowed) === null, 'public-site path must not override operations dest');

const source = read('src/auth/postLoginDestination.ts');
assert(source.includes("systemRole === 'ADMIN'"), 'helper must use systemRole ADMIN');
assert(source.includes("new Set(['OWNER', 'MANAGER', 'STAFF'])"), 'helper must use space membership roles');
assert(!source.includes("systemRole === 'OWNER'"), 'OWNER is not a systemRole');
assert(source.includes('trustedOperationsHref'), 'trusted href helper missing');

const modal = read('src/components/auth/AuthModal.tsx');
assert(modal.includes('getPostLoginDestination'), 'AuthModal must use centralized destination helper');
assert(modal.includes('listMySpaceMemberships'), 'AuthModal must load GET /spaces/my');
assert(modal.includes('clearEnquireIntent'), 'operational login must drop enquire intent');
assert(modal.includes('trustedOperationsHref'), 'AuthModal must allowlist operational URLs');
assert(!modal.includes('access_token='), 'AuthModal must not put tokens in URLs');
assert(!modal.includes('systemRole === \'OWNER\''), 'AuthModal must not treat OWNER as systemRole');

const provider = read('src/auth/AuthProvider.tsx');
assert(!provider.includes('getPostLoginDestination'), 'page load must not auto-redirect by role');
assert(!provider.includes('window.location.assign'), 'AuthProvider must not redirect on bootstrap');

const links = read('src/constants/links.ts');
assert(links.includes('admin: `${APP_ORIGIN}/admin`'), 'admin landing must be APP.admin /admin');

const mySpaces = read('src/auth/mySpacesApi.ts');
assert(mySpaces.includes("'/spaces/my'"), 'membership lookup must use GET /spaces/my');

const enquire = read('src/components/discovery/EnquireDialog.tsx');
assert(!enquire.includes('getPostLoginDestination'), 'enquire dialog must not own role routing');
assert(enquire.includes('SELF_ENQUIRY_NOT_ALLOWED'), 'self-enquiry guard must remain');

console.log('post-login destination checks passed');
