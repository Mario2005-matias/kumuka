import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CodeBlockProps {
  code: string;
  language: string;
}

const PREVIEW_STYLES =
  'body{font-family:-apple-system,"Segoe UI",Poppins,sans-serif;margin:16px;line-height:1.5;color:#0a1a2f}a{color:#123b72}';

/**
 * A code example. HTML examples also show the rendered result in a sandboxed frame: scripts
 * run so JavaScript lessons work, but in an isolated origin with no access to the app or session.
 */
export function CodeBlock({ code, language }: CodeBlockProps) {
  const { t } = useTranslation('learning');
  const [copied, setCopied] = useState(false);
  const showPreview = language === 'html';

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-border/70 bg-[#0b1626] text-[#e6edf7] elevated">
      <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="font-mono uppercase tracking-wide text-white/60">{language || t('code.example')}</span>
        </span>
        <button
          aria-label={t('code.copy')}
          className="flex min-h-8 items-center gap-1 rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => void copy()}
          type="button"
        >
          {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}
          {copied ? t('code.copied') : t('code.copy')}
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code className="font-mono">{code}</code>
      </pre>
      {showPreview && (
        <div className="border-t border-white/10 bg-white">
          <p className="border-b border-black/5 px-4 py-1.5 text-xs font-medium text-[#475569]">{t('code.result')}</p>
          <iframe
            className="h-56 w-full resize-y bg-white"
            sandbox="allow-scripts"
            srcDoc={`<!doctype html><html><head><meta charset="utf-8"><style>${PREVIEW_STYLES}</style></head><body>${code}</body></html>`}
            title={t('code.result')}
          />
        </div>
      )}
    </figure>
  );
}
