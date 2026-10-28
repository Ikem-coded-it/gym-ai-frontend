import z from 'zod'
import { exerciseSetSchema } from '~/lib/validators/workout'

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
  equipment_name: z.string(),
  sets: z.array(exerciseSetSchema).min(1, 'Add at least one set'),
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
