import type { IExercise } from '~/lib/interfaces/onboarding'

const repeat = (count: number, rep_count: number, kg_weight: number) =>
  Array.from({ length: count }, () => ({ rep_count, kg_weight }))

export const AI_GENERATED_EXERCISES: IExercise[] = [
  {
    id: 'ai-1',
    exercise: 'Barbell Squat',
    equipment_name: 'Barbell',
    sets: repeat(3, 8, 60),
  },
  {
    id: 'ai-2',
    exercise: 'Romanian Deadlift',
    equipment_name: 'Barbell',
    sets: repeat(3, 10, 50),
  },
  {
    id: 'ai-3',
    exercise: 'Plank',
    equipment_name: 'Bodyweight',
    sets: Array.from({ length: 3 }, () => ({
      rep_count: 1,
      kg_weight: 0,
      notes: '60s hold',
    })),
  },
]
