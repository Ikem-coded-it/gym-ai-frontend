import { Play, Plus } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import WorkoutDetailsHeader from '~/components/dashboard/WorkoutDetailsHeader'
import WorkoutExerciseCard from '~/components/dashboard/WorkoutExerciseCard'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import ApplicationRoutes from '~/config/routes'
import { workoutQueryKeys } from '~/lib/constants/workout'
import { findWorkoutDetail } from '~/lib/utils/workout'
import workoutService from '~/services/workout.service'

type WorkoutDetailsProps = {
  workoutId: string
}

export default function WorkoutDetails({ workoutId }: WorkoutDetailsProps) {
  const navigate = useNavigate()

  const {
    data: workouts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: workoutQueryKeys.all,
    queryFn: () => workoutService.getWorkouts(),
  })

  const workout = useMemo(() => {
    if (!workouts) return undefined
    return findWorkoutDetail(workouts, workoutId)
  }, [workouts, workoutId])

  useEffect(() => {
    if (!isLoading && !isError && workouts && !workout) {
      navigate({ to: ApplicationRoutes.DASHBOARD.index })
    }
  }, [isLoading, isError, workouts, workout, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F5F5F5]">
        <Spinner className="size-6 text-blue-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F5F5F5] px-6">
        <p className="text-sm text-destructive" role="alert">
          {error instanceof Error ? error.message : 'Failed to load workout'}
        </p>
      </div>
    )
  }

  if (!workout) {
    return null
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F5]">
      <WorkoutDetailsHeader />

      <main className="flex-1 px-6 py-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-3xl text-black">{workout.dayName}</h1>
          <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
            {workout.weekLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">{workout.focus}</p>

        <div className="mt-6 space-y-3">
          {workout.exercises.map((exercise) => (
            <WorkoutExerciseCard key={exercise.id} exercise={exercise} />
          ))}

          {workout.exercises.length === 0 && (
            <p className="text-sm text-gray-500">
              No exercises added to this workout yet.
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            className="h-auto w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 py-4 text-sm font-medium text-blue-600 hover:bg-blue-100/50"
          >
            <Plus weight="bold" className="size-4" />
            Add Exercise
          </Button>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-[#F5F5F5] px-6 py-6">
        <Button
          type="button"
          className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
        >
          <Play weight="fill" className="size-4" />
          Start Workout
        </Button>
      </footer>
    </div>
  )
}
