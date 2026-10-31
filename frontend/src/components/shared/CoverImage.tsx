import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CoverImageProps {
  src: string | null | undefined;
  className?: string;
  /** Overlaid content (badges, logos) placed over a soft bottom shade. */
  children?: ReactNode;
  /** Load immediately for above-the-fold heroes. */
  priority?: boolean;
}

/**
 * Cover picture with the brand gradient as fallback. Decorative: the title is always shown
 * next to it, so the image has no alt text.
 */
export function CoverImage({ src, className, children, priority = false }: CoverImageProps) {
  return (
    <div className={cn('relative isolate overflow-hidden bg-[image:var(--gradient-brand)]', className)}>
      {src && (
        <img
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          src={src}
        />
      )}
      {children && (
        <>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="relative flex size-full items-end justify-between gap-3 p-4 sm:p-5">{children}</div>
        </>
      )}
    </div>
  );
}

interface CompanyLogoProps {
  name: string;
  src: string | null | undefined;
  className?: string;
}

/** Company logo on a frosted tile, or its initials when there is no logo. */
export function CompanyLogo({ name, src, className }: CompanyLogoProps) {
  return (
    <div className={cn('flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-card/90 text-lg font-bold text-primary shadow-lg ring-1 ring-white/40 backdrop-blur', className)}>
      {src ? (
        <img alt={name} className="size-full object-cover" decoding="async" loading="lazy" src={src} />
      ) : (
        name.slice(0, 2).toLocaleUpperCase()
      )}
    </div>
  );
}
