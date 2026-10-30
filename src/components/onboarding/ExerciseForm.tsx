import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import FormField from '~/components/global/FormField'
import { Button } from '~/components/ui/button'
import type { IExercise } from '~/lib/interfaces/onboarding'
import {
  manualExerciseSchema,
  type ManualExerciseFormData,
} from '~/lib/validators/onboarding'

const toOptionalNumber = (value: unknown) =>
  value === '' || value == null ? undefined : Number(value)

const emptySet = () =>
  ({ rep_count: 10, kg_weight: undefined, notes: '' }) as ManualExerciseFormData['sets'][number]

const emptyExercise = (): ManualExerciseFormData => ({
  exercise: '',
  equipment_name: '',
  sets: [emptySet()],
})

function toFormValues(exercise?: IExercise | null): ManualExerciseFormData {
  if (!exercise) return emptyExercise()
  return {
    exercise: exercise.exercise,
    equipment_name: exercise.equipment_name ?? '',
    sets: exercise.sets.length
      ? exercise.sets.map((set) => ({
          rep_count: set.rep_count,
          kg_weight: set.kg_weight ?? undefined,
          notes: set.notes ?? '',
        }))
      : [emptySet()],
  }
}

type ExerciseFormProps = {
  /** Exercise being edited. Omit to start from an empty form. */
  exercise?: IExercise | null
  submitLabel: string
  onSubmit: (exercise: Omit<IExercise, 'id'>) => void
  /** Clear the form after submitting (used for repeated adds). */
  resetOnSubmit?: boolean
  onCancel?: () => void
  idPrefix?: string
}

/** Name, equipment and a list of sets (reps, weight, notes) for one exercise. */
export default function ExerciseForm({
  exercise,
  submitLabel,
  onSubmit,
  resetOnSubmit = false,
  onCancel,
  idPrefix = 'exercise',
}: ExerciseFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualExerciseFormData>({
    resolver: zodResolver(manualExerciseSchema),
    defaultValues: toFormValues(exercise),
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'sets' })

  useEffect(() => {
    reset(toFormValues(exercise))
  }, [exercise, reset])

  const submit = handleSubmit((data) => {
    onSubmit({
      exercise: data.exercise,
      equipment_name: data.equipment_name,
      sets: data.sets.map((set) => ({
        rep_count: set.rep_count,
        kg_weight: set.kg_weight ?? null,
        notes: set.notes || null,
      })),
    })
    if (resetOnSubmit) reset(emptyExercise())
  })

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField
        id={`${idPrefix}-name`}
        label="Exercise name"
        placeholder="e.g., Barbell Squat"
        error={errors.exercise}
        registration={register('exercise')}
      />

      <FormField
        id={`${idPrefix}-equipment`}
        label="Equipment (optional)"
        placeholder="Barbell"
        error={errors.equipment_name}
        registration={register('equipment_name')}
      />

      <div className="space-y-3">
        <p className="text-[13px] font-medium text-foreground/80">Sets</p>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-xl bg-muted/60 p-3">
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
                id={`${idPrefix}-set-${index}-reps`}
                label="Reps"
                type="number"
                placeholder="8"
                error={errors.sets?.[index]?.rep_count}
                registration={register(`sets.${index}.rep_count`, {
                  setValueAs: toOptionalNumber,
                })}
              />
              <FormField
                id={`${idPrefix}-set-${index}-weight`}
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
              id={`${idPrefix}-set-${index}-notes`}
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

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="sm:min-w-28"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="secondary"
          className={onCancel ? 'sm:min-w-28' : 'w-full'}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
