import type { Experience, ExperienceRegistration, TipoExperiencia } from '@/types/experience';
import { mockExperiences, mockExperienceRegistrations } from '../data/experiences';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';

type ExperienceParams = PaginationParams & {
  search?: string;
  tipo?: TipoExperiencia;
  modalidade?: Experience['modalidade'];
  periodo?: 'semana' | 'mes' | 'tres-meses';
  localizacao?: string;
};

const registrationsKey = 'kumuka-mock-experience-registrations';

function isRegistration(value: unknown): value is ExperienceRegistration {
  return (
    typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'userId' in value && typeof value.userId === 'string' &&
    'experienceId' in value && typeof value.experienceId === 'string' &&
    'estado' in value && ['inscrito', 'confirmado', 'participou', 'cancelado'].includes(String(value.estado)) &&
    'inscritoEm' in value && typeof value.inscritoEm === 'string'
  );
}

function readRegistrations(): ExperienceRegistration[] {
  const saved = localStorage.getItem(registrationsKey);
  if (!saved) return [...mockExperienceRegistrations];
  const parsed: unknown = JSON.parse(saved);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(isRegistration)
  ) {
    throw new Error('Os registos de inscrição em experiências têm um formato inválido.');
  }
  return parsed;
}

function occupiedSeats(
  experience: Experience,
  registrations: ExperienceRegistration[],
): number {
  const seededRegistrationIds = new Set(mockExperienceRegistrations.map((item) => item.id));
  const additionalRegistrations = registrations.filter(
    (item) => item.experienceId === experience.id &&
      item.estado !== 'cancelado' &&
      !seededRegistrationIds.has(item.id),
  ).length;
  return Math.min(experience.vagas, experience.vagasOcupadas + additionalRegistrations);
}

function withRegistrationState(
  experience: Experience,
  userId: string,
  registrations: ExperienceRegistration[],
): Experience {
  const occupied = occupiedSeats(experience, registrations);
  const registered = registrations.some(
    (item) => item.userId === userId && item.experienceId === experience.id &&
      item.estado !== 'cancelado',
  );
  return {
    ...experience,
    vagasOcupadas: occupied,
    estado: registered
      ? 'inscrita'
      : occupied >= experience.vagas
        ? 'sem-vagas'
        : experience.estado === 'inscrita'
          ? 'aberta'
          : experience.estado,
  };
}

function matchesPeriod(date: string, period: ExperienceParams['periodo']): boolean {
  if (!period) return true;
  const now = new Date();
  const target = new Date(`${date}T00:00:00`);
  const days = (target.getTime() - now.getTime()) / 86_400_000;
  const maxDays = period === 'semana' ? 7 : period === 'mes' ? 31 : 92;
  return days >= 0 && days <= maxDays;
}

export const experiencesHandler = {
  async list(params: ExperienceParams = {}, userId = 'user-mock-01'): Promise<Experience[]> {
    await delay();
    let found = [...mockExperiences];
    if (params.search) {
      found = search(found, params.search, ['titulo', 'descricao', 'local', 'organizador']);
    }
    if (params.tipo) found = found.filter((item) => item.tipo === params.tipo);
    if (params.modalidade) found = found.filter((item) => item.modalidade === params.modalidade);
    if (params.localizacao) {
      const location = params.localizacao.toLocaleLowerCase();
      found = found.filter((item) => item.local.toLocaleLowerCase().includes(location));
    }
    if (params.periodo) found = found.filter((item) => matchesPeriod(item.data, params.periodo));
    const registrations = readRegistrations();
    const items = paginate(sort(found, (item) => item.data), params).items;
    return items.map((item) => withRegistrationState(item, userId, registrations));
  },

  async detail(slug: string, userId = 'user-mock-01'): Promise<Experience | null> {
    await delay();
    const experience = mockExperiences.find((item) => item.slug === slug);
    if (!experience) return null;
    return withRegistrationState(experience, userId, readRegistrations());
  },

  async registrations(userId: string): Promise<ExperienceRegistration[]> {
    await delay();
    return readRegistrations().filter((item) => item.userId === userId);
  },

  async register(userId: string, experienceId: string): Promise<ExperienceRegistration> {
    await delay();
    const experience = mockExperiences.find((item) => item.id === experienceId);
    if (!experience) throw new Error('A experiência indicada não existe.');
    const registrations = readRegistrations();
    const existing = registrations.find(
      (item) => item.userId === userId && item.experienceId === experienceId &&
        item.estado !== 'cancelado',
    );
    if (existing) return existing;
    if (experience.estado === 'encerrada' || new Date(`${experience.data}T23:59:59`) < new Date()) {
      throw new Error('As inscrições para esta experiência estão encerradas.');
    }
    if (occupiedSeats(experience, registrations) >= experience.vagas) {
      throw new Error('Esta experiência já não tem vagas disponíveis.');
    }
    const registration: ExperienceRegistration = {
      id: `registration-${userId}-${experienceId}`,
      userId,
      experienceId,
      estado: 'inscrito',
      inscritoEm: new Date().toISOString(),
    };
    localStorage.setItem(registrationsKey, JSON.stringify([...registrations, registration]));
    return registration;
  },
};
