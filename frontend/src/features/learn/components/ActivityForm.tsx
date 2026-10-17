import { useState, type FormEvent } from 'react';
import { CheckCircle2, FileUp, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldError, FieldLabel } from '@/components/ui/field';
import type { Activity } from '@/types/trail';

interface ActivityFormProps {
  activity: Activity;
  draft?: string;
  submitted: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  onSaveDraft: (answer: string) => Promise<void>;
  onSubmit: (answer: string) => Promise<void>;
  onMarkComplete: () => Promise<void>;
}

function readQuizDraft(value: string | undefined) {
  if (!value) return { answers: {}, error: null as string | null };
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Object.values(parsed).some((item: unknown) => typeof item !== 'string')
    ) {
      throw new Error('O rascunho do questionário tem um formato inválido.');
    }
    return {
      answers: Object.fromEntries(
        Object.entries(parsed).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        ),
      ),
      error: null,
    };
  } catch (caught: unknown) {
    return {
      answers: {},
      error: errorMessage(caught),
    };
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Não foi possível guardar a actividade. Tenta novamente.';
}

export function ActivityForm({
  activity,
  draft,
  submitted,
  isSaving,
  isSubmitting,
  onSaveDraft,
  onSubmit,
  onMarkComplete,
}: ActivityFormProps) {
  const [answer, setAnswer] = useState(draft ?? '');
  const [quizDraft, setQuizDraft] = useState<{
    answers: Record<string, string>;
    error: string | null;
  }>(() => readQuizDraft(draft));
  const [error, setError] = useState<string | null>(quizDraft.error);
  const [feedback, setFeedback] = useState<string | null>(null);
  const quizAnswers = quizDraft.answers;

  async function saveDraft() {
    setError(null);
    setFeedback(null);
    try {
      await onSaveDraft(
        activity.tipo === 'quiz' ? JSON.stringify(quizAnswers) : answer,
      );
      setFeedback('Rascunho guardado. Podes continuar mais tarde.');
    } catch (caught: unknown) {
      setError(errorMessage(caught));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFeedback(null);
    try {
      await onSubmit(
        activity.tipo === 'quiz' ? JSON.stringify(quizAnswers) : answer,
      );
    } catch (caught: unknown) {
      setError(errorMessage(caught));
    }
  }

  async function markComplete() {
    setError(null);
    try {
      await onMarkComplete();
    } catch (caught: unknown) {
      setError(errorMessage(caught));
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 rounded-xl border border-success/30 bg-success/5 p-5 sm:p-7">
        <p className="flex items-center gap-2 font-semibold text-success">
          <CheckCircle2 aria-hidden="true" className="size-5" />
          Actividade submetida
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Bom trabalho! A tua resposta ficou registada neste módulo.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-7"
      onSubmit={submit}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Actividade · {activity.pontos} pontos
        </p>
        <h2 className="mt-2 text-xl font-bold">{activity.enunciado}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {activity.instrucoes}
        </p>
      </div>
      {activity.tipo === 'escrita' && (
        <div className="space-y-2">
          <FieldLabel htmlFor={activity.id}>A tua resposta</FieldLabel>
          <textarea
            className="min-h-36 w-full rounded-lg border border-input bg-background p-3 text-base leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id={activity.id}
            onChange={(event) => setAnswer(event.currentTarget.value)}
            placeholder="Escreve aqui a tua resposta…"
            value={answer}
          />
        </div>
      )}
      {activity.tipo === 'link' && (
        <div className="space-y-2">
          <FieldLabel htmlFor={activity.id}>Ligação para o teu trabalho</FieldLabel>
          <input
            autoComplete="url"
            className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id={activity.id}
            onChange={(event) => setAnswer(event.currentTarget.value)}
            placeholder="https://…"
            type="url"
            value={answer}
          />
        </div>
      )}
      {activity.tipo === 'upload' && (
        <div className="space-y-2">
          <FieldLabel htmlFor={activity.id}>Imagem do teu trabalho</FieldLabel>
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-1 p-5 text-center hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring">
            <FileUp aria-hidden="true" className="size-6 text-primary" />
            <span className="text-sm text-muted-foreground">
              {answer || 'Escolhe um ficheiro PNG, JPG ou WebP'}
            </span>
            <input
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              id={activity.id}
              onChange={(event) =>
                setAnswer(event.currentTarget.files?.[0]?.name ?? '')
              }
              type="file"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            Demonstração: guardamos o nome do ficheiro, não o seu conteúdo.
          </p>
        </div>
      )}
      {activity.tipo === 'quiz' && (
        <fieldset className="space-y-4">
          <legend className="sr-only">Responde ao questionário</legend>
          {activity.perguntas?.map((question, index) => (
            <fieldset className="space-y-3" key={question.id}>
              <legend className="font-medium">
                {index + 1}. {question.enunciado}
              </legend>
              {question.opcoes.map((option) => (
                <label
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 hover:bg-surface-1"
                  key={option.id}
                >
                  <input
                    checked={quizAnswers[question.id] === option.id}
                    name={question.id}
                    onChange={() =>
                      setQuizDraft((current) => ({
                        ...current,
                        error: null,
                        answers: {
                          ...current.answers,
                          [question.id]: option.id,
                        },
                      }))
                    }
                    type="radio"
                    value={option.id}
                  />
                  <span className="text-sm">{option.texto}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </fieldset>
      )}
      {error && <FieldError role="alert">{error}</FieldError>}
      {feedback && (
        <p aria-live="polite" className="text-sm text-success">
          {feedback}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          className="min-h-11 w-full sm:w-auto"
          disabled={isSaving || isSubmitting}
          onClick={() => void saveDraft()}
          type="button"
          variant="ghost"
        >
          <Save aria-hidden="true" />
          {isSaving ? 'A guardar…' : 'Guardar rascunho'}
        </Button>
        <Button
          className="min-h-11 w-full sm:w-auto"
          disabled={isSaving || isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? 'A submeter…'
            : activity.obrigatoria
              ? 'Submeter actividade'
              : 'Submeter actividade (opcional)'}
        </Button>
        {!activity.obrigatoria && (
          <Button
            className="min-h-11 w-full sm:w-auto"
            disabled={isSaving || isSubmitting}
            onClick={() => void markComplete()}
            type="button"
          >
            Avançar sem submeter
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Podes guardar o rascunho e continuar mais tarde.
      </p>
    </form>
  );
}
