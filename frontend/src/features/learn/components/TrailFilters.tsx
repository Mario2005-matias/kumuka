import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TrailLevel } from '@/types/trail';
import { useTranslation } from 'react-i18next';

export interface TrailFilterValues {
  pesquisa: string;
  nivel: TrailLevel | '';
  duracao: '' | 'menos-5' | '5-10' | 'mais-10';
  categoria: string;
}

interface TrailFiltersProps {
  value: TrailFilterValues;
  categories: string[];
  onChange: (value: TrailFilterValues) => void;
  onClear: () => void;
}

const selectClass =
  'min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm';

function parseLevel(value: string): TrailLevel | '' {
  return value === 'iniciante' || value === 'intermedio' || value === 'avancado'
    ? value
    : '';
}

function parseDuration(value: string): TrailFilterValues['duracao'] {
  return value === 'menos-5' || value === '5-10' || value === 'mais-10'
    ? value
    : '';
}

export function TrailFilters({
  value,
  categories,
  onChange,
  onClear,
}: TrailFiltersProps) {
  const { t } = useTranslation('learning');
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(15rem,2fr)_repeat(3,minmax(9rem,1fr))_auto] lg:items-end">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <label
          className="mb-2 block text-sm font-medium"
          htmlFor="trail-search"
        >
          {t('trailFilters.search')}
        </label>
        <Search
          aria-hidden="true"
          className="absolute left-3 top-[2.65rem] size-4 text-muted-foreground"
        />
        <Input
          className="min-h-11 pl-9"
          id="trail-search"
          onChange={(event) =>
            onChange({ ...value, pesquisa: event.currentTarget.value })
          }
          placeholder={t('trailFilters.searchPlaceholder')}
          type="search"
          value={value.pesquisa}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="trail-level">
          {t('courseFilters.level')}
        </label>
        <select
          className={selectClass}
          id="trail-level"
          onChange={(event) =>
            onChange({
              ...value,
              nivel: parseLevel(event.currentTarget.value),
            })
          }
          value={value.nivel}
        >
          <option value="">{t('common.all')}</option>
          <option value="iniciante">{t('courseFilters.beginner')}</option>
          <option value="intermedio">{t('courseFilters.intermediate')}</option>
          <option value="avancado">{t('courseFilters.advanced')}</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="trail-duration">
          {t('courseFilters.duration')}
        </label>
        <select
          className={selectClass}
          id="trail-duration"
          onChange={(event) =>
            onChange({
              ...value,
              duracao: parseDuration(event.currentTarget.value),
            })
          }
          value={value.duracao}
        >
          <option value="">{t('common.all')}</option>
          <option value="menos-5">{t('courseFilters.lessThanFiveHours')}</option>
          <option value="5-10">{t('courseFilters.fiveToTenHours')}</option>
          <option value="mais-10">{t('courseFilters.moreThanTenHours')}</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="trail-category">
          {t('courseFilters.category')}
        </label>
        <select
          className={selectClass}
          id="trail-category"
          onChange={(event) =>
            onChange({ ...value, categoria: event.currentTarget.value })
          }
          value={value.categoria}
        >
          <option value="">{t('common.all')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <Button
        className="min-h-11 w-full sm:col-span-2 lg:col-span-1"
        onClick={onClear}
        type="button"
        variant="outline"
      >
        <X aria-hidden="true" />
        {t('courseFilters.clear')}
      </Button>
    </div>
  );
}
