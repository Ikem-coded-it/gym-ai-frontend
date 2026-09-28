import type { IComposerOption } from '~/lib/interfaces/chat-composer'
import { cn } from '~/lib/utils'
import ChatQuickReplyChip from '~/components/ai-coach/composer/ChatQuickReplyChip'

type ChatConfirmComposerProps = {
  options: IComposerOption[]
  onSelect: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function ChatConfirmComposer({
  options,
  onSelect,
  disabled = false,
  className,
}: ChatConfirmComposerProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isConfirm =
          option.value === 'confirm' ||
          option.label.toLowerCase() === 'confirm'

        return (
          <ChatQuickReplyChip
            key={option.value}
            label={option.label}
            variant={isConfirm ? 'primary' : 'default'}
            disabled={disabled}
            onClick={() => onSelect(option.value)}
          />
        )
      })}
    </div>
  )
}
