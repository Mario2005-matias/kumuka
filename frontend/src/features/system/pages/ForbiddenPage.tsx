import { useTranslation } from 'react-i18next';

export default function ForbiddenPage() {
  const { t } = useTranslation('system');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">403 · {t('forbidden.title')}</h1>
      <p className="text-muted-foreground">{t('forbidden.description')}</p>
    </div>
  );
}