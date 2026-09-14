import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicApiError } from '../../lib/apiClient';
import { publicAuthApi } from '../../auth/authApi';
import { clearEnquireIntent } from '../../auth/enquireIntent';
import { listMySpaceMemberships } from '../../auth/mySpacesApi';
import {
  getPostLoginDestination,
  trustedOperationsHref,
} from '../../auth/postLoginDestination';
import type { PublicUser } from '../../auth/types';
import { useAuth } from '../../auth/AuthProvider';
import { APP } from '../../constants/links';
import {
  isValidIndianMobile,
  isValidPassword,
  normalizeIndianMobileDigits,
} from '../../auth/validation';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';
import { PasswordField } from './PasswordField';

type Step = 'credentials' | 'otp';

const fieldClass =
  'mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

export function AuthModal() {
  const { t } = useTranslation();
  const { authOpen, authMode, closeAuth, setSession, openAuth, user } = useAuth();
  const [step, setStep] = useState<Step>('credentials');
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPurpose, setOtpPurpose] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [pendingName, setPendingName] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [pendingConfirm, setPendingConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [openingWorkspace, setOpeningWorkspace] = useState(false);
  const [workspaceLookupFailed, setWorkspaceLookupFailed] = useState(false);

  useEffect(() => {
    if (!authOpen) {
      setStep('credentials');
      setMethod('password');
      setError(null);
      setOtp('');
      setBusy(false);
      setOpeningWorkspace(false);
      setWorkspaceLookupFailed(false);
    }
  }, [authOpen, authMode]);

  function mapError(err: unknown): string {
    if (err instanceof PublicApiError) {
      if (err.status === 401) return t('auth.invalidCredentials');
      if (err.status === 409) return t('auth.mobileRegistered');
      return err.message || t('auth.genericError');
    }
    return t('auth.genericError');
  }

  async function routeAfterLogin(user: PublicUser) {
    const allowed = { adminHref: APP.admin, operationsHref: APP.web };
    const membershipRoles =
      user.systemRole === 'ADMIN'
        ? []
        : (await listMySpaceMemberships()).map((space) => space.membershipRole);
    const destination = getPostLoginDestination({
      systemRole: user.systemRole,
      membershipRoles,
      adminHref: APP.admin,
      operationsHref: APP.web,
    });
    if (destination.kind === 'operations') {
      const href = trustedOperationsHref(destination.href, allowed);
      if (!href) {
        setWorkspaceLookupFailed(true);
        setError(t('auth.workspaceLookupFailed'));
        return;
      }
      clearEnquireIntent();
      setOpeningWorkspace(true);
      window.location.assign(href);
      return;
    }
    closeAuth();
  }

  async function finishAuthenticatedSession(user: PublicUser, accessToken: string) {
    setSession(user, accessToken);
    setError(null);
    setWorkspaceLookupFailed(false);
    try {
      await routeAfterLogin(user);
    } catch {
      setWorkspaceLookupFailed(true);
      setError(t('auth.workspaceLookupFailed'));
    }
  }

  async function submitLoginPassword() {
    const mobile = normalizeIndianMobileDigits(mobileNumber);
    if (!isValidIndianMobile(mobile)) {
      setError(t('auth.mobileInvalid'));
      return;
    }
    if (!isValidPassword(password)) {
      setError(t('auth.passwordInvalid'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await publicAuthApi.login(mobile, password);
      await finishAuthenticatedSession(result.user, result.accessToken);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setBusy(false);
    }
  }

  async function sendLoginOtp() {
    const mobile = normalizeIndianMobileDigits(mobileNumber);
    if (!isValidIndianMobile(mobile)) {
      setError(t('auth.mobileInvalid'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await publicAuthApi.sendOtp(mobile, 'LOGIN');
      setOtpPurpose('LOGIN');
      setStep('otp');
    } catch (err) {
      setError(mapError(err));
    } finally {
      setBusy(false);
    }
  }

  async function submitRegister() {
    const mobile = normalizeIndianMobileDigits(mobileNumber);
    const name = fullName.trim();
    if (!name) {
      setError(t('auth.nameRequired'));
      return;
    }
    if (!isValidIndianMobile(mobile)) {
      setError(t('auth.mobileInvalid'));
      return;
    }
    if (!isValidPassword(password)) {
      setError(t('auth.passwordInvalid'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const sent = await publicAuthApi.sendOtp(mobile, 'REGISTER');
      if (sent.otpSkipped && sent.verificationToken) {
        const result = await publicAuthApi.register({
          fullName: name,
          mobileNumber: mobile,
          password,
          confirmPassword,
          verificationToken: sent.verificationToken,
        });
        await finishAuthenticatedSession(result.user, result.accessToken);
        return;
      }
      setPendingName(name);
      setPendingPassword(password);
      setPendingConfirm(confirmPassword);
      setOtpPurpose('REGISTER');
      setStep('otp');
    } catch (err) {
      setError(mapError(err));
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp() {
    const mobile = normalizeIndianMobileDigits(mobileNumber);
    const code = otp.replace(/\D/g, '');
    if (code.length !== 6) {
      setError(t('auth.otpInvalid'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const verified = await publicAuthApi.verifyOtp(mobile, code, otpPurpose);
      if (otpPurpose === 'LOGIN') {
        const result = await publicAuthApi.loginWithOtp(mobile, verified.verificationToken);
        await finishAuthenticatedSession(result.user, result.accessToken);
        return;
      }
      const result = await publicAuthApi.register({
        fullName: pendingName,
        mobileNumber: mobile,
        password: pendingPassword,
        confirmPassword: pendingConfirm,
        verificationToken: verified.verificationToken,
      });
      await finishAuthenticatedSession(result.user, result.accessToken);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setBusy(false);
    }
  }

  const heading =
    openingWorkspace
      ? t('auth.workspaceOpening')
      : step === 'otp'
        ? t('auth.otpTitle')
        : authMode === 'register'
          ? t('auth.registerTitle')
          : t('auth.loginTitle');
  const locked = busy || openingWorkspace;

  return (
    <Modal
      open={authOpen}
      onClose={locked ? () => undefined : closeAuth}
      labelledBy="public-auth-title"
      describedBy="public-auth-body"
      closeOnBackdrop={!locked}
      className="max-w-md p-6"
    >
      <h2 id="public-auth-title" className="text-xl font-semibold tracking-tight text-navy">
        {heading}
      </h2>
      <p id="public-auth-body" className="mt-2 text-[14px] leading-relaxed text-text-secondary">
        {openingWorkspace
          ? t('auth.workspaceOpeningHint')
          : step === 'otp'
            ? t('auth.otpBody')
            : t('auth.loginBody')}
      </p>

      {error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {error && workspaceLookupFailed && user && !openingWorkspace ? (
        <ActionButton
          className="mt-3 w-full"
          disabled={locked}
          onClick={() => {
            setBusy(true);
            setWorkspaceLookupFailed(false);
            setError(null);
            void routeAfterLogin(user)
              .catch(() => {
                setWorkspaceLookupFailed(true);
                setError(t('auth.workspaceLookupFailed'));
              })
              .finally(() => setBusy(false));
          }}
        >
          {t('auth.workspaceRetry')}
        </ActionButton>
      ) : null}

      {openingWorkspace || workspaceLookupFailed ? null : step === 'otp' ? (
        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submitOtp();
          }}
        >
          <label className="block text-[13px] font-medium text-navy">
            {t('auth.otpLabel')}
            <input
              className={fieldClass}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              disabled={locked}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </label>
          <ActionButton type="submit" disabled={locked} className="w-full">
            {busy ? t('auth.pleaseWait') : t('auth.verifyOtp')}
          </ActionButton>
          <button
            type="button"
            className="w-full text-sm font-medium text-text-secondary disabled:opacity-50"
            disabled={locked}
            onClick={() => setStep('credentials')}
          >
            {t('auth.back')}
          </button>
        </form>
      ) : (
        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (authMode === 'register') {
              void submitRegister();
              return;
            }
            if (method === 'otp') {
              void sendLoginOtp();
              return;
            }
            void submitLoginPassword();
          }}
        >
          {authMode === 'register' ? (
            <label className="block text-[13px] font-medium text-navy">
              {t('auth.nameLabel')}
              <input
                className={fieldClass}
                autoComplete="name"
                value={fullName}
                disabled={locked}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
          ) : null}
          <label className="block text-[13px] font-medium text-navy">
            {t('auth.mobileLabel')}
            <input
              className={fieldClass}
              inputMode="numeric"
              autoComplete="tel"
              value={mobileNumber}
              disabled={locked}
              onChange={(event) => setMobileNumber(normalizeIndianMobileDigits(event.target.value))}
            />
          </label>
          {authMode === 'register' || method === 'password' ? (
            <PasswordField
              id="public-auth-password"
              label={t('auth.passwordLabel')}
              value={password}
              onChange={setPassword}
              autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
              disabled={locked}
            />
          ) : null}
          {authMode === 'register' ? (
            <PasswordField
              id="public-auth-confirm-password"
              label={t('auth.confirmPasswordLabel')}
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              disabled={locked}
            />
          ) : null}

          {authMode === 'login' ? (
            <div className="flex gap-2 text-[12px] font-medium">
              <button
                type="button"
                className={method === 'password' ? 'text-primary' : 'text-text-secondary'}
                disabled={locked}
                onClick={() => setMethod('password')}
              >
                {t('auth.usePassword')}
              </button>
              <span className="text-muted">·</span>
              <button
                type="button"
                className={method === 'otp' ? 'text-primary' : 'text-text-secondary'}
                disabled={locked}
                onClick={() => setMethod('otp')}
              >
                {t('auth.useOtp')}
              </button>
            </div>
          ) : null}

          <ActionButton type="submit" disabled={locked} className="w-full">
            {busy ? t('auth.pleaseWait') : authMode === 'register' ? t('auth.createAccount') : t('nav.signIn')}
          </ActionButton>
        </form>
      )}

      {openingWorkspace || workspaceLookupFailed || step !== 'credentials' ? null : (
        <p className="mt-4 text-center text-[13px] text-text-secondary">
          {authMode === 'login' ? (
            <button type="button" className="font-medium text-primary" disabled={locked} onClick={() => openAuth('register')}>
              {t('auth.needAccount')}
            </button>
          ) : (
            <button type="button" className="font-medium text-primary" disabled={locked} onClick={() => openAuth('login')}>
              {t('auth.haveAccount')}
            </button>
          )}
        </p>
      )}

      {openingWorkspace ? null : (
        <button
          type="button"
          className="mt-3 w-full text-sm text-text-secondary disabled:opacity-50"
          disabled={locked}
          onClick={closeAuth}
        >
          {t('auth.continueBrowsing')}
        </button>
      )}
    </Modal>
  );
}
