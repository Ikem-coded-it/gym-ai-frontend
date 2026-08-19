import {
  Barbell,
  CaretRight,
  PersonSimpleWalk,
  Play,
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
    <CardContent className="flex items-center gap-3 py-4">
      <div
        className={cn(
          'flex size-14 shrink-0 flex-col items-center justify-center rounded-xl text-center',
          isToday ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700',
          isRest && 'bg-gray-50 text-gray-400'
        )}
      >
        <span className="text-[10px] font-semibold tracking-wide">
          {session.dayLabel}
        </span>
        <span className="text-lg font-bold leading-none">{session.date}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <CardTitle
            className={cn(
              'truncate text-base font-semibold',
              isRest ? 'text-gray-400' : 'text-gray-900'
            )}
          >
            {session.title}
          </CardTitle>
          {isToday && (
            <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
              Today
            </span>
          )}
        </div>

        {isRest ? (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
            <PersonSimpleWalk className="size-4" />
            Rest Day
          </p>
        ) : (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <Barbell className="size-4" />
            {session.exerciseCount} Exercises • {session.durationMinutes} min
          </p>
        )}
      </div>

      {!isRest && (
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            isToday ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
          )}
        >
          {isToday ? (
            <Play weight="fill" className="size-4" />
          ) : (
            <CaretRight weight="bold" className="size-4" />
          )}
        </span>
      )}
    </CardContent>
  )

  if (isRest) {
    return (
      <Card
        className={cn(
          'rounded-xl bg-white py-0 shadow-sm ring-0',
          'border border-dashed border-gray-300 opacity-70'
        )}
      >
        {cardContent}
      </Card>
    )
  }

  return (
    <Link
      to={ApplicationRoutes.DASHBOARD.WORKOUT_DETAIL}
      params={{ workoutId: session.id }}
      className="block"
    >
      <Card
        className={cn(
          'rounded-xl bg-white py-0 shadow-sm ring-0 transition-colors hover:bg-gray-50',
          isToday && 'border-l-4 border-blue-600'
        )}
      >
        {cardContent}
      </Card>
    </Link>
  )
}
