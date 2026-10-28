import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash } from '@phosphor-icons/react'
import { useFieldArray, useForm } from 'react-hook-form'
import ExerciseListItem from '~/components/onboarding/ExerciseListItem'
import { Button } from '~/components/ui/button'
import { FOCUS_AREAS, FocusArea, type IExercise } from '~/lib/interfaces/onboarding'
import {
  manualExerciseSchema,
  type ManualExerciseFormData,
} from '~/lib/validators/onboarding'
import FormField from '~/components/global/FormField'
import SelectableChip from '../global/SelectableChip'
import { useState } from 'react'

const toOptionalNumber = (value: unknown) =>
  value === '' || value == null ? undefined : Number(value)

const emptySet = () =>
  ({ rep_count: 10, kg_weight: undefined, notes: '' }) as ManualExerciseFormData['sets'][number]

const emptyExercise = (): ManualExerciseFormData => ({
  exercise: '',
  equipment_name: '',
  sets: [emptySet()],
})

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

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualExerciseFormData>({
    resolver: zodResolver(manualExerciseSchema),
    defaultValues: emptyExercise(),
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'sets' })

  const onSubmit = handleSubmit((data) => {
    onAddExercise({
      id: crypto.randomUUID(),
      exercise: data.exercise,
      equipment_name: data.equipment_name,
      sets: data.sets.map((set) => ({
        rep_count: set.rep_count,
        kg_weight: set.kg_weight ?? null,
        notes: set.notes || null,
      })),
    })
    reset(emptyExercise())
  })

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
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            id="name"
            label="Exercise name"
            placeholder="e.g., Barbell Squat"
            error={errors.exercise}
            registration={register('exercise')}
          />

          <FormField
            id="equipment"
            label="Equipment (optional)"
            placeholder="Barbell"
            error={errors.equipment_name}
            registration={register('equipment_name')}
          />

          <div className="space-y-3">
            <p className="text-[13px] font-medium text-foreground/80">Sets</p>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-xl bg-muted/60 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">
                    Set {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove set ${index + 1}`}
                    >
                      <Trash className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    id={`set-${index}-reps`}
                    label="Reps"
                    type="number"
                    placeholder="8"
                    error={errors.sets?.[index]?.rep_count}
                    registration={register(`sets.${index}.rep_count`, {
                      setValueAs: toOptionalNumber,
                    })}
                  />
                  <FormField
                    id={`set-${index}-weight`}
                    label="Weight (kg)"
                    type="number"
                    placeholder="Bodyweight"
                    error={errors.sets?.[index]?.kg_weight}
                    registration={register(`sets.${index}.kg_weight`, {
                      setValueAs: toOptionalNumber,
                    })}
                  />
                </div>
                <FormField
                  id={`set-${index}-notes`}
                  label="Notes (optional)"
                  placeholder="e.g., slow tempo"
                  error={errors.sets?.[index]?.notes}
                  registration={register(`sets.${index}.notes`)}
                />
              </div>
            ))}
            {errors.sets?.root && (
              <p className="text-sm text-destructive">{errors.sets.root.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(emptySet())}
              className="w-full border-dashed border-primary/25 text-primary"
            >
              <Plus weight="bold" className="size-3.5" />
              Add set
            </Button>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full"
          >
            <Plus weight="bold" className="size-4" />
            Add Exercise
          </Button>
        </form>
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
