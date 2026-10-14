'use client'

import { ArrowLeft, DotsThreeVertical, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import DeleteWorkoutConfirmDialog from '~/components/dashboard/DeleteWorkoutConfirmDialog'
import BrandMark from '~/components/global/BrandMark'
import ApplicationRoutes from '~/config/routes'
import { workoutQueryKeys } from '~/lib/constants/workout'
import { cn } from '~/lib/utils'
import workoutService from '~/services/workout.service'

type WorkoutDetailsHeaderProps = {
  workoutId: string
  workoutLabel?: string
}

export default function WorkoutDetailsHeader({
  workoutId,
  workoutLabel,
}: WorkoutDetailsHeaderProps) {
  const router = useRouter()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const deleteMutation = useMutation({
    mutationFn: () => workoutService.deleteWorkout(workoutId),
    onSuccess: async () => {
      setDeleteDialogOpen(false)
      await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all })
      toast.success('Workout deleted')
      navigate({ to: ApplicationRoutes.DASHBOARD.index })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleOpenDeleteDialog = () => {
    setMenuOpen(false)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate()
  }

  const deleteDescription = workoutLabel
    ? `Delete "${workoutLabel}"? This cannot be undone.`
    : 'Delete this workout? This cannot be undone.'

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-2">
      <button
        type="button"
        onClick={() => router.history.back()}
        className="flex size-10 items-center justify-center rounded-full text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/30"
        aria-label="Go back"
      >
        <ArrowLeft className="size-5" weight="bold" />
      </button>

      <Link
        to={ApplicationRoutes.DASHBOARD.index}
        className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
      >
        <BrandMark />
      </Link>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          className={cn('flex size-10 items-center justify-center rounded-full text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/30', menuOpen && 'bg-muted')}
          aria-label="Workout options"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <DotsThreeVertical className="size-5" weight="bold" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 min-w-44 origin-top-right animate-in rounded-xl bg-popover p-1 shadow-float ring-1 ring-foreground/5 duration-100 fade-in-0 zoom-in-95"
          >
            <button
              type="button"
              role="menuitem"
              disabled={deleteMutation.isPending}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
              onClick={handleOpenDeleteDialog}
            >
              <Trash className="size-4" />
              Delete workout
            </button>
          </div>
        )}
      </div>
      </div>

      <DeleteWorkoutConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        description={deleteDescription}
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </header>
  )
}
