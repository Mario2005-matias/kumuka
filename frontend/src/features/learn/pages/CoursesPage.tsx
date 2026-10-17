import { useEffect, useRef, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/features/learn/components/CourseCard';
import {
  CourseFilters,
  type CourseFilterValues,
} from '@/features/learn/components/CourseFilters';
import { useCourseProgressList } from '@/features/learn/hooks/useCourseFlow';
import { useCourses } from '@/features/learn/hooks/useCourses';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { Course, CourseLevel } from '@/types/course';
import { useTranslation } from 'react-i18next';

const storageKey = 'kumuka-courses-filters';
const emptyFilters: CourseFilterValues = {
  pesquisa: '',
  nivel: '',
  duracao: '',
  categoria: '',
  acesso: '',
};

function parseLevel(value: string): CourseLevel | '' {
  return value === 'iniciante' || value === 'intermedio' || value === 'avancado' ? value : '';
}

function parseDuration(value: string): CourseFilterValues['duracao'] {
  return value === 'menos-5' || value === '5-10' || value === 'mais-10' ? value : '';
}

function parseAccess(value: string): CourseFilterValues['acesso'] {
  return value === 'free' || value === 'premium' ? value : '';
}

function isLevel(value: unknown): value is CourseLevel | '' {
  return value === '' || value === 'iniciante' || value === 'intermedio' || value === 'avancado';
}

function isDuration(value: unknown): value is CourseFilterValues['duracao'] {
  return value === '' || value === 'menos-5' || value === '5-10' || value === 'mais-10';
}

function isAccess(value: unknown): value is CourseFilterValues['acesso'] {
  return value === '' || value === 'free' || value === 'premium';
}

function fromSearch(search: URLSearchParams): CourseFilterValues {
  return {
    pesquisa: search.get('q') ?? '',
    nivel: parseLevel(search.get('nivel') ?? ''),
    duracao: parseDuration(search.get('duracao') ?? ''),
    categoria: search.get('categoria') ?? '',
    acesso: parseAccess(search.get('acesso') ?? ''),
  };
}

function hasFilters(search: URLSearchParams) {
  return ['q', 'nivel', 'duracao', 'categoria', 'acesso'].some((key) => search.has(key));
}

function initialState(search: URLSearchParams) {
  if (hasFilters(search)) return { filters: fromSearch(search), error: null };
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return { filters: emptyFilters, error: null };
    const parsed: unknown = JSON.parse(saved);
    if (
      typeof parsed !== 'object' || parsed === null ||
      !('pesquisa' in parsed) || typeof parsed.pesquisa !== 'string' ||
      !('nivel' in parsed) || !isLevel(parsed.nivel) ||
      !('duracao' in parsed) || !isDuration(parsed.duracao) ||
      !('categoria' in parsed) || typeof parsed.categoria !== 'string' ||
      !('acesso' in parsed) || !isAccess(parsed.acesso)
    ) {
      throw new Error('Os filtros de cursos guardados têm um formato inválido.');
    }
    return {
      filters: {
        pesquisa: parsed.pesquisa,
        nivel: parsed.nivel,
        duracao: parsed.duracao,
        categoria: parsed.categoria,
        acesso: parsed.acesso,
      },
      error: null,
    };
  } catch (error: unknown) {
    return {
      filters: emptyFilters,
      error: error instanceof Error ? error.message : 'Não foi possível ler os filtros guardados.',
    };
  }
}

function CourseCardSkeleton() {
  return (
    <div aria-hidden="true" className="h-[23rem] animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="h-24 rounded-lg bg-surface-2" />
      <div className="mt-5 h-5 w-3/4 rounded bg-surface-2" />
      <div className="mt-3 h-4 rounded bg-surface-2" />
      <div className="mt-2 h-4 w-5/6 rounded bg-surface-2" />
      <div className="mt-6 h-4 w-1/2 rounded bg-surface-2" />
      <div className="mt-8 h-11 rounded-lg bg-surface-2" />
    </div>
  );
}

export default function CoursesPage() {
  const { t } = useTranslation('learning');
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const lastSearch = useRef(searchParams.toString());
  const [initial] = useState(() => initialState(searchParams));
  const [filters, setFilters] = useState<CourseFilterValues>(initial.filters);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const query = {
    search: debouncedFilters.pesquisa.trim() || undefined,
    nivel: debouncedFilters.nivel || undefined,
    duracao: debouncedFilters.duracao || undefined,
    categoria: debouncedFilters.categoria || undefined,
    acesso: debouncedFilters.acesso || undefined,
  };
  const courses = useCourses(query);
  const allCourses = useCourses();
  const courseProgress = useCourseProgressList(userId);
  const categories = Array.from(new Set([
    ...(allCourses.data ?? []).map((course) => course.categoria),
    ...(debouncedFilters.categoria ? [debouncedFilters.categoria] : []),
  ])).sort((left, right) => left.localeCompare(right, 'pt'));

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedFilters(filters), 300);
    return () => window.clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const search = searchParams.toString();
    if (search === lastSearch.current) return;
    lastSearch.current = search;
    setFilters(fromSearch(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const entries: Record<string, string> = {
      q: debouncedFilters.pesquisa.trim(),
      nivel: debouncedFilters.nivel,
      duracao: debouncedFilters.duracao,
      categoria: debouncedFilters.categoria,
      acesso: debouncedFilters.acesso,
    };
    Object.entries(entries).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    const nextSearch = next.toString();
    if (nextSearch !== searchParams.toString()) {
      lastSearch.current = nextSearch;
      setSearchParams(next, { replace: true });
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(debouncedFilters));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Não foi possível guardar os filtros.';
      window.setTimeout(() => setStorageError(message), 0);
    }
  }, [debouncedFilters, searchParams, setSearchParams]);

  const progressByCourse = new Map(
    (courseProgress.data ?? []).map((progress) => [progress.courseId, progress]),
  );
  function clearFilters() {
    setStorageError(null);
    setFilters(emptyFilters);
    setDebouncedFilters(emptyFilters);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={<Link className="hover:text-foreground" to={ROUTES.learn.root}>{t('hub.title')}</Link>}
        description={t('courseList.description')}
        title={t('courseList.title')}
      />
      <CourseFilters
        categories={categories}
        onChange={(next) => {
          setStorageError(null);
          setFilters(next);
        }}
        onClear={clearFilters}
        value={filters}
      />
      {storageError && <p className="text-sm text-destructive" role="alert">{storageError}</p>}
      {courseProgress.isError && (
        <ErrorState
          message={t('courseList.progressError')}
          onRetry={() => void courseProgress.refetch()}
        />
      )}
      {courses.isLoading ? (
        <section aria-label={t('courseList.loading')} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <CourseCardSkeleton key={index} />)}
        </section>
      ) : courses.isError ? (
        <ErrorState onRetry={() => void courses.refetch()} />
      ) : courses.data?.length === 0 ? (
        <EmptyState
          action={<Button className="min-h-11" onClick={clearFilters} type="button" variant="outline">{t('courseList.clearFilters')}</Button>}
          description={t('courseList.emptyDescription')}
          icon={GraduationCap}
          title={t('courseList.emptyTitle')}
        />
      ) : (
        <section aria-label={t('courseList.results')} className="space-y-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {t('courseList.resultsCount', { count: courses.data?.length ?? 0 })}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.data?.map((course: Course) => {
              const progress = progressByCourse.get(course.id);
              return (
                <CourseCard
                  course={course}
                  key={course.id}
                  progress={progress ? { estado: progress.estado, progresso: progress.progresso } : undefined}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
