export default function ServerErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">500</h1>
      <p className="text-muted-foreground">Algo correu mal do nosso lado.</p>
    </div>
  );
}