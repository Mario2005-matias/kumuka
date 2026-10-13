import type { User } from '@/types/user';

export interface MockHandler<TParams, TResult> {
  (params: TParams): Promise<TResult>;
}

export interface MockConfig {
  latency: { min: number; max: number };
  userId: string;
  simulateErrors: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface MockUser extends User {
  password: string;
}
