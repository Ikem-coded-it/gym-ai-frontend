import { CaretLeft } from '@phosphor-icons/react'

type RoutineDayHeaderProps = {
  dayLabel: string
  dayNumber: number
  totalDays: number
  previousDayLabel?: string
  onPreviousDay?: () => void
}

export default function RoutineDayHeader({
  dayLabel,
  dayNumber,
  totalDays,
  previousDayLabel,
  onPreviousDay,
}: RoutineDayHeaderProps) {
  return (
    <div className="mx-auto w-full max-w-md px-6 pt-2">
      {onPreviousDay && previousDayLabel && (
        <button
          type="button"
          onClick={onPreviousDay}
          className="-ml-2 mb-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
        >
          <CaretLeft className="size-4" weight="bold" />
          Back to {previousDayLabel}
        </button>
      )}

      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Your Blueprint
      </p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <h1 className="font-heading text-3xl text-foreground">{dayLabel}</h1>
        <span className="mb-1 shrink-0 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-card ring-1 ring-foreground/5">
          Day {dayNumber} of {totalDays}
        </span>
      </div>
    </div>
  )
}
