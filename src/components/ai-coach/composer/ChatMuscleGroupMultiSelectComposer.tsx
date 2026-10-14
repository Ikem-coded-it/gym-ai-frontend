'use client'

import { Check } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import type { IComposerOption } from '~/lib/interfaces/chat-composer'
import { cn } from '~/lib/utils'

type ChatMuscleGroupMultiSelectComposerProps = {
  options: IComposerOption[]
  suggestedValue?: string | null
  onSelect: (value: string) => void
  disabled?: boolean
  className?: string
}

function parseSuggestedValues(
  suggestedValue: string | null | undefined,
  options: IComposerOption[]
): string[] {
  if (!suggestedValue?.trim()) {
    return []
  }

  const valid = new Set(options.map((option) => option.value))
  return suggestedValue
    .split(',')
    .map((part) => part.trim())
    .filter((value) => valid.has(value))
}

export default function ChatMuscleGroupMultiSelectComposer({
  options,
  suggestedValue,
  onSelect,
  disabled = false,
  className,
}: ChatMuscleGroupMultiSelectComposerProps) {
  const initialSelected = useMemo(
    () => parseSuggestedValues(suggestedValue, options),
    [suggestedValue, options]
  )
  const [selected, setSelected] = useState<string[]>(initialSelected)

  const toggleValue = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value]
    )
  }

  const handleConfirm = () => {
    if (selected.length === 0) return
    onSelect(selected.join(', '))
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={isSelected ? 'default' : 'outline'}
              disabled={disabled}
              onClick={() => toggleValue(option.value)}
              aria-pressed={isSelected}
              className={cn(
                'h-9 rounded-full px-4',
                isSelected
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-primary/25 bg-card text-primary shadow-none hover:border-primary/40 hover:bg-secondary'
              )}
            >
              {isSelected && <Check weight="bold" className="-ml-1 size-3.5" />}
              {option.label}
            </Button>
          )
        })}
      </div>

      <Button
        type="button"
        disabled={disabled || selected.length === 0}
        onClick={handleConfirm}
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Confirm muscle groups
      </Button>
    </div>
  )
}
