import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

type EmptyStateProps = {
  icon: Icon
  title: ReactNode
  description?: ReactNode
  className?: string
}

export default function EmptyState({
  icon: IconComponent,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl bg-card px-6 py-10 text-center shadow-card ring-1 ring-foreground/5',
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
        <IconComponent weight="duotone" className="size-6" />
      </span>
      <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
