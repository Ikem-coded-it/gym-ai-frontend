import {
  Barbell,
  CaretRight,
  PersonSimpleWalk,
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardTitle } from '~/components/ui/card'
import ApplicationRoutes from '~/config/routes'
import type { IWorkoutSession } from '~/lib/interfaces/workout'
import { cn } from '~/lib/utils'

type WorkoutScheduleCardProps = {
  session: IWorkoutSession
}

export default function WorkoutScheduleCard({ session }: WorkoutScheduleCardProps) {
  const isToday = session.status === 'today'
  const isRest = session.status === 'rest'

  const cardContent = (
    <CardContent className="flex items-center gap-3 px-3 py-3">
      <div
        className={cn(
          'flex size-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-center',
          isToday && 'bg-primary text-primary-foreground shadow-card',
          !isToday && !isRest && 'bg-secondary text-primary',
          isRest && 'bg-muted text-muted-foreground'
        )}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
          {session.dayLabel}
        </span>
        <span className="text-lg font-bold leading-none tabular-nums">
          {session.date}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <CardTitle
            className={cn(
              'truncate',
              isRest ? 'text-muted-foreground' : 'text-foreground'
            )}
          >
            {session.title}
          </CardTitle>
          {isToday && (
            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              Today
            </span>
          )}
        </div>

        {isRest ? (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <PersonSimpleWalk className="size-4" />
            Rest Day
          </p>
        ) : (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Barbell className="size-4" />
            {session.exerciseCount} Exercises • {session.durationMinutes} min
          </p>
        )}
      </div>

      {!isRest && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover/link:bg-secondary group-hover/link:text-primary">
          <CaretRight weight="bold" className="size-4" />
        </span>
      )}
    </CardContent>
  )

  if (isRest) {
    return (
      <Card className="border border-dashed border-border bg-transparent py-0 shadow-none ring-0">
        {cardContent}
      </Card>
    )
  }

  return (
    <Link
      to={ApplicationRoutes.DASHBOARD.WORKOUT_DETAIL}
      params={{ workoutId: session.id }}
      className="group/link block rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
    >
      <Card
        className={cn(
          'py-0 transition-[box-shadow,transform] duration-150 group-hover/link:shadow-float group-active/link:scale-[0.99]',
          isToday && 'ring-2 ring-primary'
        )}
      >
        {cardContent}
      </Card>
    </Link>
  )
}
