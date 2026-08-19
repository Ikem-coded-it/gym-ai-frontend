import { ArrowUp, User } from '@phosphor-icons/react'
import { type FormEvent, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

type ChatInputBarProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInputBar({ onSend, disabled }: ChatInputBarProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const trimmed = value.trim()
    if (!trimmed) return

    onSend(trimmed)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-x-0 bottom-16 z-10 border-t border-gray-200 bg-white px-4 py-3"
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
          <User className="size-4 text-blue-600" weight="fill" />
        </div>

        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Log your set..."
            disabled={disabled}
            className="h-11 rounded-full border-0 bg-gray-100 px-4 pr-12 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-600"
          />
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !value.trim()}
            className="absolute top-1/2 right-1 size-9 -translate-y-1/2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            aria-label="Send message"
          >
            <ArrowUp weight="bold" className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
