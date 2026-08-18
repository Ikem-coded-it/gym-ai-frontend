import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from '@phosphor-icons/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import AuthDivider from '~/components/auth/AuthDivider'
import AuthFormField from '~/components/auth/AuthFormField'
import GoogleAuthButton from '~/components/auth/GoogleAuthButton'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import {
  signupSchema,
  type SignupFormData,
} from '~/lib/validators/auth'
import useAuthStore from '~/store/zustand/auth.zustand'

export default function Register() {
  const navigate = useNavigate()
  const updateEmail = useAuthStore((state) => state.updateEmail)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    updateEmail(data.email)
    navigate({ to: ApplicationRoutes.AUTH.VERIFY_EMAIL })
  })

  return (
    <div className="min-h-dvh bg-[#F5F5F5] px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <Link
            to={ApplicationRoutes.HOME}
            className="font-heading text-2xl text-blue-600"
          >
            GymAI
          </Link>
          <h1 className="font-heading mt-6 text-3xl text-black">
            Create your Blueprint
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start your structured fitness journey today.
          </p>
        </div>

        <div className="mt-8">
          <GoogleAuthButton label="Sign up with Google" />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#F5F5F5] px-3 text-xs uppercase tracking-wide text-gray-400">
              Or sign up with email
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <AuthFormField
              id="firstName"
              label="First name"
              placeholder="Enter first name"
              error={errors.firstName}
              registration={register('firstName')}
            />

            <AuthFormField
              id="lastName"
              label="Last name"
              placeholder="Enter last name"
              error={errors.lastName}
              registration={register('lastName')}
            />

            <AuthFormField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
              error={errors.email}
              registration={register('email')}
            />

            <AuthFormField
              id="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              error={errors.password}
              registration={register('password')}
            />

            <AuthFormField
              id="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              registration={register('confirmPassword')}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-blue-600 text-base text-white hover:bg-blue-700"
            >
              Create Account
              <ArrowRight weight="bold" className="size-4" />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to={ApplicationRoutes.AUTH.LOGIN}
            className="font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
