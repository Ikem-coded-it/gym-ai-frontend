import { Plus } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import WorkoutScheduleCard from '~/components/dashboard/WorkoutScheduleCard'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import { workoutQueryKeys } from '~/lib/constants/workout'
import { mapWorkoutsToSessions } from '~/lib/utils/workout'
import workoutService from '~/services/workout.service'

export default function WorkoutOverview() {
  const {
    data: workouts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: workoutQueryKeys.all,
    queryFn: () => workoutService.getWorkouts(),
  })

  const sessions = workouts ? mapWorkoutsToSessions(workouts) : []

  return (
    <div className="px-6 py-6">
      <h1 className="font-heading text-3xl text-black">Workout Plan</h1>
      <p className="mt-2 text-sm text-gray-500">
        Your blueprint for the week. Stay consistent.
      </p>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          This Week&apos;s Schedule
        </h2>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <Spinner className="size-6 text-blue-600" />
          </div>
        )}

        {isError && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error instanceof Error ? error.message : 'Failed to load workouts'}
          </p>
        )}

        {!isLoading && !isError && sessions.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">
            No workouts yet. Complete onboarding to build your weekly plan.
          </p>
        )}

        {!isLoading && !isError && sessions.length > 0 && (
          <div className="mt-4 space-y-3">
            {sessions.map((session) => (
              <WorkoutScheduleCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

      <Button
        type="button"
        variant="outline"
        className="mt-6 h-12 w-full rounded-xl border-blue-200 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
      >
        <Plus weight="bold" className="size-4" />
        Add Extra Session
      </Button>
    </div>
  )
}
