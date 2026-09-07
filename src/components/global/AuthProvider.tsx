'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'
import { mapMeToUser } from '~/lib/utils/auth'
import authService from '~/services/auth.service'
import useAuthStore from '~/store/zustand/auth.zustand'
import { checkLogin, clearAuthState, getAuthToken } from '~/utils/auth'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sessionReady, setSessionReady] = useState(false)
  const [shouldFetchMe, setShouldFetchMe] = useState(false)

  const updateAuthToken = useAuthStore((state) => state.updateAuthToken)
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser)
  const updateEmail = useAuthStore((state) => state.updateEmail)
  const updateIsLoggedIn = useAuthStore((state) => state.updateIsLoggedIn)

  useEffect(() => {
    if (!checkLogin()) {
      clearAuthState()
      setShouldFetchMe(false)
      setSessionReady(true)
      return
    }

    const stored = getAuthToken()
    if (stored?.token) {
      updateAuthToken(stored.token)
      setShouldFetchMe(true)
    }

    setSessionReady(true)
  }, [updateAuthToken])

  const { data, isError, isFetched } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe({ skipAuthRedirect: true }),
    enabled: sessionReady && shouldFetchMe,
    retry: false,
  })

  useEffect(() => {
    if (!sessionReady || !shouldFetchMe || !isFetched) return

    const isHome = location.pathname === ApplicationRoutes.HOME

    if (data) {
      updateCurrentUser(mapMeToUser(data))
      updateEmail(data.email)
      updateIsLoggedIn(true)

      if (isHome) {
        navigate({
          to: data.has_onboarded
            ? ApplicationRoutes.DASHBOARD.index
            : ApplicationRoutes.ONBOARDING.SCHEDULE,
        })
      }
      return
    }

    if (isError) {
      clearAuthState()
      if (isHome) {
        navigate({ to: ApplicationRoutes.HOME })
      }
    }
  }, [
    sessionReady,
    shouldFetchMe,
    isFetched,
    data,
    isError,
    location.pathname,
    navigate,
    updateCurrentUser,
    updateEmail,
    updateIsLoggedIn,
  ])

  return <>{children}</>
}
