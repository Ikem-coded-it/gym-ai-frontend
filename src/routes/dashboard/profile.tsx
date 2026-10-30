import { createFileRoute } from '@tanstack/react-router'
import Profile from '~/components/pages/dashboard/Profile'

export const Route = createFileRoute('/dashboard/profile')({
  component: Profile,
})
