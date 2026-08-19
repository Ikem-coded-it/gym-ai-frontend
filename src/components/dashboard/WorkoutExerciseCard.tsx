import { Barbell, PencilSimple } from '@phosphor-icons/react'
import { Card, CardContent, CardTitle } from '~/components/ui/card'
import type { IWorkoutExercise } from '~/lib/interfaces/workout'

type WorkoutExerciseCardProps = {
  exercise: IWorkoutExercise
  onEdit?: (exercise: IWorkoutExercise) => void
}

function formatExerciseStats(exercise: IWorkoutExercise) {
  const repsLabel = exercise.reps.endsWith('s')
    ? exercise.reps
    : `${exercise.reps} reps`

  if (exercise.weightKg > 0) {
    return `${exercise.sets} sets × ${repsLabel} @ ${exercise.weightKg}kg`
  }

  return `${exercise.sets} sets × ${repsLabel}`
}

export default function WorkoutExerciseCard({
  exercise,
  onEdit,
}: WorkoutExerciseCardProps) {
  return (
    <Card className="rounded-xl bg-white py-0 shadow-sm ring-0">
      <CardContent className="flex items-center gap-3 py-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <Barbell className="size-5 text-blue-600" weight="fill" />
        </div>

        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-base font-semibold text-gray-900">
            {exercise.name}
          </CardTitle>
          <p className="mt-1 text-sm text-gray-500">
            {formatExerciseStats(exercise)}
          </p>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(exercise)}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
            aria-label={`Edit ${exercise.name}`}
          >
            <PencilSimple className="size-5" />
          </button>
        )}
      </CardContent>
    </Card>
  )
}
