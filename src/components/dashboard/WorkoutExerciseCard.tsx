import { Barbell, PencilSimple, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardTitle } from '~/components/ui/card'
import type { IWorkoutExercise } from '~/lib/interfaces/workout'

type WorkoutExerciseCardProps = {
  exercise: IWorkoutExercise
  onEdit?: (exercise: IWorkoutExercise) => void
  onDelete?: (exercise: IWorkoutExercise) => void
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
  onDelete,
}: WorkoutExerciseCardProps) {
  return (
    <Card className="py-0">
      <CardContent className="flex items-center gap-3 px-3 py-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <Barbell className="size-5 text-primary" weight="fill" />
        </div>

        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-foreground">
            {exercise.name}
          </CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatExerciseStats(exercise)}
          </p>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(exercise)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete ${exercise.name}`}
          >
            <Trash className="size-5" />
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(exercise)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Edit ${exercise.name}`}
          >
            <PencilSimple className="size-5" />
          </button>
        )}
      </CardContent>
    </Card>
  )
}
