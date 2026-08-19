import {
  Barbell,
  ClockCounterClockwise,
  Robot,
  User,
} from '@phosphor-icons/react'
import { Link, useRouterState } from '@tanstack/react-router'
import ApplicationRoutes from '~/config/routes'
import { cn } from '~/lib/utils'

const navItems = [
  {
    label: 'Workout',
    to: ApplicationRoutes.DASHBOARD.index,
    icon: Barbell,
    matchPaths: [ApplicationRoutes.DASHBOARD.index, '/dashboard/'],
  },
  {
    label: 'AI Coach',
    to: ApplicationRoutes.DASHBOARD.AI_COACH,
    icon: Robot,
    matchPaths: [ApplicationRoutes.DASHBOARD.AI_COACH],
  },
  {
    label: 'History',
    to: ApplicationRoutes.DASHBOARD.HISTORY,
    icon: ClockCounterClockwise,
    matchPaths: [ApplicationRoutes.DASHBOARD.HISTORY],
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
    <nav className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white px-4 pb-3 pt-2">
      <ul className="mx-auto flex max-w-md items-center justify-between">
        {navItems.map(({ label, to, icon: Icon, matchPaths }) => {
          const isActive = matchPaths.some(
            (path) => pathname === path || pathname === `${path}/`
          )

          return (
            <li key={label}>
              <Link
                to={to}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-400'
                )}
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-xl',
                    isActive && 'bg-blue-50'
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
