import { Play, Plus } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import WorkoutDetailsHeader from '~/components/dashboard/WorkoutDetailsHeader'
import WorkoutExerciseCard from '~/components/dashboard/WorkoutExerciseCard'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import { getWorkoutDetail } from '~/lib/constants/workout'

type WorkoutDetailsProps = {
  workoutId: string
}

export default function WorkoutDetails({ workoutId }: WorkoutDetailsProps) {
  const navigate = useNavigate()
  const workout = getWorkoutDetail(workoutId)

  useEffect(() => {
    if (!workout) {
      navigate({ to: ApplicationRoutes.DASHBOARD.index })
    }
  }, [workout, navigate])

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
