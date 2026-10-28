import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import FormField from '~/components/global/FormField'
import { Button } from '~/components/ui/button'
import type { IExerciseSet } from '~/lib/interfaces/workout'
import {
  exerciseSetSchema,
  type ExerciseSetFormData,
} from '~/lib/validators/workout'

type ExerciseSetDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exerciseName: string
  /** The set being edited. Omit to add a new set. */
  set?: IExerciseSet | null
  /** Resolves once saved; reject to keep the dialog open. */
  onSubmit: (data: ExerciseSetFormData) => Promise<unknown>
  isSubmitting?: boolean
}

const emptyValues = {
  rep_count: undefined,
  kg_weight: undefined,
  notes: '',
} as unknown as ExerciseSetFormData

function valuesFor(set?: IExerciseSet | null): ExerciseSetFormData {
  if (!set) return emptyValues
  return {
    rep_count: set.reps ?? (undefined as unknown as number),
    kg_weight: set.weightKg ?? undefined,
    notes: set.notes ?? '',
  }
}

export default function ExerciseSetDialog({
  open,
  onOpenChange,
  exerciseName,
  set,
  onSubmit,
  isSubmitting = false,
}: ExerciseSetDialogProps) {
  const isEdit = Boolean(set)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseSetFormData>({
    resolver: zodResolver(exerciseSetSchema),
    defaultValues: emptyValues,
  })

  // Re-seed the form each time the dialog opens (add vs. edit a particular set).
  useEffect(() => {
    if (open) reset(valuesFor(set))
  }, [open, set, reset])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch {
      // The parent reports the error; keep the dialog open so nothing is lost.
      return
    }
    onOpenChange(false)
  })

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close set dialog"
        className="absolute inset-0 animate-in bg-foreground/40 backdrop-blur-[2px] fade-in-0 duration-150"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-set-title"
        className="relative z-10 max-h-[92dvh] w-full max-w-md animate-in overflow-y-auto rounded-t-3xl bg-card p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-float duration-200 fade-in-0 slide-in-from-bottom-8 sm:rounded-3xl sm:pb-6 sm:zoom-in-95 sm:slide-in-from-bottom-0"
      >
        <div aria-hidden="true" className="mx-auto -mt-2 mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="pr-8">
          <h2
            id="exercise-set-title"
            className="text-lg font-semibold text-foreground"
          >
            {isEdit ? 'Edit set' : 'Add set'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{exerciseName}</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="set-reps"
              label="Reps"
              type="number"
              placeholder="10"
              error={errors.rep_count}
              registration={register('rep_count', {
                setValueAs: (value) =>
                  value === '' || value == null ? undefined : Number(value),
              })}
            />
            <FormField
              id="set-weight"
              label="Weight (kg)"
              type="number"
              placeholder="Bodyweight"
              error={errors.kg_weight}
              registration={register('kg_weight', {
                setValueAs: (value) =>
                  value === '' || value == null ? undefined : Number(value),
              })}
            />
          </div>

          <FormField
            id="set-notes"
            label="Notes (optional)"
            placeholder="e.g., felt heavy, slow tempo"
            error={errors.notes}
            registration={register('notes')}
          />

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:min-w-28"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="sm:min-w-28">
              {!isEdit && <Plus weight="bold" className="size-4" />}
              {isSubmitting ? 'Saving...' : isEdit ? 'Save set' : 'Add set'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
