import { createFileRoute } from '@tanstack/react-router'
import VerifyEmail from '~/components/pages/VerifyEmail'

export const Route = createFileRoute('/auth/verify-email')({
  component: VerifyEmail,
})
