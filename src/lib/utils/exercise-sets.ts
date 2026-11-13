import type { IAddExerciseSetPayload } from '~/lib/interfaces/workout'

/** 45 -> "45s", 90 -> "1m 30s", 120 -> "2m". */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest === 0 ? `${minutes}m` : `${minutes}m ${rest}s`
}

/** What one set asks for: reps, a timed hold, or both (without weight). */
export function formatSetEffort(set: {
  rep_count?: number | null
  duration_seconds?: number | null
}): string {
  const parts: string[] = []
  if (set.rep_count) parts.push(`${set.rep_count} reps`)
  if (set.duration_seconds) parts.push(`${formatDuration(set.duration_seconds)} hold`)
  return parts.join(' • ') || '—'
}

/** One-line summary of an exercise's sets, e.g. "3 sets × 10 reps @ 60kg", "2 sets × 45s hold" or "3 sets • 10×60kg, 8×70kg". */
export function summarizeSets(
  sets: IAddExerciseSetPayload[] | null | undefined
): string {
  if (!sets?.length) return 'No sets yet'

  const weighted = (set: IAddExerciseSetPayload) =>
    set.kg_weight && set.kg_weight > 0 ? ` @ ${set.kg_weight}kg` : ''
  const label = (set: IAddExerciseSetPayload) =>
    `${formatSetEffort(set)}${weighted(set)}`
  const short = (set: IAddExerciseSetPayload) =>
    set.rep_count && !set.duration_seconds
      ? set.kg_weight && set.kg_weight > 0
        ? `${set.rep_count}×${set.kg_weight}kg`
        : `${set.rep_count}`
      : label(set)
  const count = `${sets.length} ${sets.length === 1 ? 'set' : 'sets'}`

  if (sets.every((set) => label(set) === label(sets[0]))) {
    return `${count} × ${label(sets[0])}`
  }
  return `${count} • ${sets.map(short).join(', ')}`
}
