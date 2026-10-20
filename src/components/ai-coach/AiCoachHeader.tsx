import { Robot } from '@phosphor-icons/react'

export default function AiCoachHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-3 px-4">
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card"
        >
          <Robot className="size-5" weight="fill" />
        </span>
        <h1 className="flex-1 text-base font-semibold text-foreground">
          Today&apos;s Session
        </h1>
        {/* <button
          type="button"
          className="rounded-full px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
        >
          Edit
        </button> */}
      </div>
    </header>
  )
}
