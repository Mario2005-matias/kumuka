import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Course, CourseLevel } from '@/types/course';
import { useTranslation } from 'react-i18next';

export interface CourseFilterValues {
  pesquisa: string;
  nivel: CourseLevel | '';
  duracao: '' | 'menos-5' | '5-10' | 'mais-10';
  categoria: string;
  acesso: '' | Course['acesso'];
}

interface CourseFiltersProps {
  value: CourseFilterValues;
  categories: string[];
  onChange: (value: CourseFilterValues) => void;
  onClear: () => void;
}

const selectClass =
  'min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm';

function parseLevel(value: string): CourseLevel | '' {
  return value === 'iniciante' || value === 'intermedio' || value === 'avancado' ? value : '';
}

function parseDuration(value: string): CourseFilterValues['duracao'] {
  return value === 'menos-5' || value === '5-10' || value === 'mais-10' ? value : '';
}

function parseAccess(value: string): CourseFilterValues['acesso'] {
  return value === 'free' || value === 'premium' ? value : '';
}

export function CourseFilters({
  value,
  categories,
  onChange,
  onClear,
}: CourseFiltersProps) {
  const { t } = useTranslation('learning');
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(14rem,2fr)_repeat(4,minmax(8rem,1fr))_auto] xl:items-end">
      <div className="relative sm:col-span-2 xl:col-span-1">
        <label className="mb-2 block text-sm font-medium" htmlFor="course-search">
          {t('courseFilters.search')}
        </label>
        <Search aria-hidden="true" className="absolute left-3 top-[2.65rem] size-4 text-muted-foreground" />
        <Input
          className="min-h-11 pl-9"
          id="course-search"
          onChange={(event) => onChange({ ...value, pesquisa: event.currentTarget.value })}
          placeholder={t('courseFilters.searchPlaceholder')}
          type="search"
          value={value.pesquisa}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-level">{t('courseFilters.level')}</label>
        <select
          className={selectClass}
          id="course-level"
          onChange={(event) => onChange({ ...value, nivel: parseLevel(event.currentTarget.value) })}
          value={value.nivel}
        >
          <option value="">{t('common.all')}</option>
          <option value="iniciante">{t('courseFilters.beginner')}</option>
          <option value="intermedio">{t('courseFilters.intermediate')}</option>
          <option value="avancado">{t('courseFilters.advanced')}</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-duration">{t('courseFilters.duration')}</label>
        <select
          className={selectClass}
          id="course-duration"
          onChange={(event) => onChange({ ...value, duracao: parseDuration(event.currentTarget.value) })}
          value={value.duracao}
        >
          <option value="">{t('common.all')}</option>
          <option value="menos-5">{t('courseFilters.lessThanFiveHours')}</option>
          <option value="5-10">{t('courseFilters.fiveToTenHours')}</option>
          <option value="mais-10">{t('courseFilters.moreThanTenHours')}</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-category">{t('courseFilters.category')}</label>
        <select
          className={selectClass}
          id="course-category"
          onChange={(event) => onChange({ ...value, categoria: event.currentTarget.value })}
          value={value.categoria}
        >
          <option value="">{t('common.all')}</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-access">{t('courseFilters.access')}</label>
        <select
          className={selectClass}
          id="course-access"
          onChange={(event) => onChange({ ...value, acesso: parseAccess(event.currentTarget.value) })}
          value={value.acesso}
        >
          <option value="">{t('common.all')}</option>
          <option value="free">{t('courseFilters.free')}</option>
          <option value="premium">{t('courseFilters.premium')}</option>
        </select>
      </div>
      <Button className="min-h-11 w-full sm:col-span-2 xl:col-span-1" onClick={onClear} type="button" variant="outline">
        <X aria-hidden="true" />
        {t('courseFilters.clear')}
      </Button>
    </div>
  );
}
