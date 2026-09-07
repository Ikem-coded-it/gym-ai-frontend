'use client'

import { SignOut, UserCircle } from '@phosphor-icons/react'
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
        className="text-gray-400 outline-none"
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <UserCircle className="size-8" weight="duotone" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 z-50 mt-2 min-w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-md',
          )}
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setOpen(false)
              navigate({ to: ApplicationRoutes.AUTH.LOGOUT })
            }}
          >
            <SignOut className="size-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
