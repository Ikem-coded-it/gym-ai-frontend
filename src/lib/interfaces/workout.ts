export type WorkoutSessionStatus = 'upcoming' | 'today' | 'rest'

export interface IWorkoutSession {
  id: string
  dayLabel: string
  date: number
  title: string
  exerciseCount: number
  durationMinutes: number
  status: WorkoutSessionStatus
}

export interface IWorkoutExercise {
  id: string
  name: string
  sets: number
  reps: string
  weightKg: number
}

export interface IWorkoutDetail {
  id: string
  dayName: string
  weekLabel: string
  focus: string
  exercises: IWorkoutExercise[]
}
