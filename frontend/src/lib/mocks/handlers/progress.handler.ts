import type { LearningProgress } from '@/types/progress';
import type { Activity, Trail, TrailModule, TrailProgress } from '@/types/trail';
import { mockTrails } from '../data/trails';
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

function isProgressRecord(value: unknown): value is LearningProgress {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.userId !== 'string' ||
    !['trail', 'course', 'quick-learning'].includes(String(value.recursoTipo)) ||
    typeof value.recursoId !== 'string' ||
    typeof value.percentual !== 'number' ||
    !Number.isInteger(value.percentual) ||
    value.percentual < 0 ||
    value.percentual > 100 ||
    !['concluido', 'em_progresso'].includes(String(value.estado)) ||
    (value.moduloAtualId !== null && typeof value.moduloAtualId !== 'string') ||
    typeof value.iniciadoEm !== 'string' ||
    typeof value.atualizadoEm !== 'string' ||
    (value.concluidoEm !== null && typeof value.concluidoEm !== 'string')
  ) {
    return false;
  }

  return (
    (value.modulosConcluidos === undefined ||
      isStringArray(value.modulosConcluidos)) &&
    (value.atividadesSubmetidas === undefined ||
      isStringArray(value.atividadesSubmetidas)) &&
    (value.conteudosLidos === undefined || isStringArray(value.conteudosLidos)) &&
    (value.rascunhosAtividade === undefined ||
      isStringRecord(value.rascunhosAtividade))
  );
}

function readProgress(
  storage: Pick<Storage, 'getItem'> = localStorage,
): LearningProgress[] {
  const saved = storage.getItem(storageKey);
  if (!saved) return [...mockProgress];

  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed) || !parsed.every(isProgressRecord)) {
    throw new Error('O progresso mock guardado tem um formato inválido.');
  }
  return parsed;
}

function writeProgress(
  records: LearningProgress[],
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(storageKey, JSON.stringify(records));
}

function trailProgressFrom(
  record: LearningProgress,
  trail: Trail,
): TrailProgress {
  const legacyDemoTrailProgress =
    record.id === 'progress-002' &&
    record.recursoId === 'trail-002' &&
    record.percentual === 35 &&
    record.faseAtual === undefined;
  const seededCurrentPhase = legacyDemoTrailProgress
    ? trail.fases.find((phase) => phase.ordem === 2)
    : undefined;
  const seededCurrentModule = seededCurrentPhase?.modulos[0];
  const currentModuleIndex = trail.modulos.findIndex(
    (module) => module.id === record.moduloAtualId,
  );
  const firstIncompleteIndex = trail.modulos.findIndex(
    (module) => !record.modulosConcluidos?.includes(module.id),
  );
  const currentIndex =
    record.estado === 'concluido'
      ? Math.max(trail.modulos.length - 1, 0)
      : seededCurrentModule
        ? trail.modulos.findIndex((module) => module.id === seededCurrentModule.id)
      : currentModuleIndex >= 0
        ? currentModuleIndex
        : Math.max(firstIncompleteIndex, 0);
  const completedModuleIds = record.estado === 'concluido'
    ? trail.modulos.map((module) => module.id)
    : legacyDemoTrailProgress
      ? trail.modulos.slice(0, Math.max(currentIndex, 0)).map((module) => module.id)
      : record.modulosConcluidos ??
        trail.modulos.slice(0, currentIndex).map((module) => module.id);
  const inferredSubmittedActivities = trail.modulos
    .filter((module) => completedModuleIds.includes(module.id))
    .flatMap((module) => (module.atividade ? [module.atividade.id] : []));
  const inferredReadContent = trail.modulos
    .filter((module) => completedModuleIds.includes(module.id))
    .flatMap((module) => module.contentItems.map((item) => item.id));
  const currentModule = trail.modulos[currentIndex];
  const readContentIds = legacyDemoTrailProgress
    ? [
        ...trail.modulos
          .slice(0, Math.max(currentIndex, 0))
          .flatMap((module) => module.contentItems.map((item) => item.id)),
        ...(currentModule?.contentItems[0] ? [currentModule.contentItems[0].id] : []),
      ]
    : record.conteudosLidos ?? [
    ...inferredReadContent,
    ...(record.percentual > 0 && currentModule
      ? [currentModule.contentItems[0]?.id].filter(
          (id): id is string => typeof id === 'string',
        )
      : []),
  ];
  const currentPhase = trail.fases.find((phase) =>
    phase.modulos.some((module) => module.id === currentModule?.id),
  );
  const completedPhaseIds = record.fasesConcluidas ?? trail.fases
    .filter((phase) => phase.modulos.every((module) => completedModuleIds.includes(module.id)))
    .map((phase) => phase.id);

  return {
    id: record.id,
    userId: record.userId,
    recursoTipo: 'trail',
    recursoId: record.recursoId,
    percentual: record.percentual,
    estado: record.estado,
    moduloAtualId:
      record.estado === 'concluido'
        ? null
        : currentModule?.id ?? trail.modulos[0]?.id ?? null,
    moduloAtual: currentIndex,
    faseAtual: record.estado === 'concluido'
      ? trail.fases.length
      : currentPhase?.ordem ?? record.faseAtual ?? 1,
    modulosConcluidos: [...completedModuleIds],
    fasesConcluidas: [...completedPhaseIds],
    atividadesSubmetidas: [
      ...(legacyDemoTrailProgress
        ? inferredSubmittedActivities
        : record.atividadesSubmetidas ?? inferredSubmittedActivities),
    ],
    conteudosLidos: [...readContentIds],
    rascunhosAtividade: { ...record.rascunhosAtividade },
    iniciadoEm: record.iniciadoEm,
    atualizadoEm: record.atualizadoEm,
    concluidoEm: record.concluidoEm,
  };
}

