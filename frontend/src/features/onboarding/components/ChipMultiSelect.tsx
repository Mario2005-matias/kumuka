import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ChipMultiSelectProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export function ChipMultiSelect({
  label,
  options,
  selected,
  onToggle,
}: ChipMultiSelectProps) {
  return (
    <div aria-label={label} className="flex flex-wrap gap-2" role="group">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            aria-pressed={isSelected}
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all',
              'hover:border-primary/50 hover:bg-accent/50',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground',
            )}
          >
            {isSelected && <Check className="h-3.5 w-3.5" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}