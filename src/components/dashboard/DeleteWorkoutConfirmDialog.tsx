'use client'

import { X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'

type DeleteWorkoutConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  description: string
  isPending: boolean
  onConfirm: () => void
}

export default function DeleteWorkoutConfirmDialog({
  open,
  onOpenChange,
  description,
  isPending,
  onConfirm,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close delete workout dialog"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        disabled={isPending}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-workout-title"
        aria-describedby="delete-workout-description"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isPending}
          className="absolute top-3 right-3 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="pr-8">
          <h2
            id="delete-workout-title"
            className="font-heading text-xl text-black"
          >
            Delete workout
          </h2>
          <p id="delete-workout-description" className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg"
            disabled={isPending}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-lg"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? 'Deleting...' : 'Delete workout'}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
