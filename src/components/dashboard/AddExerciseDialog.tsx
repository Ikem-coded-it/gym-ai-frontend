import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import FormField from '~/components/global/FormField'
import { Button } from '~/components/ui/button'
import {
  workoutExerciseSchema,
  type WorkoutExerciseFormData,
} from '~/lib/validators/workout'

type AddExerciseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Resolves once saved; reject to keep the dialog open. */
  onAddExercise: (exercise: WorkoutExerciseFormData) => Promise<unknown>
  isSubmitting?: boolean
}

const defaultValues: WorkoutExerciseFormData = {
  exercise: '',
  equipment_name: '',
}

export default function AddExerciseDialog({
  open,
  onOpenChange,
  onAddExercise,
  isSubmitting = false,
}: AddExerciseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkoutExerciseFormData>({
    resolver: zodResolver(workoutExerciseSchema),
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onAddExercise(data)
    } catch {
      // The parent reports the error; keep the dialog open so nothing is lost.
      return
    }
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
            Name the exercise and its equipment, then add sets to it.
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

          <FormField
            id="exercise-equipment"
            label="Equipment (optional)"
            placeholder="Barbell"
            error={errors.equipment_name}
            registration={register('equipment_name')}
          />

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
              disabled={isSubmitting}
              className="sm:min-w-28"
            >
              <Plus weight="bold" className="size-4" />
              {isSubmitting ? 'Adding...' : 'Add Exercise'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
