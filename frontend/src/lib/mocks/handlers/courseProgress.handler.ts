import type { Course, CourseActivity, CourseModule, CourseProgress } from '@/types/course';
import type { LearningProgress } from '@/types/progress';
import { mockCourseProgress } from '../data/courseProgress';
import { mockCourses } from '../data/courses';
import { mockProgress } from '../data/progress';
import { mockConfig } from '../config';
import { delay } from '../utils/delay';
import { achievementsHandler } from './achievements.handler';

const storageKey = 'kumuka-mock-progress';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item: unknown) => typeof item === 'string');
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((item: unknown) => typeof item === 'string')
  );
}

function isLearningProgress(value: unknown): value is LearningProgress {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.userId === 'string' &&
    ['trail', 'course', 'quick-learning'].includes(String(value.recursoTipo)) &&
    typeof value.recursoId === 'string' &&
    typeof value.percentual === 'number' &&
    Number.isInteger(value.percentual) &&
    value.percentual >= 0 &&
    value.percentual <= 100 &&
    ['em_progresso', 'concluido'].includes(String(value.estado)) &&
    (value.moduloAtualId === null || typeof value.moduloAtualId === 'string') &&
    typeof value.iniciadoEm === 'string' &&
    typeof value.atualizadoEm === 'string' &&
    (value.concluidoEm === null || typeof value.concluidoEm === 'string') &&
    (value.modulosConcluidos === undefined || isStringArray(value.modulosConcluidos)) &&
    (value.atividadesSubmetidas === undefined || isStringArray(value.atividadesSubmetidas)) &&
    (value.conteudosLidos === undefined || isStringArray(value.conteudosLidos)) &&
    (value.rascunhosAtividade === undefined || isStringRecord(value.rascunhosAtividade))
  );
}

function readRecords(): LearningProgress[] {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return [...mockProgress];
  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed) || !parsed.every(isLearningProgress)) {
    throw new Error('O progresso mock guardado tem um formato inválido.');
  }
  return parsed;
}

function writeRecords(records: LearningProgress[]): void {
  localStorage.setItem(storageKey, JSON.stringify(records));
}

function findCourse(courseId: string): Course {
  const course = mockCourses.find((item) => item.id === courseId);
  if (!course) throw new Error('O curso indicado não existe.');
  return course;
}

function findRecord(
  records: LearningProgress[],
  userId: string,
  courseId: string,
) {
  return records.find(
    (record) =>
      record.userId === userId &&
      record.recursoTipo === 'course' &&
      record.recursoId === courseId,
  );
}

function fromRecord(
  record: LearningProgress | undefined,
  course: Course,
  userId: string,
): CourseProgress {
  const demo = mockCourseProgress.find((item) => item.courseId === course.id);
  if (!record) {
    return (
      demo ?? {
        id: `progress-${userId}-${course.id}`,
        userId,
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
        ultimoAcesso: '',
        concluidoEm: null,
      }
    );
  }
  const foundCurrentIndex = course.modulos.findIndex(
    (module) => module.id === record.moduloAtualId,
  );
  const complete = record.modulosConcluidos ?? (
    record.estado === 'concluido'
      ? course.modulos.map((module) => module.id)
      : course.modulos
          .slice(0, Math.max(0, foundCurrentIndex))
          .map((module) => module.id)
  );
  const firstIncompleteIndex = course.modulos.findIndex(
    (module) => !complete.includes(module.id),
  );
  const currentIndex = record.estado === 'concluido'
    ? Math.max(course.modulos.length - 1, 0)
    : foundCurrentIndex >= 0
      ? foundCurrentIndex
      : Math.max(firstIncompleteIndex, 0);
  return {
    id: record.id,
    userId: record.userId,
    courseId: record.recursoId,
    tipo: 'course',
    progresso: record.percentual,
    moduloAtual: record.estado === 'concluido'
      ? Math.max(0, course.modulos.length - 1)
      : currentIndex,
    moduloAtualId: record.estado === 'concluido'
      ? null
      : record.moduloAtualId ?? course.modulos[currentIndex]?.id ?? null,
    estado: record.estado,
    modulosConcluidos: [...complete],
    atividadesSubmetidas: [...(record.atividadesSubmetidas ?? [])],
    conteudosLidos: [...(record.conteudosLidos ?? [])],
    rascunhosAtividade: { ...(record.rascunhosAtividade ?? {}) },
    iniciadoEm: record.iniciadoEm,
    ultimoAcesso: record.atualizadoEm,
    concluidoEm: record.concluidoEm,
  };
}

