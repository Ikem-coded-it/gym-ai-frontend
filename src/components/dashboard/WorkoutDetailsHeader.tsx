'use client'

import { ArrowLeft, DotsThreeVertical, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
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
      await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all })
      toast.success('Workout deleted')
      navigate({ to: ApplicationRoutes.DASHBOARD.index })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteWorkout = () => {
    setMenuOpen(false)

    const label = workoutLabel ? ` "${workoutLabel}"` : ''
    const confirmed = window.confirm(
      `Delete this workout${label}? This cannot be undone.`,
    )
    if (!confirmed) return

    deleteMutation.mutate()
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => router.history.back()}
        className="text-blue-600"
        aria-label="Go back"
      >
        <ArrowLeft className="size-6" weight="bold" />
      </button>

      <Link
        to={ApplicationRoutes.DASHBOARD.index}
        className="font-heading text-lg text-blue-600"
      >
        GymAI
      </Link>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          className="text-blue-600 outline-none"
          aria-label="Workout options"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <DotsThreeVertical className="size-6" weight="bold" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className={cn(
              'absolute right-0 z-50 mt-2 min-w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-md',
            )}
          >
            <button
              type="button"
              role="menuitem"
              disabled={deleteMutation.isPending}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              onClick={handleDeleteWorkout}
            >
              <Trash className="size-4" />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete workout'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
