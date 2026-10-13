export function sort<T>(
  items: readonly T[],
  selector: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...items].sort((left, right) => {
    const leftValue = selector(left);
    const rightValue = selector(right);
    const comparison =
      typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue), 'pt-PT');

    return comparison * multiplier;
  });
}
