'use client'

import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Spinner } from '~/components/ui/spinner'
import ApplicationRoutes from '~/config/routes'
import { queryClient } from '~/lib/query-client'
import { logout } from '~/utils/auth'

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    void logout().then(() => {
      queryClient.clear()
      navigate({ to: ApplicationRoutes.HOME, replace: true })
    })
  }, [navigate])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <Spinner className="size-8 text-primary" />
      <span className="sr-only">Signing out...</span>
    </div>
  )
}
