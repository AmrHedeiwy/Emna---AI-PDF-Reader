import { z } from 'zod';

export const LoginCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' })
});

export const CreateAccountCredentialsValidator = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().min(1, { message: 'Required' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type TLoginCredentialsValidator = z.infer<typeof LoginCredentialsValidator>;
export type TCreateAccountCredentialsValidator = z.infer<
  typeof CreateAccountCredentialsValidator
>;
