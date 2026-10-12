import { Button } from '@/components/ui/button';

interface ChipMultiSelectProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function ChipMultiSelect({
  label,
  options,
  selected,
  onChange,
}: ChipMultiSelectProps) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <Button
              aria-pressed={isSelected}
              className="rounded-full"
              key={option}
              onClick={() => toggle(option)}
              type="button"
              variant={isSelected ? 'default' : 'outline'}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
}