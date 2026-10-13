import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Status = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
}

const styles: Record<Status, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
  neutral: 'bg-muted text-muted-foreground',
};

export function StatusBadge({
  status,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium',
        styles[status],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
