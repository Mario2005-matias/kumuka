import { useRef, useState } from 'react';
import { CheckCircle2, Download, ExternalLink, FileText, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { apiErrorMessage } from '@/lib/api/client';
import type { BlockProgress, Lesson, LessonBlock, LessonProgress, QuizAttempt } from '@/types/trail';
import type { Answers } from '../hooks/useTrailFlow';
import { useHtmlVideoTracker, useYouTubeTracker, youTubeId } from '../hooks/useLessonTracking';
import { answerFor, isAnswered } from '../lib/questions';
import { renderMarkdown } from '../lib/markdown';
import { QuestionField } from './QuestionField';

interface LessonViewProps {
  lesson: Lesson;
  progress: LessonProgress | undefined;
  blockProgress: Record<string, BlockProgress>;
  onVideoPosition: (blockId: string, position: number) => void;
  onMarkRead: () => Promise<unknown>;
  onSubmitCheckpoint: (answers: Answers) => Promise<QuizAttempt>;
  isMarkingRead: boolean;
  isSubmittingCheckpoint: boolean;
}

function HtmlVideo({ block, progress, onPosition }: { block: LessonBlock; progress?: BlockProgress; onPosition: (position: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useHtmlVideoTracker({ videoRef, report: onPosition, resumeAt: progress?.posicao ?? null });
  return (
    <video
      className="aspect-video w-full rounded-lg border border-border bg-black"
      controls
      controlsList="nodownload noplaybackrate"
      preload="metadata"
      ref={videoRef}
      src={block.url ?? undefined}
    />
  );
}

function YouTubeVideo({ videoId, progress, onPosition }: { videoId: string; progress?: BlockProgress; onPosition: (position: number) => void }) {
  const { t } = useTranslation('learning');
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useYouTubeTracker({
    containerRef,
    videoId,
    report: onPosition,
    resumeAt: progress?.posicao ?? null,
    onError: () => setFailed(true),
  });
  if (failed) return <p className="text-sm text-destructive" role="alert">{t('lesson.videoError')}</p>;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-black [&_iframe]:size-full" ref={containerRef} />
  );
}

function VideoBlock({ block, progress, onPosition }: { block: LessonBlock; progress?: BlockProgress; onPosition: (position: number) => void }) {
  const { t } = useTranslation('learning');
  const videoId = youTubeId(block.url);
  return (
    <div className="space-y-2">
      {videoId ? (
        <YouTubeVideo onPosition={onPosition} progress={progress} videoId={videoId} />
      ) : (
        <HtmlVideo block={block} onPosition={onPosition} progress={progress} />
      )}
      {block.acompanhado && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {progress?.concluido ? (
            <span className="flex items-center gap-1 font-medium text-success">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              {t('lesson.videoWatched')}
            </span>
          ) : (
            <>
              <div
                aria-label={t('lesson.videoProgress')}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={progress?.percentual ?? 0}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
              >
                <div className="h-full bg-primary" style={{ width: `${progress?.percentual ?? 0}%` }} />
              </div>
              <span>{t('lesson.videoHint')}</span>
            </>
          )}
        </div>
      )}
      {block.conteudo && <div className="text-base leading-7">{renderMarkdown(block.conteudo)}</div>}
    </div>
  );
}

function PdfBlock({ block }: { block: LessonBlock }) {
  const { t } = useTranslation('learning');
  if (!block.url) return null;
  return (
    <div className="space-y-3">
      {block.conteudo && <div className="text-base leading-7">{renderMarkdown(block.conteudo)}</div>}
      <object
        aria-label={block.titulo ?? t('lesson.pdf')}
        className="hidden h-[70vh] w-full rounded-lg border border-border md:block"
        data={block.url}
        type="application/pdf"
      >
        <p className="p-4 text-sm text-muted-foreground">{t('lesson.pdfFallback')}</p>
      </object>
      <div className="flex flex-wrap gap-2">
        <Button
          className="min-h-11"
          nativeButton={false}
          render={<a href={block.url} rel="noopener noreferrer" target="_blank" />}
          variant="outline"
        >
          <FileText aria-hidden="true" />
          {t('lesson.openPdf')}
        </Button>
        <Button
          className="min-h-11"
          nativeButton={false}
          render={<a download href={block.url} />}
          variant="ghost"
        >
          <Download aria-hidden="true" />
          {t('lesson.downloadPdf')}
        </Button>
      </div>
    </div>
  );
}

function Block({ block, progress, onPosition }: { block: LessonBlock; progress?: BlockProgress; onPosition: (position: number) => void }) {
  const { t } = useTranslation('learning');
  return (
    <section className="space-y-3">
      {block.titulo && (
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          {block.tipo === 'video' && <PlayCircle aria-hidden="true" className="size-5 text-primary" />}
          {block.titulo}
        </h3>
      )}
      {block.tipo === 'video' && <VideoBlock block={block} onPosition={onPosition} progress={progress} />}
      {block.tipo === 'pdf' && <PdfBlock block={block} />}
      {block.tipo === 'imagem' && block.url && (
        <figure className="space-y-2">
          <img alt={block.titulo ?? ''} className="w-full rounded-lg border border-border" decoding="async" loading="lazy" src={block.url} />
          {block.conteudo && <figcaption className="text-sm text-muted-foreground">{block.conteudo}</figcaption>}
        </figure>
      )}
      {block.tipo === 'texto' && <div className="text-base leading-7">{renderMarkdown(block.conteudo)}</div>}
      {block.tipo === 'link' && (
        <div className="space-y-3">
          {block.conteudo && <div className="text-base leading-7">{renderMarkdown(block.conteudo)}</div>}
          <Button
            className="min-h-11"
            nativeButton={false}
            render={<a href={block.url ?? '#'} rel="noopener noreferrer" target="_blank" />}
            variant="outline"
          >
            {t('lesson.openLink')}
            <ExternalLink aria-hidden="true" />
          </Button>
        </div>
      )}
    </section>
  );
}

function Checkpoint({
  lesson,
  passed,
  onSubmit,
  isSubmitting,
}: {
  lesson: Lesson;
  passed: boolean;
  onSubmit: (answers: Answers) => Promise<QuizAttempt>;
  isSubmitting: boolean;
}) {
  const { t } = useTranslation('learning');
  const [answers, setAnswers] = useState<Answers>({});
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const results = attempt?.resultados ?? [];
  const showResults = attempt !== null;

  async function submit() {
    setError(null);
    const payload: Answers = {};
    for (const question of lesson.verificacao) {
      const value = answerFor(question, answers[question.id]);
      if (!isAnswered(question, value)) {
        setError(t('quiz.answerAll'));
        return;
      }
      payload[question.id] = value as NonNullable<typeof value>;
    }
    try {
      setAttempt(await onSubmit(payload));
    } catch (caught) {
      setError(apiErrorMessage(caught, t('quiz.submitError')));
    }
  }

  if (passed && !showResults) {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 p-4 text-sm font-medium text-success">
        <CheckCircle2 aria-hidden="true" className="size-4" />
        {t('lesson.checkpointPassed')}
      </p>
    );
  }

  return (
    <section aria-labelledby={`checkpoint-${lesson.id}`} className="space-y-5 rounded-xl border border-primary/25 bg-primary/5 p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold" id={`checkpoint-${lesson.id}`}>{t('lesson.checkpointTitle')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('lesson.checkpointDescription')}</p>
      </div>
      {lesson.verificacao.map((question, index) => (
        <QuestionField
          key={question.id}
          number={index + 1}
          onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
          question={question}
          result={showResults ? results.find((result) => result.questionId === question.id) : undefined}
          value={answers[question.id]}
        />
      ))}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {attempt && (
        <p aria-live="polite" className={`text-sm font-medium ${attempt.aprovada ? 'text-success' : 'text-destructive'}`}>
          {attempt.aprovada ? t('lesson.checkpointPassed') : t('lesson.checkpointRetry')}
        </p>
      )}
      {showResults && !attempt?.aprovada ? (
        <Button className="min-h-11" onClick={() => setAttempt(null)} type="button" variant="outline">
          {t('quiz.tryAgain')}
        </Button>
      ) : !attempt?.aprovada ? (
        <Button className="min-h-11" disabled={isSubmitting} onClick={() => void submit()} type="button">
          {isSubmitting ? t('quiz.checking') : t('lesson.checkAnswers')}
        </Button>
      ) : null}
    </section>
  );
}

