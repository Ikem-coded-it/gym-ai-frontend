import { ArrowRight, CalendarBlank, Plus, Sparkle } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import AppHeader from '~/components/global/AppHeader'
import GeneratedExerciseCard from '~/components/onboarding/GeneratedExerciseCard'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import { AI_GENERATED_EXERCISES } from '~/lib/constants/onboarding'
import {
  getFocusAreaLabels,
  getSortedTrainingDays,
  getTrainingDayLabel,
  type FocusArea,
  type IExercise,
  type TrainingDay,
} from '~/lib/interfaces/onboarding'
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
    savedRoutine?.exercises.length
      ? savedRoutine.exercises
      : AI_GENERATED_EXERCISES
  )

  useEffect(() => {
    if (sortedDays.length === 0) {
      navigate({ to: ApplicationRoutes.ONBOARDING.SCHEDULE })
      return
    }

    if (!sortedDays.includes(day)) {
      navigate({ to: ApplicationRoutes.ONBOARDING.ROUTINE })
    }
  }, [day, navigate, sortedDays])

  const handleDeleteExercise = (exercise: IExercise) => {
    setExercises((current) => current.filter((item) => item.id !== exercise.id))
  }

  const handleRegenerate = () => {
    navigate({
      to: ApplicationRoutes.ONBOARDING.ROUTINE,
      search: { tab: 'ai' },
    })
  }

  const handleConfirmRoutine = () => {
    setDayRoutine(day, {
      mode: 'ai',
      exercises,
      focusAreas,
    })

    const isLastDay = currentDayIndex === sortedDays.length - 1

    if (isLastDay) {
      navigate({ to: ApplicationRoutes.DASHBOARD.AI_COACH })
      return
    }

    setCurrentDayIndex(currentDayIndex + 1)
    navigate({ to: ApplicationRoutes.ONBOARDING.ROUTINE })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
          Based on your focus areas ({getFocusAreaLabels(focusAreas)}).
        </p>

        <div className="mt-6 space-y-3">
          {exercises.map((exercise) => (
            <GeneratedExerciseCard
              key={exercise.id}
              exercise={exercise}
              onDelete={handleDeleteExercise}
            />
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-2 border-dashed border-primary/25 bg-transparent text-sm text-primary shadow-none hover:bg-secondary/60"
          >
            <Plus weight="bold" className="size-4" />
            Add Exercise
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleRegenerate}
            className="w-full text-sm"
          >
            <Sparkle weight="fill" className="size-4" />
            Regenerate
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={handleConfirmRoutine}
            className="w-full"
          >
            Confirm Routine
            <ArrowRight weight="bold" className="size-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
