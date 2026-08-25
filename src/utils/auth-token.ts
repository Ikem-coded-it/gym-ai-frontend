import useAuthStore from '../store/zustand/auth.zustand'

const TOKEN_ID = 'gymai_token'

const isClient = () =>
  typeof window !== 'undefined' && typeof localStorage !== 'undefined'

export const saveAuthToken = (token: unknown) => {
  if (!isClient()) return
  localStorage.setItem(TOKEN_ID, JSON.stringify(token))
}

export const getAuthToken = () => {
  if (!isClient()) return null
  const raw = localStorage.getItem(TOKEN_ID)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const saveAccessToken = (accessToken: string, expiresInMinutes = 30) => {
  saveAuthToken({
    token: accessToken,
    expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString(),
  })
}

/**
 * Synchronously wipe local auth state (token + store) without making any API
 * calls. Used by the HTTP interceptor to handle 401s without risking a
 * recursive request loop.
 */
export const clearAuthState = () => {
  if (!isClient()) return
  localStorage.removeItem(TOKEN_ID)
  useAuthStore.setState({
    currentUser: null,
    isLoggedIn: false,
    authToken: null,
  })
}
