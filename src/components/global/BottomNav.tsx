import {
  Barbell,
  Robot,
  User,
} from '@phosphor-icons/react'
import { Link, useRouterState } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'
import { cn } from '~/lib/utils'

const navItems = [
  {
    label: 'AI Coach',
    to: ApplicationRoutes.DASHBOARD.AI_COACH,
    icon: Robot,
    matchPaths: [ApplicationRoutes.DASHBOARD.AI_COACH],
  },
  {
    label: 'Workout',
    to: ApplicationRoutes.DASHBOARD.index,
    icon: Barbell,
    matchPaths: [ApplicationRoutes.DASHBOARD.index, '/dashboard/'],
  },
  {
    label: 'Profile',
    to: ApplicationRoutes.DASHBOARD.PROFILE,
    icon: User,
    matchPaths: [ApplicationRoutes.DASHBOARD.PROFILE],
  },
] as const

export default function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="mx-auto flex h-16 max-w-md items-stretch px-2">
        {navItems.map(({ label, to, icon: Icon, matchPaths }) => {
          const isActive = matchPaths.some(
            (path) => pathname === path || pathname === `${path}/`
          )

          return (
            <li key={label} className="flex flex-1">
              <Link
                to={to}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/30',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-14 items-center justify-center rounded-full transition-colors',
                    isActive ? 'bg-secondary' : 'group-hover:bg-muted'
                  )}
                >
                  <Icon
                    className="size-5"
                    weight={isActive ? 'fill' : 'regular'}
                  />
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
