import { CalendarBlank, Plus } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import AddWorkoutSessionDialog from '~/components/dashboard/AddWorkoutSessionDialog'
import WorkoutScheduleCard from '~/components/dashboard/WorkoutScheduleCard'
import EmptyState from '~/components/global/EmptyState'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import ApplicationRoutes from '~/config/routes'
import { workoutQueryKeys } from '~/lib/constants/workout'
import { mapWorkoutsToSessions } from '~/lib/utils/workout'
import type { CreateWorkoutFormData } from '~/lib/validators/workout'
import workoutService from '~/services/workout.service'

export default function WorkoutOverview() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)

  const {
    data: workouts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: workoutQueryKeys.all,
    queryFn: () => workoutService.getWorkouts(),
  })

  const sessions = workouts ? mapWorkoutsToSessions(workouts) : []
  const takenDays = workouts?.map((workout) => workout.day) ?? []

  const createWorkoutMutation = useMutation({
    mutationFn: (data: CreateWorkoutFormData) =>
      workoutService.createWorkout({
        day: data.day,
        muscle_group: data.focus_areas.join(','),
      }),
    onSuccess: async (workout) => {
      // Refetch first: the details page redirects away if it can't find the workout.
      await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all })
      setIsAddSessionOpen(false)
      toast.success('Workout created. Add your exercises.')
      navigate({
        to: ApplicationRoutes.DASHBOARD.WORKOUT_DETAIL,
        params: { workoutId: workout.id },
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return (
    <div className="mx-auto w-full max-w-md px-6 py-6">
      <h1 className="font-heading text-3xl text-foreground">Workout Plan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your blueprint for the week. Stay consistent.
      </p>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          This Week&apos;s Schedule
        </h2>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <Spinner className="size-6 text-primary" />
          </div>
        )}

        {isError && (
          <p
            className="mt-3 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error instanceof Error ? error.message : 'Failed to load workouts'}
          </p>
        )}

        {!isLoading && !isError && sessions.length === 0 && (
          <EmptyState
            icon={CalendarBlank}
            title="No workouts yet."
            description="Complete onboarding to build your weekly plan."
            className="mt-3"
          />
        )}

        {!isLoading && !isError && sessions.length > 0 && (
          <div className="mt-3 space-y-3">
            {sessions.map((session) => (
              <WorkoutScheduleCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={() => setIsAddSessionOpen(true)}
        className="mt-6 w-full text-sm"
      >
        <Plus weight="bold" className="size-4" />
        Add Extra Session
      </Button>

      <AddWorkoutSessionDialog
        open={isAddSessionOpen}
        onOpenChange={setIsAddSessionOpen}
        takenDays={takenDays}
        onCreate={createWorkoutMutation.mutateAsync}
        isSubmitting={createWorkoutMutation.isPending}
      />
    </div>
  )
}
