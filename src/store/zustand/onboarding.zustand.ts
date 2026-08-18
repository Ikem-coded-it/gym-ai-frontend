import { create } from 'zustand'
import type {
  FocusArea,
  IExercise,
  RoutineMode,
  TrainingDay,
} from '~/lib/interfaces/onboarding'

export type DayRoutine = {
  mode: RoutineMode
  exercises: IExercise[]
  focusAreas: FocusArea[]
}

type State = {
  selectedDays: TrainingDay[]
  dayRoutines: Partial<Record<TrainingDay, DayRoutine>>
  currentDayIndex: number
}

type Action = {
  toggleDay: (day: TrainingDay) => void
  setSelectedDays: (days: TrainingDay[]) => void
  setDayRoutine: (day: TrainingDay, routine: DayRoutine) => void
  setCurrentDayIndex: (index: number) => void
  reset: () => void
}

const useOnboardingStore = create<State & Action>((set) => ({
  selectedDays: [],
  dayRoutines: {},
  currentDayIndex: 0,
  toggleDay: (day) =>
    set((state) => ({
      selectedDays: state.selectedDays.includes(day)
        ? state.selectedDays.filter((d) => d !== day)
        : [...state.selectedDays, day],
    })),
  setSelectedDays: (days) => set({ selectedDays: days }),
  setDayRoutine: (day, routine) =>
    set((state) => ({
      dayRoutines: { ...state.dayRoutines, [day]: routine },
    })),
  setCurrentDayIndex: (index) => set({ currentDayIndex: index }),
  reset: () => set({ selectedDays: [], dayRoutines: {}, currentDayIndex: 0 }),
}))

export default useOnboardingStore
