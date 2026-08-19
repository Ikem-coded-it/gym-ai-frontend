import { Plus } from '@phosphor-icons/react'
import WorkoutScheduleCard from '~/components/dashboard/WorkoutScheduleCard'
import { Button } from '~/components/ui/button'
import { DEMO_WEEKLY_SCHEDULE } from '~/lib/constants/workout'

export default function WorkoutOverview() {
  return (
    <div className="px-6 py-6">
      <h1 className="font-heading text-3xl text-black">Workout Plan</h1>
      <p className="mt-2 text-sm text-gray-500">
        Your blueprint for the week. Stay consistent.
      </p>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          This Week&apos;s Schedule
        </h2>

        <div className="mt-4 space-y-3">
          {DEMO_WEEKLY_SCHEDULE.map((session) => (
            <WorkoutScheduleCard key={session.id} session={session} />
          ))}
        </div>
      </section>

      <Button
        type="button"
        variant="outline"
        className="mt-6 h-12 w-full rounded-xl border-blue-200 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
      >
        <Plus weight="bold" className="size-4" />
        Add Extra Session
      </Button>
    </div>
  )
}
