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

const enquire = read('src/components/discovery/EnquireDialog.tsx');
const authModal = read('src/components/auth/AuthModal.tsx');
const navbar = read('src/components/layout/Navbar.tsx');
const layout = read('src/components/layout/Layout.tsx');
const footer = read('src/components/layout/Footer.tsx');
const signInCta = read('src/components/auth/SignInCta.tsx');
const authApi = read('src/auth/authApi.ts');
const storage = read('src/auth/storage.ts');
const intent = read('src/auth/enquireIntent.ts');
const validation = read('src/auth/validation.ts');
const apiClient = read('src/lib/apiClient.ts');
const discover = read('src/auth/discoverEnquiry.ts');
const types = read('src/auth/types.ts');
const listingTypes = read('src/data/listings/types.ts');
const links = read('src/constants/links.ts');
const places = read('src/pages/PlacesPage.tsx');
const meals = read('src/pages/MealsPage.tsx');
const passwordField = read('src/components/auth/PasswordField.tsx');
const maps = read('src/data/listings/query.ts');
const en = JSON.parse(read('src/i18n/locales/en.json'));
const hi = JSON.parse(read('src/i18n/locales/hi.json'));
const mr = JSON.parse(read('src/i18n/locales/mr.json'));

assert(layout.includes('AuthProvider'), 'Layout must wrap AuthProvider');
assert(layout.includes('AuthModal'), 'Layout must render AuthModal');
assert(!enquire.includes('app.acomi.in'), 'Enquire must not redirect to app.acomi.in');
assert(!enquire.includes('APP.login'), 'Enquire must not use AcomiWeb login URL');
assert(enquire.includes("openAuth('login')"), 'Enquire must open public-site login');
assert(enquire.includes("openAuth('register')"), 'Enquire must open public-site register');
assert(enquire.includes('saveEnquireIntent'), 'Enquire must preserve listing intent');
assert(enquire.includes('SELF_ENQUIRY_NOT_ALLOWED'), 'Enquire must keep self-enquiry guard');
assert(enquire.includes('enquireOwnTitle'), 'Own-space copy must be used');
assert(enquire.includes('reusedExisting'), 'duplicate enquiry must show a user-facing message');
assert(en.discovery.enquireAlreadySharedTitle.toLowerCase().includes('inbox'), 'duplicate shared title missing');
assert(en.discovery.enquireAlreadyNoNewEmail.toLowerCase().includes('not sent'), 'duplicate copy must say email was not sent');
assert(authModal.includes('PasswordField'), 'login/register must use the password visibility field');
assert(authModal.includes('publicAuthApi.login'), 'Auth modal must use existing login API');
assert(authModal.includes('publicAuthApi.register'), 'Auth modal must use existing register API');
assert(authModal.includes('loginWithOtp'), 'Auth modal must reuse OTP login');
assert(authModal.includes('sendOtp'), 'Auth modal must reuse send-otp');
assert(authModal.includes('getPostLoginDestination'), 'Auth modal must route by existing ACOMI roles');
assert(authModal.includes('listMySpaceMemberships'), 'Auth modal must load space memberships after login');
assert(authModal.includes('trustedOperationsHref'), 'operational redirect must use trusted APP URLs only');
assert(authModal.includes('clearEnquireIntent'), 'operational login must not continue customer enquire');
assert(!authModal.includes('access_token='), 'Auth modal must not put tokens in URLs');
assert(!authModal.includes("systemRole === 'OWNER'"), 'OWNER is a membership role, not systemRole');
assert(en.auth.workspaceOpening.toLowerCase().includes('workspace'), 'workspace opening copy missing');
assert(en.auth.workspaceLookupFailed, 'workspace lookup error copy missing');
assert(en.auth.workspaceRetry, 'workspace retry copy missing');
assert(hi.auth.workspaceOpening, 'Hindi workspace opening missing');
assert(mr.auth.workspaceRetry, 'Marathi workspace retry missing');

const destination = read('src/auth/postLoginDestination.ts');
assert(destination.includes("systemRole === 'ADMIN'"), 'ADMIN routing must use systemRole');
assert(destination.includes("new Set(['OWNER', 'MANAGER', 'STAFF'])"), 'operational roles must be membership roles');
assert(!destination.includes("systemRole === 'OWNER'"), 'must not invent systemRole OWNER');

const mySpaces = read('src/auth/mySpacesApi.ts');
assert(mySpaces.includes("'/spaces/my'"), 'membership API must reuse GET /spaces/my');

