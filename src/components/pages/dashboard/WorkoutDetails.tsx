import { Barbell, Plus } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import AddExerciseDialog from '~/components/dashboard/AddExerciseDialog'
import WorkoutDetailsHeader from '~/components/dashboard/WorkoutDetailsHeader'
import WorkoutExerciseCard from '~/components/dashboard/WorkoutExerciseCard'
import EmptyState from '~/components/global/EmptyState'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import ApplicationRoutes from '~/config/routes'
import { workoutQueryKeys } from '~/lib/constants/workout'
import type { IWorkoutExercise } from '~/lib/interfaces/workout'
import { findWorkoutDetail } from '~/lib/utils/workout'
import workoutService from '~/services/workout.service'

type WorkoutDetailsProps = {
  workoutId: string
}

export default function WorkoutDetails({ workoutId }: WorkoutDetailsProps) {
  const navigate = useNavigate()
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)
  const [exercises, setExercises] = useState<IWorkoutExercise[]>([])

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
    if (workout) {
      setExercises(workout.exercises)
    }
  }, [workout])

  useEffect(() => {
    if (!isLoading && !isError && workouts && !workout) {
      navigate({ to: ApplicationRoutes.DASHBOARD.index })
    }
  }, [isLoading, isError, workouts, workout, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="size-6 text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6">
        <p
          className="w-full max-w-md rounded-2xl bg-destructive/10 px-4 py-3 text-center text-sm text-destructive"
          role="alert"
        >
          {error instanceof Error ? error.message : 'Failed to load workout'}
        </p>
      </div>
    )
  }

  if (!workout) {
    return null
  }

  const handleAddExercise = (exercise: IWorkoutExercise) => {
    setExercises((current) => [...current, exercise])
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <WorkoutDetailsHeader
        workoutId={workoutId}
        workoutLabel={workout.dayName}
      />

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-3xl text-foreground">{workout.dayName}</h1>
          <span className="mt-1 shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            {workout.weekLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{workout.focus}</p>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Exercises
          </h2>

          <div className="mt-3 space-y-3">
            {exercises.map((exercise) => (
              <WorkoutExerciseCard key={exercise.id} exercise={exercise} />
            ))}

            {exercises.length === 0 && (
              <EmptyState
                icon={Barbell}
                title="No exercises added to this workout yet."
              />
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddExerciseOpen(true)}
              className="h-auto w-full rounded-2xl border-2 border-dashed border-primary/25 bg-transparent py-4 text-primary shadow-none hover:bg-secondary/60"
            >
              <Plus weight="bold" className="size-4" />
              Add Exercise
            </Button>
          </div>
        </section>
      </main>

      <AddExerciseDialog
        open={isAddExerciseOpen}
        onOpenChange={setIsAddExerciseOpen}
        onAddExercise={handleAddExercise}
      />
    </div>
  )
}
