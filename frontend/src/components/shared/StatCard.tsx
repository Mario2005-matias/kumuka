import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  delta?: string;
  deltaTone?: 'success' | 'destructive' | 'neutral';
}

export function StatCard({
  label,
  value,
  icon: Icon,
  description,
  delta,
  deltaTone = 'neutral',
}: StatCardProps) {
  const deltaColor = {
    success: 'text-success',
    destructive: 'text-destructive',
    neutral: 'text-muted-foreground',
  }[deltaTone];

  return (
    <Card className="border-border bg-gradient-to-br from-surface-1 to-card">
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
            {value}
          </p>
          {(description || delta) && (
            <p className={`mt-2 text-xs ${delta ? deltaColor : 'text-muted-foreground'}`}>
              {delta ?? description}
            </p>
          )}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}
