import { cn } from '~/lib/utils'

type OnboardingProgressProps = {
  currentStep: number
  totalSteps: number
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1
        const isActive = step <= currentStep

        return (
          <div
            key={step}
            className={cn(
              'h-1.5 rounded-full transition-colors',
              isActive ? 'w-16 bg-blue-600' : 'w-6 bg-gray-200'
            )}
          />
        )
      })}
    </div>
  )
}
