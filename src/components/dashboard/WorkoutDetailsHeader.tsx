import { ArrowLeft, DotsThreeVertical } from '@phosphor-icons/react'
import { Link, useRouter } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'

export default function WorkoutDetailsHeader() {
  const router = useRouter()

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

      <button
        type="button"
        className="text-blue-600"
        aria-label="Workout options"
      >
        <DotsThreeVertical className="size-6" weight="bold" />
      </button>
    </header>
  )
}
