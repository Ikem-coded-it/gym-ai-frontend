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
        'flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'bg-blue-50 text-blue-600'
          : 'bg-white text-gray-900 hover:bg-gray-50',
        className
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-base font-medium">{label}</span>
        {description && (
          <span
            className={cn(
              'text-sm',
              selected ? 'text-blue-500' : 'text-gray-500'
            )}
          >
            {description}
          </span>
        )}
      </span>
      {selected && (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check weight="bold" className="size-3.5" />
        </span>
      )}
    </button>
  )
}
