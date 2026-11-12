import { Plus } from '@phosphor-icons/react'
import ExerciseForm from '~/components/onboarding/ExerciseForm'
import ExerciseListItem from '~/components/onboarding/ExerciseListItem'
import { Button } from '~/components/ui/button'
import { FOCUS_AREAS, FocusArea, type IExercise } from '~/lib/interfaces/onboarding'
import SelectableChip from '../global/SelectableChip'
import { useState } from 'react'

type ManualRoutinePanelProps = {
  exercises: IExercise[]
  onAddExercise: (exercise: IExercise) => void
  onDeleteExercise: (exerciseId: string) => void
  selectedFocusAreas: FocusArea[]
  onToggleFocusArea: (area: FocusArea) => void
}

export default function ManualRoutinePanel({
  exercises,
  onAddExercise,
  onDeleteExercise,
  selectedFocusAreas,
  onToggleFocusArea,
}: ManualRoutinePanelProps) {
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            What are you training?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Select the muscle groups this day&apos;s workout focuses on.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map((area) => (
            <SelectableChip
              key={area.value}
              label={area.label}
              value={area.value}
              selected={selectedFocusAreas.includes(area.value)}
              onSelect={(value) => {
                onToggleFocusArea(value)
                if (error) setError(null)
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Create your exercises
            </h3>
            <span className="text-xs font-medium text-muted-foreground">
              {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Create exercises for the muscle groups you selected.
          </p>
        </div>

        {exercises.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No exercises yet. Add your first one below.
          </p>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                onDelete={() => onDeleteExercise(exercise.id)}
              />
            ))}
          </div>
        )}
      </div>

      {isFormOpen ? (
        <div className="rounded-2xl bg-card p-5 shadow-card ring-1 ring-foreground/5">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            Add an exercise
          </h3>
          <ExerciseForm
            idPrefix="manual"
            submitLabel="Save Exercise"
            onCancel={() => setIsFormOpen(false)}
            onSubmit={(exercise) => {
              onAddExercise({ id: crypto.randomUUID(), ...exercise })
              setIsFormOpen(false)
            }}
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setIsFormOpen(true)}
          className="w-full border-2 border-dashed border-primary/25 bg-transparent text-sm text-primary shadow-none hover:bg-secondary/60"
        >
          <Plus weight="bold" className="size-4" />
          Add Exercise
        </Button>
      )}
    </div>
  )
}
