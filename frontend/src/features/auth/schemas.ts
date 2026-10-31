import { z } from 'zod';
import type { TFunction } from 'i18next';

/** Must match the backend rule (Password::min(8)). */
export const PASSWORD_MIN_LENGTH = 8;

export const createLoginSchema = (t: TFunction<'auth'>) =>
  z.object({
    email: z
      .string()
      .min(1, t('login.requiredEmail'))
      .email(t('login.invalidEmail')),
    password: z.string().min(1, t('login.requiredPassword')),
  });

export const createForgotPasswordSchema = (t: TFunction<'auth'>) =>
  z.object({
    email: z
      .string()
      .min(1, t('login.requiredEmail'))
      .email(t('login.invalidEmail')),
  });

export const createResetPasswordSchema = (t: TFunction<'auth'>) =>
  z
    .object({
      password: z
        .string()
        .min(PASSWORD_MIN_LENGTH, t('register.shortPassword', { count: PASSWORD_MIN_LENGTH })),
      confirmPassword: z.string().min(1, t('register.confirmPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('register.passwordMismatch'),
      path: ['confirmPassword'],
    });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
