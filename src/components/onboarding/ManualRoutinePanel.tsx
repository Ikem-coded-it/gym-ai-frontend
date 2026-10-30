import ExerciseForm from '~/components/onboarding/ExerciseForm'
import ExerciseListItem from '~/components/onboarding/ExerciseListItem'
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

  return (
    <div className="space-y-6">
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

      <div className="rounded-2xl bg-card p-5 shadow-card ring-1 ring-foreground/5">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          Add an exercise
        </h3>
        <ExerciseForm
          idPrefix="manual"
          submitLabel="Add Exercise"
          resetOnSubmit
          onSubmit={(exercise) =>
            onAddExercise({ id: crypto.randomUUID(), ...exercise })
          }
        />
      </div>

      {exercises.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Current Routine
            </h3>
            <span className="text-xs font-medium text-muted-foreground">
              {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}
            </span>
          </div>
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                onDelete={() => onDeleteExercise(exercise.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
