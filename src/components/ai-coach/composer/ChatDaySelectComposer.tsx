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
        <Label htmlFor="chat-day-select" className="px-1 text-xs text-muted-foreground">
          Weekday
        </Label>
        <select
          id="chat-day-select"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          className="flex h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm text-foreground shadow-card outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
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
        disabled={disabled || !value}
        onClick={handleSubmit}
        className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Send day
      </Button>
    </div>
  )
}
