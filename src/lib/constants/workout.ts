import type { IWorkoutDetail, IWorkoutSession } from '~/lib/interfaces/workout'

export const DEMO_WEEKLY_SCHEDULE: IWorkoutSession[] = [
  {
    id: '1',
    dayLabel: 'MON',
    date: 14,
    title: 'Full Body Power',
    exerciseCount: 6,
    durationMinutes: 45,
    status: 'upcoming',
  },
  {
    id: '2',
    dayLabel: 'WED',
    date: 16,
    title: 'Push Focus',
    exerciseCount: 5,
    durationMinutes: 50,
    status: 'today',
  },
  {
    id: '3',
    dayLabel: 'FRI',
    date: 18,
    title: 'Pull & Core',
    exerciseCount: 7,
    durationMinutes: 60,
    status: 'upcoming',
  },
  {
    id: '4',
    dayLabel: 'SUN',
    date: 20,
    title: 'Active Recovery',
    exerciseCount: 0,
    durationMinutes: 0,
    status: 'rest',
  },
]

export const DEMO_WORKOUT_DETAILS: Record<string, IWorkoutDetail> = {
  '1': {
    id: '1',
    dayName: 'MONDAY',
    weekLabel: 'W1 / D1',
    focus: 'Full Body Focus',
    exercises: [
      {
        id: 'ex-1',
        name: 'Barbell Squat',
        sets: 3,
        reps: '5',
        weightKg: 80,
      },
      {
        id: 'ex-2',
        name: 'Bench Press',
        sets: 3,
        reps: '5',
        weightKg: 65,
      },
      {
        id: 'ex-3',
        name: 'Romanian Deadlift',
        sets: 3,
        reps: '8',
        weightKg: 90,
      },
    ],
  },
  '2': {
    id: '2',
    dayName: 'WEDNESDAY',
    weekLabel: 'W1 / D2',
    focus: 'Push Focus',
    exercises: [
      {
        id: 'ex-4',
        name: 'Overhead Press',
        sets: 3,
        reps: '8',
        weightKg: 45,
      },
      {
        id: 'ex-5',
        name: 'Incline Bench Press',
        sets: 3,
        reps: '10',
        weightKg: 55,
      },
      {
        id: 'ex-6',
        name: 'Tricep Pushdown',
        sets: 3,
        reps: '12',
        weightKg: 25,
      },
    ],
  },
  '3': {
    id: '3',
    dayName: 'FRIDAY',
    weekLabel: 'W1 / D3',
    focus: 'Pull & Core',
    exercises: [
      {
        id: 'ex-7',
        name: 'Pull Up',
        sets: 3,
        reps: '8',
        weightKg: 0,
      },
      {
        id: 'ex-8',
        name: 'Barbell Row',
        sets: 3,
        reps: '8',
        weightKg: 70,
      },
      {
        id: 'ex-9',
        name: 'Plank',
        sets: 3,
        reps: '60s',
        weightKg: 0,
      },
    ],
  },
}

export function getWorkoutDetail(workoutId: string): IWorkoutDetail | undefined {
  return DEMO_WORKOUT_DETAILS[workoutId]
}
