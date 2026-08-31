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
    <div className="px-6 pt-4">
      {onPreviousDay && previousDayLabel && (
        <button
          type="button"
          onClick={onPreviousDay}
          className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          <CaretLeft className="size-4" weight="bold" />
          Back to {previousDayLabel}
        </button>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl text-black">{dayLabel}</h2>
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Day {dayNumber} of {totalDays}
        </span>
      </div>
    </div>
  )
}
