import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import SelectableItem from '~/components/global/SelectableItem'
import OnboardingBackButton from '~/components/onboarding/OnboardingBackButton'
import OnboardingProgress from '~/components/onboarding/OnboardingProgress'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import { TRAINING_DAYS } from '~/lib/interfaces/onboarding'
import { scheduleSchema } from '~/lib/validators/onboarding'
import useOnboardingStore from '~/store/zustand/onboarding.zustand'

export default function OnboardingSchedule() {
  const navigate = useNavigate()
  const selectedDays = useOnboardingStore((state) => state.selectedDays)
  const toggleDay = useOnboardingStore((state) => state.toggleDay)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = () => {
    const result = scheduleSchema.safeParse({ trainingDays: selectedDays })

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid selection')
      return
    }

    setError(null)
    navigate({ to: ApplicationRoutes.ONBOARDING.ROUTINE })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F5]">
      <header className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center px-4 pt-4">
        <OnboardingBackButton />
        <div className="flex justify-center">
          <OnboardingProgress currentStep={1} totalSteps={2} />
        </div>
        <span aria-hidden="true" />
      </header>

      <main className="flex-1 px-6 pt-8">
        <h1 className="font-heading text-3xl text-black">When do you lift?</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Select your training days. We&apos;ll generate a routine tailored to
          your schedule.
        </p>

        <div className="mt-8 space-y-3">
          {TRAINING_DAYS.map((day) => (
            <SelectableItem
              key={day.value}
              label={day.label}
              value={day.value}
              selected={selectedDays.includes(day.value)}
              onSelect={(value) => {
                toggleDay(value)
                if (error) setError(null)
              }}
            />
          ))}
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </main>

      <footer className="border-t border-gray-200 px-6 py-6">
        <Button
          type="button"
          onClick={handleContinue}
          className="h-12 w-full rounded-lg bg-blue-600 text-base text-white hover:bg-blue-700"
        >
          Continue
        </Button>
      </footer>
    </div>
  )
}
