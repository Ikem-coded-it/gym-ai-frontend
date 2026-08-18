import { List, UserCircle } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <button
        type="button"
        className="text-gray-700"
        aria-label="Open menu"
      >
        <List className="size-6" />
      </button>

      <Link
        to={ApplicationRoutes.HOME}
        className="font-heading text-lg text-blue-600"
      >
        GymAI
      </Link>

      <button
        type="button"
        className="text-gray-400"
        aria-label="Open profile"
      >
        <UserCircle className="size-8" weight="duotone" />
      </button>
    </header>
  )
}
