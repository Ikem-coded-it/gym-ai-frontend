import { Check } from '@phosphor-icons/react'
import { cn } from '~/lib/utils'

type SelectableChipProps<T> = {
  label: string
  value: T
  selected: boolean
  onSelect: (value: T) => void
  disabled?: boolean
  className?: string
}

export default function SelectableChip<T>({
  label,
  value,
  selected,
  onSelect,
  disabled = false,
  className,
}: SelectableChipProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium outline-none transition-all active:scale-[0.97]',
        'focus-visible:ring-[3px] focus-visible:ring-ring/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-card'
          : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary/60',
        className
      )}
    >
      {selected && <Check weight="bold" className="-ml-1 size-3.5" />}
      {label}
    </button>
  )
}
