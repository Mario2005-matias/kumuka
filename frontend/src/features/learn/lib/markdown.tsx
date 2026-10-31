import type { ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;

/**
 * Renders inline emphasis and links as React nodes (never as raw HTML).
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground" key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong className="font-semibold text-foreground" key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      return (
        <a className="font-medium text-primary underline underline-offset-4" href={link[2]} key={key} rel="noopener noreferrer" target="_blank">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

/**
 * Renders the Markdown subset used by lesson content: headings, paragraphs, bullet and numbered
 * lists, blockquotes, fenced code blocks, bold, italic, inline code and links.
 */
export function renderMarkdown(content: string) {
  const lines = content.split(/\r?\n/);
  const elements: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let code: { language: string; lines: string[] } | null = null;

  function flushList() {
    if (!list) return;
    const key = `list-${elements.length}`;
    const items = list.items.map((item, index) => <li key={`${key}-${index}`}>{renderInline(item, `${key}-${index}`)}</li>);
    elements.push(
      list.ordered ? (
        <ol className="my-4 list-decimal space-y-2 pl-6 text-muted-foreground" key={key}>{items}</ol>
      ) : (
        <ul className="my-4 list-disc space-y-2 pl-6 text-muted-foreground" key={key}>{items}</ul>
      ),
    );
    list = null;
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (code) {
      if (trimmed.startsWith('```')) {
        elements.push(<CodeBlock code={code.lines.join('\n')} key={`code-${index}`} language={code.language} />);
        code = null;
      } else {
        code.lines.push(line);
      }
      return;
    }

    if (trimmed.startsWith('```')) {
      flushList();
      code = { language: trimmed.slice(3).trim().toLowerCase(), lines: [] };
      return;
    }

    const bullet = trimmed.match(/^[-*] (.+)$/);
    const numbered = trimmed.match(/^\d+[.)] (.+)$/);

    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      return;
    }

    flushList();
    if (!trimmed) return;

    const key = `line-${index}`;
    if (trimmed.startsWith('### ')) {
      elements.push(<h4 className="mt-6 text-lg font-semibold" key={key}>{renderInline(trimmed.slice(4), key)}</h4>);
    } else if (trimmed.startsWith('## ')) {
      elements.push(<h3 className="mt-6 text-xl font-semibold" key={key}>{renderInline(trimmed.slice(3), key)}</h3>);
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote className="my-4 border-l-4 border-highlight bg-surface-1 px-4 py-3 text-foreground" key={key}>
          {renderInline(trimmed.slice(2), key)}
        </blockquote>,
      );
    } else {
      elements.push(<p className="my-3 leading-7 text-muted-foreground" key={key}>{renderInline(trimmed, key)}</p>);
    }
  });
  flushList();
  if (code) {
    const unclosed = code as { language: string; lines: string[] };
    elements.push(<CodeBlock code={unclosed.lines.join('\n')} key="code-end" language={unclosed.language} />);
  }
  return elements;
}
