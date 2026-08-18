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
  return (
    <Field data-invalid={!!error}>
      <FieldLabel
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-gray-500"
      >
        {label}
      </FieldLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(
          'h-auto rounded-none border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-base shadow-none',
          'placeholder:text-gray-400 focus-visible:border-blue-600 focus-visible:ring-0',
          'aria-invalid:border-destructive aria-invalid:ring-0'
        )}
        {...registration}
      />
      <FieldError errors={[error]} />
    </Field>
  )
}
