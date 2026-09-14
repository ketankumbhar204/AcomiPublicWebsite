import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getPublicAccessToken,
  setPublicAccessToken,
  setPublicUnauthorizedHandler,
} from '../lib/apiClient';
import { publicAuthApi } from './authApi';
import { clearStoredAuth, readStoredToken, writeStoredToken, writeStoredUser } from './storage';
import type { PublicUser } from './types';

type AuthMode = 'login' | 'register';

type AuthContextValue = {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  authOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setSession: (user: PublicUser, accessToken: string) => void;
  refreshUser: () => Promise<PublicUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const clearClientSession = useCallback(() => {
    setPublicAccessToken(null);
    clearStoredAuth();
    setUser(null);
  }, []);

  const setSession = useCallback((nextUser: PublicUser, accessToken: string) => {
    setPublicAccessToken(accessToken);
    writeStoredToken(accessToken);
    writeStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    setPublicUnauthorizedHandler(clearClientSession);
    const stored = readStoredToken();
    if (stored) {
      setPublicAccessToken(stored);
    }
    void publicAuthApi
      .me(stored)
      .then((me) => {
        writeStoredUser(me);
        setUser(me);
      })
      .catch(() => {
        if (stored) {
          clearClientSession();
        }
      })
      .finally(() => setIsBootstrapping(false));
    return () => setPublicUnauthorizedHandler(null);
  }, [clearClientSession]);

  const refreshUser = useCallback(async () => {
    try {
      const me = await publicAuthApi.me();
      writeStoredUser(me);
      setUser(me);
      return me;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await publicAuthApi.logout();
    } catch {
      // cookie may already be gone
    }
    clearClientSession();
  }, [clearClientSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      authOpen,
      authMode,
      openAuth: (mode = 'login') => {
        setAuthMode(mode);
        setAuthOpen(true);
      },
      closeAuth: () => setAuthOpen(false),
      setSession,
      refreshUser,
      logout,
    }),
    [authMode, authOpen, isBootstrapping, logout, refreshUser, setSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}

export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}

export function peekAccessToken(): string | null {
  return getPublicAccessToken();
}
