export function filter<T>(
  items: readonly T[],
  predicate: (item: T) => boolean,
): T[] {
  return items.filter(predicate);
}
