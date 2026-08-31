import { ArrowRight } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import AiRoutinePanel from '~/components/onboarding/AiRoutinePanel'
import ManualRoutinePanel from '~/components/onboarding/ManualRoutinePanel'
import OnboardingBackButton from '~/components/onboarding/OnboardingBackButton'
import RoutineDayHeader from '~/components/onboarding/RoutineDayHeader'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import ApplicationRoutes from '~/config/routes'
import {
  getSortedTrainingDays,
  getTrainingDayLabel,
  OnboardingPayload,
  TrainingDay,
  type FocusArea,
  type IExercise,
  type RoutineMode,
} from '~/lib/interfaces/onboarding'
import useOnboardingStore, { type DayRoutine } from '~/store/zustand/onboarding.zustand'
import onboardingService from '~/services/onboarding.service'

const DEMO_EXERCISES: IExercise[] = [
  {
    id: '1',
    exercise: 'Barbell Squat',
    set_count: 3,
    rep_count: 5,
    kg_weight: 60,
    equipment_name: 'Barbell',
  },
  {
    id: '2',
    exercise: 'Romanian Deadlift',
    set_count: 3,
    rep_count: 8,
    kg_weight: 50,
    equipment_name: 'Barbell',
  },
]

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
    savedRoutine?.exercises.length
      ? savedRoutine.exercises
      : DEMO_EXERCISES
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
      setExercises(
        routine.exercises.length ? routine.exercises : DEMO_EXERCISES
      )
      setFocusAreas(
        routine.focusAreas.length ? routine.focusAreas : ['full-body', 'core']
      )
    } else {
      if (!initialTab) {
        setMode('manual')
      }
      setExercises(DEMO_EXERCISES)
      setFocusAreas(['full-body', 'core'])
    }
  }, [currentDay, dayRoutines, initialTab])

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

  const handleGenerateRoutine = () => {
    persistCurrentDay({ mode: 'ai', focusAreas })

    navigate({
      to: ApplicationRoutes.ONBOARDING.AI_RESULT,
      search: { day: currentDay },
    })
  }

  function buildOnboardingPayload(
    routines: Partial<Record<TrainingDay, DayRoutine>>,
  ): OnboardingPayload {
    return {
      workouts: sortedDays.map((day) => {
        const routine = routines[day]
        if (!routine) {
          throw new Error(`Missing routine for ${day}`)
        }

        return {
          workout: {
            muscle_group: routine.focusAreas.join(','),
            day,
          },
          exercises: routine.exercises.map((exercise) => ({
            exercise: exercise.exercise,
            set_count: exercise.set_count,
            rep_count: exercise.rep_count,
            kg_weight: exercise.kg_weight,
            equipment_name: exercise.equipment_name,
          })),
        }
      }),
    }
  }

  const onboardingMutation = useMutation({
    mutationFn: (payload: OnboardingPayload) => onboardingService.createOnboarding(payload),
    onSuccess: (_data, variables) => {
      // console.log('Onboarding created: ', variables)
      toast.success('Onboarding successful and workouts saved!')
      navigate({ to: ApplicationRoutes.DASHBOARD.index })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

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
      onboardingMutation.mutate(buildOnboardingPayload(routines))
      return
    }

    setCurrentDayIndex(currentDayIndex + 1)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F5]">
      <header className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center px-4 pt-4">
        <OnboardingBackButton />
        <h1 className="text-center font-heading text-xl text-blue-600">
          Your Blueprint
        </h1>
        <span aria-hidden="true" />
      </header>

      <RoutineDayHeader
        dayLabel={getTrainingDayLabel(currentDay)}
        dayNumber={currentDayIndex + 1}
        totalDays={sortedDays.length}
        previousDayLabel={
          previousDay ? getTrainingDayLabel(previousDay) : undefined
        }
        onPreviousDay={previousDay ? handlePreviousDay : undefined}
      />

      <main className="flex-1 px-6 py-6">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as RoutineMode)}
        >
          <TabsList className="mb-6 grid h-11 w-full grid-cols-2 rounded-xl bg-white p-1 shadow-sm">
            <TabsTrigger
              value="manual"
              className="rounded-lg data-active:bg-blue-50 data-active:text-blue-600"
            >
              Manual
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="rounded-lg data-active:bg-blue-50 data-active:text-blue-600"
            >
              AI Suggestion
            </TabsTrigger>
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
              onGenerate={handleGenerateRoutine}
            />
          </TabsContent>
        </Tabs>
      </main>

      {mode === 'manual' && (
        <footer className="border-t border-gray-200 px-6 py-6">
          <Button
            type="button"
            onClick={handleConfirmAndContinue}
            className="h-12 w-full rounded-lg bg-blue-600 text-base text-white hover:bg-blue-700"
          >
            Confirm &amp; Continue
            <ArrowRight weight="bold" className="size-4" />
          </Button>
        </footer>
      )}
    </div>
  )
}
