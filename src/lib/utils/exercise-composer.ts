import type { IComposerExercise } from '~/lib/interfaces/chat-composer'

export type SetDraftRow = {
  /** `null` = not filled in yet. */
  rep_count: number | null
  /** `null` = bodyweight (0 kg). */
  kg_weight: number | null
  notes: string
}

export type ExerciseDraftRow = {
  exercise: string
  equipment_name: string
  sets: SetDraftRow[]
}

export function createEmptySetRow(): SetDraftRow {
  return { rep_count: null, kg_weight: null, notes: '' }
}

export function createEmptyExerciseRow(): ExerciseDraftRow {
  return {
    exercise: '',
    equipment_name: '',
    sets: [createEmptySetRow()],
  }
}

export function resolveKgWeight(set: SetDraftRow): number {
  if (set.kg_weight === null || Number.isNaN(set.kg_weight)) {
    return 0
  }
  return Math.max(0, set.kg_weight)
}

/**
 * One block per exercise, one line per set, e.g.
 *   Bench Press (Barbell)
 *   Set 1: 10 reps @ 60kg
 *   Set 2: 8 reps @ 65kg — felt heavy
 */
export function formatExerciseBlock(row: ExerciseDraftRow): string {
  const name = row.exercise.trim()
  const equipment = row.equipment_name.trim()
  const header = equipment ? `${name} (${equipment})` : name
  const lines = row.sets.map((set, index) => {
    const notes = set.notes.trim()
    return `Set ${index + 1}: ${set.rep_count} reps @ ${resolveKgWeight(set)}kg${
      notes ? ` — ${notes}` : ''
    }`
  })
  return [header, ...lines].join('\n')
}

export function formatExercisesMessage(rows: ExerciseDraftRow[]): string {
  return rows.map(formatExerciseBlock).join('\n\n')
}

export function isSetRowComplete(set: SetDraftRow): boolean {
  const weightOk =
    set.kg_weight === null ||
    (typeof set.kg_weight === 'number' &&
      !Number.isNaN(set.kg_weight) &&
      set.kg_weight >= 0)

  return typeof set.rep_count === 'number' && set.rep_count > 0 && weightOk
}

export function isExerciseRowComplete(row: ExerciseDraftRow): boolean {
  return (
    row.exercise.trim().length > 0 &&
    row.sets.length > 0 &&
    row.sets.every(isSetRowComplete)
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
    equipment_name: exercise.equipment_name ?? '',
    sets: exercise.sets.length
      ? exercise.sets.map((set) => ({
          rep_count: set.rep_count > 0 ? set.rep_count : null,
          kg_weight: set.kg_weight == null || set.kg_weight === 0 ? null : set.kg_weight,
          notes: set.notes ?? '',
        }))
      : [createEmptySetRow()],
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

export function parseRepsInput(raw: string): number | null {
  const parsed = Math.round(Number(raw))
  return raw.trim() === '' || Number.isNaN(parsed) || parsed < 0 ? null : parsed
}
