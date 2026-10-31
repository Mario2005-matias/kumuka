import { ArrowDown, ArrowUp, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { Answer, Question, QuestionResult } from '@/types/trail';

interface QuestionFieldProps {
  question: Question;
  number: number;
  value: Answer | undefined;
  onChange: (value: Answer) => void;
  /** Feedback after submission; the field becomes read-only. */
  result?: QuestionResult;
}

const optionClass =
  'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-1 has-[:checked]:border-primary has-[:checked]:bg-primary/5';

function labelFor(question: Question, id: string): string {
  return (
    question.opcoes?.find((option) => option.id === id)?.texto ??
    question.direita?.find((option) => option.id === id)?.texto ??
    id
  );
}

function CorrectAnswer({ question, result }: { question: Question; result: QuestionResult }) {
  const { t } = useTranslation('learning');
  const correct = result.respostaCorreta;
  let text: string;
  if (typeof correct === 'boolean') {
    text = correct ? t('quiz.true') : t('quiz.false');
  } else if (Array.isArray(correct)) {
    text = correct.map((id) => labelFor(question, id)).join(question.tipo === 'ordering' ? ' → ' : ', ');
  } else if (correct && typeof correct === 'object') {
    text = (question.esquerda ?? [])
      .map((left) => `${left.texto} → ${labelFor(question, correct[left.id] ?? '')}`)
      .join(' · ');
  } else {
    text = question.tipo === 'fill_blank' ? String(correct ?? '') : labelFor(question, String(correct ?? ''));
  }
  return (
    <p className="text-sm">
      <span className="font-medium">{t('quiz.correctAnswer')}</span> {text}
    </p>
  );
}

/**
 * Renders any question type as a controlled form field and, after grading, its feedback.
 */
export function QuestionField({ question, number, value, onChange, result }: QuestionFieldProps) {
  const { t } = useTranslation('learning');
  const disabled = Boolean(result);
  const name = `question-${question.id}`;

  function renderInput() {
    switch (question.tipo) {
      case 'single':
        return question.opcoes?.map((option) => (
          <label className={optionClass} key={option.id}>
            <input
              checked={value === option.id}
              disabled={disabled}
              name={name}
              onChange={() => onChange(option.id)}
              type="radio"
            />
            {option.texto}
          </label>
        ));
      case 'multiple': {
        const selected = Array.isArray(value) ? value : [];
        return (
          <>
            <p className="text-xs text-muted-foreground">{t('quiz.selectAll')}</p>
            {question.opcoes?.map((option) => (
              <label className={optionClass} key={option.id}>
                <input
                  checked={selected.includes(option.id)}
                  disabled={disabled}
                  onChange={(event) =>
                    onChange(
                      event.currentTarget.checked
                        ? [...selected, option.id]
                        : selected.filter((id) => id !== option.id),
                    )
                  }
                  type="checkbox"
                />
                {option.texto}
              </label>
            ))}
          </>
        );
      }
      case 'true_false':
        return [true, false].map((option) => (
          <label className={optionClass} key={String(option)}>
            <input
              checked={value === option}
              disabled={disabled}
              name={name}
              onChange={() => onChange(option)}
              type="radio"
            />
            {option ? t('quiz.true') : t('quiz.false')}
          </label>
        ));
      case 'ordering': {
        const order = Array.isArray(value) ? value : (question.opcoes ?? []).map((option) => option.id);
        const move = (index: number, offset: number) => {
          const next = [...order];
          [next[index], next[index + offset]] = [next[index + offset], next[index]];
          onChange(next);
        };
        return (
          <ol className="space-y-2">
            {order.map((id, index) => (
              <li className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm" key={id}>
                <span className="w-6 font-semibold text-primary">{index + 1}.</span>
                <span className="flex-1">{labelFor(question, id)}</span>
                <Button
                  aria-label={t('quiz.moveUp')}
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowUp aria-hidden="true" />
                </Button>
                <Button
                  aria-label={t('quiz.moveDown')}
                  disabled={disabled || index === order.length - 1}
                  onClick={() => move(index, 1)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowDown aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ol>
        );
      }
      case 'matching': {
        const pairs = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
        return question.esquerda?.map((left) => (
          <label className="grid gap-2 text-sm sm:grid-cols-2 sm:items-center" key={left.id}>
            <span className="font-medium">{left.texto}</span>
            <select
              className="min-h-11 rounded-lg border border-input bg-background px-3"
              disabled={disabled}
              onChange={(event) => onChange({ ...pairs, [left.id]: event.currentTarget.value })}
              value={pairs[left.id] ?? ''}
            >
              <option value="">{t('quiz.choose')}</option>
              {question.direita?.map((right) => (
                <option key={right.id} value={right.id}>
                  {right.texto}
                </option>
              ))}
            </select>
          </label>
        ));
      }
      case 'fill_blank':
        return (
          <input
            aria-label={question.enunciado}
            className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
            disabled={disabled}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder={t('quiz.typeAnswer')}
            value={typeof value === 'string' ? value : ''}
          />
        );
    }
  }

  return (
    <fieldset className="space-y-3">
      {question.contexto && (
        <p className="rounded-lg bg-surface-1 p-3 text-sm leading-6 text-muted-foreground">{question.contexto}</p>
      )}
      <legend className="font-medium leading-6">
        {number}. {question.enunciado}
      </legend>
      <div className="space-y-2">{renderInput()}</div>
      {result && (
        <div
          className={`space-y-2 rounded-lg border p-3 ${
            result.correta ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'
          }`}
          role="status"
        >
          <p className="flex items-center gap-2 text-sm font-semibold">
            {result.correta ? (
              <CheckCircle2 aria-hidden="true" className="size-4 text-success" />
            ) : (
              <XCircle aria-hidden="true" className="size-4 text-destructive" />
            )}
            {result.correta ? t('quiz.correct') : t('quiz.incorrect')}
          </p>
          {!result.correta && <CorrectAnswer question={question} result={result} />}
          {result.explicacao && <p className="text-sm leading-6 text-muted-foreground">{result.explicacao}</p>}
        </div>
      )}
    </fieldset>
  );
}

