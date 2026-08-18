import { createFileRoute } from '@tanstack/react-router'
import OnboardingAiResult from '~/components/pages/onboarding/OnboardingAiResult'
import type { TrainingDay } from '~/lib/interfaces/onboarding'

const trainingDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

type AiResultSearch = {
  day: TrainingDay
}

export const Route = createFileRoute('/onboarding/routine/ai-result')({
  validateSearch: (search: Record<string, unknown>): AiResultSearch => ({
    day: trainingDays.includes(search.day as TrainingDay)
      ? (search.day as TrainingDay)
      : 'monday',
  }),
  component: AiResultRoute,
})

function AiResultRoute() {
  const { day } = Route.useSearch()

  return <OnboardingAiResult day={day} />
}
