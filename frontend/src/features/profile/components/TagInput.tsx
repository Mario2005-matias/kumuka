import { useId, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface TagInputProps {
  label: string;
  hint: string;
  value: string[];
  onChange: (value: string[]) => void;
  max: number;
}

/** Free-text tags: Enter or comma adds one, the × removes it. */
export function TagInput({ label, hint, value, onChange, max }: TagInputProps) {
  const { t } = useTranslation('profile');
  const [draft, setDraft] = useState('');
  const id = useId();
  const isFull = value.length >= max;

  function commit() {
    const tag = draft.trim().replace(/,$/, '').slice(0, 60);
    if (tag && !isFull && !value.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }
    setDraft('');
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>{label}</label>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <li className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-1 py-1 pl-3 pr-1 text-xs font-medium" key={tag}>
              {tag}
              <button
                aria-label={t('edit.removeTag', { tag })}
                className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onChange(value.filter((item) => item !== tag))}
                type="button"
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Input
        aria-describedby={`${id}-hint`}
        disabled={isFull}
        id={id}
        onBlur={commit}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            commit();
          }
        }}
        value={draft}
      />
      <p className="text-xs text-muted-foreground" id={`${id}-hint`}>
        {isFull ? t('edit.tagsFull', { count: max }) : hint}
      </p>
    </div>
  );
}
