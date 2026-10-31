import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Pagination } from '@/components/shared/Pagination';
import { pageFromSearch } from '@/lib/pagination';
import { ROUTES } from '@/lib/constants/routes';
import { LearningCatalog, type ResourceCategory } from '../components/LearningCatalog';
import { useLearningCatalog } from '../hooks/useLearningCatalog';
import { useGuide } from '../hooks/useGuides';
import { useQuickLearning } from '../hooks/useQuickLearnings';
import { useTranslation } from 'react-i18next';

const categoryPaths = [
  { label: 'all', to: ROUTES.learn.root, key: null },
  { label: 'trails', to: ROUTES.learn.trails, key: null },
  { label: 'quickLearnings', to: ROUTES.learn.quickLearnings, key: 'aprendizados' },
  { label: 'guides', to: ROUTES.learn.guides, key: 'guias' },
] as const;

/**
 * Catalogue and reader for short learning resources (quick learnings and guides).
 */
export default function LearnContentPage() {
  const { t } = useTranslation('learning');
  const { pathname } = useLocation();
  const { slug = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category: ResourceCategory = pathname.startsWith(ROUTES.learn.guides) ? 'guias' : 'aprendizados';
  const translationKey = category === 'guias' ? 'guides' : 'quickLearnings';
  const categoryTitle = t(`hub.categories.${translationKey}.title`);
  const listPath = category === 'guias' ? ROUTES.learn.guides : ROUTES.learn.quickLearnings;
  const page = pageFromSearch(searchParams);

  const catalog = useLearningCatalog(
    slug ? null : category === 'guias' ? 'guides' : 'quick-learnings',
    { page },
  );
  const quickLearning = useQuickLearning(category === 'aprendizados' ? slug : '');
  const guide = useGuide(category === 'guias' ? slug : '');
  const detail = category === 'guias' ? guide : quickLearning;
  const item = detail.data;

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button
            nativeButton={false}
            render={<Link to={slug ? listPath : ROUTES.learn.root} />}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            {slug
              ? t('content.backToCategory', { category: categoryTitle })
              : t('content.backToLearning')}
          </Button>
        }
        description={slug ? item?.descricao ?? t('content.defaultDescription') : t(`hub.categories.${translationKey}.description`)}
        title={slug ? item?.titulo ?? '' : categoryTitle}
      />

      {!slug && (
        <>
          <nav aria-label={t('hub.categoriesLabel')} className="overflow-x-auto">
            <ul className="flex min-w-max gap-2 border-b border-border">
              {categoryPaths.map((entry) => (
                <li key={entry.to}>
                  <Link
                    aria-current={category === entry.key ? 'page' : undefined}
                    className={`inline-flex min-h-11 items-center border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      category === entry.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    to={entry.to}
                  >
                    {t(`hub.tabs.${entry.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LearningCatalog
            category={category}
            isError={catalog.isError}
            isLoading={catalog.isLoading}
            items={catalog.data?.data as Parameters<typeof LearningCatalog>[0]['items']}
          />
          <Pagination
            meta={catalog.data?.meta}
            onPageChange={(next) => setSearchParams({ pagina: String(next) })}
          />
        </>
      )}

      {slug && detail.isLoading && (
        <p aria-live="polite" className="text-sm text-muted-foreground">{t('content.loading')}</p>
      )}

      {slug && detail.isError && (
        <EmptyState
          description={t('content.notFoundDescription')}
          icon={BookOpen}
          title={t('content.notFoundTitle')}
        />
      )}

      {slug && item && (
        <article className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{item.conteudo}</p>
        </article>
      )}
    </div>
  );
}
