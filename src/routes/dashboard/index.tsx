import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F5F5F5] px-6">
      <p className="text-center text-gray-500">
        Dashboard coming soon — onboarding complete.
      </p>
    </div>
  )
}
