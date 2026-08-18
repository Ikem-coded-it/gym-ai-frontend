import { createFileRoute } from '@tanstack/react-router'
import OnboardingRoutine from '~/components/pages/onboarding/OnboardingRoutine'
import type { RoutineMode } from '~/lib/interfaces/onboarding'

type RoutineSearch = {
  tab?: RoutineMode
}

export const Route = createFileRoute('/onboarding/routine/')({
  validateSearch: (search: Record<string, unknown>): RoutineSearch => ({
    tab: search.tab === 'ai' || search.tab === 'manual' ? search.tab : undefined,
  }),
  component: RoutineRoute,
})

function RoutineRoute() {
  const { tab } = Route.useSearch()

  return <OnboardingRoutine initialTab={tab} />
}
