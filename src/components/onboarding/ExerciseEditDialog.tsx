import { X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import ExerciseForm from '~/components/onboarding/ExerciseForm'
import type { IExercise } from '~/lib/interfaces/onboarding'

type ExerciseEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Exercise to edit. Omit to add a new one. */
  exercise?: IExercise | null
  onSubmit: (exercise: Omit<IExercise, 'id'>) => void
}

export default function ExerciseEditDialog({
  open,
  onOpenChange,
  exercise,
  onSubmit,
}: ExerciseEditDialogProps) {
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

  if (!open || typeof document === 'undefined') {
    return null
  }

  const isEdit = Boolean(exercise)

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close exercise dialog"
        className="absolute inset-0 animate-in bg-foreground/40 backdrop-blur-[2px] fade-in-0 duration-150"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-exercise-title"
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

        <h2
          id="onboarding-exercise-title"
          className="pr-8 text-lg font-semibold text-foreground"
        >
          {isEdit ? 'Edit exercise' : 'Add exercise'}
        </h2>

        <div className="mt-6">
          <ExerciseForm
            idPrefix="dialog"
            exercise={exercise}
            submitLabel={isEdit ? 'Save changes' : 'Add exercise'}
            onSubmit={(data) => {
              onSubmit(data)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
