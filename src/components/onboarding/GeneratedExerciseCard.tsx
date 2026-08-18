import {
  Barbell,
  PencilSimple,
  PersonSimple,
  Trash,
} from '@phosphor-icons/react'
import type { IExercise } from '~/lib/interfaces/onboarding'

type GeneratedExerciseCardProps = {
  exercise: IExercise
  onEdit?: (exercise: IExercise) => void
  onDelete?: (exercise: IExercise) => void
}

function EquipmentIcon({ equipment }: { equipment: string }) {
  if (equipment.toLowerCase() === 'bodyweight') {
    return <PersonSimple className="size-3.5" />
  }

  return <Barbell className="size-3.5" />
}

export default function GeneratedExerciseCard({
  exercise,
  onEdit,
  onDelete,
}: GeneratedExerciseCardProps) {
  const repsLabel = exercise.reps.endsWith('s')
    ? exercise.reps
    : `${exercise.reps} reps`

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <EquipmentIcon equipment={exercise.equipment} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{exercise.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <EquipmentIcon equipment={exercise.equipment} />
          <span>{exercise.equipment}</span>
          <span aria-hidden="true">•</span>
          <span>
            {exercise.sets} sets x {repsLabel}
          </span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
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
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(exercise)}
            className="text-gray-400 transition-colors hover:text-red-500"
            aria-label={`Delete ${exercise.name}`}
          >
            <Trash className="size-5" />
          </button>
        )}
      </div>
    </div>
  )
}
