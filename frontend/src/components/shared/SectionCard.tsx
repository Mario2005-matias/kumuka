import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  id,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn('scroll-mt-24 border-border bg-card', className)} id={id}>
      <CardHeader className="flex-row items-start justify-between gap-4 p-5 sm:p-6">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </CardHeader>
      <CardContent className={cn('px-5 pb-5 sm:px-6 sm:pb-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
