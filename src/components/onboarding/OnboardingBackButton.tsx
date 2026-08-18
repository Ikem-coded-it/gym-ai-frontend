import { ArrowLeft } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export default function OnboardingBackButton() {
  const router = useRouter()

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => router.history.back()}
      className="size-10 shrink-0 rounded-full border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
      aria-label="Go back"
    >
      <ArrowLeft className="size-5" />
    </Button>
  )
}
