import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-lg bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}
