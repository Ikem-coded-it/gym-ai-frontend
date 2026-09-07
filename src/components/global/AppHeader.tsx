'use client'

import { List } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'
import ProfileMenu from '~/components/global/ProfileMenu'

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

      <ProfileMenu />
    </header>
  )
}
