import { Suspense, useEffect, useRef, useState, type ElementType } from 'react';

type LazyHomeSectionProps = {
  component: ElementType;
  heading?: string;
  placeholderClassName?: string;
};

export function LazyHomeSection({
  component: Section,
  heading,
  placeholderClassName = 'min-h-80 sm:min-h-96',
}: LazyHomeSectionProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder) return;

    let observer: IntersectionObserver | undefined;
    const fallbackTimer = window.setTimeout(() => setShouldLoad(true), 1800);

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          window.clearTimeout(fallbackTimer);
          setShouldLoad(true);
          observer?.disconnect();
        },
        { rootMargin: '1200px 0px' },
      );
      observer.observe(placeholder);
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      className={
        shouldLoad
          ? 'contents'
          : `flex ${placeholderClassName} items-center justify-center`
      }
      ref={placeholderRef}
    >
      {shouldLoad ? (
        <Suspense
          fallback={
            <HomeSectionPlaceholder
              className={placeholderClassName}
              heading={heading}
            />
          }
        >
          <Section />
        </Suspense>
      ) : (
        <HomeSectionPlaceholder
          className={placeholderClassName}
          heading={heading}
        />
      )}
    </div>
  );
}

function HomeSectionPlaceholder({
  className,
  heading,
}: {
  className: string;
  heading?: string;
}) {
  if (!heading) {
    return <div aria-hidden="true" className={className} />;
  }

  const headingId = `home-section-${heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <section
      aria-labelledby={headingId}
      className={`flex ${className} items-center justify-center`}
    >
      <div className="container text-center">
        <h2
          className="text-2xl font-semibold tracking-tight text-muted-foreground sm:text-3xl"
          id={headingId}
        >
          {heading}
        </h2>
      </div>
    </section>
  );
}