/**
 * A lesson made of content blocks. It is completed by watching its videos and answering its
 * checkpoint; reading-only lessons are completed with an explicit button.
 */
export function LessonView({
  lesson,
  progress,
  blockProgress,
  onVideoPosition,
  onMarkRead,
  onSubmitCheckpoint,
  isMarkingRead,
  isSubmittingCheckpoint,
}: LessonViewProps) {
  const { t } = useTranslation('learning');
  const [error, setError] = useState<string | null>(null);
  const hasVideo = lesson.blocos.some((block) => block.acompanhado);
  const hasCheckpoint = lesson.verificacao.length > 0;
  const videosWatched = lesson.blocos.filter((block) => block.acompanhado).every((block) => blockProgress[block.id]?.concluido);

  return (
    <article aria-labelledby={`lesson-${lesson.id}`} className="space-y-6 rounded-xl border border-border bg-card p-5 sm:p-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {t('lesson.number', { number: lesson.ordem })} · {t('catalog.duration', { count: lesson.duracao })}
          {!lesson.obrigatoria && ` · ${t('lesson.optional')}`}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight" id={`lesson-${lesson.id}`}>{lesson.titulo}</h2>
        {lesson.resumo && <p className="mt-2 text-muted-foreground">{lesson.resumo}</p>}
      </header>

      {lesson.blocos.map((block) => (
        <Block
          block={block}
          key={block.id}
          onPosition={(position) => onVideoPosition(block.id, position)}
          progress={blockProgress[block.id]}
        />
      ))}

      {hasCheckpoint && (!hasVideo || videosWatched || progress?.verificacaoAprovada) && (
        <Checkpoint
          isSubmitting={isSubmittingCheckpoint}
          lesson={lesson}
          onSubmit={onSubmitCheckpoint}
          passed={progress?.verificacaoAprovada ?? false}
        />
      )}
      {hasCheckpoint && hasVideo && !videosWatched && !progress?.verificacaoAprovada && (
        <p className="text-sm text-muted-foreground">{t('lesson.watchBeforeCheckpoint')}</p>
      )}

      {progress?.concluida ? (
        <p className="flex items-center gap-2 text-sm font-medium text-success">
          <CheckCircle2 aria-hidden="true" className="size-4" />
          {t('lesson.completed')}
        </p>
      ) : !hasVideo && !hasCheckpoint ? (
        <div className="space-y-2">
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button
            className="min-h-11"
            disabled={isMarkingRead}
            onClick={() => {
              setError(null);
              onMarkRead().catch((caught) => setError(apiErrorMessage(caught, t('lesson.readError'))));
            }}
            type="button"
          >
            <CheckCircle2 aria-hidden="true" />
            {t('lesson.markRead')}
          </Button>
        </div>
      ) : null}
    </article>
  );
}
