import { TRAINING_DAYS, type TrainingDay } from '~/lib/interfaces/onboarding'
import type {
  IWorkoutDetail,
  IWorkoutExercise,
  IWorkoutExerciseResponse,
  IWorkoutResponse,
  IWorkoutSession,
  WorkoutSessionStatus,
} from '~/lib/interfaces/workout'

const DAY_ORDER = TRAINING_DAYS.map((day) => day.value)

const ESTIMATED_MINUTES_PER_EXERCISE = 8

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function sortWorkoutsByDay(workouts: IWorkoutResponse[]): IWorkoutResponse[] {
  return [...workouts].sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.day as TrainingDay) -
      DAY_ORDER.indexOf(b.day as TrainingDay),
  )
}

function getDayLabel(day: string) {
  return day.slice(0, 3).toUpperCase()
}

function formatMuscleGroupTitle(muscleGroup: string) {
  return muscleGroup
    .split(',')
    .map((area) => capitalize(area.trim().replace(/-/g, ' ')))
    .join(' & ')
}

function getWeekdayDate(day: string) {
  const dayIndex = DAY_ORDER.indexOf(day as TrainingDay)
  if (dayIndex === -1) return new Date().getDate()

  const today = new Date()
  const currentDayIndex = (today.getDay() + 6) % 7
  const date = new Date(today)
  date.setDate(today.getDate() + (dayIndex - currentDayIndex))

  return date.getDate()
}

function getSessionStatus(day: string): WorkoutSessionStatus {
  const todayName = DAY_ORDER[(new Date().getDay() + 6) % 7]
  return day === todayName ? 'today' : 'upcoming'
}

function mapExerciseToUi(exercise: IWorkoutExerciseResponse): IWorkoutExercise {
  return {
    id: exercise.id,
    name: exercise.exercise,
    sets: exercise.set_count,
    reps: String(exercise.rep_count),
    weightKg: exercise.kg_weight,
  }
}

export function mapWorkoutToSession(workout: IWorkoutResponse): IWorkoutSession {
  const exerciseCount = workout.exercises.length

  return {
    id: workout.id,
    dayLabel: getDayLabel(workout.day),
    date: getWeekdayDate(workout.day),
    title: formatMuscleGroupTitle(workout.muscle_group),
    exerciseCount,
    durationMinutes: exerciseCount * ESTIMATED_MINUTES_PER_EXERCISE,
    status: getSessionStatus(workout.day),
  }
}

export function mapWorkoutToDetail(
  workout: IWorkoutResponse,
  dayIndex: number,
): IWorkoutDetail {
  return {
    id: workout.id,
    dayName: workout.day.toUpperCase(),
    weekLabel: `W1 / D${dayIndex + 1}`,
    focus: formatMuscleGroupTitle(workout.muscle_group),
    exercises: workout.exercises.map(mapExerciseToUi),
  }
}

export function mapWorkoutsToSessions(
  workouts: IWorkoutResponse[],
): IWorkoutSession[] {
  return sortWorkoutsByDay(workouts).map(mapWorkoutToSession)
}

export function findWorkoutDetail(
  workouts: IWorkoutResponse[],
  workoutId: string,
): IWorkoutDetail | undefined {
  const sortedWorkouts = sortWorkoutsByDay(workouts)
  const workoutIndex = sortedWorkouts.findIndex(
    (workout) => workout.id === workoutId,
  )

  if (workoutIndex === -1) return undefined

  return mapWorkoutToDetail(sortedWorkouts[workoutIndex], workoutIndex)
}
