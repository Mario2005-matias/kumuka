import type { CourseProgress } from '@/types/course';
import { mockCourses } from './courses';

const excel = mockCourses.find((course) => course.id === 'course-001');
if (!excel) throw new Error('O curso de demonstração do Excel não existe.');

const completedExcelModules = excel.modulos.slice(0, 4);
const currentExcelModule = excel.modulos[4];
if (!currentExcelModule) throw new Error('O curso de Excel precisa de cinco módulos.');

const initialTime = '2026-08-23T10:00:00Z';

export const mockCourseProgress: CourseProgress[] = mockCourses.map((course) => {
  if (course.id !== excel.id) {
    return {
      id: `progress-user-mock-01-${course.id}`,
      userId: 'user-mock-01',
      courseId: course.id,
      tipo: 'course',
      progresso: 0,
      moduloAtual: 0,
      moduloAtualId: course.modulos[0]?.id ?? null,
      estado: 'nao_iniciado',
      modulosConcluidos: [],
      atividadesSubmetidas: [],
      conteudosLidos: [],
      rascunhosAtividade: {},
      iniciadoEm: null,
      ultimoAcesso: initialTime,
      concluidoEm: null,
    };
  }

  return {
    id: 'progress-user-mock-01-course-001',
    userId: 'user-mock-01',
    courseId: course.id,
    tipo: 'course',
    progresso: 70,
    moduloAtual: 4,
    moduloAtualId: currentExcelModule.id,
    estado: 'em_progresso',
    modulosConcluidos: completedExcelModules.map((module) => module.id),
    atividadesSubmetidas: completedExcelModules.flatMap((module) =>
      module.activity ? [module.activity.id] : [],
    ),
    conteudosLidos: [
      ...completedExcelModules.flatMap((module) =>
        module.contentItems.map((item) => item.id),
      ),
      currentExcelModule.contentItems[0]?.id ?? '',
    ].filter(Boolean),
    rascunhosAtividade: {},
    iniciadoEm: initialTime,
    ultimoAcesso: '2026-09-04T10:00:00Z',
    concluidoEm: null,
  };
});
