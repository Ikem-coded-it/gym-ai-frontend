import { Barbell, PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardTitle } from '~/components/ui/card'
import type { IExerciseSet, IWorkoutExercise } from '~/lib/interfaces/workout'

type WorkoutExerciseCardProps = {
  exercise: IWorkoutExercise
  onDelete?: (exercise: IWorkoutExercise) => void
  onAddSet?: (exercise: IWorkoutExercise) => void
  onEditSet?: (exercise: IWorkoutExercise, set: IExerciseSet) => void
  onDeleteSet?: (exercise: IWorkoutExercise, set: IExerciseSet) => void
}

function formatSetStats(set: IExerciseSet) {
  const reps = set.reps === null ? '— reps' : `${set.reps} reps`
  return set.weightKg && set.weightKg > 0 ? `${reps} × ${set.weightKg}kg` : reps
}

export default function WorkoutExerciseCard({
  exercise,
  onDelete,
  onAddSet,
  onEditSet,
  onDeleteSet,
}: WorkoutExerciseCardProps) {
  const setCountLabel = `${exercise.sets.length} ${
    exercise.sets.length === 1 ? 'set' : 'sets'
  }`

  return (
    <Card className="py-0">
      <CardContent className="space-y-3 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Barbell className="size-5 text-primary" weight="fill" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-foreground">
              {exercise.name}
            </CardTitle>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {exercise.equipment ? `${exercise.equipment} • ` : ''}
              {setCountLabel}
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
        </div>

        {exercise.sets.length > 0 && (
          <ul className="space-y-1.5">
            {exercise.sets.map((set, index) => (
              <li
                key={set.id}
                className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2"
              >
                <span className="w-12 shrink-0 text-xs font-semibold text-primary">
                  Set {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {formatSetStats(set)}
                  </p>
                  {set.notes && (
                    <p className="truncate text-xs text-muted-foreground">
                      {set.notes}
                    </p>
                  )}
                </div>

                {onEditSet && (
                  <button
                    type="button"
                    onClick={() => onEditSet(exercise, set)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    aria-label={`Edit set ${index + 1} of ${exercise.name}`}
                  >
                    <PencilSimple className="size-4" />
                  </button>
                )}
                {onDeleteSet && (
                  <button
                    type="button"
                    onClick={() => onDeleteSet(exercise, set)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete set ${index + 1} of ${exercise.name}`}
                  >
                    <Trash className="size-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {onAddSet && (
          <button
            type="button"
            onClick={() => onAddSet(exercise)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/25 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary/60"
          >
            <Plus weight="bold" className="size-3.5" />
            Add set
          </button>
        )}
      </CardContent>
    </Card>
  )
}
