import type { ReactNode } from 'react';

/**
 * Renders the small Markdown subset used by lesson bodies (headings and lists).
 */
export function renderMarkdown(content: string) {
  const lines = content.split(/\r?\n/);
  const elements: ReactNode[] = [];
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
