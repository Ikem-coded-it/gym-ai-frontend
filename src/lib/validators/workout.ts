import z from 'zod'

export const workoutExerciseSchema = z.object({
  exercise: z
    .string()
    .trim()
    .min(1, 'Exercise name is required')
    .max(50, 'Name must be 50 characters or fewer'),
  equipment_name: z
    .string()
    .trim()
    .max(50, 'Equipment must be 50 characters or fewer'),
})

export type WorkoutExerciseFormData = z.infer<typeof workoutExerciseSchema>

export const exerciseSetSchema = z
  .object({
    rep_count: z
      .number({ message: 'Reps must be a number' })
      .int('Reps must be a whole number')
      .min(1, 'Reps must be at least 1')
      .max(999, 'Reps must be below 1000')
      .optional(),
    // Seconds held, for timed exercises like a plank.
    duration_seconds: z
      .number({ message: 'Time must be a number' })
      .int('Time must be a whole number of seconds')
      .min(1, 'Time must be at least 1 second')
      .max(86399, 'Time must be under 24 hours')
      .optional(),
    // Blank means bodyweight / no added load.
    kg_weight: z
      .number({ message: 'Weight must be a number' })
      .min(0, 'Weight must be 0 or more')
      .max(999, 'Weight must be below 1000')
      .optional(),
    notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer'),
  })
  .refine((set) => set.rep_count !== undefined || set.duration_seconds !== undefined, {
    message: 'Enter reps or a time',
    path: ['rep_count'],
  })

export type ExerciseSetFormData = z.infer<typeof exerciseSetSchema>

export const createWorkoutSchema = z.object({
  day: z.enum(
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    { message: 'Pick a day' },
  ),
  focus_areas: z.array(z.string()).min(1, 'Pick at least one focus area'),
})

export type CreateWorkoutFormData = z.infer<typeof createWorkoutSchema>
