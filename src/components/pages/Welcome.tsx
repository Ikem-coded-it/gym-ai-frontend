import { Link } from '@tanstack/react-router'
import BrandMark from '~/components/global/BrandMark'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'

export default function Welcome() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60dvh] bg-[radial-gradient(ellipse_at_top,var(--color-secondary),transparent_70%)]"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="sr-only">GymAI</h1>
        <BrandMark size="lg" />
        <p className="mt-4 text-base text-muted-foreground">
          Progressive overload, simplified.
        </p>
      </div>

      <div className="relative mx-auto flex w-full max-w-sm flex-col gap-3 px-6 pb-[max(env(safe-area-inset-bottom),3rem)]">
        <Button
          render={<Link to={ApplicationRoutes.AUTH.LOGIN} />}
          nativeButton={false}
          size="lg"
          className="w-full"
        >
          Login
        </Button>

        <Button
          render={<Link to={ApplicationRoutes.AUTH.REGISTER} />}
          nativeButton={false}
          variant="ghost"
          size="lg"
          className="w-full text-muted-foreground hover:text-foreground"
        >
          Sign Up
        </Button>
      </div>
    </div>
  )
}
