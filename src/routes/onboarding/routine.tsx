import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/routine')({
  component: () => <Outlet />,
})
