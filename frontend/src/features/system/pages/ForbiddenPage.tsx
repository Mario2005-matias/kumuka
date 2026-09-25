export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">403</h1>
      <p className="text-muted-foreground">Não tens permissão para aceder.</p>
    </div>
  );
}