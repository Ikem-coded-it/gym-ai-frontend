import authService from '../services/auth.service';
import { DateTime } from 'luxon';
import useAuthStore from '../store/zustand/auth.zustand';

const TOKEN_ID = 'gymai_token';

const isClient = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const saveAuthToken = (token: any) => {
  if (!isClient()) return;
  localStorage.setItem(TOKEN_ID, JSON.stringify(token));
};

export const getAuthToken = () => {
  if (!isClient()) return null;
  const raw = localStorage.getItem(TOKEN_ID);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Synchronously wipe local auth state (token + store) without making any API
 * calls. Used by the HTTP interceptor to handle 401s without risking a
 * recursive request loop.
 */
export const clearAuthState = () => {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_ID);
  useAuthStore.setState({ currentUser: null, isLoggedIn: false, authToken: null });
};

export const logout = async () => {
  if (isClient()) {
    try {
      await authService.logout();
    } catch {
      // Ignore API errors — the server session may already be invalidated
    }
    clearAuthState();
  }
  return true;
};

export function isTokenExpired(expiresAtString: string) {
  const expiresAt = DateTime.fromISO(expiresAtString);
  const now = DateTime.now();
  return expiresAt <= now;
}

export const checkLogin = () => {
  const accessToken = getAuthToken();
  if (!accessToken || !accessToken.token) return false;
  const expired = isTokenExpired(accessToken?.expiresAt);
  if (expired === true) {
    return false;
  }
  return true;
};
