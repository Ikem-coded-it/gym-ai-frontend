import { PencilSimple } from '@phosphor-icons/react'
import type { IExercise } from '~/lib/interfaces/onboarding'

type ExerciseListItemProps = {
  exercise: IExercise
  onEdit?: (exercise: IExercise) => void
}

export default function ExerciseListItem({
  exercise,
  onEdit,
}: ExerciseListItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-4 shadow-sm">
      <div>
        <p className="font-medium text-gray-900">{exercise.name}</p>
        <p className="mt-1 text-sm text-gray-500">
          {exercise.sets} sets x {exercise.reps} reps • {exercise.weightKg}kg
        </p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(exercise)}
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label={`Edit ${exercise.name}`}
        >
          <PencilSimple className="size-5" />
        </button>
      )}
    </div>
  )
}
