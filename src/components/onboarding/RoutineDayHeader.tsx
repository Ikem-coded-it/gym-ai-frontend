type RoutineDayHeaderProps = {
  dayLabel: string
  dayNumber: number
  totalDays: number
}

export default function RoutineDayHeader({
  dayLabel,
  dayNumber,
  totalDays,
}: RoutineDayHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-4">
      <h2 className="font-heading text-2xl text-black">{dayLabel}</h2>
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Day {dayNumber} of {totalDays}
      </span>
    </div>
  )
}
