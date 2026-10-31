import { useMemo, useState } from 'react';
import { ChevronDown, Mail, MessageCircleQuestion, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Pagination } from '@/components/shared/Pagination';
import { cn } from '@/lib/utils';
import { useFaqs } from '../hooks/useFaqs';

const PAGE_SIZE = 8;

function normalize(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('pt');
}

/**
 * Public help page: searchable, filterable questions managed in the admin panel.
 */
export default function FaqPage() {
  const { t } = useTranslation('home');
  const faqs = useFaqs();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const items = useMemo(() => faqs.data?.data ?? [], [faqs.data]);
  const categories = useMemo(() => [...new Set(items.map((item) => item.categoria))], [items]);
  const results = useMemo(() => {
    const term = normalize(query.trim());
    return items.filter(
      (item) =>
        (!category || item.categoria === category) &&
        (!term || normalize(`${item.pergunta} ${item.resposta}`).includes(term)),
    );
  }, [category, items, query]);
  const lastPage = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, lastPage);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const supportEmail = faqs.data?.suporte.email;

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t('faq.eyebrow')}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('faq.title')}</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">{t('faq.description')}</p>
        <label className="glass-surface mx-auto flex max-w-xl items-center gap-3 rounded-full border px-5 py-3 elevated focus-within:ring-2 focus-within:ring-ring">
          <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          <span className="sr-only">{t('faq.search')}</span>
          <input
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              setPage(1);
            }}
            placeholder={t('faq.searchPlaceholder')}
            type="search"
            value={query}
          />
        </label>
      </header>

      {categories.length > 1 && (
        <nav aria-label={t('faq.categories')} className="flex flex-wrap justify-center gap-2">
          {[null, ...categories].map((item) => (
            <button
              aria-pressed={category === item}
              className={cn(
                'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors',
                category === item
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card hover:border-primary/40',
              )}
              key={item ?? 'all'}
              onClick={() => {
                setCategory(item);
                setPage(1);
              }}
              type="button"
            >
              {item ?? t('faq.all')}
            </button>
          ))}
        </nav>
      )}

      {faqs.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div aria-hidden="true" className="h-16 animate-pulse rounded-2xl bg-surface-2" key={index} />
          ))}
        </div>
      ) : faqs.isError ? (
        <ErrorState message={t('faq.error')} onRetry={() => void faqs.refetch()} />
      ) : visible.length ? (
        <section aria-label={t('faq.listLabel')} className="space-y-3">
          {visible.map((item) => (
            <details
              className="group elevated rounded-2xl border border-border/70 bg-card open:border-primary/40"
              key={item.id}
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="mb-1 block text-xs font-normal text-muted-foreground">{item.categoria}</span>
                  {item.pergunta}
                </span>
                <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="whitespace-pre-line px-5 pb-5 leading-7 text-muted-foreground">{item.resposta}</p>
            </details>
          ))}
          <Pagination
            meta={{ current_page: currentPage, last_page: lastPage, per_page: PAGE_SIZE, total: results.length }}
            onPageChange={setPage}
          />
        </section>
      ) : (
        <EmptyState description={t('faq.emptyDescription')} icon={MessageCircleQuestion} title={t('faq.emptyTitle')} />
      )}

      <section className="glass-surface elevated rounded-3xl border p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">{t('faq.contactTitle')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {supportEmail ? t('faq.contactDescription') : t('faq.contactUnavailable')}
        </p>
        {supportEmail && (
          <Button className="mt-5 min-h-11" nativeButton={false} render={<a href={`mailto:${supportEmail}`} />}>
            <Mail aria-hidden="true" />
            {t('faq.contactAction')}
          </Button>
        )}
      </section>
    </div>
  );
}
