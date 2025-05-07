import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export type SigninSchemaProps = z.infer<typeof signinSchema>;

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(5, {
        message: 'Username must be minimum length of 5 characters',
      })
      .toLowerCase(),
    email: z.string().email({ message: 'Enter a valid email' }).toLowerCase(),
    password: z
      .string()
      .min(5, { message: 'Password must be between 5-20 characters long' })
      .max(20, { message: 'Password must be between 5-20 characters long' }),
    confirmPassword: z.string().min(1, {
      message: 'Confirm password is required',
    }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpSchemaProps = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
});

export type forgotPasswordProps = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(5, {
    message: 'Required',
  }),
});

export type resetPasswordProps = z.infer<typeof resetPasswordSchema>;
