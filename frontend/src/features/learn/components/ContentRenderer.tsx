import type { TrailContentItem } from '@/types/trail';
import type { CourseContentItem } from '@/types/course';
import { useTranslation } from 'react-i18next';

interface ContentRendererProps {
  item: TrailContentItem | CourseContentItem;
}

function renderMarkdown(content: string) {
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let list: string[] = [];

  function flushList() {
    if (!list.length) return;
    elements.push(
      <ul className="my-4 list-disc space-y-2 pl-6" key={`list-${elements.length}`}>
        {list.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>,
    );
    list = [];
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }
    if (trimmed.startsWith('- ')) {
      list.push(trimmed.slice(2));
      return;
    }
    flushList();
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 className="mt-6 text-lg font-semibold" key={`heading-${index}`}>
          {trimmed.slice(4)}
        </h3>,
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 className="mt-6 text-xl font-semibold" key={`heading-${index}`}>
          {trimmed.slice(3)}
        </h2>,
      );
    } else {
      elements.push(
        <p className="my-3 leading-7 text-muted-foreground" key={`line-${index}`}>
          {trimmed}
        </p>,
      );
    }
  });
  flushList();
  return elements;
}

export function ContentRenderer({ item }: ContentRendererProps) {
  const { t } = useTranslation('learning');
  return (
    <article
      aria-labelledby={`content-${item.id}`}
      className="rounded-xl border border-border bg-card p-5 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        {t('module.contentNumber', { number: item.ordem })}
      </p>
      <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl" id={`content-${item.id}`}>
        {item.titulo}
      </h2>
      <div className="mt-4 text-base leading-7">{renderMarkdown(item.conteudo)}</div>
    </article>
  );
}
