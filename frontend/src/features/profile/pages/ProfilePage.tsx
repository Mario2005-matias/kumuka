import {
  Award,
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  Mail,
  UserRound,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useAchievements } from '@/features/dashboard/hooks/useAchievements';
import { useAuthStore } from '@/stores/authStore';
import { useProfile, useProfileCompetences, useProjects } from '../hooks/useProfile';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation('profile');
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? '';
  const profile = useProfile(userId);
  const competences = useProfileCompetences(userId);
  const projects = useProjects(userId);
  const experiences = useExperiences();
  const achievements = useAchievements(userId);
  const initials = profile.data?.nome
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'K';
  const enrolled = experiences.data?.filter((item) => item.estado === 'inscrita') ?? [];

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

      <Card className="overflow-hidden border-border bg-[image:var(--gradient-surface)]">
        <div aria-hidden="true" className="h-24 bg-[image:var(--gradient-brand-soft)]" />
        <CardContent className="-mt-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:gap-5 sm:p-6">
          <Avatar className="size-20 border-4 border-card" size="lg">
            <AvatarFallback className="bg-primary/15 text-xl font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 pb-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{t('kumukaProfile')}</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">{profile.data.nome}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{profile.data.bio}</p>
          </div>
        </CardContent>
      </Card>

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
        <SectionCard description={t('accountDescription')} id="profile-data" title={t('accountData')}>
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
                <dd className="mt-1 text-sm">{profile.data.situacao} · {profile.data.faixaEtaria} anos</dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('goal')}</dt>
              <dd className="mt-1 text-sm">{profile.data.objetivo}</dd>
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

        <SectionCard description={t('projectsDescription')} id="profile-projects" title={t('portfolio')}>
          {projects.isLoading ? (
            <p className="text-sm text-muted-foreground">{t('loadingProjects')}</p>
          ) : projects.isError ? (
            <ErrorState message={t('projectsError')} />
          ) : projects.data?.length ? (
            <ul className="space-y-3">
              {projects.data.map((project) => (
                <li className="rounded-lg border border-border p-4" key={project.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{project.titulo}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{project.descricao}</p>
                    </div>
                    <StatusBadge status="info">{project.tipo === 'tecnico' ? t('projectType.technical') : t('projectType.creative')}</StatusBadge>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.competencias.map((skill) => <li key={skill}><Badge variant="outline">{skill}</Badge></li>)}
                  </ul>
                  <a
                    className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={project.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {t('viewProject')}
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
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
                <li className="rounded-lg border border-border p-4" key={experience.id}>
                  <h3 className="font-semibold">{experience.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{experience.data} · {experience.local}</p>
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
                <li className="flex items-start gap-3 rounded-lg border border-border p-4" key={item.id}>
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
