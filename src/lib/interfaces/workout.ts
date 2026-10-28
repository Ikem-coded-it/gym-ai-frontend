export type WorkoutSessionStatus = 'upcoming' | 'today' | 'rest'

/** One set of an exercise (GET /workout, set endpoints) */
export interface IExerciseSetResponse {
  id: string
  workout_exercise_id: string
  rep_count: number | null
  kg_weight: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

/** GET /workout exercise item */
export interface IWorkoutExerciseResponse {
  id: string
  workout_id: string
  exercise: string
  equipment_name: string | null
  exercise_sets: IExerciseSetResponse[]
  created_at: string
  updated_at: string
}

/** POST /workout/{id}/exercises/{exerciseId}/sets body */
export interface IAddExerciseSetPayload {
  rep_count: number
  kg_weight?: number | null
  notes?: string | null
}

/** PATCH /workout/{id}/exercises/{exerciseId}/sets/{setId} body */
export type IUpdateExerciseSetPayload = Partial<IAddExerciseSetPayload>

/** POST /workout/{id}/exercises body */
export interface IAddWorkoutExercisePayload {
  exercise: string
  equipment_name?: string | null
  sets?: IAddExerciseSetPayload[]
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

export interface IExerciseSet {
  id: string
  reps: number | null
  weightKg: number | null
  notes: string | null
}

export interface IWorkoutExercise {
  id: string
  name: string
  equipment: string | null
  sets: IExerciseSet[]
}

export interface IWorkoutDetail {
  id: string
  dayName: string
  weekLabel: string
  focus: string
  exercises: IWorkoutExercise[]
}