function findTrail(trailId: string): Trail {
  const trail = mockTrails.find((item) => item.id === trailId);
  if (!trail) throw new Error('A trilha indicada não existe.');
  return trail;
}

function findRecord(
  records: LearningProgress[],
  userId: string,
  trailId: string,
): LearningProgress | undefined {
  return records.find(
    (record) =>
      record.userId === userId &&
      record.recursoTipo === 'trail' &&
      record.recursoId === trailId,
  );
}

function findModule(trail: Trail, moduleId: string): TrailModule {
  const module = trail.modulos.find((item) => item.id === moduleId);
  if (!module) throw new Error('O módulo indicado não pertence a esta trilha.');
  return module;
}

function assertModuleAccessible(
  trail: Trail,
  progress: TrailProgress,
  module: TrailModule,
): void {
  if (
    progress.estado !== 'concluido' &&
    module.ordem > 1 &&
    !progress.modulosConcluidos.includes(
      trail.modulos[module.ordem - 2]?.id ?? '',
    )
  ) {
    throw new Error('Conclui o módulo anterior para desbloquear este módulo.');
  }
}

function calculatePercent(
  trail: Trail,
  progress: TrailProgress,
): number {
  if (progress.estado === 'concluido') return 100;

  const completed = progress.modulosConcluidos.length;
  const currentModule = trail.modulos[progress.moduloAtual];
  if (!currentModule) {
    return Math.min(
      99,
      Math.max(progress.percentual, Math.round((completed / trail.modulos.length) * 100)),
    );
  }

  const activityUnits = currentModule.atividade?.obrigatoria ? 1 : 0;
  const totalUnits = currentModule.contentItems.length + activityUnits;
  const readUnits = currentModule.contentItems.filter((item) =>
    progress.conteudosLidos.includes(item.id),
  ).length;
  const submittedUnits =
    currentModule.atividade &&
    progress.atividadesSubmetidas.includes(currentModule.atividade.id)
      ? 1
      : 0;
  const currentFraction = totalUnits
    ? (readUnits + submittedUnits) / totalUnits
    : 0;
  return Math.min(
    99,
    Math.max(
      progress.percentual,
      Math.round(((completed + currentFraction) / trail.modulos.length) * 100),
    ),
  );
}

function requireProgress(
  userId: string,
  trailId: string,
  storage: Pick<Storage, 'getItem'> = localStorage,
): { records: LearningProgress[]; trail: Trail; progress: TrailProgress } {
  const trail = findTrail(trailId);
  const records = readProgress(storage);
  const record = findRecord(records, userId, trailId);
  if (!record) {
    throw new Error('Começa a trilha antes de actualizar o teu progresso.');
  }
  return { records, trail, progress: trailProgressFrom(record, trail) };
}

