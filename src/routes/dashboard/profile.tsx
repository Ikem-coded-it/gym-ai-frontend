import { UserCircle } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import EmptyState from '~/components/global/EmptyState'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="mx-auto flex min-h-[50dvh] w-full max-w-md items-center px-6">
      <EmptyState
        icon={UserCircle}
        title="Profile coming soon."
        className="w-full"
      />
    </div>
  )
}
