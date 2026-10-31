import { useState, type FormEvent } from 'react';
import { CheckCircle2, FileUp, RotateCcw, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldError, FieldLabel } from '@/components/ui/field';
import { apiErrorMessage } from '@/lib/api/client';
import type { Activity, ActivitySubmission } from '@/types/trail';
import type { SubmitActivityInput } from '../hooks/useTrailFlow';
import { useTranslation } from 'react-i18next';

interface ActivityFormProps {
  activity: Activity;
  submission: ActivitySubmission | undefined;
  isSaving: boolean;
  isSubmitting: boolean;
  onSaveDraft: (answer: string) => Promise<unknown>;
  onSubmit: (input: SubmitActivityInput) => Promise<unknown>;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;

function readQuizAnswers(value: string | null | undefined): Record<string, string> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    );
  } catch {
    return {};
  }
}

export function ActivityForm({
  activity,
  submission,
  isSaving,
  isSubmitting,
  onSaveDraft,
  onSubmit,
}: ActivityFormProps) {
  const { t } = useTranslation('learning');
  const isQuiz = activity.tipo === 'quiz';
  const [answer, setAnswer] = useState(isQuiz ? '' : submission?.resposta ?? '');
  const [quizAnswers, setQuizAnswers] = useState(() =>
    isQuiz ? readQuizAnswers(submission?.resposta) : {},
  );
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const questions = activity.perguntas ?? [];
  const allQuestionsAnswered = questions.every((question) => quizAnswers[question.id]);

  async function saveDraft() {
    setError(null);
    setFeedback(null);
    try {
      await onSaveDraft(isQuiz ? JSON.stringify(quizAnswers) : answer);
      setFeedback(t('activityForm.draftSaved'));
    } catch (caught: unknown) {
      setError(apiErrorMessage(caught, t('activityForm.saveError')));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFeedback(null);
    if (activity.tipo === 'upload' && !file) {
      setError(t('activityForm.fileRequired'));
      return;
    }
    if (isQuiz && !allQuestionsAnswered) {
      setError(t('activityForm.answerAllQuestions'));
      return;
    }
    try {
      await onSubmit({
        activityId: activity.id,
        ...(isQuiz
          ? { answers: quizAnswers }
          : { answer: answer.trim() || undefined, file: file ?? undefined }),
      });
    } catch (caught: unknown) {
      setError(apiErrorMessage(caught, t('activityForm.submitError')));
    }
  }

  if (submission?.aprovada) {
    return (
      <div className="space-y-2 rounded-xl border border-success/30 bg-success/5 p-5 sm:p-7">
        <p className="flex items-center gap-2 font-semibold text-success">
          <CheckCircle2 aria-hidden="true" className="size-5" />
          {t('activityForm.submitted')}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          {isQuiz
            ? t('activityForm.quizPassed', { score: submission.nota ?? 0 })
            : t('activityForm.submittedDescription')}
        </p>
      </div>
    );
  }

  const failedQuiz = isQuiz && submission?.submetida && !submission.aprovada;

  return (
    <form
      className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-7"
      onSubmit={submit}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {t('activityForm.points', { count: activity.pontos })}
          {activity.obrigatoria && ` · ${t('activityForm.required')}`}
        </p>
        <h2 className="mt-2 text-xl font-bold">{activity.enunciado}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {activity.instrucoes}
        </p>
        {isQuiz && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t('activityForm.passingScore', { score: activity.notaMinima })}
          </p>
        )}
      </div>

      {failedQuiz && (
        <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm" role="status">
          <XCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
          {t('activityForm.quizFailed', {
            score: submission.nota ?? 0,
            required: activity.notaMinima,
            count: submission.tentativas,
          })}
        </p>
      )}

      {activity.tipo === 'escrita' && (
        <div className="space-y-2">
          <FieldLabel htmlFor={activity.id}>{t('activityForm.yourAnswer')}</FieldLabel>
          <textarea
            className="min-h-36 w-full rounded-lg border border-input bg-background p-3 text-base leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id={activity.id}
            minLength={20}
            onChange={(event) => setAnswer(event.currentTarget.value)}
            placeholder={t('activityForm.answerPlaceholder')}
            value={answer}
          />
          <p className="text-xs text-muted-foreground">{t('activityForm.minLength', { count: 20 })}</p>
        </div>
      )}
      {activity.tipo === 'link' && (
        <div className="space-y-2">
          <FieldLabel htmlFor={activity.id}>{t('activityForm.workLink')}</FieldLabel>
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
          <FieldLabel htmlFor={activity.id}>{t('activityForm.workFile')}</FieldLabel>
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-1 p-5 text-center hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring">
            <FileUp aria-hidden="true" className="size-6 text-primary" />
            <span className="text-sm text-muted-foreground">
              {file?.name ?? t('activityForm.chooseFile')}
            </span>
            <input
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
              className="sr-only"
              id={activity.id}
              onChange={(event) => {
                const chosen = event.currentTarget.files?.[0] ?? null;
                if (chosen && chosen.size > MAX_FILE_BYTES) {
                  setError(t('activityForm.fileTooLarge'));
                  setFile(null);
                  return;
                }
                setError(null);
                setFile(chosen);
              }}
              type="file"
            />
          </label>
          <p className="text-xs text-muted-foreground">{t('activityForm.fileHint')}</p>
        </div>
      )}
      {isQuiz && (
        <fieldset className="space-y-4">
          <legend className="sr-only">{t('activityForm.answerQuiz')}</legend>
          {questions.map((question, index) => (
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
                      setQuizAnswers((current) => ({ ...current, [question.id]: option.id }))
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
        {activity.tipo !== 'upload' && (
          <Button
            className="min-h-11 w-full sm:w-auto"
            disabled={isSaving || isSubmitting}
            onClick={() => void saveDraft()}
            type="button"
            variant="ghost"
          >
            <Save aria-hidden="true" />
            {isSaving ? t('activityForm.saving') : t('activityForm.saveDraft')}
          </Button>
        )}
        <Button
          className="min-h-11 w-full sm:w-auto"
          disabled={isSaving || isSubmitting}
          type="submit"
        >
          {failedQuiz && <RotateCcw aria-hidden="true" />}
          {isSubmitting
            ? t('activityForm.submitting')
            : failedQuiz
              ? t('activityForm.retry')
              : activity.obrigatoria
                ? t('activityForm.submit')
                : t('activityForm.submitOptional')}
        </Button>
      </div>
      {activity.tipo !== 'upload' && (
        <p className="text-xs text-muted-foreground">{t('activityForm.draftHint')}</p>
      )}
    </form>
  );
}
