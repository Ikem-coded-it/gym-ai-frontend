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
        'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-blue-600 bg-blue-50 text-blue-600'
          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
        className
      )}
    >
      {selected && (
        <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check weight="bold" className="size-2.5" />
        </span>
      )}
      {label}
    </button>
  )
}
