import { Link } from '@tanstack/react-router'
import BrandMark from '~/components/global/BrandMark'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
] as const

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-10">
          <Link
            to={ApplicationRoutes.HOME}
            aria-label="GymAI home"
            className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
          >
            <BrandMark />
          </Link>

          <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            render={<Link to={ApplicationRoutes.AUTH.LOGIN} />}
            nativeButton={false}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Log in
          </Button>
          <Button
            render={<Link to={ApplicationRoutes.AUTH.REGISTER} />}
            nativeButton={false}
            className="rounded-full px-4"
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  )
}
