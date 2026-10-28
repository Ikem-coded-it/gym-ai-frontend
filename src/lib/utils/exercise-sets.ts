import type { IAddExerciseSetPayload } from '~/lib/interfaces/workout'

/** One-line summary of an exercise's sets, e.g. "3 sets × 10 reps @ 60kg" or "3 sets • 10×60kg, 8×70kg". */
export function summarizeSets(
  sets: IAddExerciseSetPayload[] | null | undefined
): string {
  if (!sets?.length) return 'No sets yet'

  const label = (set: IAddExerciseSetPayload) =>
    set.kg_weight && set.kg_weight > 0
      ? `${set.rep_count}×${set.kg_weight}kg`
      : `${set.rep_count}`
  const allSame = sets.every((set) => label(set) === label(sets[0]))
  const count = `${sets.length} ${sets.length === 1 ? 'set' : 'sets'}`

  if (allSame) {
    const first = sets[0]
    return first.kg_weight && first.kg_weight > 0
      ? `${count} × ${first.rep_count} reps @ ${first.kg_weight}kg`
      : `${count} × ${first.rep_count} reps`
  }
  return `${count} • ${sets.map(label).join(', ')}`
}
