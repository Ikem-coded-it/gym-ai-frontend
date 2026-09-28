import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Spinner } from '~/components/ui/spinner'

const AiCoachChat = lazy(
  () => import('~/components/pages/dashboard/AiCoachChat')
)

function AiCoachRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner className="size-6 text-blue-600" />
        </div>
      }
    >
      <AiCoachChat />
    </Suspense>
  )
}

export const Route = createFileRoute('/dashboard/ai-coach')({
  component: AiCoachRoute,
})
