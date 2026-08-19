import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import AppHeader from '~/components/global/AppHeader'
import BottomNav from '~/components/global/BottomNav'
import ApplicationRoutes from '~/config/routes'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isWorkoutDetail = pathname.startsWith('/dashboard/workout/')
  const isAiCoach =
    pathname === ApplicationRoutes.DASHBOARD.AI_COACH ||
    pathname === `${ApplicationRoutes.DASHBOARD.AI_COACH}/`

  if (isWorkoutDetail) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F5]">
      {!isAiCoach && <AppHeader />}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
