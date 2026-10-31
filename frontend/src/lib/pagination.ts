/** Reads the 1-based `pagina` query parameter used by paginated lists. */
export function pageFromSearch(search: URLSearchParams): number {
  const page = Number(search.get('pagina') ?? '1');
  return Number.isInteger(page) && page > 0 ? page : 1;
}
