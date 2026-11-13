import { ArrowRight, Check } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import BrandMark from '~/components/global/BrandMark'
import ChatPreview from '~/components/landing/ChatPreview'
import LandingHeader from '~/components/landing/LandingHeader'
import PlanPreview from '~/components/landing/PlanPreview'
import WorkoutPreview from '~/components/landing/WorkoutPreview'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import {
  COACH_HIGHLIGHTS,
  LANDING_FEATURES,
  LANDING_STEPS,
} from '~/lib/constants/landing'

function SignUpButton({ children }: { children: string }) {
  return (
    <Button
      render={<Link to={ApplicationRoutes.AUTH.REGISTER} />}
      nativeButton={false}
      size="lg"
      className="h-12 rounded-full px-7 text-base"
    >
      {children}
      <ArrowRight weight="bold" className="size-4" />
    </Button>
  )
}

export default function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_top_right,var(--color-secondary),transparent_65%)]"
          />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-24">
            <div>
              <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
                AI-powered strength training
              </p>
              <h1 className="mt-5 font-heading text-5xl leading-[1.05] text-balance text-foreground sm:text-6xl">
                Your gym coach, in your pocket
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Chat with GymAI to plan your week, build workouts for the
                muscles you want to train, and log every set. No spreadsheets,
                no guesswork.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SignUpButton>Get started</SignUpButton>
                <Button
                  render={<Link to={ApplicationRoutes.AUTH.LOGIN} />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full px-7 text-base"
                >
                  I already have an account
                </Button>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Works in your browser and installs to your home screen.
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <ChatPreview />
            </div>
          </div>
        </section>

        {/* AI coach spotlight */}
        <section
          id="features"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-6 sm:px-6"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--color-secondary),var(--color-background))] px-6 py-12 ring-1 ring-foreground/5 sm:px-12 md:py-16">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-primary-foreground uppercase">
                    AI coach
                  </span>
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                    Planning by conversation
                  </span>
                </div>
                <h2 className="mt-5 font-heading text-4xl leading-tight text-balance text-foreground sm:text-5xl">
                  Plan a workout by just saying so
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Tell GymAI what you want to train. It asks for the day and
                  the muscle groups, makes sure the day is free, and builds
                  the session with you one question at a time.
                </p>

                <ul className="mt-6 space-y-3">
                  {COACH_HIGHLIGHTS.map((item) => (
                    <li key={item} className="flex gap-3 text-base text-foreground">
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check weight="bold" className="size-3" />
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <SignUpButton>Meet your coach</SignUpButton>
                </div>
              </div>

              <div className="flex justify-center gap-5 lg:justify-end">
                <WorkoutPreview />
                <PlanPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl leading-tight text-balance text-foreground sm:text-5xl">
              Built for the way you actually train
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The small details that make logging a workout quick enough to do
              between sets.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LANDING_FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-3xl bg-card p-6 shadow-card ring-1 ring-foreground/5"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <feature.icon weight="fill" className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-16 sm:px-6 md:pb-24"
        >
          <h2 className="font-heading text-4xl leading-tight text-balance text-foreground sm:text-5xl">
            Up and training in three steps
          </h2>

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {LANDING_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-card">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Closing call to action */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
          <div className="rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <h2 className="font-heading text-4xl leading-tight text-balance sm:text-5xl">
              Ready for your first session?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
              Create an account and have your week planned in minutes.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                render={<Link to={ApplicationRoutes.AUTH.REGISTER} />}
                nativeButton={false}
                variant="secondary"
                size="lg"
                className="h-12 rounded-full px-7 text-base"
              >
                Create your account
                <ArrowRight weight="bold" className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <BrandMark />
          <nav aria-label="Account" className="flex items-center gap-6 text-sm">
            <Link
              to={ApplicationRoutes.AUTH.LOGIN}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              to={ApplicationRoutes.AUTH.REGISTER}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign up
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GymAI
          </p>
        </div>
      </footer>
    </div>
  )
}
