import type { Answer, Question } from '@/types/trail';

/** Whether a question has an answer worth submitting. */
export function isAnswered(question: Question, value: Answer | undefined): boolean {
  if (value === undefined) return question.tipo === 'ordering';
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return (question.esquerda ?? []).every((left) => value[left.id]);
  return true;
}

/** Ordering questions start in the shown order, so an untouched answer is that order. */
export function answerFor(question: Question, value: Answer | undefined): Answer | undefined {
  if (value === undefined && question.tipo === 'ordering') {
    return (question.opcoes ?? []).map((option) => option.id);
  }
  return value;
}
