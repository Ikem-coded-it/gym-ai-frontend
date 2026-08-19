import { createFileRoute } from '@tanstack/react-router'
import WorkoutOverview from '~/components/pages/dashboard/WorkoutOverview'

export const Route = createFileRoute('/dashboard/')({
  component: WorkoutOverview,
})
