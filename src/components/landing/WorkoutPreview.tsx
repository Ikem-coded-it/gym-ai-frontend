import { Barbell, DotsSixVertical } from '@phosphor-icons/react'
import PhoneFrame from '~/components/landing/PhoneFrame'

type PreviewExercise = {
  name: string
  equipment: string
  sets: string[]
}

const EXERCISES: PreviewExercise[] = [
  {
    name: 'Pull-up',
    equipment: 'Bodyweight',
    sets: ['10 reps', '8 reps', '7 reps'],
  },
  {
    name: 'Barbell Row',
    equipment: 'Barbell',
    sets: ['10 reps × 50kg', '10 reps × 55kg'],
  },
  {
    name: 'Plank',
    equipment: 'Bodyweight',
    sets: ['45s hold', '40s hold'],
  },
]

/** Static picture of a workout: exercises in order, each set tracked on its own. */
export default function WorkoutPreview() {
  return (
    <PhoneFrame label="A GymAI workout with each set's reps, weight or hold time">
      <div className="border-b border-border/70 bg-card px-4 py-2.5">
        <p className="font-heading text-lg leading-none text-foreground">Thursday</p>
        <p className="mt-1 text-[10px] text-muted-foreground">Back &amp; Arms</p>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden bg-muted/50 px-3 py-3">
        {EXERCISES.map((exercise) => (
          <div
            key={exercise.name}
            className="rounded-2xl bg-card p-2.5 shadow-card ring-1 ring-foreground/5"
          >
            <div className="flex items-center gap-2">
              <DotsSixVertical weight="bold" className="size-4 text-muted-foreground" />
              <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary">
                <Barbell weight="fill" className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-foreground">
                  {exercise.name}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {exercise.equipment} • {exercise.sets.length} sets
                </p>
              </div>
            </div>
            <ul className="mt-2 space-y-1">
              {exercise.sets.map((set, index) => (
                <li
                  key={set}
                  className="flex items-center gap-2 rounded-lg bg-muted/70 px-2 py-1 text-[10px]"
                >
                  <span className="w-9 font-semibold text-primary">Set {index + 1}</span>
                  <span className="font-medium text-foreground">{set}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}
