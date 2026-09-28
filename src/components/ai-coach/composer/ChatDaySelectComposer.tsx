'use client'

import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import type { IComposerOption } from '~/lib/interfaces/chat-composer'
import { cn } from '~/lib/utils'

type ChatDaySelectComposerProps = {
  options: IComposerOption[]
  suggestedValue?: string | null
  onSelect: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function ChatDaySelectComposer({
  options,
  suggestedValue,
  onSelect,
  disabled = false,
  className,
}: ChatDaySelectComposerProps) {
  const initial =
    suggestedValue && options.some((option) => option.value === suggestedValue)
      ? suggestedValue
      : options[0]?.value ?? ''

  const [value, setValue] = useState(initial)

  const handleSubmit = () => {
    if (!value) return
    onSelect(value)
  }

  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-end', className)}>
      <div className="flex min-w-[10rem] flex-1 flex-col gap-1.5">
        <Label htmlFor="chat-day-select" className="text-muted-foreground">
          Weekday
        </Label>
        <select
          id="chat-day-select"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          className="flex h-8 w-full rounded-none border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="button"
        size="sm"
        disabled={disabled || !value}
        onClick={handleSubmit}
        className="shrink-0"
      >
        Send day
      </Button>
    </div>
  )
}
