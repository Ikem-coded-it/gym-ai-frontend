'use client'

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
            >
              {option.label}
            </Button>
          )
        })}
      </div>

      <Button
        type="button"
        size="sm"
        disabled={disabled || selected.length === 0}
        onClick={handleConfirm}
      >
        Confirm muscle groups
      </Button>
    </div>
  )
}
