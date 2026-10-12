import { Button } from '@/components/ui/button';

interface SelectableCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export function SelectableCard({
  title,
  description,
  selected,
  onSelect,
}: SelectableCardProps) {
  return (
    <Button
      aria-pressed={selected}
      className={`h-auto min-h-16 w-full justify-start whitespace-normal border p-4 text-left ${
        selected
          ? 'border-primary bg-primary/5 text-foreground'
          : 'border-border bg-background text-foreground'
      }`}
      onClick={onSelect}
      type="button"
      variant="outline"
    >
      <span className="flex flex-col gap-1">
        <span className="font-medium">{title}</span>
        {description && (
          <span className="text-sm font-normal text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </Button>
  );
}