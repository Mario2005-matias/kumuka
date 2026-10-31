import { useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { Modal } from '@/components/shared/Modal';
import { apiErrorMessage } from '@/lib/api/client';
import type { Project } from '@/types/project';
import { useDeleteProject, useSaveProject } from '../hooks/useProfile';
import { FormField } from './FormField';
import { TagInput } from './TagInput';
import { useTranslation } from 'react-i18next';

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  /** The project being edited; without it the dialog adds a new one. */
  project?: Project | null;
}

export function ProjectDialog({ open, onClose, userId, project }: ProjectDialogProps) {
  const { t } = useTranslation('profile');

  return (
    <Modal
      description={t('projectForm.description')}
      onClose={onClose}
      open={open}
      title={project ? t('projectForm.editTitle') : t('projectForm.addTitle')}
    >
      <ProjectForm onDone={onClose} project={project ?? null} userId={userId} />
    </Modal>
  );
}

function ProjectForm({ project, userId, onDone }: { project: Project | null; userId: string; onDone: () => void }) {
  const { t } = useTranslation('profile');
  const save = useSaveProject(userId);
  const remove = useDeleteProject(userId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [titulo, setTitulo] = useState(project?.titulo ?? '');
  const [descricao, setDescricao] = useState(project?.descricao ?? '');
  const [tipo, setTipo] = useState<Project['tipo']>(project?.tipo ?? 'tecnico');
  const [link, setLink] = useState(project?.link ?? '');
  const [competencias, setCompetencias] = useState(project?.competencias ?? []);
  const error = save.error ?? remove.error;

  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate(
      { id: project?.id, titulo: titulo.trim(), descricao: descricao.trim(), tipo, link: link.trim() || null, competencias },
      {
        onSuccess: () => {
          toast.add({ title: project ? t('projectForm.updated') : t('projectForm.added'), type: 'success' });
          onDone();
        },
      },
    );
  }

  function deleteProject() {
    if (!project) return;
    remove.mutate(project.id, {
      onSuccess: () => {
        toast.add({ title: t('projectForm.deleted'), type: 'success' });
        onDone();
      },
    });
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <FormField label={t('projectForm.title')} maxLength={160} onChange={setTitulo} required value={titulo} />
      <FormField label={t('projectForm.summary')} maxLength={2000} multiline onChange={setDescricao} required value={descricao} />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{t('projectForm.type')}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['tecnico', 'criativo'] as const).map((option) => (
            <label
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
              key={option}
            >
              <input checked={tipo === option} className="sr-only" name="tipo" onChange={() => setTipo(option)} type="radio" />
              {option === 'tecnico' ? t('projectType.technical') : t('projectType.creative')}
            </label>
          ))}
        </div>
      </fieldset>
      <FormField label={t('projectForm.link')} onChange={setLink} placeholder="https://…" type="url" value={link} />
      <TagInput hint={t('projectForm.skillsHint')} label={t('sections.skills')} max={10} onChange={setCompetencias} value={competencias} />
      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
          {apiErrorMessage(error, t('edit.error'))}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        {project && (
          confirmingDelete ? (
            <Button className="sm:mr-auto" disabled={remove.isPending} onClick={deleteProject} type="button" variant="destructive">
              <Trash2 aria-hidden="true" />
              {t('projectForm.confirmDelete')}
            </Button>
          ) : (
            <Button className="text-destructive sm:mr-auto" onClick={() => setConfirmingDelete(true)} type="button" variant="ghost">
              <Trash2 aria-hidden="true" />
              {t('projectForm.delete')}
            </Button>
          )
        )}
        <Button className="sm:ml-auto" onClick={onDone} type="button" variant="ghost">{t('edit.cancel')}</Button>
        <Button disabled={save.isPending} type="submit">
          {save.isPending ? t('edit.saving') : t('edit.save')}
        </Button>
      </div>
    </form>
  );
}
