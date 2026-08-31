export type WorkoutSessionStatus = 'upcoming' | 'today' | 'rest'

/** GET /workout exercise item */
export interface IWorkoutExerciseResponse {
  id: string
  workout_id: string
  exercise: string
  set_count: number
  rep_count: number
  kg_weight: number
  equipment_name: string
  created_at: string
  updated_at: string
}

/** GET /workout item */
export interface IWorkoutResponse {
  id: string
  user_id: string
  muscle_group: string
  day: string
  created_at: string
  updated_at: string
  exercises: IWorkoutExerciseResponse[]
}

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