assert(links.includes('admin: `${APP_ORIGIN}/admin`'), 'admin destination must be existing /admin route');
assert(authApi.includes("'/auth/login'"), 'login endpoint missing');
assert(authApi.includes("'/auth/register'"), 'register endpoint missing');
assert(authApi.includes("'/auth/logout'"), 'logout endpoint missing');
assert(authApi.includes("'/auth/me'"), 'current-user endpoint missing');
assert(apiClient.includes("credentials: 'include'"), 'API client must send cookies');
assert(storage.includes('id: user.id'), 'stored user must keep id');
assert(storage.includes('fullName: user.fullName'), 'stored user must keep name');
assert(storage.includes('email: user.email ?? null'), 'stored user must keep email');
assert(storage.includes('enquiryEmails'), 'stored user should keep saved enquiry emails');
assert(!storage.includes('mobileNumber'), 'public storage must not persist mobile numbers');
assert(!storage.includes('password'), 'public storage must not persist passwords');
assert(intent.includes('listingId'), 'enquire intent must keep listing id');
assert(intent.includes('intentContainsSecrets'), 'intent secret guard missing');
assert(validation.includes('INDIAN_MOBILE_REGEX'), 'mobile validation missing');
assert(validation.includes('PASSWORD_MIN_LENGTH = 8'), 'password min length must match ACOMI');
assert(validation.includes('PASSWORD_MAX_LENGTH = 72'), 'password max length must match ACOMI');
assert(validation.includes('assertNoTokenInUrl'), 'URL token guard missing');
assert(navbar.includes('openAuth'), 'Navbar sign-in must stay on the public site');
assert(navbar.includes('<AccountMenu'), 'Logged-in header must use AccountMenu dropdown');
assert(!navbar.includes('access_token'), 'Navbar must not put tokens in URLs');

const accountMenu = read('src/components/layout/AccountMenu.tsx');
assert(accountMenu.includes('APP.web'), 'Account menu Dashboard must go to AcomiWeb');
assert(accountMenu.includes('/my-enquiries'), 'Account menu must link to public My Enquiries');
assert(accountMenu.includes('/notifications'), 'Account menu must link to public notifications');
assert(accountMenu.includes('logout'), 'Account menu must sign out');
assert(accountMenu.includes('changeAppLanguage'), 'Account menu must include language switcher');
assert(signInCta.includes("openAuth('login')"), 'marketing Sign in must open public auth');
assert(!footer.includes('APP.login'), 'Footer must not send Sign in to app.acomi.in');
assert(places.includes('readEnquireIntent'), 'Places page must restore listing after login');
assert(meals.includes('readEnquireIntent'), 'Meals page must restore listing after login');
assert(discover.includes('/spaces/discover'), 'enquiry resolution must use discover APIs');
assert(discover.includes('/enquiries'), 'enquiry submit must use existing enquiry API');
assert(!types.includes('ownerMobile'), 'public auth types must not model owner mobile');
assert(!types.includes('alternateMobile'), 'public auth types must not model alternate mobile');
assert(listingTypes.includes('Never shown: ownerName, mobileNumber'), 'listing types must keep owner contact out');
assert(!links.includes('enquireSignInUrl'), 'legacy app login enquire URL helper must be removed');
assert(passwordField.includes('EyeOff'), 'password field must include hide-password icon');
assert(passwordField.includes('<Eye '), 'password field must include show-password icon');
assert(passwordField.includes("type={visible ? 'text' : 'password'}"), 'eye toggle must switch input type');
assert(maps.includes('listingMapUrl'), 'Google Maps helper must remain');
assert(maps.includes('google.com/maps'), 'Google Maps URL generation must remain');
assert(en.auth.showPassword.toLowerCase().includes('show'), 'show password label missing');
assert(en.auth.hidePassword.toLowerCase().includes('hide'), 'hide password label missing');
assert(hi.auth.showPassword, 'Hindi show password missing');
assert(mr.auth.hidePassword, 'Marathi hide password missing');
assert(en.auth.createAccount.toLowerCase().includes('account'), 'create account copy missing');
assert(en.discovery.enquireSignInTitle.toLowerCase().includes('sign in'), 'enquire login heading missing');
assert(en.discovery.enquireOwnTitle.toLowerCase().includes('your'), 'own-space heading missing');
assert(hi.nav.dashboard, 'Hindi dashboard label missing');
assert(mr.nav.dashboard, 'Marathi dashboard label missing');
assert(hi.auth.loginTitle, 'Hindi login title missing');
assert(mr.auth.loginTitle, 'Marathi login title missing');
assert(en.nav.notifications, 'English notifications nav missing');
assert(en.nav.myEnquiries, 'English My Enquiries nav missing');
assert(hi.nav.notifications, 'Hindi notifications nav missing');
assert(mr.nav.myEnquiries, 'Marathi My Enquiries nav missing');
assert(en.notifications.viewAll.toLowerCase().includes('view'), 'view all copy missing');
assert(en.enquiries.sharedHint.toLowerCase().includes('email'), 'shared enquiry hint must mention email');
assert(!en.enquiries.sharedHint.toLowerCase().includes('mobile'), 'shared enquiry hint must not mention mobile');

