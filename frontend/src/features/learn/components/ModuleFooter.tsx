import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ModuleFooterProps {
  progressLabel: string;
  primaryLabel: string;
  onPrevious?: () => void;
  onPrimary: () => void;
  disabled?: boolean;
  isPending?: boolean;
}

export function ModuleFooter({
  progressLabel,
  primaryLabel,
  onPrevious,
  onPrimary,
  disabled = false,
  isPending = false,
}: ModuleFooterProps) {
  const { t } = useTranslation('learning');
  return (
    <footer className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          className="min-h-11 w-full sm:w-auto"
          disabled={!onPrevious}
          onClick={onPrevious}
          type="button"
          variant="outline"
        >
          <ArrowLeft aria-hidden="true" />
          {t('module.previous')}
        </Button>
        <p aria-live="polite" className="text-center text-sm text-muted-foreground">
          {progressLabel}
        </p>
        <Button
          className="min-h-11 w-full sm:w-auto"
          disabled={disabled || isPending}
          onClick={onPrimary}
          type="button"
        >
          {isPending ? t('module.saving') : primaryLabel}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </footer>
  );
}
