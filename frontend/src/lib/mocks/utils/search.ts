export function search<T>(
  items: readonly T[],
  query: string,
  keys: readonly (keyof T)[],
): T[] {
  const normalizedQuery = query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-PT');

  if (!normalizedQuery) return [...items];

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return (
        typeof value === 'string' &&
        value
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleLowerCase('pt-PT')
          .includes(normalizedQuery)
      );
    }),
  );
}
