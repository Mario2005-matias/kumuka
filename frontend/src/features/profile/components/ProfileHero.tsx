import { Camera, ExternalLink, ImagePlus, Loader2, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/profile';
import { PROFILE_MEDIA_MAX_BYTES, useProfileMedia, type ProfileMedia } from '../hooks/useProfile';
import { useTranslation } from 'react-i18next';

interface ProfileHeroProps {
  profile: Profile;
  onEdit: () => void;
}

/** Profile header: editable banner and photo, name, bio, location and links. */
export function ProfileHero({ profile, onEdit }: ProfileHeroProps) {
  const { t } = useTranslation('profile');
  const photo = useMediaActions(profile.userId, 'foto');
  const banner = useMediaActions(profile.userId, 'banner');
  const initials = profile.nome
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'K';

  return (
    <section aria-label={t('kumukaProfile')} className="elevated animate-rise overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-2.5">
      <div className="relative h-40 overflow-hidden rounded-[1.35rem] bg-[image:var(--gradient-brand)] sm:h-56">
        {profile.banner && (
          <img alt="" className="size-full object-cover transition-transform duration-700 hover:scale-[1.02]" src={profile.banner} />
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <ImagePicker busy={banner.isPending} label={profile.banner ? t('media.changeBanner') : t('media.addBanner')} onPick={banner.upload}>
            <ImagePlus aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">{profile.banner ? t('media.changeBanner') : t('media.addBanner')}</span>
          </ImagePicker>
          {profile.banner && (
            <button
              aria-label={t('media.removeBanner')}
              className="glass flex size-10 items-center justify-center rounded-full text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              disabled={banner.isPending}
              onClick={banner.remove}
              type="button"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="relative flex flex-col gap-4 px-3 pb-3 sm:flex-row sm:items-end sm:gap-5 sm:px-5 sm:pb-4">
        <div className="relative -mt-12 w-fit shrink-0 sm:-mt-14">
          <Avatar className="size-24 ring-4 ring-card sm:size-28">
            {profile.foto && <AvatarImage alt="" className="object-cover" src={profile.foto} />}
            <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <ImagePicker
            busy={photo.isPending}
            className="absolute -bottom-1 -right-1 size-10 justify-center px-0"
            label={profile.foto ? t('media.changePhoto') : t('media.addPhoto')}
            onPick={photo.upload}
          >
            <Camera aria-hidden="true" className="size-4" />
          </ImagePicker>
        </div>

        <div className="min-w-0 flex-1 sm:pb-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{t('kumukaProfile')}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">{profile.nome || t('edit.noName')}</h2>
          {profile.bio && <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{profile.bio}</p>}
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {profile.localizacao && (
              <li className="flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-4 text-primary" />{profile.localizacao}</li>
            )}
            {profile.linkedin && <ProfileLink href={profile.linkedin} label="LinkedIn" />}
            {profile.portfolio && <ProfileLink href={profile.portfolio} label={t('edit.portfolio')} />}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 sm:pb-1">
          {profile.foto && (
            <Button disabled={photo.isPending} onClick={photo.remove} size="sm" variant="ghost">
              {t('media.removePhoto')}
            </Button>
          )}
          <Button className="min-h-10" onClick={onEdit}>
            <Pencil aria-hidden="true" />
            {t('edit.open')}
          </Button>
        </div>
      </div>
    </section>
  );
}

function useMediaActions(userId: string, media: ProfileMedia) {
  const { t } = useTranslation('profile');
  const mutation = useProfileMedia(userId, media);
  const onError = (error: unknown) =>
    toast.add({ title: t('media.error'), description: apiErrorMessage(error, t('edit.error')), type: 'error' });

  return {
    isPending: mutation.isPending,
    upload: (file: File) => {
      if (file.size > PROFILE_MEDIA_MAX_BYTES[media]) {
        toast.add({
          title: t('media.tooLarge', { size: PROFILE_MEDIA_MAX_BYTES[media] / 1024 / 1024 }),
          type: 'error',
        });
        return;
      }
      mutation.mutate(file, {
        onError,
        onSuccess: () => toast.add({ title: t('media.saved'), type: 'success' }),
      });
    },
    remove: () => mutation.mutate(null, { onError }),
  };
}

interface ImagePickerProps {
  label: string;
  busy: boolean;
  onPick: (file: File) => void;
  className?: string;
  children: React.ReactNode;
}

/** Frosted button that opens the file picker for an image. */
function ImagePicker({ label, busy, onPick, className, children }: ImagePickerProps) {
  return (
    <label
      aria-busy={busy}
      className={cn(
        'glass inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-white transition-transform hover:scale-105 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white',
        busy && 'pointer-events-none opacity-80',
        className,
      )}
      title={label}
    >
      <input
        accept="image/jpeg,image/png,image/webp"
        aria-label={label}
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          if (file) onPick(file);
        }}
        type="file"
      />
      {busy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : children}
    </label>
  );
}

function ProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {label}
        <ExternalLink aria-hidden="true" className="size-3.5" />
      </a>
    </li>
  );
}