function toRecord(progress: CourseProgress): LearningProgress {
  return {
    id: progress.id,
    userId: progress.userId,
    recursoTipo: 'course',
    recursoId: progress.courseId,
    percentual: progress.progresso,
    estado: progress.estado === 'nao_iniciado' ? 'em_progresso' : progress.estado,
    moduloAtualId: progress.moduloAtualId,
    moduloAtual: progress.moduloAtual,
    modulosConcluidos: progress.modulosConcluidos,
    atividadesSubmetidas: progress.atividadesSubmetidas,
    conteudosLidos: progress.conteudosLidos,
    rascunhosAtividade: progress.rascunhosAtividade,
    iniciadoEm: progress.iniciadoEm ?? progress.ultimoAcesso,
    atualizadoEm: progress.ultimoAcesso,
    concluidoEm: progress.concluidoEm,
  };
}

function persist(
  records: LearningProgress[],
  progress: CourseProgress,
): CourseProgress {
  const record = toRecord(progress);
  const index = records.findIndex(
    (item) => item.userId === record.userId &&
      item.recursoTipo === 'course' &&
      item.recursoId === record.recursoId,
  );
  const next = [...records];
  if (index === -1) next.push(record);
  else next[index] = record;
  writeRecords(next);
  return progress;
}

function requireProgress(userId: string, courseId: string) {
  const course = findCourse(courseId);
  const records = readRecords();
  const progress = fromRecord(findRecord(records, userId, courseId), course, userId);
  if (progress.estado === 'nao_iniciado') {
    throw new Error('Começa o curso antes de actualizar o teu progresso.');
  }
  return { course, records, progress };
}

function findModule(course: Course, moduleId: string): CourseModule {
  const module = course.modulos.find((item) => item.id === moduleId);
  if (!module) throw new Error('O módulo indicado não pertence a este curso.');
  return module;
}

function assertModuleAccessible(
  course: Course,
  progress: CourseProgress,
  module: CourseModule,
): void {
  if (
    progress.estado !== 'concluido' &&
    module.ordem > 1 &&
    !progress.modulosConcluidos.includes(course.modulos[module.ordem - 2]?.id ?? '')
  ) {
    throw new Error('Conclui o módulo anterior para desbloquear este módulo.');
  }
}

function validateActivity(activity: CourseActivity, answer: string): void {
  const trimmed = answer.trim();
  if (!trimmed) throw new Error('Preenche a actividade antes de submeter.');
  if (activity.tipo === 'escrita' && trimmed.length < 20) {
    throw new Error('Escreve pelo menos 20 caracteres para submeter a actividade.');
  }
  if (activity.tipo === 'upload' && !/\.(png|jpe?g|webp)$/i.test(trimmed)) {
    throw new Error('Escolhe uma imagem PNG, JPG ou WebP.');
  }
  if (activity.tipo === 'link') {
    let url: URL;
    try {
      url = new URL(trimmed);
    } catch {
      throw new Error('Introduz uma ligação válida começada por https://.');
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('A ligação deve começar por http:// ou https://.');
    }
  }
  if (activity.tipo === 'quiz') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw new Error('Responde às perguntas do questionário.');
    }
    if (!isRecord(parsed) || !activity.perguntas?.length) {
      throw new Error('As respostas do questionário têm um formato inválido.');
    }
    if (!activity.perguntas.every((question) => parsed[question.id] === question.respostaCorretaId)) {
      throw new Error('Revisa as tuas respostas e tenta novamente.');
    }
  }
}

