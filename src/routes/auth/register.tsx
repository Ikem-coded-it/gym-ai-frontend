import { createFileRoute } from '@tanstack/react-router'
import Register from '~/components/pages/Register'

export const Route = createFileRoute('/auth/register')({
  component: Register,
})
