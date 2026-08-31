export type TrainingDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export const TRAINING_DAYS: { value: TrainingDay; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

export type RoutineMode = 'manual' | 'ai'

export type FocusArea =
  | 'full-body'
  | 'upper-body'
  | 'lower-body'
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core'

export const FOCUS_AREAS: { value: FocusArea; label: string }[] = [
  { value: 'full-body', label: 'Full Body' },
  { value: 'upper-body', label: 'Upper Body' },
  { value: 'lower-body', label: 'Lower Body' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'legs', label: 'Legs' },
  { value: 'arms', label: 'Arms' },
  { value: 'core', label: 'Core' },
]

export interface IExercise {
  id: string | null
  exercise: string
  set_count: number
  rep_count: number
  kg_weight: number
  equipment_name: string
}

export interface OnboardingPayload {
  workouts: {
    workout: {
      muscle_group: FocusArea,
      day: TrainingDay,
    },
    exercises: IExercise[],
  }[]
}

export function getSortedTrainingDays(days: TrainingDay[]): TrainingDay[] {
  const order = TRAINING_DAYS.map((day) => day.value)
  return [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

export function getTrainingDayLabel(day: TrainingDay): string {
  return TRAINING_DAYS.find((entry) => entry.value === day)?.label ?? day
}

export function getFocusAreaLabels(areas: FocusArea[]): string {
  return areas
    .map(
      (area) => FOCUS_AREAS.find((entry) => entry.value === area)?.label ?? area
    )
    .join(', ')
}
