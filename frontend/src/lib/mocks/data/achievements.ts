import type { Achievement } from '@/types/achievement';

/**
 * Conquistas demonstrativas, incluindo a primeira trilha concluída.
 * Consumidas por: achievements.handler.ts.
 */
export const mockAchievements: Achievement[] = [
  { id: 'ach-001', titulo: 'Perfil Completo', descricao: 'Completa o perfil para apresentar os teus interesses.', unlocked: true, unlockedAt: '2026-08-15T10:05:00Z' },
  { id: 'ach-002', titulo: 'Primeira Aprendizagem', descricao: 'Conclui a tua primeira aprendizagem.', unlocked: true, unlockedAt: '2026-08-16T10:00:00Z' },
  { id: 'ach-003', titulo: 'Primeira Actividade', descricao: 'Avança numa actividade de aprendizagem.', unlocked: true, unlockedAt: '2026-08-17T10:00:00Z' },
  { id: 'ach-004', titulo: 'Primeiro Projecto', descricao: 'Adiciona um projecto ao teu portefólio.', unlocked: true, unlockedAt: '2026-08-20T10:00:00Z' },
  { id: 'ach-005', titulo: 'Primeira Experiência', descricao: 'Participa numa experiência em que te inscreveste.', unlocked: false, unlockedAt: null },
  { id: 'ach-006', titulo: 'Primeiro Certificado', descricao: 'Conclui uma aprendizagem que disponibilize certificado.', unlocked: false, unlockedAt: null },
  { id: 'ach-007', titulo: 'Primeira Trilha Concluída', descricao: 'Conclui todos os módulos de uma trilha de aprendizagem.', unlocked: false, unlockedAt: null },
  { id: 'ach-008', titulo: 'Primeiro Curso Concluído', descricao: 'Conclui todos os módulos de um curso de aprendizagem.', unlocked: false, unlockedAt: null },
];
