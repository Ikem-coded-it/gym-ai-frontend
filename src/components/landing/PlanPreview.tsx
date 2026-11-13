import { Sparkle } from '@phosphor-icons/react'
import PhoneFrame from '~/components/landing/PhoneFrame'

type PlanItem = { name: string; detail: string }

const PLAN: PlanItem[] = [
  { name: 'Barbell Bench Press', detail: '2 sets × 10 reps @ 40kg' },
  { name: 'Incline Dumbbell Press', detail: '2 sets × 10 reps @ 14kg' },
  { name: 'Shoulder Press', detail: '2 sets × 10 reps @ 25kg' },
  { name: 'Dumbbell Lateral Raise', detail: '2 sets × 10 reps @ 6kg' },
]

/** Static picture of a suggested plan awaiting Confirm or Edit. */
export default function PlanPreview() {
  return (
    <PhoneFrame label="A suggested GymAI plan with Confirm and Edit buttons">
      <div className="flex items-center gap-2 border-b border-border/70 bg-card px-4 py-2.5">
        <Sparkle weight="fill" className="size-4 text-primary" />
        <p className="text-[11px] font-semibold text-foreground">Suggested plan</p>
      </div>

      <div className="flex flex-1 flex-col bg-muted/50 px-3 py-3">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Monday · Chest &amp; Shoulders
        </p>

        <ul className="mt-2 space-y-1.5">
          {PLAN.map((item) => (
            <li
              key={item.name}
              className="rounded-xl bg-card px-3 py-2 shadow-card ring-1 ring-foreground/5"
            >
              <p className="text-[11px] font-semibold text-foreground">{item.name}</p>
              <p className="text-[9px] text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex gap-2 pt-3">
          <span className="flex-1 rounded-full bg-primary py-1.5 text-center text-[10px] font-semibold text-primary-foreground">
            Confirm
          </span>
          <span className="flex-1 rounded-full border border-primary/25 bg-card py-1.5 text-center text-[10px] font-semibold text-primary">
            Edit
          </span>
        </div>
      </div>
    </PhoneFrame>
  )
}
