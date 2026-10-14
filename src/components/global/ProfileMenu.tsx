'use client'

import { SignOut, User } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'
import { cn } from '~/lib/utils'

export default function ProfileMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className={cn(
          'flex size-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/30',
          open ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted'
        )}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-muted ring-1 ring-foreground/5">
          <User className="size-4" weight="bold" />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-44 origin-top-right animate-in fade-in-0 zoom-in-95 rounded-xl bg-popover p-1 shadow-float ring-1 ring-foreground/5 duration-100"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            onClick={() => {
              setOpen(false)
              navigate({ to: ApplicationRoutes.AUTH.LOGOUT })
            }}
          >
            <SignOut className="size-4 text-muted-foreground" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
