import { createFileRoute } from '@tanstack/react-router'
import Logout from '~/components/pages/Logout'

export const Route = createFileRoute('/auth/logout')({
  component: Logout,
})
