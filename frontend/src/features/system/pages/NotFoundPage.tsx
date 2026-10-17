import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation('system');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">404 · {t('notFound.title')}</h1>
      <p className="text-muted-foreground">{t('notFound.description')}</p>
      <Button>
        <Link to={ROUTES.home}>{t('notFound.backHome')}</Link>
      </Button>
    </div>
  );
}