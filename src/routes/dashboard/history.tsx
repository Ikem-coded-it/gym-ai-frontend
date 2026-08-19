import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/history')({
  component: HistoryPage,
})

function HistoryPage() {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center px-6">
      <p className="text-center text-gray-500">History coming soon.</p>
    </div>
  )
}
