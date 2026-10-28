import { Barbell, PencilSimple, Trash } from '@phosphor-icons/react'
import type { IExercise } from '~/lib/interfaces/onboarding'
import { summarizeSets } from '~/lib/utils/exercise-sets'

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
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 pr-2 shadow-card ring-1 ring-foreground/5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Barbell weight="fill" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{exercise.exercise}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {exercise.equipment_name ? `${exercise.equipment_name} • ` : ''}
          {summarizeSets(exercise.sets)}
        </p>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 items-center">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(exercise)}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Edit ${exercise.exercise}`}
            >
              <PencilSimple className="size-5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(exercise)}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
