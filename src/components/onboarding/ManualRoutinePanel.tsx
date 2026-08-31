import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
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
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualExerciseFormData>({
    resolver: zodResolver(manualExerciseSchema),
    defaultValues: {
      exercise: '',
      set_count: 3,
      rep_count: 10,
      kg_weight: 0,
      equipment_name: '',
    },
  })

  const onSubmit = handleSubmit((data) => {
    onAddExercise({
      id: crypto.randomUUID(),
      exercise: data.exercise,
      set_count: data.set_count,
      rep_count: data.rep_count,
      kg_weight: data.kg_weight,
      equipment_name: data.equipment_name,
    })
    reset({
      exercise: '',
      set_count: 3,
      rep_count: 10,
      kg_weight: 0,
      equipment_name: '',
    })
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
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

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            id="name"
            label="Exercise name"
            placeholder="e.g., Barbell Squat"
            error={errors.exercise}
            registration={register('exercise')}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="sets"
              label="Sets"
              type="number"
              placeholder="3"
              error={errors.set_count}
              registration={register('set_count', { valueAsNumber: true })}
            />
            <FormField
              id="reps"
              label="Reps"
              type="number"
              placeholder="8"
              error={errors.rep_count}
              registration={register('rep_count')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="weightKg"
              label="Weight (kg)"
              type="number"
              placeholder="60"
              error={errors.kg_weight}
              registration={register('kg_weight', { valueAsNumber: true })}
            />
            <FormField
              id="equipment"
              label="Equipment"
              placeholder="Barbell"
              error={errors.equipment_name}
              registration={register('equipment_name')}
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
