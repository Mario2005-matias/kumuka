import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'A carregar...',
  className,
}: LoadingStateProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'space-y-4 py-8',
        className,
      )}
    >
      <span className="sr-only">{message}</span>
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40 sm:hidden lg:block" />
      </div>
    </div>
  );
}