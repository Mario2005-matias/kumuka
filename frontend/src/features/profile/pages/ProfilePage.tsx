import {
  Award,
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  Mail,
  MapPin,
  Pencil,
  Plus,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useAchievements } from '@/features/dashboard/hooks/useAchievements';
import { useAuthStore } from '@/stores/authStore';
import type { Project } from '@/types/project';
import { useProfile, useProfileCompetences, useProjects } from '../hooks/useProfile';
import { ProfileEditDialog } from '../components/ProfileEditDialog';
import { ProfileHero } from '../components/ProfileHero';
import { ProjectDialog } from '../components/ProjectDialog';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation('profile');
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? '';
  const profile = useProfile(userId);
  const competences = useProfileCompetences(userId);
  const projects = useProjects(userId);
  const experiences = useExperiences({ pageSize: 50 });
  const achievements = useAchievements(userId);
  const [editingProfile, setEditingProfile] = useState(false);
  const [projectDialog, setProjectDialog] = useState<Project | 'new' | null>(null);
  const enrolled = experiences.data?.data.filter((item) => item.estado === 'inscrita') ?? [];

  if (profile.isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader description={t('description')} title={t('title')} />
        <LoadingState message={t('loading')} />
      </div>
    );
  }

  if (profile.isError) {
    return (
      <div className="space-y-8">
        <PageHeader description={t('description')} title={t('title')} />
        <ErrorState message={t('error')} />
      </div>
    );
  }

  if (!profile.data) {
    return (
      <div className="space-y-8">
        <PageHeader description={t('description')} title={t('title')} />
        <EmptyState
          description={t('emptyDescription')}
          icon={UserRound}
          title={t('emptyTitle')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description={t('description')}
        title={t('title')}
      />

      <ProfileHero onEdit={() => setEditingProfile(true)} profile={profile.data} />
      <ProfileEditDialog onClose={() => setEditingProfile(false)} open={editingProfile} profile={profile.data} />
      <ProjectDialog
        onClose={() => setProjectDialog(null)}
        open={projectDialog !== null}
        project={projectDialog === 'new' ? null : projectDialog}
        userId={userId}
      />

      <nav aria-label={t('sections.nav')} className="overflow-x-auto">
        <ul className="flex min-w-max gap-2 border-b border-border">
          {[
            [t('sections.data'), '#profile-data'],
            [t('sections.skills'), '#profile-skills'],
            [t('sections.projects'), '#profile-projects'],
            [t('sections.experiences'), '#profile-experiences'],
            [t('sections.evidence'), '#profile-evidence'],
          ].map(([label, href], index) => (
            <li key={href}>
              <a
                aria-current={index === 0 ? 'location' : undefined}
                className={`inline-flex min-h-11 items-center border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  index === 0
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                href={href}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          action={
            <Button onClick={() => setEditingProfile(true)} size="sm" variant="ghost">
              <Pencil aria-hidden="true" />
              {t('edit.short')}
            </Button>
          }
          description={t('accountDescription')}
          id="profile-data"
          title={t('accountData')}
        >
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('email')}</dt>
                <dd className="mt-1 break-all text-sm">{user?.email ?? t('notAvailable')}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserRound aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('situation')}</dt>
                <dd className="mt-1 text-sm">{profile.data.situacao || t('notAvailable')}{profile.data.idade ? ` · ${t('age', { count: profile.data.idade })}` : ''}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('edit.location')}</dt>
                <dd className="mt-1 text-sm">{profile.data.localizacao || t('notAvailable')}</dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('goal')}</dt>
              <dd className="mt-1 text-sm">{profile.data.objetivo || t('notAvailable')}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('interests')}</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {profile.data.interesses.map((interest) => <Badge key={interest} variant="secondary">{interest}</Badge>)}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard description={t('skillsDescription')} id="profile-skills" title={t('sections.skills')}>
          {competences.isLoading ? (
            <p className="text-sm text-muted-foreground">{t('loadingSkills')}</p>
          ) : competences.isError ? (
            <ErrorState message={t('skillsError')} />
          ) : competences.data?.length ? (
            <ul className="flex flex-wrap gap-2">
              {competences.data.map((competence) => (
                <li key={competence.id}><Badge variant="secondary">{competence.nome}</Badge></li>
              ))}
            </ul>
          ) : (
            <EmptyState className="border-0 bg-transparent py-4" description={t('skillsEmptyDescription')} icon={Award} title={t('skillsEmptyTitle')} />
          )}
        </SectionCard>

        <SectionCard
          action={
            <Button onClick={() => setProjectDialog('new')} size="sm">
              <Plus aria-hidden="true" />
              {t('projectForm.add')}
            </Button>
          }
          description={t('projectsDescription')}
          id="profile-projects"
          title={t('portfolio')}
        >
          {projects.isLoading ? (
            <p className="text-sm text-muted-foreground">{t('loadingProjects')}</p>
          ) : projects.isError ? (
            <ErrorState message={t('projectsError')} />
          ) : projects.data?.length ? (
            <ul className="space-y-3">
              {projects.data.map((project) => (
                <li className="rounded-2xl border border-border bg-surface-1 p-4" key={project.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{project.titulo}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{project.descricao}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusBadge status="info">{project.tipo === 'tecnico' ? t('projectType.technical') : t('projectType.creative')}</StatusBadge>
                      <Button aria-label={t('projectForm.editNamed', { title: project.titulo })} onClick={() => setProjectDialog(project)} size="icon" variant="ghost">
                        <Pencil aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  {project.competencias.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.competencias.map((skill) => <li key={skill}><Badge variant="outline">{skill}</Badge></li>)}
                    </ul>
                  )}
                  {project.link && <a
                    className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={project.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {t('viewProject')}
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </a>}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="border-0 bg-transparent py-4" description={t('projectsEmptyDescription')} icon={FolderKanban} title={t('projectsEmptyTitle')} />
          )}
        </SectionCard>

        <SectionCard description={t('experiencesDescription')} id="profile-experiences" title={t('sections.experiences')}>
          {experiences.isLoading ? (
            <p className="text-sm text-muted-foreground">{t('loadingExperiences')}</p>
          ) : experiences.isError ? (
            <ErrorState message={t('experiencesError')} />
          ) : enrolled.length ? (
            <ul className="space-y-3">
              {enrolled.map((experience) => (
                <li className="rounded-2xl border border-border bg-surface-1 p-4" key={experience.id}>
                  <h3 className="font-semibold">{experience.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{experience.dataInicio} · {experience.local}</p>
                  <StatusBadge className="mt-3" status="success">{t('enrolled')}</StatusBadge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="border-0 bg-transparent py-4" description={t('experiencesEmptyDescription')} icon={BriefcaseBusiness} title={t('experiencesEmptyTitle')} />
          )}
        </SectionCard>

        <SectionCard description={t('evidenceDescription')} id="profile-evidence" title={t('evidence')}>
          {achievements.isLoading ? (
            <p className="text-sm text-muted-foreground">{t('loadingEvidence')}</p>
          ) : achievements.isError ? (
            <ErrorState message={t('evidenceError')} />
          ) : achievements.data?.some((item) => item.unlocked) ? (
            <ul className="space-y-3">
              {achievements.data.filter((item) => item.unlocked).map((item) => (
                <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface-1 p-4" key={item.id}>
                  <Award aria-hidden="true" className="mt-0.5 size-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{item.titulo}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.descricao}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="border-0 bg-transparent py-4" description={t('evidenceEmptyDescription')} icon={Award} title={t('evidenceEmptyTitle')} />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
