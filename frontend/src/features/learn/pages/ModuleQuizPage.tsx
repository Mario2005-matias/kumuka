import { useEffect, useState } from 'react';
import { ArrowLeft, Award, Clock3, RotateCcw, Target } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { apiErrorMessage } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import type { QuizAttempt } from '@/types/trail';
import { QuestionField } from '../components/QuestionField';
import {
  useModuleQuizStatus,
  useStartQuiz,
  useSubmitQuiz,
  type Answers,
} from '../hooks/useTrailFlow';
import { useTrail } from '../hooks/useTrails';
import { answerFor, isAnswered } from '../lib/questions';

function useMinutesUntil(iso: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!iso) return;
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, [iso]);
  if (!iso) return 0;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - now) / 60_000));
}

/**
 * End-of-module quiz: questions drawn from the bank, graded on the server, with an explanation
 * for every answer and a link back to the lesson to review.
 */
export default function ModuleQuizPage() {
  const { t } = useTranslation('learning');
  const { slug = '', moduleId = '' } = useParams();
  const trail = useTrail(slug);
  const status = useModuleQuizStatus(moduleId);
  const start = useStartQuiz(moduleId);
  const submit = useSubmitQuiz(slug, moduleId);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const waitMinutes = useMinutesUntil(status.data?.disponivelEm ?? null);
  const module = trail.data?.modulos?.find((item) => item.id === moduleId);
  const modulePath = ROUTES.learn.trailModule(slug, moduleId);

  async function begin() {
    setError(null);
    setAnswers({});
    try {
      setAttempt(await start.mutateAsync());
    } catch (caught) {
      setError(apiErrorMessage(caught, t('quiz.startError')));
    }
  }

  async function finish() {
    if (!attempt) return;
    setError(null);
    const payload: Answers = {};
    for (const question of attempt.perguntas) {
      const value = answerFor(question, answers[question.id]);
      if (!isAnswered(question, value)) {
        setError(t('quiz.answerAll'));
        return;
      }
      payload[question.id] = value as NonNullable<typeof value>;
    }
    try {
      setAttempt(await submit.mutateAsync({ attemptId: attempt.id, answers: payload }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (caught) {
      setError(apiErrorMessage(caught, t('quiz.submitError')));
    }
  }

  const header = (
    <PageHeader
      action={
        <Button className="min-h-11" nativeButton={false} render={<Link to={modulePath} />} variant="outline">
          <ArrowLeft aria-hidden="true" />
          {t('quiz.backToModule')}
        </Button>
      }
      breadcrumb={<Link className="hover:text-foreground" to={ROUTES.learn.trail(slug)}>{trail.data?.titulo}</Link>}
      description={module?.titulo}
      title={t('quiz.moduleQuizTitle')}
    />
  );

  if (status.isLoading || trail.isLoading) return <p aria-live="polite">{t('quiz.loading')}</p>;
  if (status.isError || !status.data) {
    return <EmptyState description={t('quiz.unavailableDescription')} icon={Target} title={t('quiz.unavailableTitle')} />;
  }

  const quiz = status.data;

  if (attempt?.submetida) {
    const results = attempt.resultados ?? [];
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-16">
        {header}
        <section className={`rounded-xl border p-6 text-center ${attempt.aprovada ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'}`} role="status">
          <Award aria-hidden="true" className={`mx-auto size-10 ${attempt.aprovada ? 'text-success' : 'text-muted-foreground'}`} />
          <p className="mt-3 text-4xl font-bold">{attempt.nota}%</p>
          <p className="mt-2 font-semibold">{attempt.aprovada ? t('quiz.passedTitle') : t('quiz.failedTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {attempt.aprovada
              ? t('quiz.passedDescription')
              : t('quiz.failedDescription', { score: quiz.notaMinima, correct: results.filter((item) => item.correta).length, total: results.length })}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button className="min-h-11" nativeButton={false} render={<Link to={modulePath} />}>
              {attempt.aprovada ? t('quiz.continue') : t('quiz.reviewLessons')}
            </Button>
          </div>
        </section>
        <h2 className="text-xl font-bold">{t('quiz.feedbackTitle')}</h2>
        <div className="space-y-6">
          {attempt.perguntas.map((question, index) => {
            const result = results.find((item) => item.questionId === question.id);
            return (
              <div className="space-y-2 elevated rounded-2xl border border-border/70 bg-card p-5" key={question.id}>
                <QuestionField number={index + 1} onChange={() => undefined} question={question} result={result} value={result?.resposta ?? undefined} />
                {result && !result.correta && result.lessonId && (
                  <Link className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline" to={`${modulePath}?aula=${result.lessonId}`}>
                    {t('quiz.reviewThisLesson')}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (attempt) {
    const answered = attempt.perguntas.filter((question) => isAnswered(question, answerFor(question, answers[question.id]))).length;
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-16">
        {header}
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {t('quiz.answeredCount', { answered, total: attempt.perguntas.length })}
        </p>
        <div className="space-y-6">
          {attempt.perguntas.map((question, index) => (
            <div className="elevated rounded-2xl border border-border/70 bg-card p-5" key={question.id}>
              <QuestionField
                number={index + 1}
                onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                question={question}
                value={answers[question.id]}
              />
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button className="min-h-11 w-full sm:w-auto" disabled={submit.isPending} onClick={() => void finish()}>
          {submit.isPending ? t('quiz.checking') : t('quiz.submit')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {header}
      <section className="space-y-4 elevated rounded-2xl border border-border/70 bg-card p-6">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>{t('quiz.ruleQuestions', { count: quiz.perguntas })}</li>
          <li>{t('quiz.ruleScore', { score: quiz.notaMinima })}</li>
          <li>{t('quiz.ruleRetry')}</li>
        </ul>
        {quiz.melhorNota !== null && (
          <p className="text-sm">{t('quiz.bestScore', { score: quiz.melhorNota, count: quiz.tentativas })}</p>
        )}
        {!quiz.desbloqueado && <p className="text-sm text-muted-foreground">{t('quiz.lockedUntilLessons')}</p>}
        {waitMinutes > 0 && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 aria-hidden="true" className="size-4" />
            {t('quiz.cooldown', { count: waitMinutes })}
          </p>
        )}
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button
          className="min-h-11"
          disabled={!quiz.desbloqueado || waitMinutes > 0 || start.isPending}
          onClick={() => void begin()}
        >
          {quiz.tentativas > 0 && <RotateCcw aria-hidden="true" />}
          {quiz.tentativaAbertaId ? t('quiz.resume') : quiz.tentativas > 0 ? t('quiz.tryAgain') : t('quiz.startQuiz')}
        </Button>
      </section>
    </div>
  );
}
