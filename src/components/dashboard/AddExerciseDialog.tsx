import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import FormField from '~/components/global/FormField'
import { Button } from '~/components/ui/button'
import type { IWorkoutExercise } from '~/lib/interfaces/workout'
import {
  manualExerciseSchema,
  type ManualExerciseFormData,
} from '~/lib/validators/onboarding'

type AddExerciseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExercise: (exercise: IWorkoutExercise) => void
}

const defaultValues: ManualExerciseFormData = {
  exercise: '',
  set_count: 3,
  rep_count: 10,
  kg_weight: 0,
  equipment_name: '',
}

export default function AddExerciseDialog({
  open,
  onOpenChange,
  onAddExercise,
}: AddExerciseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualExerciseFormData>({
    resolver: zodResolver(manualExerciseSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        reset(defaultValues)
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange, reset])

  const handleClose = () => {
    reset(defaultValues)
    onOpenChange(false)
  }

  const onSubmit = handleSubmit((data) => {
    onAddExercise({
      id: crypto.randomUUID(),
      name: data.exercise,
      sets: data.set_count,
      reps: String(data.rep_count),
      weightKg: data.kg_weight,
    })
    reset(defaultValues)
    onOpenChange(false)
  })

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close add exercise dialog"
        className="absolute inset-0 animate-in bg-foreground/40 backdrop-blur-[2px] fade-in-0 duration-150"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-exercise-title"
        className="relative z-10 max-h-[92dvh] w-full max-w-md animate-in overflow-y-auto rounded-t-3xl bg-card p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-float duration-200 fade-in-0 slide-in-from-bottom-8 sm:rounded-3xl sm:pb-6 sm:zoom-in-95 sm:slide-in-from-bottom-0"
      >
        <div aria-hidden="true" className="mx-auto -mt-2 mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="pr-8">
          <h2
            id="add-exercise-title"
            className="text-lg font-semibold text-foreground"
          >
            Add Exercise
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the details for your new exercise.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <FormField
            id="exercise-name"
            label="Exercise name"
            placeholder="e.g., Barbell Squat"
            error={errors.exercise}
            registration={register('exercise')}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="exercise-sets"
              label="Sets"
              type="number"
              placeholder="3"
              error={errors.set_count}
              registration={register('set_count', { valueAsNumber: true })}
            />
            <FormField
              id="exercise-reps"
              label="Reps"
              type="number"
              placeholder="8"
              error={errors.rep_count}
              registration={register('rep_count', { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="exercise-weight"
              label="Weight (kg)"
              type="number"
              placeholder="60"
              error={errors.kg_weight}
              registration={register('kg_weight', { valueAsNumber: true })}
            />
            <FormField
              id="exercise-equipment"
              label="Equipment"
              placeholder="Barbell"
              error={errors.equipment_name}
              registration={register('equipment_name')}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="sm:min-w-28"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="sm:min-w-28"
            >
              <Plus weight="bold" className="size-4" />
              Add Exercise
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
