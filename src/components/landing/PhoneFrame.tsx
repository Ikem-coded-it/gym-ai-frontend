import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

type PhoneFrameProps = {
  children: ReactNode
  className?: string
  /** Describes the screenshot for screen readers; the mock-up itself is decorative. */
  label: string
}

/** A phone-shaped frame for the product previews on the landing page. */
export default function PhoneFrame({ children, className, label }: PhoneFrameProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'relative h-[30rem] w-[15.5rem] shrink-0 overflow-hidden rounded-[2.25rem] border-[7px] border-foreground bg-background shadow-float',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground"
      />
      <div aria-hidden="true" className="flex h-full flex-col pt-8">
        {children}
      </div>
    </div>
  )
}
