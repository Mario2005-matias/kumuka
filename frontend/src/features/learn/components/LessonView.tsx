import { useRef } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { Lesson, LessonProgress } from '@/types/trail';
import type { HeartbeatInput } from '../hooks/useTrailFlow';
import { useReadingTracker, useVideoTracker } from '../hooks/useLessonTracking';
import { renderMarkdown } from '../lib/markdown';

interface LessonViewProps {
  lesson: Lesson;
  progress: LessonProgress | undefined;
  onHeartbeat: (input: HeartbeatInput) => void;
}

function LessonStatus({ lesson, progress }: Omit<LessonViewProps, 'onHeartbeat'>) {
  const { t } = useTranslation('learning');
  if (progress?.concluida) {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-success">
        <CheckCircle2 aria-hidden="true" className="size-4" />
        {t('lesson.completed')}
      </p>
    );
  }

  const percent = progress?.percentual ?? 0;
  const hint =
    lesson.tipo === 'video'
      ? t('lesson.videoHint', { percent: lesson.percentagemMinima })
      : lesson.tipo === 'link'
        ? t('lesson.linkHint')
        : lesson.tipo === 'imagem'
          ? t('lesson.imageHint')
          : progress?.segundosEnvolvidos && percent >= 99 && !progress.chegouAoFim
            ? t('lesson.scrollToEnd')
            : t('lesson.textHint');

  return (
    <div className="space-y-2">
      {lesson.tipo !== 'link' && (
        <div
          aria-label={t('lesson.progressLabel')}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percent}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
        >
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      )}
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function ReadingLesson({ lesson, progress, onHeartbeat }: LessonViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useReadingTracker({
    lessonId: lesson.id,
    completed: progress?.concluida ?? false,
    send: onHeartbeat,
    containerRef,
    endRef,
  });

  return (
    <div ref={containerRef}>
      {lesson.tipo === 'imagem' && lesson.mediaUrl ? (
        <figure className="mt-4 space-y-2">
          <img
            alt={lesson.titulo}
            className="w-full rounded-lg border border-border"
            decoding="async"
            loading="lazy"
            src={lesson.mediaUrl}
          />
          {lesson.conteudo && (
            <figcaption className="text-sm text-muted-foreground">{lesson.conteudo}</figcaption>
          )}
        </figure>
      ) : (
        <div className="mt-4 text-base leading-7">{renderMarkdown(lesson.conteudo)}</div>
      )}
      <div aria-hidden="true" className="h-px" ref={endRef} />
    </div>
  );
}

function VideoLesson({ lesson, progress, onHeartbeat }: LessonViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoTracker({
    lessonId: lesson.id,
    send: onHeartbeat,
    videoRef,
    resumeAt: progress?.posicao ?? null,
  });

  return (
    <div className="mt-4 space-y-3">
      <video
        className="aspect-video w-full rounded-lg border border-border bg-black"
        controls
        controlsList="nodownload noplaybackrate"
        preload="metadata"
        ref={videoRef}
        src={lesson.mediaUrl ?? undefined}
      />
      {lesson.conteudo && <div className="text-base leading-7">{renderMarkdown(lesson.conteudo)}</div>}
    </div>
  );
}

function LinkLesson({ lesson, onHeartbeat }: LessonViewProps) {
  const { t } = useTranslation('learning');
  return (
    <div className="mt-4 space-y-3">
      {lesson.conteudo && <div className="text-base leading-7">{renderMarkdown(lesson.conteudo)}</div>}
      <Button
        className="min-h-11"
        nativeButton={false}
        onClick={() => onHeartbeat({ lessonId: lesson.id, event: 'opened' })}
        render={<a href={lesson.mediaUrl ?? '#'} rel="noopener noreferrer" target="_blank" />}
        variant="outline"
      >
        {t('lesson.openLink')}
        <ExternalLink aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * Renders a lesson and reports real engagement to the API, which decides on
 * completion. Opening a lesson alone never marks it as done.
 */
export function LessonView(props: LessonViewProps) {
  const { t } = useTranslation('learning');
  const { lesson } = props;

  return (
    <article
      aria-labelledby={`lesson-${lesson.id}`}
      className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {t('module.contentNumber', { number: lesson.ordem })}
          {!lesson.obrigatoria && ` · ${t('lesson.optional')}`}
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl" id={`lesson-${lesson.id}`}>
          {lesson.titulo}
        </h2>
        {lesson.tipo === 'video' ? (
          <VideoLesson {...props} />
        ) : lesson.tipo === 'link' ? (
          <LinkLesson {...props} />
        ) : (
          <ReadingLesson {...props} />
        )}
      </div>
      <LessonStatus lesson={lesson} progress={props.progress} />
    </article>
  );
}
