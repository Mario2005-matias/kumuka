import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { TrailCompletionCard } from '@/features/learn/components/TrailCompletionCard';
import { useTrailProgress } from '@/features/learn/hooks/useTrailFlow';
import { useTrail } from '@/features/learn/hooks/useTrails';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';

export default function TrailCompletionPage() {
  const { slug = '' } = useParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const trail = useTrail(slug);
  const progress = useTrailProgress(userId, trail.data?.id ?? '');

  if (trail.isLoading) return <p aria-live="polite">A carregar conclusão…</p>;
  if (trail.isError) {
    return <p className="text-sm text-destructive" role="alert">Não foi possível carregar esta trilha.</p>;
  }
  if (!trail.data) {
    return (
      <EmptyState
        description="Volta ao catálogo para escolher uma trilha disponível."
        icon={BookOpen}
        title="Trilha não encontrada"
      />
    );
  }
  if (progress.isLoading) return <p aria-live="polite">A carregar o teu progresso…</p>;
  if (progress.isError) {
    return <p className="text-sm text-destructive" role="alert">Não foi possível carregar o teu progresso.</p>;
  }
  if (!progress.data || progress.data.estado !== 'concluido') {
    return <Navigate replace to={ROUTES.learn.trail(trail.data.slug)} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <PageHeader
        action={
          <Button
            className="min-h-11"
            nativeButton={false}
            render={<Link to={ROUTES.learn.trails} />}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            Explorar trilhas
          </Button>
        }
        description="Parabéns por completares o percurso. O teu progresso ficou guardado."
        title="Trilha concluída!"
      />
      <TrailCompletionCard progress={progress.data} trail={trail.data} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="min-h-11 w-full sm:w-auto"
          nativeButton={false}
          render={<Link to={ROUTES.learn.trail(trail.data.slug)} />}
        >
          Rever módulos
        </Button>
        <Button
          className="min-h-11 w-full sm:w-auto"
          nativeButton={false}
          render={<Link to={ROUTES.learn.trails} />}
          variant="outline"
        >
          Descobrir outra trilha
        </Button>
      </div>
    </div>
  );
}
