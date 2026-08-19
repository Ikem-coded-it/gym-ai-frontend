import { createFileRoute } from '@tanstack/react-router'
import WorkoutDetails from '~/components/pages/dashboard/WorkoutDetails'

export const Route = createFileRoute('/dashboard/workout/$workoutId')({
  component: WorkoutDetailsRoute,
})

function WorkoutDetailsRoute() {
  const { workoutId } = Route.useParams()

  return <WorkoutDetails workoutId={workoutId} />
}
