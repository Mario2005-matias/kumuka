import type { Course, CourseProgress } from '@/types/course';
import { CourseModuleCard, type CourseModuleState } from './CourseModuleCard';

export function CourseModuleList({
  course,
  progress,
}: {
  course: Course;
  progress?: CourseProgress;
}) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {course.modulos.map((module) => {
        const complete = progress?.modulosConcluidos.includes(module.id) ?? false;
        const previousComplete =
          module.ordem === 1 ||
          (progress?.modulosConcluidos.includes(course.modulos[module.ordem - 2]?.id ?? '') ?? false);
        const state: CourseModuleState = complete
          ? 'completed'
          : !previousComplete
            ? 'locked'
            : progress?.moduloAtualId === module.id
              ? 'active'
              : 'available';
        return (
          <li key={module.id}>
            <CourseModuleCard course={course} module={module} progress={progress} state={state} />
          </li>
        );
      })}
    </ol>
  );
}
