import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { Modal } from '@/components/shared/Modal';
import { apiErrorMessage } from '@/lib/api/client';
import type { Profile } from '@/types/profile';
import { useUpdateProfile } from '../hooks/useProfile';
import { FormField } from './FormField';
import { TagInput } from './TagInput';
import { useTranslation } from 'react-i18next';

interface ProfileEditDialogProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
}

export function ProfileEditDialog({ open, onClose, profile }: ProfileEditDialogProps) {
  const { t } = useTranslation('profile');

  return (
    <Modal description={t('edit.description')} onClose={onClose} open={open} title={t('edit.title')}>
      <ProfileForm onDone={onClose} profile={profile} />
    </Modal>
  );
}

/** Kept separate so the fields start from the saved profile every time the dialog opens. */
function ProfileForm({ profile, onDone }: { profile: Profile; onDone: () => void }) {
  const { t } = useTranslation('profile');
  const update = useUpdateProfile(profile.userId);
  const [form, setForm] = useState({
    nome: profile.nome,
    idade: profile.idade ? String(profile.idade) : '',
    situacao: profile.situacao,
    localizacao: profile.localizacao,
    objetivo: profile.objetivo,
    bio: profile.bio,
    linkedin: profile.linkedin ?? '',
    portfolio: profile.portfolio ?? '',
  });
  const [interesses, setInteresses] = useState(profile.interesses);
  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (value: string) => setForm((current) => ({ ...current, [key]: value })),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    update.mutate(
      {
        ...form,
        nome: form.nome.trim(),
        idade: form.idade ? Number(form.idade) : null,
        linkedin: form.linkedin.trim() || null,
        portfolio: form.portfolio.trim() || null,
        interesses,
      },
      {
        onSuccess: () => {
          toast.add({ title: t('edit.saved'), type: 'success' });
          onDone();
        },
      },
    );
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
        <FormField label={t('edit.name')} maxLength={120} required {...field('nome')} />
        <FormField label={t('edit.age')} type="number" {...field('idade')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={t('situation')} maxLength={120} placeholder={t('edit.situationPlaceholder')} {...field('situacao')} />
        <FormField label={t('edit.location')} maxLength={120} placeholder={t('edit.locationPlaceholder')} {...field('localizacao')} />
      </div>
      <FormField label={t('goal')} maxLength={160} placeholder={t('edit.goalPlaceholder')} {...field('objetivo')} />
      <FormField label={t('edit.bio')} maxLength={1000} multiline placeholder={t('edit.bioPlaceholder')} {...field('bio')} />
      <TagInput hint={t('edit.interestsHint')} label={t('interests')} max={12} onChange={setInteresses} value={interesses} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="LinkedIn" placeholder="https://linkedin.com/in/…" type="url" {...field('linkedin')} />
        <FormField label={t('edit.portfolio')} placeholder="https://…" type="url" {...field('portfolio')} />
      </div>
      {update.isError && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
          {apiErrorMessage(update.error, t('edit.error'))}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={onDone} type="button" variant="ghost">{t('edit.cancel')}</Button>
        <Button disabled={update.isPending} type="submit">
          {update.isPending ? t('edit.saving') : t('edit.save')}
        </Button>
      </div>
    </form>
  );
}
