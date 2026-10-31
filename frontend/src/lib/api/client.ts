import axios, { isAxiosError } from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      useAuthStore.getState().token
    ) {
      void import('@/features/auth/session').then(({ endSession }) =>
        endSession('expired'),
      );
    }
    return Promise.reject(error);
  },
);

/** Laravel resources wrap their payload in `data`. */
export interface ApiEnvelope<T> {
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export async function getData<T>(url: string, params?: object): Promise<T> {
  const { data } = await api.get<ApiEnvelope<T>>(url, { params });
  return data.data;
}

export async function getPage<T>(url: string, params?: object): Promise<Paginated<T>> {
  const { data } = await api.get<Paginated<T>>(url, { params });
  return data;
}

/**
 * Extracts a human-readable message from an API error, preferring the first
 * Laravel validation message over the generic Axios message.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const body = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    const firstValidation = body?.errors
      ? Object.values(body.errors)[0]?.[0]
      : undefined;
    if (firstValidation) return firstValidation;
    if (body?.message) return body.message;
    if (!error.response) return fallback;
  }
  return fallback;
}

export function apiStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}
