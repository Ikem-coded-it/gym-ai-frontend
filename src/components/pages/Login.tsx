import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import AuthDivider from '~/components/auth/AuthDivider'
import AuthFormField from '~/components/auth/AuthFormField'
import GoogleAuthButton from '~/components/auth/GoogleAuthButton'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import {
  loginSchema,
  type LoginFormData,
} from '~/lib/validators/auth'
import useAuthStore from '~/store/zustand/auth.zustand'

export default function Login() {
  const navigate = useNavigate()
  const userEmail = useAuthStore((state) => state.userEmail)
  const updateEmail = useAuthStore((state) => state.updateEmail)
  const updateIsLoggedIn = useAuthStore((state) => state.updateIsLoggedIn)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: userEmail ?? '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    updateEmail(data.email)
    updateIsLoggedIn(true)
    navigate({ to: ApplicationRoutes.ONBOARDING.SCHEDULE })
  })

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F5F5F5] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-black">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue your progress.
          </p>
        </div>

        <div className="mt-8">
          <GoogleAuthButton label="Sign in with Google" />
        </div>

        <AuthDivider>or</AuthDivider>

        <form onSubmit={onSubmit} className="space-y-6">
          <AuthFormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
            registration={register('email')}
          />

          <div className="space-y-2">
            <AuthFormField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              registration={register('password')}
            />
            <div className="flex justify-end">
              <Link
                to={ApplicationRoutes.AUTH.FORGOT_PASSWORD}
                className="text-xs text-gray-500 transition-colors hover:text-gray-700"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-blue-600 text-base text-white hover:bg-blue-700"
          >
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            to={ApplicationRoutes.AUTH.REGISTER}
            className="font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
