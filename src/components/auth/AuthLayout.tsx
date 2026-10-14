import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import BrandMark from '~/components/global/BrandMark'
import ApplicationRoutes from '~/config/routes'

type AuthLayoutProps = {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export default function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-4 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10 sm:justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Link
            to={ApplicationRoutes.HOME}
            className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
          >
            <BrandMark size="md" />
          </Link>
        </div>

        <div className="mt-8 rounded-3xl bg-card p-6 shadow-card ring-1 ring-foreground/5 sm:p-8">
          <div className="text-center">
            <h1 className="font-heading text-[1.75rem] leading-tight text-balance text-foreground sm:text-3xl">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          <div className="mt-8">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 space-y-3 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
