import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'A password deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'O email é obrigatório')
      .email('Email inválido'),
    password: z
      .string()
      .min(6, 'A password deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma a password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatório')
    .email('Email inválido'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'A password deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma a password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;