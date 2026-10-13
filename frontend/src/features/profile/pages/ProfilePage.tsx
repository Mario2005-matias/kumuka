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

export default function ProfilePage() {
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
        <PageHeader description="Organiza os teus dados e reúne aquilo que queres mostrar." title="Perfil" />
        <LoadingState message="A carregar o perfil…" />
      </div>
    );
  }

  if (profile.isError) {
    return (
      <div className="space-y-8">
        <PageHeader description="Organiza os teus dados e reúne aquilo que queres mostrar." title="Perfil" />
        <ErrorState message="Não foi possível carregar o teu perfil." />
      </div>
    );
  }

  if (!profile.data) {
    return (
      <div className="space-y-8">
        <PageHeader description="Organiza os teus dados e reúne aquilo que queres mostrar." title="Perfil" />
        <EmptyState
          description="Completa o onboarding para criares o teu perfil."
          icon={UserRound}
          title="Ainda não tens um perfil de demonstração"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Organiza os teus dados e reúne aquilo que queres mostrar."
        title="Perfil"
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
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Perfil KUMUKA</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">{profile.data.nome}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{profile.data.bio}</p>
          </div>
        </CardContent>
      </Card>

      <nav aria-label="Secções do perfil" className="overflow-x-auto">
        <ul className="flex min-w-max gap-2 border-b border-border">
          {[
            ['Dados', '#profile-data'],
            ['Competências', '#profile-skills'],
            ['Projectos', '#profile-projects'],
            ['Experiências', '#profile-experiences'],
            ['Evidências', '#profile-evidence'],
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
        <SectionCard description="Informação associada à tua conta." id="profile-data" title="Dados da conta">
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
                <dd className="mt-1 break-all text-sm">{user?.email ?? 'Não disponível'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserRound aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Situação</dt>
                <dd className="mt-1 text-sm">{profile.data.situacao} · {profile.data.faixaEtaria} anos</dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Objectivo</dt>
              <dd className="mt-1 text-sm">{profile.data.objetivo}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interesses</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {profile.data.interesses.map((interest) => <Badge key={interest} variant="secondary">{interest}</Badge>)}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard description="Competências que fazem parte do teu perfil." id="profile-skills" title="Competências">
          {competences.isLoading ? (
            <p className="text-sm text-muted-foreground">A carregar competências…</p>
          ) : competences.isError ? (
            <ErrorState message="Não foi possível carregar as competências." />
          ) : competences.data?.length ? (
            <ul className="flex flex-wrap gap-2">
              {competences.data.map((competence) => (
                <li key={competence.id}><Badge variant="secondary">{competence.nome}</Badge></li>
              ))}
            </ul>
          ) : (
            <EmptyState className="border-0 bg-transparent py-4" description="As competências desenvolvidas vão aparecer aqui." icon={Award} title="Ainda não há competências para mostrar" />
          )}
        </SectionCard>

        <SectionCard description="Projectos que mostram o que sabes fazer." id="profile-projects" title="Portefólio">
          {projects.isLoading ? (
            <p className="text-sm text-muted-foreground">A carregar projectos…</p>
          ) : projects.isError ? (
            <ErrorState message="Não foi possível carregar os projectos." />
          ) : projects.data?.length ? (
            <ul className="space-y-3">
              {projects.data.map((project) => (
                <li className="rounded-lg border border-border p-4" key={project.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{project.titulo}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{project.descricao}</p>
                    </div>
                    <StatusBadge status="info">{project.tipo === 'tecnico' ? 'Técnico' : 'Criativo'}</StatusBadge>
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
                    Ver projecto
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="border-0 bg-transparent py-4" description="Os teus projectos vão ficar reunidos nesta área." icon={FolderKanban} title="Ainda não há projectos para mostrar" />
          )}
        </SectionCard>

        <SectionCard description="Programas e actividades em que participas." id="profile-experiences" title="Experiências">
          {experiences.isLoading ? (
            <p className="text-sm text-muted-foreground">A carregar experiências…</p>
          ) : experiences.isError ? (
            <ErrorState message="Não foi possível carregar as experiências." />
          ) : enrolled.length ? (
            <ul className="space-y-3">
              {enrolled.map((experience) => (
                <li className="rounded-lg border border-border p-4" key={experience.id}>
                  <h3 className="font-semibold">{experience.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{experience.data} · {experience.local}</p>
                  <StatusBadge className="mt-3" status="success">Inscrita</StatusBadge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="border-0 bg-transparent py-4" description="As experiências em que participas vão aparecer aqui." icon={BriefcaseBusiness} title="Ainda não há experiências no teu perfil" />
          )}
        </SectionCard>

        <SectionCard description="Resultados concretos daquilo que aprendeste e criaste." id="profile-evidence" title="Evidências">
          {achievements.isLoading ? (
            <p className="text-sm text-muted-foreground">A carregar evidências…</p>
          ) : achievements.isError ? (
            <ErrorState message="Não foi possível carregar as evidências." />
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
            <EmptyState className="border-0 bg-transparent py-4" description="As evidências do teu trabalho vão ficar guardadas nesta área." icon={Award} title="Ainda não há evidências para mostrar" />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
