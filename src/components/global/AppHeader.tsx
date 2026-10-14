'use client'

import { List } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'
import BrandMark from '~/components/global/BrandMark'
import ProfileMenu from '~/components/global/ProfileMenu'

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-2">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          aria-label="Open menu"
        >
          <List className="size-6" />
        </button>

        <Link
          to={ApplicationRoutes.HOME}
          className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
        >
          <BrandMark />
        </Link>

        <ProfileMenu />
      </div>
    </header>
  )
}
