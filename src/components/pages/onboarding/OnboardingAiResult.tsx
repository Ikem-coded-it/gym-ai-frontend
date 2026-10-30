import { ArrowRight, CalendarBlank, Plus, Sparkle } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AppHeader from '~/components/global/AppHeader'
import ExerciseEditDialog from '~/components/onboarding/ExerciseEditDialog'
import GeneratedExerciseCard from '~/components/onboarding/GeneratedExerciseCard'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import {
  getFocusAreaLabels,
  getSortedTrainingDays,
  getTrainingDayLabel,
  type FocusArea,
  type IExercise,
  type OnboardingPayload,
  type TrainingDay,
} from '~/lib/interfaces/onboarding'
import { buildOnboardingPayload, withExerciseIds } from '~/lib/utils/onboarding'
import onboardingService from '~/services/onboarding.service'
import useOnboardingStore from '~/store/zustand/onboarding.zustand'

type OnboardingAiResultProps = {
  day: TrainingDay
}

export default function OnboardingAiResult({ day }: OnboardingAiResultProps) {
  const navigate = useNavigate()
  const selectedDays = useOnboardingStore((state) => state.selectedDays)
  const dayRoutines = useOnboardingStore((state) => state.dayRoutines)
  const currentDayIndex = useOnboardingStore((state) => state.currentDayIndex)
  const setDayRoutine = useOnboardingStore((state) => state.setDayRoutine)
  const setCurrentDayIndex = useOnboardingStore((state) => state.setCurrentDayIndex)

  const sortedDays = useMemo(
    () => getSortedTrainingDays(selectedDays),
    [selectedDays]
  )

  const savedRoutine = dayRoutines[day]
  const focusAreas: FocusArea[] = savedRoutine?.focusAreas.length
    ? savedRoutine.focusAreas
    : ['full-body', 'core']

  const [exercises, setExercises] = useState<IExercise[]>(
    savedRoutine?.exercises ?? []
  )
  // `null` closed, `{}` adding, `{ exercise }` editing
  const [dialog, setDialog] = useState<{ exercise?: IExercise } | null>(null)

  useEffect(() => {
    if (sortedDays.length === 0) {
      navigate({ to: ApplicationRoutes.ONBOARDING.SCHEDULE })
      return
    }

    if (!sortedDays.includes(day)) {
      navigate({ to: ApplicationRoutes.ONBOARDING.ROUTINE })
      return
    }

    // Nothing generated for this day (e.g. the page was opened directly).
    if (!savedRoutine?.exercises.length) {
      navigate({ to: ApplicationRoutes.ONBOARDING.ROUTINE, search: { tab: 'ai' } })
    }
  }, [day, navigate, sortedDays, savedRoutine])

  const regenerateMutation = useMutation({
    mutationFn: () => onboardingService.generateRoutine({ focus_areas: focusAreas }),
    onSuccess: (data) => {
      setExercises(withExerciseIds(data.exercises))
      toast.success('New routine generated')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onboardingMutation = useMutation({
    mutationFn: (payload: OnboardingPayload) =>
      onboardingService.createOnboarding(payload),
    onSuccess: () => {
      toast.success('Onboarding successful and workouts saved!')
      navigate({ to: ApplicationRoutes.DASHBOARD.AI_COACH })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteExercise = (exercise: IExercise) => {
    setExercises((current) => current.filter((item) => item.id !== exercise.id))
  }

  const handleSubmitExercise = (data: Omit<IExercise, 'id'>) => {
    const editing = dialog?.exercise
    setExercises((current) =>
      editing
        ? current.map((item) =>
            item.id === editing.id ? { ...item, ...data } : item
          )
        : [...current, { id: crypto.randomUUID(), ...data }]
    )
  }

  const handleConfirmRoutine = () => {
    const routine = { mode: 'ai' as const, exercises, focusAreas }
    setDayRoutine(day, routine)

    const isLastDay = currentDayIndex === sortedDays.length - 1

    if (isLastDay) {
      // This is the end of the flow: save every day's routine.
      onboardingMutation.mutate(
        buildOnboardingPayload(sortedDays, {
          ...useOnboardingStore.getState().dayRoutines,
          [day]: routine,
        })
      )
      return
    }

    setCurrentDayIndex(currentDayIndex + 1)
    navigate({ to: ApplicationRoutes.ONBOARDING.ROUTINE })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isBusy = regenerateMutation.isPending || onboardingMutation.isPending

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader />

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
          <CalendarBlank className="size-3.5" weight="fill" />
          {getTrainingDayLabel(day)} Routine
        </div>

        <h1 className="mt-3 font-heading text-3xl text-foreground">
          Generated Blueprint
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on your focus areas ({getFocusAreaLabels(focusAreas)}). Review it,
          edit anything you like, then confirm.
        </p>

        <div className="mt-6 space-y-3">
          {exercises.map((exercise) => (
            <GeneratedExerciseCard
              key={exercise.id}
              exercise={exercise}
              onEdit={(target) => setDialog({ exercise: target })}
              onDelete={handleDeleteExercise}
            />
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isBusy}
            onClick={() => setDialog({})}
            className="w-full border-2 border-dashed border-primary/25 bg-transparent text-sm text-primary shadow-none hover:bg-secondary/60"
          >
            <Plus weight="bold" className="size-4" />
            Add Exercise
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isBusy}
            onClick={() => regenerateMutation.mutate()}
            className="w-full text-sm"
          >
            <Sparkle weight="fill" className="size-4" />
            {regenerateMutation.isPending ? 'Generating...' : 'Regenerate'}
          </Button>

          <Button
            type="button"
            size="lg"
            disabled={isBusy || exercises.length === 0}
            onClick={handleConfirmRoutine}
            className="w-full"
          >
            {onboardingMutation.isPending ? 'Saving...' : 'Confirm Routine'}
            <ArrowRight weight="bold" className="size-4" />
          </Button>
        </div>
      </main>

      <ExerciseEditDialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        exercise={dialog?.exercise}
        onSubmit={handleSubmitExercise}
      />
    </div>
  )
}
