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

type FormFieldProps = {
  id: string
  label: string
  type?: React.ComponentProps<'input'>['type']
  placeholder?: string
  error?: RHFFieldError
  registration: UseFormRegisterReturn
}

export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  registration,
}: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && isPasswordVisible ? 'text' : type

  return (
    <Field data-invalid={!!error}>
      <FieldLabel
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-gray-500"
      >
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn(
            'h-auto rounded-none border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-base shadow-none',
            'placeholder:text-gray-400 focus-visible:border-blue-600 focus-visible:ring-0',
            'aria-invalid:border-destructive aria-invalid:ring-0',
            isPasswordField && 'pr-9',
          )}
          {...registration}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-0 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
          >
            {isPasswordVisible ? (
              <EyeSlash weight="bold" className="size-5" />
            ) : (
              <Eye weight="bold" className="size-5" />
            )}
          </button>
        )}
      </div>
      <FieldError errors={[error]} />
    </Field>
  )
}
