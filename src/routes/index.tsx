import { createFileRoute } from '@tanstack/react-router'
import Landing from '~/components/pages/Landing'

export const Route = createFileRoute('/')({
  component: Landing,
})
