import { createFileRoute } from '@tanstack/react-router'
import AiCoachChat from '~/components/pages/dashboard/AiCoachChat'

export const Route = createFileRoute('/dashboard/ai-coach')({
  component: AiCoachChat,
})