function updatePercent(course: Course, progress: CourseProgress): CourseProgress {
  if (progress.estado === 'concluido') return { ...progress, progresso: 100 };
  const current = course.modulos[progress.moduloAtual];
  if (!current) return progress;
  const readCount = current.contentItems.filter((item) =>
    progress.conteudosLidos.includes(item.id),
  ).length;
  const activity = current.activity;
  const doneActivity =
    activity && progress.atividadesSubmetidas.includes(activity.id) ? 1 : 0;
  const units = current.contentItems.length + (activity?.obrigatoria ? 1 : 0);
  const partial = units ? (readCount + doneActivity) / units : 0;
  return {
    ...progress,
    progresso: Math.min(
      99,
      Math.max(
        progress.progresso,
        Math.round(((progress.modulosConcluidos.length + partial) / course.totalModulos) * 100),
      ),
    ),
  };
}

export const courseProgressHandler = {
  async list(userId = mockConfig.userId): Promise<CourseProgress[]> {
    await delay();
    const records = readRecords().filter(
      (record) => record.userId === userId && record.recursoTipo === 'course',
    );
    return mockCourses.map((course) =>
      fromRecord(findRecord(records, userId, course.id), course, userId),
    );
  },

  async get(userId: string, courseId: string): Promise<CourseProgress> {
    await delay();
    const course = findCourse(courseId);
    return fromRecord(findRecord(readRecords(), userId, courseId), course, userId);
  },

  async start(userId: string, courseId: string): Promise<CourseProgress> {
    await delay();
    const course = findCourse(courseId);
    if (course.status !== 'published') throw new Error('Este curso ainda não está disponível.');
    if (course.acesso !== 'free') throw new Error('Este curso requer acesso premium.');
    const records = readRecords();
    const existing = findRecord(records, userId, courseId);
    if (existing) return fromRecord(existing, course, userId);
    const firstModule = course.modulos[0];
    if (!firstModule) throw new Error('Este curso ainda não tem módulos.');
    const now = new Date().toISOString();
    return persist(records, {
      id: `progress-${userId}-${courseId}`,
      userId,
      courseId,
      tipo: 'course',
      progresso: 0,
      moduloAtual: 0,
      moduloAtualId: firstModule.id,
      estado: 'em_progresso',
      modulosConcluidos: [],
      atividadesSubmetidas: [],
      conteudosLidos: [],
      rascunhosAtividade: {},
      iniciadoEm: now,
      ultimoAcesso: now,
      concluidoEm: null,
    });
  },

  async markContentRead(
    userId: string,
    courseId: string,
    moduleId: string,
    contentId: string,
  ): Promise<CourseProgress> {
    await delay();
    const { course, records, progress } = requireProgress(userId, courseId);
    const module = findModule(course, moduleId);
    assertModuleAccessible(course, progress, module);
    if (!module.contentItems.some((item) => item.id === contentId)) {
      throw new Error('O conteúdo indicado não pertence a este módulo.');
    }
    const updated = updatePercent(course, {
      ...progress,
      conteudosLidos: progress.conteudosLidos.includes(contentId)
        ? progress.conteudosLidos
        : [...progress.conteudosLidos, contentId],
      ultimoAcesso: new Date().toISOString(),
    });
    return persist(records, updated);
  },

  async saveDraft(
    userId: string,
    courseId: string,
    moduleId: string,
    answer: string,
  ): Promise<CourseProgress> {
    await delay();
    const { course, records, progress } = requireProgress(userId, courseId);
    const module = findModule(course, moduleId);
    assertModuleAccessible(course, progress, module);
    if (!module.activity) throw new Error('Este módulo não tem uma actividade para guardar.');
    return persist(records, {
      ...progress,
      rascunhosAtividade: { ...progress.rascunhosAtividade, [module.activity.id]: answer },
      ultimoAcesso: new Date().toISOString(),
    });
  },

  async submitActivity(
    userId: string,
    courseId: string,
    moduleId: string,
    answer: string,
  ): Promise<CourseProgress> {
    await delay();
    const { course, records, progress } = requireProgress(userId, courseId);
    const module = findModule(course, moduleId);
    assertModuleAccessible(course, progress, module);
    if (!module.activity) throw new Error('Este módulo não tem uma actividade para submeter.');
    if (!module.contentItems.every((item) => progress.conteudosLidos.includes(item.id))) {
      throw new Error('Lê todos os conteúdos do módulo antes de submeter a actividade.');
    }
    if (progress.atividadesSubmetidas.includes(module.activity.id)) {
      throw new Error('Esta actividade já foi submetida.');
    }
    validateActivity(module.activity, answer);
    return persist(
      records,
      updatePercent(course, {
        ...progress,
        atividadesSubmetidas: [...progress.atividadesSubmetidas, module.activity.id],
        rascunhosAtividade: Object.fromEntries(
          Object.entries(progress.rascunhosAtividade).filter(
            ([id]) => id !== module.activity?.id,
          ),
        ),
        ultimoAcesso: new Date().toISOString(),
      }),
    );
  },

  async completeModule(
    userId: string,
    courseId: string,
    moduleId: string,
  ): Promise<CourseProgress> {
    await delay();
    const { course, records, progress } = requireProgress(userId, courseId);
    const module = findModule(course, moduleId);
    assertModuleAccessible(course, progress, module);
    if (progress.modulosConcluidos.includes(moduleId)) return progress;
    if (!module.contentItems.every((item) => progress.conteudosLidos.includes(item.id))) {
      throw new Error('Lê todos os conteúdos antes de concluir o módulo.');
    }
    if (
      module.activity?.obrigatoria &&
      !progress.atividadesSubmetidas.includes(module.activity.id)
    ) {
      throw new Error('Submete a actividade obrigatória antes de avançar.');
    }
    const completed = [...progress.modulosConcluidos, moduleId];
    const nextIndex = course.modulos.findIndex((item) => !completed.includes(item.id));
    const now = new Date().toISOString();
    const updated: CourseProgress = {
      ...progress,
      progresso: Math.min(
        99,
        Math.max(progress.progresso, Math.round((completed.length / course.totalModulos) * 100)),
      ),
      moduloAtual: nextIndex < 0 ? Math.max(course.totalModulos - 1, 0) : nextIndex,
      moduloAtualId: nextIndex < 0 ? null : course.modulos[nextIndex].id,
      modulosConcluidos: completed,
      ultimoAcesso: now,
    };
    return persist(records, updated);
  },

  async completeCourse(userId: string, courseId: string): Promise<CourseProgress> {
    await delay();
    const { course, records, progress } = requireProgress(userId, courseId);
    if (!course.modulos.every((module: CourseModule) =>
      progress.modulosConcluidos.includes(module.id),
    )) {
      throw new Error('Conclui todos os módulos para terminar este curso.');
    }
    if (course.modulos.some(
      (module) => module.activity?.obrigatoria &&
        !progress.atividadesSubmetidas.includes(module.activity.id),
    )) {
      throw new Error('Submete todas as actividades obrigatórias antes de terminar o curso.');
    }
    const now = progress.concluidoEm ?? new Date().toISOString();
    const updated: CourseProgress = {
      ...progress,
      progresso: 100,
      estado: 'concluido',
      moduloAtual: Math.max(course.totalModulos - 1, 0),
      moduloAtualId: null,
      ultimoAcesso: now,
      concluidoEm: now,
    };
    const saved = persist(records, updated);
    await achievementsHandler.unlock(userId, 'ach-008');
    return saved;
  },
};
