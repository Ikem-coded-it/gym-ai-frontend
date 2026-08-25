import { DateTime } from 'luxon'
import authService from '../services/auth.service'
import { clearAuthState, getAuthToken } from './auth-token'

export { clearAuthState, getAuthToken, saveAccessToken, saveAuthToken } from './auth-token'

export const logout = async () => {
  if (typeof window !== 'undefined') {
    try {
      await authService.logout()
    } catch {
      // Ignore API errors — the server session may already be invalidated
    }
    clearAuthState()
  }
  return true
}

export function isTokenExpired(expiresAtString: string) {
  const expiresAt = DateTime.fromISO(expiresAtString)
  const now = DateTime.now()
  return expiresAt <= now
}

export const checkLogin = () => {
  const accessToken = getAuthToken()
  if (!accessToken || !accessToken.token) return false
  const expired = isTokenExpired(accessToken?.expiresAt)
  if (expired === true) {
    return false
  }
  return true
}
