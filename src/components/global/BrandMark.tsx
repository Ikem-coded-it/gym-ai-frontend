import { Barbell } from '@phosphor-icons/react'
import { cn } from '~/lib/utils'

type BrandMarkProps = {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const sizes = {
  sm: { tile: 'size-7 rounded-lg', icon: 'size-4', text: 'text-lg' },
  md: { tile: 'size-9 rounded-xl', icon: 'size-5', text: 'text-2xl' },
  lg: { tile: 'size-16 rounded-2xl', icon: 'size-9', text: 'text-5xl' },
} as const

export default function BrandMark({
  size = 'sm',
  showIcon = true,
  className,
}: BrandMarkProps) {
  const styles = sizes[size]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-foreground',
        size === 'lg' && 'flex-col gap-4',
        className
      )}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center bg-primary text-primary-foreground shadow-card',
            styles.tile
          )}
        >
          <Barbell weight="fill" className={styles.icon} />
        </span>
      )}
      <span className={cn('font-heading leading-none tracking-wide', styles.text)}>
        Gym<span className="text-primary">AI</span>
      </span>
    </span>
  )
}
