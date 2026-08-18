import { createFileRoute } from '@tanstack/react-router'
import OnboardingSchedule from '~/components/pages/onboarding/OnboardingSchedule'

export const Route = createFileRoute('/onboarding/schedule')({
  component: OnboardingSchedule,
})
