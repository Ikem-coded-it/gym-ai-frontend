import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import AuthLayout from '~/components/auth/AuthLayout'
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
    <AuthLayout
      title="Verify your email"
      description={
        <>
          We sent a 4-digit code to{' '}
          <span className="font-medium text-foreground">{userEmail}</span>
        </>
      }
      footer={
        <>
          <p>
            Didn&apos;t receive a code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </p>
          <p>
            Wrong email?{' '}
            <Link
              to={ApplicationRoutes.AUTH.REGISTER}
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Go back
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
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
                      className="size-14 rounded-xl border border-input text-xl font-semibold first:rounded-xl first:border-l last:rounded-xl aria-invalid:border-destructive"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          <FieldError errors={[errors.token]} className="text-center" />
        </Field>

        {resendMessage && (
          <p
            className="rounded-xl bg-emerald-50 px-4 py-2.5 text-center text-sm text-emerald-700"
            role="status"
          >
            {resendMessage}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          Verify email
        </Button>
      </form>
    </AuthLayout>
  )
}
