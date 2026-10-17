import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction<'auth'>) =>
  z.object({
    email: z
      .string()
      .min(1, t('login.requiredEmail'))
      .email(t('login.invalidEmail')),
    password: z
      .string()
      .min(6, t('login.shortPassword', { count: 6 })),
  });

export const createRegisterSchema = (t: TFunction<'auth'>) =>
  z
    .object({
      email: z
        .string()
        .min(1, t('register.requiredEmail'))
        .email(t('register.invalidEmail')),
      password: z
        .string()
        .min(6, t('register.shortPassword', { count: 6 })),
      confirmPassword: z.string().min(1, t('register.confirmPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('register.passwordMismatch'),
      path: ['confirmPassword'],
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
        .min(6, t('register.shortPassword', { count: 6 })),
      confirmPassword: z.string().min(1, t('register.confirmPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('register.passwordMismatch'),
      path: ['confirmPassword'],
    });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;