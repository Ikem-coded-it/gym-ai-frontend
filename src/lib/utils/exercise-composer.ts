import type { IComposerExercise } from '~/lib/interfaces/chat-composer'

export type ExerciseDraftRow = {
  exercise: string
  set_count: number
  rep_count: number
  /** `null` = bodyweight (0 kg). */
  kg_weight: number | null
  equipment_name: string
}

export function createEmptyExerciseRow(): ExerciseDraftRow {
  return {
    exercise: '',
    set_count: 3,
    rep_count: 10,
    kg_weight: null,
    equipment_name: '',
  }
}

export function resolveKgWeight(row: ExerciseDraftRow): number {
  if (row.kg_weight === null || Number.isNaN(row.kg_weight)) {
    return 0
  }
  return Math.max(0, Math.round(row.kg_weight))
}

export function formatExerciseLine(row: ExerciseDraftRow): string {
  const name = row.exercise.trim()
  const equipment = row.equipment_name.trim()
  const sets = Math.max(1, Math.round(row.set_count))
  const reps = Math.max(1, Math.round(row.rep_count))
  const kg = resolveKgWeight(row)
  return `${name} — ${sets} sets × ${reps} reps @ ${kg}kg, ${equipment}`
}

export function formatExercisesMessage(rows: ExerciseDraftRow[]): string {
  return rows.map(formatExerciseLine).join('\n')
}

export function isExerciseRowComplete(row: ExerciseDraftRow): boolean {
  const weightOk =
    row.kg_weight === null ||
    (typeof row.kg_weight === 'number' &&
      !Number.isNaN(row.kg_weight) &&
      row.kg_weight >= 0)

  return (
    row.exercise.trim().length > 0 &&
    row.equipment_name.trim().length > 0 &&
    row.set_count > 0 &&
    row.rep_count > 0 &&
    weightOk
  )
}

export function areAllExerciseRowsComplete(rows: ExerciseDraftRow[]): boolean {
  return rows.length > 0 && rows.every(isExerciseRowComplete)
}

export function composerExercisesToRows(
  exercises: IComposerExercise[] | null | undefined
): ExerciseDraftRow[] {
  if (!exercises?.length) {
    return [createEmptyExerciseRow()]
  }
  return exercises.map((exercise) => ({
    exercise: exercise.exercise,
    set_count: exercise.set_count,
    rep_count: exercise.rep_count,
    kg_weight:
      exercise.kg_weight == null || exercise.kg_weight === 0
        ? null
        : exercise.kg_weight,
    equipment_name: exercise.equipment_name ?? '',
  }))
}

export function parseKgWeightInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return null
  }
  const parsed = Number(trimmed)
  if (Number.isNaN(parsed) || parsed < 0) {
    return null
  }
  return parsed
}