function persistUpdatedProgress(
  records: LearningProgress[],
  updated: TrailProgress,
  storage: Pick<Storage, 'setItem'> = localStorage,
): TrailProgress {
  const index = records.findIndex((record) => record.id === updated.id);
  if (index < 0) throw new Error('O progresso a actualizar já não existe.');
  const trail = findTrail(updated.recursoId);
  const completedPhaseIds = trail.fases
    .filter((phase) =>
      phase.modulos.every((module) => updated.modulosConcluidos.includes(module.id)),
    )
    .map((phase) => phase.id);
  const currentPhase = trail.fases.find((phase) =>
    phase.modulos.some((module) => module.id === updated.moduloAtualId),
  );
  const normalized: TrailProgress = {
    ...updated,
    faseAtual: updated.estado === 'concluido'
      ? trail.fases.length
      : currentPhase?.ordem ?? updated.faseAtual,
    fasesConcluidas: completedPhaseIds,
  };
  const next = [...records];
  next[index] = normalized;
  writeProgress(next, storage);
  return normalized;
}

function validateActivityAnswer(activity: Activity, answer: string): void {
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
    let answers: unknown;
    try {
      answers = JSON.parse(trimmed);
    } catch {
      throw new Error('Responde às perguntas do questionário.');
    }
    if (!isRecord(answers) || !activity.perguntas?.length) {
      throw new Error('As respostas do questionário têm um formato inválido.');
    }
    const correct = activity.perguntas.every(
      (question) => answers[question.id] === question.respostaCorretaId,
    );
    if (!correct) throw new Error('Revisa as tuas respostas e tenta novamente.');
  }
}

/**
 * Guarda e actualiza o progresso das trilhas no armazenamento local.
 */
