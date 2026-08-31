import { PencilSimple, Trash } from '@phosphor-icons/react'
import type { IExercise } from '~/lib/interfaces/onboarding'

type ExerciseListItemProps = {
  exercise: IExercise
  onEdit?: (exercise: IExercise) => void
  onDelete?: (exercise: IExercise) => void
}

export default function ExerciseListItem({
  exercise,
  onEdit,
  onDelete,
}: ExerciseListItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-4 shadow-sm">
      <div>
        <p className="font-medium text-gray-900">{exercise.exercise}</p>
        <p className="mt-1 text-sm text-gray-500">
          {exercise.set_count} sets x {exercise.rep_count} reps • {exercise.kg_weight}kg
        </p>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(exercise)}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label={`Edit ${exercise.exercise}`}
            >
              <PencilSimple className="size-5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(exercise)}
              className="text-gray-400 transition-colors hover:text-red-500"
              aria-label={`Delete ${exercise.exercise}`}
            >
              <Trash className="size-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
