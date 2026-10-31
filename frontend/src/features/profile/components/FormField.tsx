import { useId } from 'react';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  /** Renders a textarea instead of a single-line input. */
  multiline?: boolean;
  type?: 'text' | 'url' | 'number';
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
}

/** Labelled input or textarea used by the profile forms. */
export function FormField({ label, value, onChange, hint, multiline, type = 'text', ...rest }: FormFieldProps) {
  const id = useId();
  const shared = {
    'aria-describedby': hint ? `${id}-hint` : undefined,
    id,
    value,
    ...rest,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium" htmlFor={id}>{label}</label>
        {multiline && rest.maxLength && (
          <span className="text-xs tabular-nums text-muted-foreground">{value.length}/{rest.maxLength}</span>
        )}
      </div>
      {multiline ? (
        <textarea
          className="min-h-28 w-full rounded-xl border border-input bg-background/60 p-3 text-base leading-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          onChange={(event) => onChange(event.currentTarget.value)}
          {...shared}
        />
      ) : (
        <Input
          inputMode={type === 'number' ? 'numeric' : undefined}
          onChange={(event) => onChange(event.currentTarget.value)}
          type={type}
          {...shared}
        />
      )}
      {hint && <p className="text-xs text-muted-foreground" id={`${id}-hint`}>{hint}</p>}
    </div>
  );
}
