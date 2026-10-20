'use client'

import ChatActionChipsComposer from '~/components/ai-coach/composer/ChatActionChipsComposer'
import ChatConfirmComposer from '~/components/ai-coach/composer/ChatConfirmComposer'
import ChatDaySelectComposer from '~/components/ai-coach/composer/ChatDaySelectComposer'
import ChatExerciseFormComposer from '~/components/ai-coach/composer/ChatExerciseFormComposer'
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

function composerHint(composer: IChatComposer): string | null {
  if (composer.kind === 'muscle_group_multi_select') {
    return 'Select muscle groups (one or more):'
  }
  if (composer.kind === 'exercise_form') {
    return composer.exercises?.length
      ? 'Edit your exercises below, then resubmit:'
      : 'Add your exercises below (or use Suggest a plan):'
  }
  if (composer.kind === 'chips') {
    return 'Which exercise did you mean?'
  }
  if (composer.kind === 'day_select' || composer.kind === 'confirm') {
    return 'Or pick a quick reply:'
  }
  return 'Or pick a quick reply:'
}

export default function ChatMessageComposer({
  composer,
  onSelect,
  disabled = false,
  className,
}: ChatMessageComposerProps) {
  const hint = composerHint(composer)
  const isWide = composer.kind === 'exercise_form'

  return (
    <div
      className={cn(
        'mt-1 space-y-2',
        isWide ? 'w-full max-w-md' : 'w-full max-w-sm',
        className
      )}
      role="group"
      aria-label="Quick reply options"
    >
      {hint && (
        <Label className="px-1 text-xs font-medium text-muted-foreground">{hint}</Label>
      )}

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

      {composer.kind === 'exercise_form' && (
        <ChatExerciseFormComposer
          suggestOption={composer.options[0]}
          initialExercises={composer.exercises}
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
