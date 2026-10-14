'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
import type { ILoginPayload } from '~/lib/interfaces/auth'
import {
  loginSchema,
  type LoginFormData,
} from '~/lib/validators/auth'
import authService from '~/services/auth.service'
import useAuthStore from '~/store/zustand/auth.zustand'
import { mapMeToUser } from '~/lib/utils/auth'
import { saveAccessToken } from '~/utils/auth-token'

export default function Login() {
  const navigate = useNavigate()
  const userEmail = useAuthStore((state) => state.userEmail)
  const updateEmail = useAuthStore((state) => state.updateEmail)
  const updateIsLoggedIn = useAuthStore((state) => state.updateIsLoggedIn)
  const updateAuthToken = useAuthStore((state) => state.updateAuthToken)

  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: userEmail ?? '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (payload: ILoginPayload) => {
      const loginData = await authService.login(payload)
      saveAccessToken(loginData.access_token)
      const user = await authService.getMe()
      return { loginData, user, email: payload.email }
    },
    onSuccess: ({ loginData, user, email }) => {
      updateAuthToken(loginData.access_token)
      updateEmail(email)
      updateCurrentUser(mapMeToUser(user))
      updateIsLoggedIn(true)
      toast.success('Welcome back!')
      navigate({
        to: user.has_onboarded
          ? ApplicationRoutes.DASHBOARD.index
          : ApplicationRoutes.ONBOARDING.SCHEDULE,
      })
    },
    onError: (error: Error) => {
      // console.log("Login error:", error)
      toast.error(error.message)
    },
  })

  const submitLogin = handleSubmit((data) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    })
  })

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    void submitLogin(event)
  }

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to continue your progress."
      footer={
        <p>
          Don&apos;t have an account?{' '}
          <Link
            to={ApplicationRoutes.AUTH.REGISTER}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <GoogleAuthButton label="Sign in with Google" />

      <AuthDivider>or continue with email</AuthDivider>

      <form
        onSubmit={onSubmit}
        noValidate
        method="post"
        action="#"
        className="space-y-5"
      >
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
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loginMutation.isPending}
          className="w-full"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </AuthLayout>
  )
}
