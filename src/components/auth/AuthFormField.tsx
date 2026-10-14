import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useState } from 'react'
import type {
  FieldError as RHFFieldError,
  UseFormRegisterReturn,
} from 'react-hook-form'
import {
  Field,
  FieldError,
  FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

type AuthFormFieldProps = {
  id: string
  label: string
  type?: React.ComponentProps<'input'>['type']
  placeholder?: string
  error?: RHFFieldError
  registration: UseFormRegisterReturn
}

export default function AuthFormField({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  registration,
}: AuthFormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && isPasswordVisible ? 'text' : type

  return (
    <Field data-invalid={!!error}>
      <FieldLabel
        htmlFor={id}
        className="text-[13px] font-medium text-foreground/80"
      >
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn(isPasswordField && 'pr-11')}
          {...registration}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isPasswordVisible ? (
              <EyeSlash className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        )}
      </div>
      <FieldError errors={[error]} />
    </Field>
  )
}