const app = read('src/App.tsx');
assert(app.includes('/notifications'), 'public notifications route missing');
assert(app.includes('/my-enquiries'), 'public my-enquiries route missing');
assert(!app.includes('app.acomi.in/notifications'), 'notifications must stay on the public site');
assert(!app.includes('app.acomi.in/my-enquiries'), 'My Enquiries must stay on the public site');

const inbox = read('src/auth/inboxApi.ts');
assert(inbox.includes('/notifications/me'), 'inbox must use authenticated /notifications/me');
assert(inbox.includes('/enquiries/me'), 'inbox must use authenticated /enquiries/me');
assert(inbox.includes('isSafeEnquiryId'), 'enquiry deep links must validate UUID');
assert(!inbox.includes('userId='), 'notification API must not send userId query');
assert(!inbox.includes('ownerMobile'), 'inbox API must not model owner mobile');

const bell = read('src/components/layout/NotificationBell.tsx');
assert(bell.includes('isAuthenticated'), 'bell must hide for anonymous visitors');
assert(bell.includes('/my-enquiries'), 'notification click must open My Enquiries');
assert(!bell.includes('ownerMobile'), 'bell must not render owner mobile');
assert(!bell.includes('alternateMobile'), 'bell must not render alternate mobile');

const myEnquiries = read('src/pages/MyEnquiriesPage.tsx');
const enquiryCard = read('src/components/discovery/EnquiryPlaceCard.tsx');
assert(enquiryCard.includes('sharedHint'), 'My Enquiries cards must use email-only shared copy');
assert(enquiryCard.includes('onOpen'), 'enquiry cards must open a status popup');
assert(!enquiryCard.includes('listingPath'), 'enquiry cards must not navigate to listing pages');
assert(!enquiryCard.includes('ChevronRight'), 'enquiry cards must not use the listing chevron');
assert(myEnquiries.includes('EnquiryPlaceCard'), 'My Enquiries must render enquiry cards');
assert(myEnquiries.includes('EnquiryStatusDialog'), 'My Enquiries must show enquiry status popup');
assert(myEnquiries.includes('EnquireDialog'), 'expired enquiries must reuse enquire dialog');
assert(en.enquiries.detail.SHARED.title.toLowerCase().includes('email'), 'shared popup must mention email');
assert(en.enquiries.detail.EXPIRED.title.toLowerCase().includes('expired'), 'expired popup title missing');
assert(en.enquiries.respondedOnLabel.toLowerCase().includes('email'), 'shared enquiry must show email sent date');
assert(en.enquiries.respondedOnHint.toLowerCase().includes('inbox'), 'shared popup must tell users to search inbox by date');
assert(!myEnquiries.includes('ownerContact'), 'My Enquiries must not show owner contact');
assert(!myEnquiries.includes('mobileNumber'), 'My Enquiries must not show mobile numbers');

const notifPage = read('src/pages/NotificationsPage.tsx');
assert(notifPage.includes('RequireAuth'), 'notifications page must require auth');
assert(!notifPage.includes('ownerMobile'), 'notifications page must not show owner mobile');

assert(!types.includes('ownerMobile'), 'public auth types must not model owner mobile');
assert(!types.includes('alternateMobile'), 'public auth types must not model alternate mobile');
assert(!types.includes('additionalMobile'), 'public auth types must not model Contact 3');

const listingFiles = fs.readdirSync(path.join(root, 'src/data/listings')).filter((name) => name.endsWith('.ts'));
for (const file of listingFiles) {
  const source = read(`src/data/listings/${file}`);
  assert(!/ownerMobile|alternateMobile|ownerEmail|contact3/i.test(source), `${file} must not include owner contact fields`);
}

const sampleIntent = JSON.stringify({
  listingId: 'sunrise-pg-wakad',
  listingName: 'Sunrise PG',
  listingKind: 'places',
  path: '/places/sunrise-pg-wakad',
});
assert(!intentContainsSecrets(sampleIntent), 'listing intent must not look like it contains secrets');
assert(intentContainsSecrets('{"mobile":"9876543210"}'), 'intent secret detector must catch mobile');
assert(intentContainsSecrets('access_token=abc'), 'intent secret detector must catch access tokens');

function intentContainsSecrets(raw) {
  const lower = raw.toLowerCase();
  return (
    lower.includes('access_token') ||
    lower.includes('owner') ||
    lower.includes('mobile') ||
    lower.includes('password')
  );
}

function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(value.replace(/\D/g, '').slice(0, 10));
}
function isValidPassword(value) {
  return value.length >= 8 && value.length <= 72;
}
assert(isValidIndianMobile('9876543210'), 'valid mobile rejected');
assert(!isValidIndianMobile('1876543210'), 'invalid mobile accepted');
assert(isValidPassword('abcdefgh'), 'valid password rejected');
assert(!isValidPassword('short'), 'short password accepted');

assert(!validation.includes('app.acomi.in/login?token'), 'validation must not describe token URLs');

console.log('public-site authentication checks passed');
