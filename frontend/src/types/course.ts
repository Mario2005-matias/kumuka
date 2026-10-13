import type { Module } from './module';

export interface Course {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  competenciaCentral: string;
  nivel: 'iniciante' | 'intermedio' | 'avancado';
  duracao: number;
  resultadoEsperado: string;
  status: 'draft' | 'published' | 'unpublished';
  acesso: 'free' | 'premium' | 'paid';
  preco: number | null;
  modulos: Module[];
  createdAt: string;
  updatedAt: string;
}
