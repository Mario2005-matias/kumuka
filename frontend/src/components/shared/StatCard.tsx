import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  delta?: string;
  color?: string,
  deltaTone?: 'success' | 'destructive' | 'neutral';
}

export function StatCard({
  color,
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
    <Card className="relative border-border bg-gradient-to-br from-surface-1 to-card hover:scale-105 duration-300">
      <div className='absolute top-0 right-0 h-20 w-20 blur-3xl bg-blue-500 z-0'></div>
      <CardContent className="flex items-start justify-between gap-4 px-4 z-10">
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
        <span className={`${color} flex size-14 shrink-0 items-center justify-center rounded-xl  text-primary`}>
          <Icon aria-hidden="true" className="size-6 text-white" />
        </span>
      </CardContent>
    </Card>
  );
}
