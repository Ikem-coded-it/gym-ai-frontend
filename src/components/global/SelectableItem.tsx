import { Check } from '@phosphor-icons/react'
import { cn } from '~/lib/utils'

type SelectableItemProps<T> = {
  label: string
  value: T
  selected: boolean
  onSelect: (value: T) => void
  description?: string
  disabled?: boolean
  className?: string
}

export default function SelectableItem<T>({
  label,
  value,
  selected,
  onSelect,
  description,
  disabled = false,
  className,
}: SelectableItemProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left shadow-card outline-none transition-all active:scale-[0.99]',
        'focus-visible:ring-[3px] focus-visible:ring-ring/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'bg-secondary text-primary ring-2 ring-primary'
          : 'bg-card text-foreground ring-1 ring-foreground/5 hover:ring-primary/30',
        className
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-base font-semibold">{label}</span>
        {description && (
          <span
            className={cn(
              'text-sm',
              selected ? 'text-primary/80' : 'text-muted-foreground'
            )}
          >
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full transition-colors',
          selected
            ? 'bg-primary text-primary-foreground'
            : 'border-2 border-border'
        )}
      >
        {selected && <Check weight="bold" className="size-3.5" />}
      </span>
    </button>
  )
}
