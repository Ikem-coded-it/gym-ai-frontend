import type { ReactNode } from 'react'

type OnboardingFooterProps = {
  children: ReactNode
}

export default function OnboardingFooter({ children }: OnboardingFooterProps) {
  return (
    <footer className="sticky bottom-0 z-20 border-t border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-md px-6 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {children}
      </div>
    </footer>
  )
}
