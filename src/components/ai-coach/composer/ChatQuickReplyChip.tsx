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
      className={cn(className)}
    >
      {label}
    </Button>
  )
}
