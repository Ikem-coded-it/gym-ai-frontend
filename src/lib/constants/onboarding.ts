import type { IExercise } from '~/lib/interfaces/onboarding'

export const AI_GENERATED_EXERCISES: IExercise[] = [
  {
    id: 'ai-1',
    name: 'Barbell Squat',
    sets: 3,
    reps: '8',
    weightKg: 60,
    equipment: 'Barbell',
  },
  {
    id: 'ai-2',
    name: 'Romanian Deadlift',
    sets: 3,
    reps: '10',
    weightKg: 50,
    equipment: 'Barbell',
  },
  {
    id: 'ai-3',
    name: 'Plank',
    sets: 3,
    reps: '60s',
    weightKg: 0,
    equipment: 'Bodyweight',
  },
]
