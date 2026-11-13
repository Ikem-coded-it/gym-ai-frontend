import { ArrowUp, Robot } from '@phosphor-icons/react'
import PhoneFrame from '~/components/landing/PhoneFrame'
import { cn } from '~/lib/utils'

function Bubble({
  from,
  children,
}: {
  from: 'user' | 'coach'
  children: string
}) {
  return (
    <div className={cn('flex', from === 'user' ? 'justify-end' : 'justify-start')}>
      <p
        className={cn(
          'max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-snug',
          from === 'user'
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : 'rounded-bl-md bg-card text-foreground shadow-card ring-1 ring-foreground/5'
        )}
      >
        {children}
      </p>
    </div>
  )
}

function Chip({ children, selected }: { children: string; selected?: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full border px-2.5 py-1 text-[10px] font-medium',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground'
      )}
    >
      {children}
    </span>
  )
}

/** Static picture of the AI coach chat: scheduling a workout with quick-tap options. */
export default function ChatPreview() {
  return (
    <PhoneFrame label="The GymAI coach chat, planning a workout for Thursday">
      <div className="flex items-center gap-2 border-b border-border/70 bg-card px-3 py-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Robot weight="fill" className="size-3.5" />
        </span>
        <span className="text-[11px] font-semibold text-foreground">Today&apos;s Session</span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 bg-muted/50 px-3 py-3">
        <Bubble from="user">I want to schedule a workout</Bubble>
        <Bubble from="coach">Which day works for you?</Bubble>
        <div className="flex flex-wrap justify-start gap-1.5">
          <Chip>Tuesday</Chip>
          <Chip selected>Thursday</Chip>
          <Chip>Saturday</Chip>
        </div>
        <Bubble from="user">Thursday</Bubble>
        <Bubble from="coach">Thursday is free. What are you training?</Bubble>
        <div className="flex flex-wrap justify-start gap-1.5">
          <Chip selected>Back</Chip>
          <Chip selected>Arms</Chip>
          <Chip>Legs</Chip>
          <Chip>Core</Chip>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border/70 bg-card px-3 py-2.5">
        <span className="flex-1 rounded-full bg-muted px-3 py-1.5 text-[10px] text-muted-foreground">
          Log your set...
        </span>
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/40 text-primary-foreground">
          <ArrowUp weight="bold" className="size-3" />
        </span>
      </div>
    </PhoneFrame>
  )
}
