import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ROUTES } from '@/lib/constants/routes';
import { useProgress } from '@/features/dashboard/hooks/useProgress';
import { useAuthStore } from '@/stores/authStore';
import { LearningCatalog } from '../components/LearningCatalog';
import {
  useLearningCatalog,
  type LearningCatalogCategory,
} from '../hooks/useLearningCatalog';
import {
  useCourse,
  useCourseModule,
} from '../hooks/useCourses';
import { useGuide } from '../hooks/useGuides';
import { useQuickLearning } from '../hooks/useQuickLearnings';
import {
  useTrail,
  useTrailModule,
} from '../hooks/useTrails';

const categories = {
  trilhas: {
    title: 'Trilhas',
    description: 'Jornadas completas para desenvolver competências.',
  },
  cursos: {
    title: 'Cursos',
    description: 'Aprendizagem estruturada e organizada por temas.',
  },
  aprendizados: {
    title: 'Aprendizados',
    description: 'Conteúdos curtos para aprender algo novo.',
  },
  guias: {
    title: 'Guias',
    description: 'Materiais práticos para consultar quando precisares.',
  },
} as const;

const categoryPaths = [
  { label: 'Tudo', to: ROUTES.learn.root, key: '' },
  { label: 'Trilhas', to: ROUTES.learn.trails, key: 'trilhas' },
  { label: 'Cursos', to: ROUTES.learn.courses, key: 'cursos' },
  { label: 'Aprendizados', to: ROUTES.learn.quickLearnings, key: 'aprendizados' },
  { label: 'Guias', to: ROUTES.learn.guides, key: 'guias' },
];

type CategoryKey = keyof typeof categories;

const apiCategoryByRoute: Record<CategoryKey, LearningCatalogCategory> = {
  trilhas: 'trails',
  cursos: 'courses',
  aprendizados: 'quick-learnings',
  guias: 'guides',
};

function isCategory(value: string): value is CategoryKey {
  return Object.prototype.hasOwnProperty.call(categories, value);
}

function formatSlug(value: string) {
  return decodeURIComponent(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase() + part.slice(1))
    .join(' ');
}

export default function LearnContentPage() {
  const { pathname } = useLocation();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const segments = pathname.split('/').filter(Boolean);
  const rawCategoryKey = segments[1] ?? '';
  const categoryKey = isCategory(rawCategoryKey) ? rawCategoryKey : null;
  const category = categoryKey ? categories[categoryKey] : undefined;
  const apiCategory = categoryKey ? apiCategoryByRoute[categoryKey] : null;
  const moduleIndex = segments.indexOf('modulo');
  const isModule = moduleIndex !== -1;
  const isDetail = segments.length > 2 && !isModule;
  const slug = isDetail || isModule ? segments[2] ?? '' : '';
  const moduleId = isModule ? segments[moduleIndex + 1] ?? '' : '';

  const catalog = useLearningCatalog(apiCategory);
  const progress = useProgress(userId);
  const trail = useTrail(categoryKey === 'trilhas' ? slug : '');
  const course = useCourse(categoryKey === 'cursos' ? slug : '');
  const quickLearning = useQuickLearning(categoryKey === 'aprendizados' ? slug : '');
  const guide = useGuide(categoryKey === 'guias' ? slug : '');
  const trailModule = useTrailModule(
    categoryKey === 'trilhas' ? slug : '',
    categoryKey === 'trilhas' ? moduleId : '',
  );
  const courseModule = useCourseModule(
    categoryKey === 'cursos' ? slug : '',
    categoryKey === 'cursos' ? moduleId : '',
  );

  const item = categoryKey === 'trilhas'
    ? trail.data
    : categoryKey === 'cursos'
      ? course.data
      : categoryKey === 'aprendizados'
        ? quickLearning.data
        : categoryKey === 'guias'
          ? guide.data
          : null;
  const selectedModule = categoryKey === 'trilhas'
    ? trailModule.data
    : categoryKey === 'cursos'
      ? courseModule.data
      : null;
  const isDetailLoading =
    trail.isLoading || course.isLoading || quickLearning.isLoading || guide.isLoading;
  const detailError =
    trail.isError || course.isError || quickLearning.isError || guide.isError;
  const title = isModule
    ? selectedModule?.titulo ?? `Módulo ${formatSlug(moduleId)}`
    : isDetail
      ? item?.titulo ?? formatSlug(slug)
      : category?.title ?? 'Aprender';
  const parentPath = `/${segments.slice(0, 2).join('/')}`;

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button
            nativeButton={false}
            render={<Link to={isDetail || isModule ? parentPath : ROUTES.learn.root} />}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            {isDetail || isModule ? `Voltar a ${category?.title ?? 'Aprender'}` : 'Voltar a Aprender'}
          </Button>
        }
        description={isDetail || isModule ? item?.descricao ?? 'Conteúdo de aprendizagem KUMUKA.' : category?.description}
        title={title}
      />

      {!isDetail && !isModule && (
        <nav aria-label="Categorias de aprendizagem" className="overflow-x-auto">
          <ul className="flex min-w-max gap-2 border-b border-border">
            {categoryPaths.map((entry) => (
              <li key={entry.to}>
                <Link
                  aria-current={categoryKey === entry.key ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    categoryKey === entry.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  to={entry.to}
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {categoryKey && !isDetail && !isModule && (
        <LearningCatalog
          category={categoryKey}
          isError={catalog.isError || progress.isError}
          isLoading={catalog.isLoading || progress.isLoading}
          items={catalog.data}
          progress={progress.data}
        />
      )}

      {(isDetail || isModule) && !isDetailLoading && !detailError && !item && (
        <EmptyState
          description="Confirma a ligação e volta à categoria para escolher outro conteúdo."
          icon={BookOpen}
          title="Conteúdo não encontrado"
        />
      )}

      {(isDetail || isModule) && isDetailLoading && (
        <p aria-live="polite" className="text-sm text-muted-foreground">A carregar conteúdo…</p>
      )}

      {(isDetail || isModule) && detailError && <p role="alert" className="text-sm text-destructive">Não foi possível carregar este conteúdo.</p>}

      {isDetail && item && !isModule && (
        'modulos' in item ? (
          <section aria-label="Módulos do conteúdo" className="space-y-3">
            {item.modulos.map((module) => (
              <Link
                className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                key={module.id}
                to={
                  categoryKey === 'trilhas'
                    ? ROUTES.learn.trailModule(item.slug, module.id)
                    : ROUTES.learn.courseModule(item.slug, module.id)
                }
              >
                <h2 className="font-semibold">{module.titulo}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{module.descricao}</p>
                <p className="mt-2 text-xs text-muted-foreground">{module.duracao} min</p>
              </Link>
            ))}
          </section>
        ) : (
          <article className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {'conteudo' in item ? item.conteudo : ''}
            </p>
          </article>
        )
      )}

      {isModule && selectedModule && (
        <article className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-7">
          <p className="text-sm leading-6 text-muted-foreground">{selectedModule.descricao}</p>
          {selectedModule.contentItems.map((content) => (
            <section className="border-t border-border pt-4" key={content.id}>
              <h2 className="font-semibold">{content.titulo}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.conteudo}</p>
            </section>
          ))}
        </article>
      )}
    </div>
  );
}
