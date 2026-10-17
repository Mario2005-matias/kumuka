import { useEffect, useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { TrailCard } from '@/features/learn/components/TrailCard';
import {
  TrailFilters,
  type TrailFilterValues,
} from '@/features/learn/components/TrailFilters';
import { useTrailProgressList } from '@/features/learn/hooks/useTrailFlow';
import { useTrails } from '@/features/learn/hooks/useTrails';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { TrailLevel } from '@/types/trail';
import { useTranslation } from 'react-i18next';

const storageKey = 'kumuka-trails-filters';
const emptyFilters: TrailFilterValues = {
  pesquisa: '',
  nivel: '',
  duracao: '',
  categoria: '',
};

function isTrailLevel(value: unknown): value is TrailLevel {
  return value === 'iniciante' || value === 'intermedio' || value === 'avancado';
}

function isDuration(value: unknown): value is TrailFilterValues['duracao'] {
  return value === '' || value === 'menos-5' || value === '5-10' || value === 'mais-10';
}

function filtersFromSearch(search: URLSearchParams): TrailFilterValues {
  const level = search.get('nivel') ?? '';
  const duration = search.get('duracao') ?? '';
  return {
    pesquisa: search.get('q') ?? '',
    nivel: isTrailLevel(level) ? level : '',
    duracao: isDuration(duration) ? duration : '',
    categoria: search.get('categoria') ?? '',
  };
}

function filtersFromStorage(): TrailFilterValues | null {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return null;
  const parsed: unknown = JSON.parse(saved);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('pesquisa' in parsed) ||
    typeof parsed.pesquisa !== 'string' ||
    !('nivel' in parsed) ||
    !(parsed.nivel === '' || isTrailLevel(parsed.nivel)) ||
    !('duracao' in parsed) ||
    !isDuration(parsed.duracao) ||
    !('categoria' in parsed) ||
    typeof parsed.categoria !== 'string'
  ) {
    throw new Error('Os filtros de trilhas guardados têm um formato inválido.');
  }
  return {
    pesquisa: parsed.pesquisa,
    nivel: parsed.nivel,
    duracao: parsed.duracao,
    categoria: parsed.categoria,
  };
}

function hasSearchFilters(search: URLSearchParams) {
  return ['q', 'nivel', 'duracao', 'categoria'].some((key) => search.has(key));
}

function initialFilterState(searchParams: URLSearchParams) {
  if (hasSearchFilters(searchParams)) {
    return { filters: filtersFromSearch(searchParams), error: null };
  }
  try {
    return { filters: filtersFromStorage() ?? emptyFilters, error: null };
  } catch (error: unknown) {
    return {
      filters: emptyFilters,
      error:
        error instanceof Error
          ? error.message
          : 'Não foi possível ler os filtros guardados.',
    };
  }
}

export default function TrailsPage() {
  const { t } = useTranslation('learning');
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const lastSearch = useRef(searchParams.toString());
  const [initial] = useState(() => initialFilterState(searchParams));
  const [filters, setFilters] = useState<TrailFilterValues>(initial.filters);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [storageError, setStorageError] = useState<string | null>(initial.error);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedFilters(filters), 300);
    return () => window.clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const search = searchParams.toString();
    if (search === lastSearch.current) return;
    lastSearch.current = search;
    setFilters(filtersFromSearch(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const values: Record<string, string> = {
      q: debouncedFilters.pesquisa.trim(),
      nivel: debouncedFilters.nivel,
      duracao: debouncedFilters.duracao,
      categoria: debouncedFilters.categoria,
    };
    Object.entries(values).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    const nextSearch = next.toString();
    if (nextSearch !== searchParams.toString()) {
      lastSearch.current = nextSearch;
      setSearchParams(next, { replace: true });
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(debouncedFilters));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível guardar os filtros.';
      window.setTimeout(() => setStorageError(message), 0);
    }
  }, [debouncedFilters, searchParams, setSearchParams]);

  const trails = useTrails({
    search: debouncedFilters.pesquisa.trim() || undefined,
    nivel: debouncedFilters.nivel || undefined,
    duracao: debouncedFilters.duracao || undefined,
    categoria: debouncedFilters.categoria || undefined,
  });
  const allTrails = useTrails();
  const progress = useTrailProgressList(userId);
  const categories = Array.from(
    new Set([
      ...(allTrails.data ?? []).map((trail) => trail.categoria),
      ...(trails.data ?? []).map((trail) => trail.categoria),
      ...(debouncedFilters.categoria ? [debouncedFilters.categoria] : []),
    ]),
  ).sort((left, right) => left.localeCompare(right, 'pt'));

  function clearFilters() {
    setFilters(emptyFilters);
    setDebouncedFilters(emptyFilters);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={
          <Link className="hover:text-foreground" to={ROUTES.learn.root}>{t('hub.title')}</Link>
        }
        description={t('trailList.description')}
        title={t('trailList.title')}
      />
      <TrailFilters
        categories={categories}
        onChange={(nextFilters) => {
          setStorageError(null);
          setFilters(nextFilters);
        }}
        onClear={() => {
          setStorageError(null);
          clearFilters();
        }}
        value={filters}
      />
      {storageError && (
        <p className="text-sm text-destructive" role="alert">
          {storageError}
        </p>
      )}
      {progress.isError && (
        <p className="text-sm text-destructive" role="alert">
          {t('trailList.progressError')}
        </p>
      )}
      {trails.isLoading && (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {t('trailList.loading')}
        </p>
      )}
      {trails.isError && (
        <p className="text-sm text-destructive" role="alert">
          {t('trailList.error')}
        </p>
      )}
      {allTrails.isError && (
        <p className="text-sm text-destructive" role="alert">
          {t('trailList.categoryError')}
        </p>
      )}
      {!trails.isLoading && !trails.isError && trails.data?.length === 0 && (
        <EmptyState
          description={t('trailList.emptyDescription')}
          icon={BookOpen}
          title={t('trailList.emptyTitle')}
        />
      )}
      {!!trails.data?.length && (
        <section aria-label={t('trailList.results')} className="space-y-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {t('trailList.resultsCount', { count: trails.data.length })}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {trails.data.map((trail) => {
              const record = progress.data?.find(
                (item) => item.recursoTipo === 'trail' && item.recursoId === trail.id,
              );
              return (
                <TrailCard
                  key={trail.id}
                  progress={
                    record
                      ? { estado: record.estado, percentual: record.percentual }
                      : undefined
                  }
                  trail={trail}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
