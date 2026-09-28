import type { IComposerOption } from '~/lib/interfaces/chat-composer'
import { cn } from '~/lib/utils'
import ChatQuickReplyChip from '~/components/ai-coach/composer/ChatQuickReplyChip'

type ChatActionChipsComposerProps = {
  options: IComposerOption[]
  onSelect: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function ChatActionChipsComposer({
  options,
  onSelect,
  disabled = false,
  className,
}: ChatActionChipsComposerProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <ChatQuickReplyChip
          key={option.value}
          label={option.label}
          disabled={disabled}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </div>
  )
}
