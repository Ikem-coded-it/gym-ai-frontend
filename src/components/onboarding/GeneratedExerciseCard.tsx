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
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 pr-2 shadow-card ring-1 ring-foreground/5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary [&_svg]:size-5">
        <EquipmentIcon equipment={exercise.equipment} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{exercise.name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <EquipmentIcon equipment={exercise.equipment} />
          <span>{exercise.equipment}</span>
          <span aria-hidden="true">•</span>
          <span>
            {exercise.sets} sets x {repsLabel}
          </span>
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(exercise)}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Edit ${exercise.name}`}
          >
            <PencilSimple className="size-5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(exercise)}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete ${exercise.name}`}
          >
            <Trash className="size-5" />
          </button>
        )}
      </div>
    </div>
  )
}
