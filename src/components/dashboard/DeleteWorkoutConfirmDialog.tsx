'use client'

import { Trash, X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'

type DeleteWorkoutConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  description: string
  isPending: boolean
  onConfirm: () => void
  title?: string
  confirmLabel?: string
}

export default function DeleteWorkoutConfirmDialog({
  open,
  onOpenChange,
  description,
  isPending,
  onConfirm,
  title = 'Delete workout',
  confirmLabel = 'Delete workout',
}: DeleteWorkoutConfirmDialogProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange, isPending])

  const handleClose = () => {
    if (isPending) return
    onOpenChange(false)
  }

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close delete workout dialog"
        className="absolute inset-0 animate-in bg-foreground/40 backdrop-blur-[2px] fade-in-0 duration-150"
        onClick={handleClose}
        disabled={isPending}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-workout-title"
        aria-describedby="delete-workout-description"
        className="relative z-10 max-h-[92dvh] w-full max-w-md animate-in overflow-y-auto rounded-t-3xl bg-card p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-float duration-200 fade-in-0 slide-in-from-bottom-8 sm:rounded-3xl sm:pb-6 sm:zoom-in-95 sm:slide-in-from-bottom-0"
      >
        <div aria-hidden="true" className="mx-auto -mt-2 mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <button
          type="button"
          onClick={handleClose}
          disabled={isPending}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Trash weight="duotone" className="size-6" />
        </span>

        <div className="mt-4 pr-8">
          <h2
            id="delete-workout-title"
            className="text-lg font-semibold text-foreground"
          >
            {title}
          </h2>
          <p id="delete-workout-description" className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="sm:min-w-28"
            disabled={isPending}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="sm:min-w-28"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? 'Deleting...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
