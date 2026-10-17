import { CalendarDays, MapPin, Search, UsersRound, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants/routes';
import type { Experience, ExperienceModality, TipoExperiencia } from '@/types/experience';

const selectClass = 'min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm';
const types: { value: TipoExperiencia; label: string }[] = [
  { value: 'programa', label: 'Programa' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'evento', label: 'Evento' },
  { value: 'mentoria', label: 'Mentoria' },
  { value: 'desafio', label: 'Desafio' },
];

function readState(experience: Experience) {
  if (experience.estado === 'inscrita') return { label: 'Inscrita', tone: 'success' as const };
  if (experience.estado === 'sem-vagas') return { label: 'Sem vagas', tone: 'warning' as const };
  if (experience.estado === 'encerrada') return { label: 'Encerrada', tone: 'neutral' as const };
  return { label: 'Com vagas', tone: 'info' as const };
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('pt-AO', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`));
}

export default function ExperiencesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const search = searchParams.get('q') ?? '';
  const tipo = searchParams.get('tipo') ?? '';
  const modalidade = searchParams.get('modalidade') ?? '';
  const periodo = searchParams.get('periodo') ?? '';
  const localizacao = searchParams.get('localizacao') ?? '';
  const experiences = useExperiences({
    search: search || undefined,
    tipo: types.some((item) => item.value === tipo) ? tipo as TipoExperiencia : undefined,
    modalidade: ['online', 'presencial', 'hibrido'].includes(modalidade)
      ? modalidade as ExperienceModality
      : undefined,
    periodo: ['semana', 'mes', 'tres-meses'].includes(periodo)
      ? periodo as 'semana' | 'mes' | 'tres-meses'
      : undefined,
    localizacao: localizacao || undefined,
  }, userId);

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function clear() {
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Participa em programas, workshops e actividades para pôr as tuas competências em prática."
        title="Experiências"
      />
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(15rem,2fr)_repeat(4,minmax(9rem,1fr))_auto] xl:items-end">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-search">Pesquisar</label>
          <Search aria-hidden="true" className="absolute left-3 top-[2.65rem] size-4 text-muted-foreground" />
          <Input className="min-h-11 pl-9" id="experience-search" onChange={(event) => update('q', event.currentTarget.value)} placeholder="Ex.: tecnologia" value={search} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-type">Tipo</label>
          <select className={selectClass} id="experience-type" onChange={(event) => update('tipo', event.currentTarget.value)} value={tipo}>
            <option value="">Todos</option>{types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-mode">Modalidade</label>
          <select className={selectClass} id="experience-mode" onChange={(event) => update('modalidade', event.currentTarget.value)} value={modalidade}>
            <option value="">Todas</option><option value="online">Online</option><option value="presencial">Presencial</option><option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-date">Data</label>
          <select className={selectClass} id="experience-date" onChange={(event) => update('periodo', event.currentTarget.value)} value={periodo}>
            <option value="">Qualquer data</option><option value="semana">Esta semana</option><option value="mes">Este mês</option><option value="tres-meses">Próximos 3 meses</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-location">Localização</label>
          <Input className="min-h-11" id="experience-location" onChange={(event) => update('localizacao', event.currentTarget.value)} placeholder="Ex.: Luanda" value={localizacao} />
        </div>
        <Button className="min-h-11 w-full sm:col-span-2 xl:col-span-1" onClick={clear} type="button" variant="outline">
          <X aria-hidden="true" />Limpar
        </Button>
      </div>
      {experiences.isLoading ? (
        <section aria-label="A carregar experiências" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div aria-hidden="true" className="h-96 animate-pulse rounded-xl border border-border bg-card p-5" key={index}><div className="h-36 rounded-lg bg-surface-2" /><div className="mt-5 h-5 w-3/4 rounded bg-surface-2" /><div className="mt-3 h-4 w-1/2 rounded bg-surface-2" /><div className="mt-8 h-11 rounded-lg bg-surface-2" /></div>)}
        </section>
      ) : experiences.isError ? (
        <ErrorState message="Não foi possível carregar as experiências." onRetry={() => void experiences.refetch()} />
      ) : experiences.data?.length ? (
        <section aria-label="Resultados das experiências" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {experiences.data.map((experience) => {
            const state = readState(experience);
            return (
              <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card" key={experience.id}>
                <div aria-hidden="true" className="flex aspect-[16/8] items-end bg-[image:var(--gradient-surface)] p-5">
                  <StatusBadge status="info">{types.find((item) => item.value === experience.tipo)?.label ?? experience.tipo}</StatusBadge>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold">{experience.titulo}</h2>
                    <StatusBadge className="shrink-0" status={state.tone}>{state.label}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{experience.subtitulo}</p>
                  <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">Data</dt><dd>{dateLabel(experience.data)} · {experience.hora}</dd></div>
                    <div className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">Local</dt><dd>{experience.local} · {experience.modalidade}</dd></div>
                    <div className="flex items-center gap-2"><UsersRound aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">Vagas</dt><dd>{experience.vagasOcupadas}/{experience.vagas} preenchidas</dd></div>
                  </dl>
                  <Button className="mt-auto min-h-11 w-full pt-5" nativeButton={false} render={<Link to={ROUTES.experiences.detail(experience.slug)} />}>
                    Saber mais
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState description="Altera os filtros para procurar outras actividades." icon={CalendarDays} title="Nenhuma experiência encontrada" />
      )}
    </div>
  );
}
