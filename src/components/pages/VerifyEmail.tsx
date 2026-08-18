import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Field, FieldError } from '~/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '~/components/ui/input-otp'
import ApplicationRoutes from '~/config/routes'
import {
  verifyEmailSchema,
  type VerifyEmailFormData,
} from '~/lib/validators/auth'
import useAuthStore from '~/store/zustand/auth.zustand'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const userEmail = useAuthStore((state) => state.userEmail)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: '',
    },
  })

  useEffect(() => {
    if (!userEmail) {
      navigate({ to: ApplicationRoutes.AUTH.REGISTER })
    }
  }, [userEmail, navigate])

  const onSubmit = handleSubmit(async () => {
    navigate({ to: ApplicationRoutes.AUTH.LOGIN })
  })

  const handleResend = async () => {
    if (!userEmail || isResending) return

    setIsResending(true)
    setResendMessage(null)

    await new Promise((resolve) => setTimeout(resolve, 500))

    setResendMessage('A new code has been sent to your email.')
    setIsResending(false)
  }

  if (!userEmail) {
    return null
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F5F5F5] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-black">Verify your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a 4-digit code to{' '}
            <span className="font-medium text-gray-700">{userEmail}</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <Field data-invalid={!!errors.token}>
            <Controller
              name="token"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={4}
                  value={field.value}
                  onChange={field.onChange}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup className="gap-3">
                    {Array.from({ length: 4 }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-14 rounded-lg border border-gray-200 text-lg font-medium first:rounded-lg first:border-l last:rounded-lg aria-invalid:border-destructive"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <FieldError errors={[errors.token]} />
          </Field>

          {resendMessage && (
            <p className="text-center text-sm text-green-600" role="status">
              {resendMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-blue-600 text-base text-white hover:bg-blue-700"
          >
            Verify email
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Didn&apos;t receive a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend code'}
          </button>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          Wrong email?{' '}
          <Link
            to={ApplicationRoutes.AUTH.REGISTER}
            className="font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Go back
          </Link>
        </p>
      </div>
    </div>
  )
}
