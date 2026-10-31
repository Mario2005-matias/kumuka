import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Accessible dialog built on the native `<dialog>`: focus trap, Escape to close and the
 * backdrop come from the browser. Clicking the backdrop also closes it.
 */
export function Modal({ open, onClose, title, description, children }: ModalProps) {
  const { t } = useTranslation('common');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-labelledby={titleId}
      className="modal m-auto w-[calc(100%-2rem)] max-w-xl rounded-[1.75rem] border border-border/70 bg-card p-0 text-foreground elevated"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      {open && (
        <div className="max-h-[85dvh] overflow-y-auto p-5 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight" id={titleId}>{title}</h2>
              {description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>}
            </div>
            <button
              aria-label={t('actions.close')}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
