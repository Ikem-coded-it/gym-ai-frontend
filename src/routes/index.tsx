import { createFileRoute } from '@tanstack/react-router'
import Welcome from '~/components/pages/Welcome'

export const Route = createFileRoute('/')({
  component: Welcome,
})
