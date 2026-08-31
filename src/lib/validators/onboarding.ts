import z from 'zod'

const trainingDaySchema = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export const scheduleSchema = z.object({
  trainingDays: z
    .array(trainingDaySchema)
    .min(1, 'Select at least one training day'),
})

export type ScheduleFormData = z.infer<typeof scheduleSchema>

export const manualExerciseSchema = z.object({
  exercise: z.string().min(1, 'Exercise name is required'),
  set_count: z.number().min(1, 'Sets must be at least 1'),
  rep_count: z.number().min(1, 'Reps are required'),
  kg_weight: z.number().min(0, 'Weight must be 0 or more'),
  equipment_name: z.string().min(1, 'Equipment is required'),
})

export type ManualExerciseFormData = z.infer<typeof manualExerciseSchema>

const focusAreaSchema = z.enum([
  'full-body',
  'upper-body',
  'lower-body',
  'chest',
  'back',
  'shoulders',
  'legs',
  'arms',
  'core',
])

export const aiFocusSchema = z.object({
  focusAreas: z
    .array(focusAreaSchema)
    .min(1, 'Select at least one focus area'),
})

export type AiFocusFormData = z.infer<typeof aiFocusSchema>
