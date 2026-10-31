import { createElement } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  delta?: string;
  deltaTone?: 'success' | 'destructive' | 'neutral';
}

/** Summary number in the platform card style: brand tile with the icon, then label and value. */
export function StatCard({
  label,
  value,
  icon,
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
    <article className="reveal flex h-full items-center gap-4 rounded-[1.75rem] border border-border/70 bg-card p-2.5 elevated">
      <span
        aria-hidden="true"
        className="flex size-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-[image:var(--gradient-brand)] text-[color:var(--on-brand)]"
      >
        <span className="glass flex size-10 items-center justify-center rounded-xl">
          {createElement(icon, { className: 'size-5' })}
        </span>
      </span>
      <div className="min-w-0 py-1 pr-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground [overflow-wrap:normal]">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
        {(description || delta) && (
          <p className={`mt-0.5 line-clamp-2 text-xs ${delta ? deltaColor : 'text-muted-foreground'}`}>
            {delta ?? description}
          </p>
        )}
      </div>
    </article>
  );
}
