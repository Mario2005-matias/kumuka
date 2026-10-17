import { ArrowRight, Clock3, GraduationCap, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants/routes';
import type { Course, CourseProgress } from '@/types/course';
import { CourseProgressBar } from './CourseProgressBar';

interface CourseCardProps {
  course: Course;
  progress?: Pick<CourseProgress, 'estado' | 'progresso'>;
}

export function CourseCard({ course, progress }: CourseCardProps) {
  const complete = progress?.estado === 'concluido';
  const action = complete ? 'Rever' : progress?.estado === 'em_progresso' ? 'Continuar' : 'Começar';

  return (
    <Link
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      to={ROUTES.learn.course(course.slug)}
    >
      <Card className="h-full overflow-hidden border-border/80 transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/5">
        <div className="relative flex h-28 items-start justify-between bg-[image:var(--gradient-surface)] p-4">
          <StatusBadge className="bg-surface-2 text-foreground" status="info">Curso</StatusBadge>
          <StatusBadge status="neutral">{course.nivel}</StatusBadge>
          <span className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-xl border border-border bg-card/80 text-primary">
            <GraduationCap aria-hidden="true" className="size-5" />
          </span>
        </div>
        <CardContent className="flex h-[calc(100%-7rem)] flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 min-h-14 text-lg font-semibold tracking-tight">
              {course.titulo}
            </h2>
            {complete && <StatusBadge status="success">Concluído</StatusBadge>}
          </div>
          <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
            {course.descricao}
          </p>
          <p className="mt-4 text-sm font-semibold text-primary">
            {course.competenciaCentral}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock3 aria-hidden="true" className="size-4 text-primary" />
              {course.duracao} h
            </span>
            <span className="inline-flex items-center gap-2">
              <Layers3 aria-hidden="true" className="size-4 text-primary" />
              {course.totalModulos} módulos
            </span>
          </div>
          {progress && progress.estado !== 'nao_iniciado' && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-medium">
                  {complete ? 'Concluído' : 'Em progresso'}
                </span>
                <span className="text-muted-foreground">{progress.progresso}% concluído</span>
              </div>
              <CourseProgressBar courseTitle={course.titulo} value={progress.progresso} />
            </div>
          )}
          <span
            className={`mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
              complete
                ? 'border border-border bg-background text-foreground group-hover:bg-muted'
                : 'bg-[image:var(--gradient-brand)] text-primary-foreground group-hover:brightness-110'
            }`}
          >
            {action}
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
