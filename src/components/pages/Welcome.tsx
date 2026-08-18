import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'

export default function Welcome() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F5]">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading text-4xl tracking-tight text-black">
          GymAI
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Progressive overload, simplified.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 px-6 pb-12">
        <Button
          render={<Link to={ApplicationRoutes.AUTH.LOGIN} />}
          nativeButton={false}
          className="h-12 w-full max-w-sm rounded-lg bg-blue-600 text-base text-white hover:bg-blue-700"
        >
          Login
        </Button>

        <Link
          to={ApplicationRoutes.AUTH.REGISTER}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
