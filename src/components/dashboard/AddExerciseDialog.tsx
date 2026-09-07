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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close add exercise dialog"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-exercise-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="pr-8">
          <h2
            id="add-exercise-title"
            className="font-heading text-xl text-black"
          >
            Add Exercise
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the details for your new exercise.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-5">
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
              className="h-11 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
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
