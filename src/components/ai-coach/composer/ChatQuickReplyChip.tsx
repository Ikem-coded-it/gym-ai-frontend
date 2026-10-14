import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type ChatQuickReplyChipProps = {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'primary'
  className?: string
}

export default function ChatQuickReplyChip({
  label,
  onClick,
  disabled = false,
  variant = 'default',
  className,
}: ChatQuickReplyChipProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant={variant === 'primary' ? 'default' : 'outline'}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-9 rounded-full px-4',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border-primary/25 bg-card text-primary shadow-none hover:border-primary/40 hover:bg-secondary',
        className
      )}
    >
      {label}
    </Button>
  )
}
