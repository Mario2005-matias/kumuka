import { useTranslation } from 'react-i18next';

export default function ServerErrorPage() {
  const { t } = useTranslation('system');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">500 · {t('serverError.title')}</h1>
      <p className="text-muted-foreground">{t('serverError.description')}</p>
    </div>
  );
}