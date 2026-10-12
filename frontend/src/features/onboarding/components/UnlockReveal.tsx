interface UnlockRevealProps {
  title: string;
  description: string;
}

export function UnlockReveal({ title, description }: UnlockRevealProps) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
      <div
        aria-hidden="true"
        className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground"
      >
        ✨
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}