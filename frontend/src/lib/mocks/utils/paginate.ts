import type {
  PaginatedResult,
  PaginationParams,
} from '../types/mock.types';

export function paginate<T>(
  items: readonly T[],
  params: PaginationParams = {},
): PaginatedResult<T> {
  const pageSize = Math.max(1, Math.floor(params.pageSize ?? 100));
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pageCount, Math.max(1, Math.floor(params.page ?? 1)));
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
  };
}
