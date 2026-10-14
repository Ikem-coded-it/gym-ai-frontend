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
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-border/70 bg-card/90 px-4 py-3 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-md items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="size-4 text-primary" weight="fill" />
        </div>

        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Log your set..."
            disabled={disabled}
            className="rounded-full border-transparent bg-muted pr-12 pl-4 focus-visible:bg-card"
          />
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !value.trim()}
            className="absolute top-1/2 right-1 size-9 -translate-y-1/2 rounded-full"
            aria-label="Send message"
          >
            <ArrowUp weight="bold" className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
