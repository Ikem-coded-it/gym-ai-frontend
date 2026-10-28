import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import SelectableChip from '~/components/global/SelectableChip'
import { Button } from '~/components/ui/button'
import {
  FOCUS_AREAS,
  TRAINING_DAYS,
  type FocusArea,
  type TrainingDay,
} from '~/lib/interfaces/onboarding'
import {
  createWorkoutSchema,
  type CreateWorkoutFormData,
} from '~/lib/validators/workout'

type Step = 'day' | 'focus'

type AddWorkoutSessionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Weekdays that already have a workout; they can't be picked. */
  takenDays: string[]
  /** Resolves once the workout is created; reject to keep the dialog open. */
  onCreate: (data: CreateWorkoutFormData) => Promise<unknown>
  isSubmitting?: boolean
}

export default function AddWorkoutSessionDialog({
  open,
  onOpenChange,
  takenDays,
  onCreate,
  isSubmitting = false,
}: AddWorkoutSessionDialogProps) {
  const [step, setStep] = useState<Step>('day')

  const {
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CreateWorkoutFormData>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: { focus_areas: [] },
  })

  const selectedDay = watch('day') as TrainingDay | undefined
  const focusAreas = (watch('focus_areas') ?? []) as FocusArea[]
  const availableDays = TRAINING_DAYS.filter(
    (day) => !takenDays.includes(day.value)
  )

  // Start from the first step each time the dialog opens.
  useEffect(() => {
    if (open) {
      reset({ focus_areas: [] })
      setStep('day')
    }
  }, [open, reset])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onOpenChange(false)
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange, isSubmitting])

  const toggleFocusArea = (area: FocusArea) => {
    const next = focusAreas.includes(area)
      ? focusAreas.filter((item) => item !== area)
      : [...focusAreas, area]
    setValue('focus_areas', next, { shouldValidate: true })
  }

  const handleNext = async () => {
    if (await trigger('day')) setStep('focus')
  }

  const submit = handleSubmit(async (data) => {
    try {
      await onCreate(data)
    } catch {
      // The parent reports the error; keep the dialog open so nothing is lost.
    }
  })

  const handleClose = () => {
    if (!isSubmitting) onOpenChange(false)
  }

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close add session dialog"
        className="absolute inset-0 animate-in bg-foreground/40 backdrop-blur-[2px] fade-in-0 duration-150"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-session-title"
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
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step {step === 'day' ? 1 : 2} of 2
          </p>
          <h2
            id="add-session-title"
            className="mt-1 text-lg font-semibold text-foreground"
          >
            {step === 'day' ? 'Which day?' : 'What are you training?'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === 'day'
              ? 'Pick a day without a workout. You can add exercises next.'
              : 'Choose one or more focus areas for this session.'}
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-6">
          {step === 'day' && (
            <div className="space-y-3">
              {availableDays.length === 0 ? (
                <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  Every day of the week already has a workout. Delete one to
                  add a new session.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day) => (
                    <SelectableChip
                      key={day.value}
                      label={day.label}
                      value={day.value}
                      selected={selectedDay === day.value}
                      onSelect={(value) =>
                        setValue('day', value, { shouldValidate: true })
                      }
                    />
                  ))}
                </div>
              )}
              {errors.day && (
                <p className="text-sm text-destructive">{errors.day.message}</p>
              )}
            </div>
          )}

          {step === 'focus' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <SelectableChip
                    key={area.value}
                    label={area.label}
                    value={area.value}
                    selected={focusAreas.includes(area.value)}
                    onSelect={toggleFocusArea}
                  />
                ))}
              </div>
              {errors.focus_areas && (
                <p className="text-sm text-destructive">
                  {errors.focus_areas.message}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {step === 'day' ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="sm:min-w-28"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={availableDays.length === 0}
                  className="sm:min-w-28"
                >
                  Next
                  <ArrowRight weight="bold" className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('day')}
                  disabled={isSubmitting}
                  className="sm:min-w-28"
                >
                  <ArrowLeft weight="bold" className="size-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:min-w-28"
                >
                  {isSubmitting ? 'Creating...' : 'Create workout'}
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
