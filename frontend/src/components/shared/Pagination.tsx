import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/lib/api/client';

interface PaginationProps {
  meta: PaginationMeta | undefined;
  onPageChange: (page: number) => void;
}

/**
 * Classic previous/next pagination for API-paginated lists.
 */
export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { t } = useTranslation('common');
  if (!meta || meta.last_page <= 1) return null;

  const { current_page: page, last_page: lastPage } = meta;

  return (
    <nav aria-label={t('pagination.label')} className="flex items-center justify-between gap-4 pt-2">
      <Button
        className="min-h-11"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        variant="outline"
      >
        <ChevronLeft aria-hidden="true" />
        {t('pagination.previous')}
      </Button>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {t('pagination.status', { page, total: lastPage })}
      </p>
      <Button
        className="min-h-11"
        disabled={page >= lastPage}
        onClick={() => onPageChange(page + 1)}
        variant="outline"
      >
        {t('pagination.next')}
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
