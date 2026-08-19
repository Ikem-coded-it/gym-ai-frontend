import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center px-6">
      <p className="text-center text-gray-500">Profile coming soon.</p>
    </div>
  )
}
