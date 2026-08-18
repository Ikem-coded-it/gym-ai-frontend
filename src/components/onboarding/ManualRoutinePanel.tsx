import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import AuthFormField from '~/components/auth/AuthFormField'
import ExerciseListItem from '~/components/onboarding/ExerciseListItem'
import { Button } from '~/components/ui/button'
import type { IExercise } from '~/lib/interfaces/onboarding'
import {
  manualExerciseSchema,
  type ManualExerciseFormData,
} from '~/lib/validators/onboarding'

type ManualRoutinePanelProps = {
  exercises: IExercise[]
  onAddExercise: (exercise: IExercise) => void
}

export default function ManualRoutinePanel({
  exercises,
  onAddExercise,
}: ManualRoutinePanelProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualExerciseFormData>({
    resolver: zodResolver(manualExerciseSchema),
    defaultValues: {
      name: '',
      sets: 3,
      reps: '5-8',
      weightKg: 0,
      equipment: '',
    },
  })

  const onSubmit = handleSubmit((data) => {
    onAddExercise({
      id: crypto.randomUUID(),
      name: data.name,
      sets: data.sets,
      reps: data.reps,
      weightKg: data.weightKg,
      equipment: data.equipment,
    })
    reset({
      name: '',
      sets: 3,
      reps: '5-8',
      weightKg: 0,
      equipment: '',
    })
  })

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-5">
          <AuthFormField
            id="name"
            label="Exercise name"
            placeholder="e.g., Barbell Squat"
            error={errors.name}
            registration={register('name')}
          />

          <div className="grid grid-cols-2 gap-4">
            <AuthFormField
              id="sets"
              label="Sets"
              type="number"
              placeholder="3"
              error={errors.sets}
              registration={register('sets', { valueAsNumber: true })}
            />
            <AuthFormField
              id="reps"
              label="Reps"
              placeholder="5-8"
              error={errors.reps}
              registration={register('reps')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AuthFormField
              id="weightKg"
              label="Weight (kg)"
              type="number"
              placeholder="60"
              error={errors.weightKg}
              registration={register('weightKg', { valueAsNumber: true })}
            />
            <AuthFormField
              id="equipment"
              label="Equipment"
              placeholder="Barbell"
              error={errors.equipment}
              registration={register('equipment')}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            className="h-11 w-full rounded-lg border-blue-200 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            <Plus weight="bold" className="size-4" />
            Add Exercise
          </Button>
        </form>
      </div>

      {exercises.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading text-lg text-black">Current Routine</h3>
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <ExerciseListItem key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
