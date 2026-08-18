import z from 'zod';

/** POST /auth/login */
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/** Customer registration – POST /auth/signup */
export const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

/** POST /auth/verify-email */
export const verifyEmailSchema = z.object({
  token: z
    .string()
    .length(4, 'Enter the 4-digit code')
    .regex(/^\d{4}$/, 'Code must be 4 digits'),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
