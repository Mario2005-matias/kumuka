import { createElement, type ReactNode } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CoverImage } from '@/components/shared/CoverImage';
import { categoryIcon } from '@/lib/categoryIcon';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  /** Makes the whole card a link. Without it the card is informational. */
  to?: string;
  /** Cover picture. Without it the card shows the brand gradient with `icon`. */
  image?: string | null;
  /** Icon drawn on the gradient when there is no image (defaults to the category icon). */
  icon?: LucideIcon;
  /** Large content (e.g. a number) drawn on the gradient instead of the icon. */
  figure?: ReactNode;
  /** Height of the visual block: a full cover or a shorter banner for info cards. */
  visual?: 'cover' | 'banner' | 'none';
  title: string;
  description?: ReactNode;
  /** Lines shown before the description is cut; 0 shows it in full. */
  descriptionLines?: 0 | 2 | 3;
  /** Category chip shown under the visual, with a matching icon. */
  category?: string;
  /** Small frosted label on the visual's bottom-right corner (e.g. "Novo"). */
  badge?: string | null;
  /** Element on the visual's bottom-left corner (e.g. a logo or a step number). */
  overlay?: ReactNode;
  /** Status or meta shown next to the category chip. */
  aside?: ReactNode;
  headingLevel?: 'h2' | 'h3';
  children?: ReactNode;
  className?: string;
}

const descriptionClamp = { 0: '', 2: 'line-clamp-2', 3: 'line-clamp-3' } as const;

/**
 * The single card style used across the platform: inset rounded visual, category chip,
 * strong title and a short description. Links lift on hover.
 */
export function MediaCard({
  to,
  image,
  icon,
  figure,
  visual = 'cover',
  title,
  description,
  descriptionLines = 2,
  category,
  badge,
  overlay,
  aside,
  headingLevel: Heading = 'h2',
  children,
  className,
}: MediaCardProps) {
  const visualIcon = icon ?? (category ? categoryIcon(category) : undefined);
  const classes = cn(
    'reveal group flex h-full flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-card p-2.5 elevated transition-[transform,border-color,box-shadow] duration-300',
    to && 'hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    visual === 'none' && 'pt-4',
    className,
  );

  const content = (
    <>
      {visual !== 'none' && (
        <div className="relative overflow-hidden rounded-[1.35rem]">
          <CoverImage className={visual === 'cover' ? 'aspect-[16/10]' : 'aspect-[16/7]'} src={image} />
          {!image && figure && (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-tight text-[color:var(--on-brand)] sm:text-5xl">
              {figure}
            </span>
          )}
          {!image && !figure && visualIcon && (
            <span aria-hidden="true" className="glass absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110">
              {createElement(visualIcon, { className: 'size-7' })}
            </span>
          )}
          {overlay && <div className="absolute bottom-3 left-3">{overlay}</div>}
          {badge && (
            <span className="glass absolute bottom-3 right-3 max-w-[70%] truncate rounded-full px-3.5 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
        {(category || aside) && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {category && (
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface-1 px-3.5 py-1.5 text-xs font-medium text-foreground">
                {createElement(categoryIcon(category), { 'aria-hidden': true, className: 'size-3.5 shrink-0 text-primary' })}
                <span className="truncate">{category}</span>
              </span>
            )}
            {aside}
          </div>
        )}
        <Heading className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">{title}</Heading>
        {description && (
          <div className={cn('text-sm leading-6 text-muted-foreground', descriptionClamp[descriptionLines])}>{description}</div>
        )}
        {children && <div className="mt-auto space-y-3 pt-1">{children}</div>}
      </div>
    </>
  );

  return to ? (
    <Link className={classes} to={to}>
      {content}
    </Link>
  ) : (
    <article className={classes}>{content}</article>
  );
}

/** Call-to-action line at the bottom of a linked card; the whole card is the link. */
export function MediaCardAction({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
      {children}
      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  );
}
