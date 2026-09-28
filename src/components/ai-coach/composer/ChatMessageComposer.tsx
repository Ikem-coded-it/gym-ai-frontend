'use client'

import ChatActionChipsComposer from '~/components/ai-coach/composer/ChatActionChipsComposer'
import ChatConfirmComposer from '~/components/ai-coach/composer/ChatConfirmComposer'
import ChatDaySelectComposer from '~/components/ai-coach/composer/ChatDaySelectComposer'
import ChatMuscleGroupMultiSelectComposer from '~/components/ai-coach/composer/ChatMuscleGroupMultiSelectComposer'
import { Label } from '~/components/ui/label'
import type { IChatComposer } from '~/lib/interfaces/chat-composer'
import { cn } from '~/lib/utils'

type ChatMessageComposerProps = {
  composer: IChatComposer
  onSelect: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function ChatMessageComposer({
  composer,
  onSelect,
  disabled = false,
  className,
}: ChatMessageComposerProps) {
  return (
    <div
      className={cn('mt-1 w-full max-w-sm space-y-2', className)}
      role="group"
      aria-label="Quick reply options"
    >
      <Label className="font-normal text-muted-foreground">
        {composer.kind === 'muscle_group_multi_select'
          ? 'Select muscle groups (one or more):'
          : 'Or pick a quick reply:'}
      </Label>

      {composer.kind === 'day_select' && (
        <ChatDaySelectComposer
          options={composer.options}
          suggestedValue={composer.suggestedValue}
          onSelect={onSelect}
          disabled={disabled}
        />
      )}

      {composer.kind === 'muscle_group_multi_select' && (
        <ChatMuscleGroupMultiSelectComposer
          options={composer.options}
          suggestedValue={composer.suggestedValue}
          onSelect={onSelect}
          disabled={disabled}
        />
      )}

      {composer.kind === 'chips' && (
        <ChatActionChipsComposer
          options={composer.options}
          onSelect={onSelect}
          disabled={disabled}
        />
      )}

      {composer.kind === 'confirm' && (
        <ChatConfirmComposer
          options={composer.options}
          onSelect={onSelect}
          disabled={disabled}
        />
      )}
    </div>
  )
}
