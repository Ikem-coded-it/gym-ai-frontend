import { ArrowRight } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import AiRoutinePanel from '~/components/onboarding/AiRoutinePanel'
import ManualRoutinePanel from '~/components/onboarding/ManualRoutinePanel'
import OnboardingFooter from '~/components/onboarding/OnboardingFooter'
import OnboardingProgress from '~/components/onboarding/OnboardingProgress'
import OnboardingTopBar from '~/components/onboarding/OnboardingTopBar'
import RoutineDayHeader from '~/components/onboarding/RoutineDayHeader'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import ApplicationRoutes from '~/config/routes'
import {
  getSortedTrainingDays,
  getTrainingDayLabel,
  OnboardingPayload,
  type FocusArea,
  type IExercise,
  type RoutineMode,
} from '~/lib/interfaces/onboarding'
import useOnboardingStore, { type DayRoutine } from '~/store/zustand/onboarding.zustand'
import onboardingService from '~/services/onboarding.service'
import { buildOnboardingPayload, withExerciseIds } from '~/lib/utils/onboarding'

type OnboardingRoutineProps = {
  initialTab?: RoutineMode
}

export default function OnboardingRoutine({
  initialTab,
}: OnboardingRoutineProps) {
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

  const isInitialDayIndex = useRef(true)
  const currentDay = sortedDays[currentDayIndex]

  const savedRoutine = currentDay ? dayRoutines[currentDay] : undefined

  const [mode, setMode] = useState<RoutineMode>(
    initialTab ?? savedRoutine?.mode ?? 'manual'
  )
  const [exercises, setExercises] = useState<IExercise[]>(
savedRoutine?.exercises ?? []
  )
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(
    savedRoutine?.focusAreas.length
      ? savedRoutine.focusAreas
      : ['full-body', 'core']
  )

  useEffect(() => {
    if (sortedDays.length === 0) {
      navigate({ to: ApplicationRoutes.ONBOARDING.SCHEDULE })
    }
  }, [sortedDays.length, navigate])

  useEffect(() => {
    if (isInitialDayIndex.current) {
      isInitialDayIndex.current = false
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentDayIndex])

  useEffect(() => {
    if (initialTab) {
      setMode(initialTab)
    }
  }, [initialTab])

  useEffect(() => {
    if (!currentDay) return

    const routine = dayRoutines[currentDay]
    if (routine) {
      if (!initialTab) {
        setMode(routine.mode)
      }
      setExercises(routine.exercises)
      setFocusAreas(
        routine.focusAreas.length ? routine.focusAreas : ['full-body', 'core']
      )
    } else {
      if (!initialTab) {
        setMode('manual')
      }
      setExercises([])
      setFocusAreas(['full-body', 'core'])
    }
  }, [currentDay, dayRoutines, initialTab])

  const onboardingMutation = useMutation({
    mutationFn: (payload: OnboardingPayload) => onboardingService.createOnboarding(payload),
    onSuccess: () => {
      toast.success('Onboarding successful and workouts saved!')
      navigate({ to: ApplicationRoutes.DASHBOARD.AI_COACH })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const generateMutation = useMutation({
    mutationFn: (areas: FocusArea[]) =>
      onboardingService.generateRoutine({ focus_areas: areas }),
    onSuccess: (data, areas) => {
      if (!currentDay) return
      setDayRoutine(currentDay, {
        mode: 'ai',
        exercises: withExerciseIds(data.exercises),
        focusAreas: areas,
      })
      navigate({
        to: ApplicationRoutes.ONBOARDING.AI_RESULT,
        search: { day: currentDay },
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  if (!currentDay) {
    return null
  }

  const persistCurrentDay = (
    overrides?: Partial<{
      mode: RoutineMode
      exercises: IExercise[]
      focusAreas: FocusArea[]
    }>
  ) => {
    setDayRoutine(currentDay, {
      mode: overrides?.mode ?? mode,
      exercises: overrides?.exercises ?? exercises,
      focusAreas: overrides?.focusAreas ?? focusAreas,
    })
  }

  const toggleFocusArea = (area: FocusArea) => {
    setFocusAreas((current) =>
      current.includes(area)
        ? current.filter((item) => item !== area)
        : [...current, area]
    )
  }

  const handleAddExercise = (exercise: IExercise) => {
    setExercises((current) => [...current, exercise])
  }

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises((current) => current.filter((item) => item.id !== exerciseId))
  }

  const handlePreviousDay = () => {
    if (currentDayIndex === 0) return

    persistCurrentDay()
    setCurrentDayIndex(currentDayIndex - 1)
  }

  const previousDay = currentDayIndex > 0 ? sortedDays[currentDayIndex - 1] : null

  const handleConfirmAndContinue = () => {
    const currentRoutine: DayRoutine = {
      mode,
      exercises,
      focusAreas,
    }

    setDayRoutine(currentDay, currentRoutine)

    const isLastDay = currentDayIndex === sortedDays.length - 1

    if (isLastDay) {
      const routines = {
        ...useOnboardingStore.getState().dayRoutines,
        [currentDay]: currentRoutine,
      }
      onboardingMutation.mutate(buildOnboardingPayload(sortedDays, routines))
      return
    }

    setCurrentDayIndex(currentDayIndex + 1)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <OnboardingTopBar>
        <OnboardingProgress currentStep={2} totalSteps={2} />
      </OnboardingTopBar>

      <RoutineDayHeader
        dayLabel={getTrainingDayLabel(currentDay)}
        dayNumber={currentDayIndex + 1}
        totalDays={sortedDays.length}
        previousDayLabel={
          previousDay ? getTrainingDayLabel(previousDay) : undefined
        }
        onPreviousDay={previousDay ? handlePreviousDay : undefined}
      />

      <main className="mx-auto w-full max-w-md flex-1 px-6 pt-6 pb-8">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as RoutineMode)}
        >
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="ai">AI Suggestion</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-0">
            <ManualRoutinePanel
              exercises={exercises}
              onAddExercise={handleAddExercise}
              onDeleteExercise={handleDeleteExercise}
              selectedFocusAreas={focusAreas}
              onToggleFocusArea={toggleFocusArea}
            />
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <AiRoutinePanel
              day={currentDay}
              selectedFocusAreas={focusAreas}
              onToggleFocusArea={toggleFocusArea}
              onGenerate={() => generateMutation.mutate(focusAreas)}
              isGenerating={generateMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      </main>

      {mode === 'manual' && (
        <OnboardingFooter>
          <Button
            type="button"
            size="lg"
            onClick={handleConfirmAndContinue}
            className="w-full"
          >
            Confirm &amp; Continue
            <ArrowRight weight="bold" className="size-4" />
          </Button>
        </OnboardingFooter>
      )}
    </div>
  )
}
