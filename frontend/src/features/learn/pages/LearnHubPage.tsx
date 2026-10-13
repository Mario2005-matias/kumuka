import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { ROUTES } from '@/lib/constants/routes';
import { useProgress } from '@/features/dashboard/hooks/useProgress';
import { useAuthStore } from '@/stores/authStore';
import type { LearningProgress } from '@/types/progress';
import { useCourses } from '../hooks/useCourses';
import { useQuickLearnings } from '../hooks/useQuickLearnings';
import { useTrails } from '../hooks/useTrails';

const categories: {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
}[] = [
  {
    title: 'Trilhas',
    description: 'Jornadas completas para desenvolver competências.',
    icon: BookOpen,
    to: ROUTES.learn.trails,
  },
  {
    title: 'Cursos',
    description: 'Aprendizagem estruturada e organizada por temas.',
    icon: GraduationCap,
    to: ROUTES.learn.courses,
  },
  {
    title: 'Aprendizados',
    description: 'Conteúdos curtos para aprender algo novo.',
    icon: Zap,
    to: ROUTES.learn.quickLearnings,
  },
  {
    title: 'Guias',
    description: 'Materiais práticos para consultar quando precisares.',
    icon: FileText,
    to: ROUTES.learn.guides,
  },
];

const categoryTabs = [
  { label: 'Tudo', to: ROUTES.learn.root },
  { label: 'Trilhas', to: ROUTES.learn.trails },
  { label: 'Cursos', to: ROUTES.learn.courses },
  { label: 'Aprendizados', to: ROUTES.learn.quickLearnings },
  { label: 'Guias', to: ROUTES.learn.guides },
];

export default function LearnHubPage() {
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const progress = useProgress(userId);
  const trails = useTrails();
  const courses = useCourses();
  const quickLearnings = useQuickLearnings();
  const inProgress = (progress.data ?? [])
    .filter((item) => item.estado === 'em_progresso')
    .map((record: LearningProgress) => {
      const item =
        record.recursoTipo === 'trail'
          ? trails.data?.find((entry) => entry.id === record.recursoId)
          : record.recursoTipo === 'course'
            ? courses.data?.find((entry) => entry.id === record.recursoId)
            : quickLearnings.data?.find((entry) => entry.id === record.recursoId);
      if (!item) return null;
      const to =
        record.recursoTipo === 'trail'
          ? ROUTES.learn.trail(item.slug)
          : record.recursoTipo === 'course'
            ? ROUTES.learn.course(item.slug)
            : ROUTES.learn.quickLearning(item.slug);
      return { id: record.id, title: item.titulo, to, percent: record.percentual };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="space-y-8">
      <PageHeader
        description="Aprende ao teu ritmo e leva cada ideia para a prática."
        title="Aprender"
      />

      <nav aria-label="Categorias de aprendizagem" className="overflow-x-auto">
        <ul className="flex min-w-max gap-2 border-b border-border">
          {categoryTabs.map(({ label, to }, index) => (
            <li key={to}>
              <Link
                aria-current={index === 0 ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  index === 0
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                to={to}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SectionCard
        className="overflow-hidden bg-[image:var(--gradient-surface)]"
        contentClassName="pb-6"
        description="Escolhe um formato e começa por um tema que te interessa."
        title="Aprendizagem com propósito"
      >
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Na KUMUKA, aprender é o primeiro passo para desenvolver competências,
          criar evidências e descobrir novas oportunidades.
        </p>
      </SectionCard>

      <section aria-labelledby="learning-formats-title" className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Encontra o teu formato
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight" id="learning-formats-title">
            Explora conteúdos
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map(({ title, description, icon: Icon, to }) => (
            <Card
              className="group border-border transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface-1"
              key={title}
            >
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="min-h-12 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                <Button
                  className="mt-4 px-0 text-primary"
                  nativeButton={false}
                  render={<Link to={to} />}
                  variant="ghost"
                >
                  Explorar
                  <ArrowRight aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <SectionCard
        description="Os conteúdos vão aparecer aqui quando estiverem disponíveis."
        title="Continua a aprender"
      >
        {progress.isLoading || trails.isLoading || courses.isLoading || quickLearnings.isLoading ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">A carregar o teu progresso…</p>
        ) : progress.isError || trails.isError || courses.isError || quickLearnings.isError ? (
          <p className="text-sm text-destructive" role="alert">Não foi possível carregar o teu progresso.</p>
        ) : inProgress.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgress.map((item) => (
              <Card className="border-border" key={item.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.percent}% concluído</p>
                  <div
                    aria-label={`${item.percent}% concluído`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={item.percent}
                    className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3"
                    role="progressbar"
                  >
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%` }} />
                  </div>
                  <Button
                    className="mt-3 px-0 text-primary"
                    nativeButton={false}
                    render={<Link to={item.to} />}
                    variant="ghost"
                  >
                    Continuar
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            className="border-0 bg-transparent py-5"
            description="Escolhe uma trilha, curso ou aprendizado para começar."
            icon={BookOpen}
            title="Ainda não começaste uma actividade"
          />
        )}
      </SectionCard>
    </div>
  );
}
