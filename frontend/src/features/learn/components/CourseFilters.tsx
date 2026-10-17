import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Course, CourseLevel } from '@/types/course';

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
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(14rem,2fr)_repeat(4,minmax(8rem,1fr))_auto] xl:items-end">
      <div className="relative sm:col-span-2 xl:col-span-1">
        <label className="mb-2 block text-sm font-medium" htmlFor="course-search">
          Pesquisar cursos
        </label>
        <Search aria-hidden="true" className="absolute left-3 top-[2.65rem] size-4 text-muted-foreground" />
        <Input
          className="min-h-11 pl-9"
          id="course-search"
          onChange={(event) => onChange({ ...value, pesquisa: event.currentTarget.value })}
          placeholder="Ex.: Excel"
          type="search"
          value={value.pesquisa}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-level">Nível</label>
        <select
          className={selectClass}
          id="course-level"
          onChange={(event) => onChange({ ...value, nivel: parseLevel(event.currentTarget.value) })}
          value={value.nivel}
        >
          <option value="">Todos</option>
          <option value="iniciante">Iniciante</option>
          <option value="intermedio">Intermédio</option>
          <option value="avancado">Avançado</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-duration">Duração</label>
        <select
          className={selectClass}
          id="course-duration"
          onChange={(event) => onChange({ ...value, duracao: parseDuration(event.currentTarget.value) })}
          value={value.duracao}
        >
          <option value="">Todas</option>
          <option value="menos-5">Menos de 5 horas</option>
          <option value="5-10">5 a 10 horas</option>
          <option value="mais-10">Mais de 10 horas</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-category">Categoria</label>
        <select
          className={selectClass}
          id="course-category"
          onChange={(event) => onChange({ ...value, categoria: event.currentTarget.value })}
          value={value.categoria}
        >
          <option value="">Todas</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="course-access">Acesso</label>
        <select
          className={selectClass}
          id="course-access"
          onChange={(event) => onChange({ ...value, acesso: parseAccess(event.currentTarget.value) })}
          value={value.acesso}
        >
          <option value="">Todos</option>
          <option value="free">Grátis</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <Button className="min-h-11 w-full sm:col-span-2 xl:col-span-1" onClick={onClear} type="button" variant="outline">
        <X aria-hidden="true" />
        Limpar filtros
      </Button>
    </div>
  );
}
