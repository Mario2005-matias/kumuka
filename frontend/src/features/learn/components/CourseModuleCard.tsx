import { CheckCircle2, Circle, Clock3, LockKeyhole, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import type { Course, CourseModule, CourseProgress } from '@/types/course';
import { ROUTES } from '@/lib/constants/routes';
import { CourseProgressBar } from './CourseProgressBar';

export type CourseModuleState = 'completed' | 'active' | 'available' | 'locked';

interface CourseModuleCardProps {
  course: Course;
  module: CourseModule;
  progress?: CourseProgress;
  state: CourseModuleState;
}

export function CourseModuleCard({
  course,
  module,
  progress,
  state,
}: CourseModuleCardProps) {
  const complete = state === 'completed';
  const locked = state === 'locked';
  const current = progress?.moduloAtualId === module.id;
  const readCount = progress?.conteudosLidos.filter((id) =>
    module.contentItems.some((item) => item.id === id),
  ).length ?? 0;
  const icon = locked ? LockKeyhole : complete ? CheckCircle2 : current ? PlayCircle : Circle;
  const Icon = icon;
  const label = locked ? 'Bloqueado' : complete ? 'Rever' : current ? 'Continuar' : 'Começar';
  const card = (
    <Card className={`h-full border-border ${locked ? 'bg-muted/30 opacity-75' : 'transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-lg'}`}>
      <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${
            complete ? 'border-success/30 bg-success/10 text-success' : current ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-surface-1 text-muted-foreground'
          }`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Módulo {String(module.ordem).padStart(2, '0')}
            </p>
            <h3 className="mt-1 font-semibold">{module.titulo}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{module.descricao}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-4 text-primary" />
          {module.duracao} min
        </div>
        {progress && !locked && (
          <CourseProgressBar
            courseTitle={`${course.titulo}, módulo ${module.ordem}`}
            value={complete ? 100 : Math.round((readCount / module.contentItems.length) * 100)}
          />
        )}
        <span className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium ${
          locked ? 'text-muted-foreground' : complete ? 'text-foreground' : 'bg-primary text-primary-foreground'
        }`}>
          {label}
        </span>
      </CardContent>
    </Card>
  );
  if (locked) {
    return <div aria-disabled="true" className="cursor-not-allowed" title="Conclui o módulo anterior para desbloquear este módulo.">{card}</div>;
  }
  return (
    <Link
      aria-current={current ? 'step' : undefined}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      to={ROUTES.learn.courseModule(course.slug, module.id)}
    >
      {card}
    </Link>
  );
}
