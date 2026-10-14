'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import AuthDivider from '~/components/auth/AuthDivider'
import AuthFormField from '~/components/auth/AuthFormField'
import AuthLayout from '~/components/auth/AuthLayout'
import GoogleAuthButton from '~/components/auth/GoogleAuthButton'
import { Button } from '~/components/ui/button'
import ApplicationRoutes from '~/config/routes'
import type { ISignupPayload } from '~/lib/interfaces/auth'
import {
  signupSchema,
  type SignupFormData,
} from '~/lib/validators/auth'
import authService from '~/services/auth.service'
import useAuthStore from '~/store/zustand/auth.zustand'

export default function Register() {
  const navigate = useNavigate()
  const updateEmail = useAuthStore((state) => state.updateEmail)

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const signupMutation = useMutation({
    mutationFn: (payload: ISignupPayload) => authService.signup(payload),
    onSuccess: (_data, variables) => {
      toast.success('Account created! Please sign in.')
      updateEmail(variables.email)
      navigate({ to: ApplicationRoutes.AUTH.LOGIN })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const submitSignup = handleSubmit((data) => {
    signupMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    })
  })

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitSignup(event)
  }

  return (
    <AuthLayout
      title="Create your Blueprint"
      description="Start your structured fitness journey today."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to={ApplicationRoutes.AUTH.LOGIN}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Login
          </Link>
        </p>
      }
    >
      <GoogleAuthButton label="Sign up with Google" />

      <AuthDivider>or sign up with email</AuthDivider>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
        </div>

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
          size="lg"
          disabled={signupMutation.isPending}
          className="w-full"
        >
          {signupMutation.isPending ? 'Creating account...' : 'Create Account'}
          <ArrowRight weight="bold" className="size-4" />
        </Button>
      </form>
    </AuthLayout>
  )
}
