import type {
  IExercise,
  IOnboardingExercisePayload,
  OnboardingPayload,
  TrainingDay,
} from '~/lib/interfaces/onboarding'
import type { DayRoutine } from '~/store/zustand/onboarding.zustand'

/** API exercises (no id) -> onboarding exercises the UI can key and edit. */
export function withExerciseIds(
  exercises: IOnboardingExercisePayload[]
): IExercise[] {
  return exercises.map((exercise) => ({
    id: crypto.randomUUID(),
    exercise: exercise.exercise,
    equipment_name: exercise.equipment_name ?? '',
    sets: exercise.sets,
  }))
}

export function buildOnboardingPayload(
  sortedDays: TrainingDay[],
  routines: Partial<Record<TrainingDay, DayRoutine>>
): OnboardingPayload {
  return {
    workouts: sortedDays.map((day) => {
      const routine = routines[day]
      if (!routine) {
        throw new Error(`Missing routine for ${day}`)
      }

      return {
        workout: {
          muscle_group: routine.focusAreas.join(','),
          day,
        },
        exercises: routine.exercises.map((exercise) => ({
          exercise: exercise.exercise,
          equipment_name: exercise.equipment_name || null,
          sets: exercise.sets.map((set) => ({
            rep_count: set.rep_count,
            kg_weight: set.kg_weight ?? null,
            notes: set.notes || null,
          })),
        })),
      }
    }),
  }
}
