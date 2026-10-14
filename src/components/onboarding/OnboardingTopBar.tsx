import type { ReactNode } from 'react'
import OnboardingBackButton from '~/components/onboarding/OnboardingBackButton'

type OnboardingTopBarProps = {
  children?: ReactNode
}

export default function OnboardingTopBar({ children }: OnboardingTopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-md grid-cols-[2.5rem_1fr_2.5rem] items-center px-4">
        <OnboardingBackButton />
        <div className="flex justify-center">{children}</div>
        <span aria-hidden="true" />
      </div>
    </header>
  )
}
