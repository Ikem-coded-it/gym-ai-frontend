import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import onboardingService from '~/services/onboarding.service'
import useAuthStore from '~/store/zustand/auth.zustand'
import useOnboardingStore from '~/store/zustand/onboarding.zustand'

/** Leaves onboarding without saving a routine and goes straight to the dashboard. */
export default function SkipOnboardingButton() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const resetOnboarding = useOnboardingStore((state) => state.reset)

  const skipMutation = useMutation({
    mutationFn: () => onboardingService.skipOnboarding(),
    onSuccess: async () => {
      // The server now says this user is onboarded; keep the local copy in step.
      const { currentUser, updateCurrentUser } = useAuthStore.getState()
      if (currentUser) updateCurrentUser({ ...currentUser, hasOnboarded: true })
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      resetOnboarding()
      navigate({ to: ApplicationRoutes.DASHBOARD.AI_COACH })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={skipMutation.isPending}
      onClick={() => skipMutation.mutate()}
      className="rounded-full px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
    >
      {skipMutation.isPending ? 'Skipping...' : 'Skip'}
    </Button>
  )
}