export const progressHandler = {
  async list(userId = mockConfig.userId): Promise<LearningProgress[]> {
    await delay();
    return readProgress().filter((item) => item.userId === userId);
  },

  async get(
    userId: string,
    trailId: string,
  ): Promise<TrailProgress | null> {
    await delay();
    const trail = findTrail(trailId);
    const record = findRecord(readProgress(), userId, trailId);
    return record ? trailProgressFrom(record, trail) : null;
  },

  async start(
    userId: string,
    trailId: string,
  ): Promise<TrailProgress> {
    await delay();
    const trail = findTrail(trailId);
    if (trail.status !== 'published') {
      throw new Error('Esta trilha ainda não está disponível.');
    }
    if (trail.acesso !== 'free') {
      throw new Error('Esta trilha requer acesso premium.');
    }

    const records = readProgress();
    const existing = findRecord(records, userId, trailId);
    if (existing) return trailProgressFrom(existing, trail);

    const firstModule = trail.modulos[0];
    if (!firstModule) throw new Error('Esta trilha ainda não tem módulos.');
    const now = new Date().toISOString();
    const progress: TrailProgress = {
      id: `progress-${userId}-${trailId}`,
      userId,
      recursoTipo: 'trail',
      recursoId: trailId,
      percentual: 0,
      estado: 'em_progresso',
      moduloAtualId: firstModule.id,
      moduloAtual: 0,
      faseAtual: 1,
      modulosConcluidos: [],
      fasesConcluidas: [],
      atividadesSubmetidas: [],
      conteudosLidos: [],
      rascunhosAtividade: {},
      iniciadoEm: now,
      atualizadoEm: now,
      concluidoEm: null,
    };
    writeProgress([...records, progress]);
    return progress;
  },

  async markContentRead(
    userId: string,
    trailId: string,
    moduleId: string,
    contentId: string,
  ): Promise<TrailProgress> {
    await delay();
    const { records, trail, progress } = requireProgress(userId, trailId);
    const module = findModule(trail, moduleId);
    assertModuleAccessible(trail, progress, module);
    if (!module.contentItems.some((item) => item.id === contentId)) {
      throw new Error('O conteúdo indicado não pertence a este módulo.');
    }

    const updated: TrailProgress = {
      ...progress,
      conteudosLidos: progress.conteudosLidos.includes(contentId)
        ? progress.conteudosLidos
        : [...progress.conteudosLidos, contentId],
      atualizadoEm: new Date().toISOString(),
    };
    updated.percentual = calculatePercent(trail, updated);
    return persistUpdatedProgress(records, updated);
  },

  async saveDraft(
    userId: string,
    trailId: string,
    moduleId: string,
    answer: string,
  ): Promise<TrailProgress> {
    await delay();
    const { records, trail, progress } = requireProgress(userId, trailId);
    const module = findModule(trail, moduleId);
    assertModuleAccessible(trail, progress, module);
    if (!module.atividade) {
      throw new Error('Este módulo não tem uma actividade para guardar.');
    }
    const updated: TrailProgress = {
      ...progress,
      rascunhosAtividade: {
        ...progress.rascunhosAtividade,
        [module.atividade.id]: answer,
      },
      atualizadoEm: new Date().toISOString(),
    };
    return persistUpdatedProgress(records, updated);
  },

  async submitActivity(
    userId: string,
    trailId: string,
    moduleId: string,
    answer: string,
  ): Promise<TrailProgress> {
    await delay();
    const { records, trail, progress } = requireProgress(userId, trailId);
    const module = findModule(trail, moduleId);
    assertModuleAccessible(trail, progress, module);
    if (!module.atividade) {
      throw new Error('Este módulo não tem uma actividade para submeter.');
    }
    if (
      !module.contentItems.every((item) =>
        progress.conteudosLidos.includes(item.id),
      )
    ) {
      throw new Error('Lê todos os conteúdos do módulo antes de submeter a actividade.');
    }
    validateActivityAnswer(module.atividade, answer);

    const updated: TrailProgress = {
      ...progress,
      atividadesSubmetidas: progress.atividadesSubmetidas.includes(
        module.atividade.id,
      )
        ? progress.atividadesSubmetidas
        : [...progress.atividadesSubmetidas, module.atividade.id],
      rascunhosAtividade: Object.fromEntries(
        Object.entries(progress.rascunhosAtividade).filter(
          ([id]) => id !== module.atividade?.id,
        ),
      ),
      atualizadoEm: new Date().toISOString(),
    };
    updated.percentual = calculatePercent(trail, updated);
    return persistUpdatedProgress(records, updated);
  },

  async completeModule(
    userId: string,
    trailId: string,
    moduleId: string,
  ): Promise<TrailProgress> {
    await delay();
    const { records, trail, progress } = requireProgress(userId, trailId);
    const module = findModule(trail, moduleId);
    assertModuleAccessible(trail, progress, module);
    if (
      !module.contentItems.every((item) =>
        progress.conteudosLidos.includes(item.id),
      )
    ) {
      throw new Error('Lê todos os conteúdos antes de concluir o módulo.');
    }
    if (
      module.atividade?.obrigatoria &&
      !progress.atividadesSubmetidas.includes(module.atividade.id)
    ) {
      throw new Error('Submete a actividade obrigatória antes de avançar.');
    }

    const completedModules = progress.modulosConcluidos.includes(moduleId)
      ? progress.modulosConcluidos
      : [...progress.modulosConcluidos, moduleId];
    const nextModuleIndex = trail.modulos.findIndex(
      (item) => !completedModules.includes(item.id),
    );
    const now = new Date().toISOString();
    const isComplete = nextModuleIndex === -1;
    const updated: TrailProgress = {
      ...progress,
      percentual: isComplete
        ? 100
        : Math.max(
            progress.percentual,
            Math.round((completedModules.length / trail.modulos.length) * 100),
          ),
      estado: isComplete ? 'concluido' : 'em_progresso',
      moduloAtual:
        nextModuleIndex === -1
          ? Math.max(trail.modulos.length - 1, 0)
          : nextModuleIndex,
      moduloAtualId:
        nextModuleIndex === -1 ? null : trail.modulos[nextModuleIndex].id,
      modulosConcluidos: completedModules,
      atualizadoEm: now,
      concluidoEm: isComplete ? now : progress.concluidoEm,
    };
    return persistUpdatedProgress(records, updated);
  },

  async completeTrail(
    userId: string,
    trailId: string,
  ): Promise<TrailProgress> {
    await delay();
    const { records, trail, progress } = requireProgress(userId, trailId);
    const allModulesComplete = trail.modulos.every((module) =>
      progress.modulosConcluidos.includes(module.id),
    );
    if (!allModulesComplete) {
      throw new Error('Conclui todos os módulos para terminar esta trilha.');
    }

    const now = progress.concluidoEm ?? new Date().toISOString();
    const updated: TrailProgress = {
      ...progress,
      percentual: 100,
      estado: 'concluido',
      moduloAtual: Math.max(trail.modulos.length - 1, 0),
      moduloAtualId: null,
      atualizadoEm: now,
      concluidoEm: now,
    };
    const saved = persistUpdatedProgress(records, updated);
    await achievementsHandler.unlock(userId, 'ach-007');
    return saved;
  },
};
