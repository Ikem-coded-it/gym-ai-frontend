import { CalendarBlank, Plus } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import WorkoutScheduleCard from '~/components/dashboard/WorkoutScheduleCard'
import EmptyState from '~/components/global/EmptyState'
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
    <div className="mx-auto w-full max-w-md px-6 py-6">
      <h1 className="font-heading text-3xl text-foreground">Workout Plan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your blueprint for the week. Stay consistent.
      </p>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          This Week&apos;s Schedule
        </h2>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <Spinner className="size-6 text-primary" />
          </div>
        )}

        {isError && (
          <p
            className="mt-3 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error instanceof Error ? error.message : 'Failed to load workouts'}
          </p>
        )}

        {!isLoading && !isError && sessions.length === 0 && (
          <EmptyState
            icon={CalendarBlank}
            title="No workouts yet."
            description="Complete onboarding to build your weekly plan."
            className="mt-3"
          />
        )}

        {!isLoading && !isError && sessions.length > 0 && (
          <div className="mt-3 space-y-3">
            {sessions.map((session) => (
              <WorkoutScheduleCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="mt-6 w-full text-sm"
      >
        <Plus weight="bold" className="size-4" />
        Add Extra Session
      </Button>
    </div>
  )
}
