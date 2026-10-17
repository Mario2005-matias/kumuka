export function CoursePageSkeleton() {
  return (
    <div aria-label="A carregar curso" className="animate-pulse space-y-7">
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-surface-2" />
        <div className="h-10 w-2/3 rounded bg-surface-2" />
        <div className="h-5 max-w-2xl rounded bg-surface-2" />
        <div className="h-5 max-w-xl rounded bg-surface-2" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_19rem]">
        <div className="h-48 rounded-xl bg-surface-2" />
        <div className="h-48 rounded-xl bg-surface-2" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-36 rounded-xl bg-surface-2" />
        <div className="h-36 rounded-xl bg-surface-2" />
      </div>
      <div className="h-56 rounded-xl bg-surface-2" />
    </div>
  );
}
