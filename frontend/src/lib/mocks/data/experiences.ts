import type { Experience } from '@/types/experience';

const organizer = 'Líderes do Futuro';

function makeExperience(
  input: Pick<
    Experience,
    | 'id'
    | 'slug'
    | 'titulo'
    | 'subtitulo'
    | 'descricao'
    | 'descricaoLonga'
    | 'tipo'
    | 'data'
    | 'hora'
    | 'dataFim'
    | 'local'
    | 'localDetalhado'
    | 'modalidade'
    | 'beneficios'
    | 'requisitos'
    | 'vagas'
    | 'vagasOcupadas'
    | 'estado'
  >,
): Experience {
  return {
    ...input,
    organizador: organizer,
    organizadorLogo: null,
    empresaId: null,
    programa: [
      { hora: '09:00', titulo: 'Boas-vindas', descricao: 'Apresentação da iniciativa e dos participantes.' },
      { hora: '10:00', titulo: 'Sessão prática', descricao: 'Actividade orientada com exemplos do contexto local.' },
      { hora: '12:00', titulo: 'Partilha e próximos passos', descricao: 'Reflexão final e recursos para continuar.' },
    ],
    oradores: [
      {
        nome: 'Ana Manuel',
        cargo: 'Facilitadora de carreira',
        empresa: organizer,
        foto: null,
        bio: 'Apoia jovens a transformar competências em projectos e oportunidades.',
      },
      {
        nome: 'Paulo Domingos',
        cargo: 'Mentor',
        empresa: organizer,
        foto: null,
        bio: 'Partilha experiências práticas de aprendizagem e desenvolvimento profissional.',
      },
    ],
    banner: null,
    galeria: [],
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z',
  };
}

export const mockExperiences: Experience[] = [
  makeExperience({
    id: 'exp-001',
    slug: 'futuro-carreira-2026',
    titulo: 'Futuro Carreira 2026',
    subtitulo: 'Prepara o teu próximo passo profissional.',
    descricao: 'Encontro dedicado a carreira e oportunidades para jovens.',
    descricaoLonga: 'Um programa presencial para explorar percursos profissionais, praticar a apresentação das tuas competências e conhecer outros jovens. Participa em sessões práticas orientadas por facilitadores e sai com próximos passos claros.',
    tipo: 'programa',
    data: '2026-11-15',
    hora: '09:00',
    dataFim: null,
    local: 'Luanda',
    localDetalhado: 'Centro de Formação KUMUKA, Maianga',
    modalidade: 'presencial',
    beneficios: ['Praticar a apresentação das tuas competências', 'Receber orientação de carreira', 'Conhecer jovens com objectivos semelhantes'],
    requisitos: ['Ter entre 18 e 35 anos', 'Participar durante todo o programa'],
    vagas: 50,
    vagasOcupadas: 32,
    estado: 'inscrita',
  }),
  makeExperience({
    id: 'exp-002',
    slug: 'workshop-marketing-digital',
    titulo: 'Workshop de Marketing Digital',
    subtitulo: 'Transforma uma ideia numa campanha digital simples.',
    descricao: 'Sessão prática sobre conceitos de marketing digital.',
    descricaoLonga: 'Explora como definir um público, escolher canais digitais e planear conteúdos úteis. Vais trabalhar num exemplo de campanha adequado a um pequeno negócio ou projecto comunitário.',
    tipo: 'workshop',
    data: '2026-12-20',
    hora: '14:00',
    dataFim: null,
    local: 'Online',
    localDetalhado: null,
    modalidade: 'online',
    beneficios: ['Criar um mini-plano de conteúdos', 'Aprender a definir um público', 'Receber materiais digitais'],
    requisitos: ['Acesso à internet', 'Interesse por comunicação ou negócios'],
    vagas: 100,
    vagasOcupadas: 40,
    estado: 'aberta',
  }),
  makeExperience({
    id: 'exp-003',
    slug: 'mentoria-com-lideres',
    titulo: 'Mentoria com Líderes',
    subtitulo: 'Conversa com profissionais sobre escolhas de carreira.',
    descricao: 'Encontro de mentoria sobre percursos e desenvolvimento.',
    descricaoLonga: 'Uma sessão de mentoria em pequenos grupos para colocar perguntas, conhecer percursos profissionais e reflectir sobre os próximos passos. As vagas são limitadas para garantir espaço de conversa.',
    tipo: 'mentoria',
    data: '2027-01-15',
    hora: '10:00',
    dataFim: null,
    local: 'Luanda',
    localDetalhado: 'Hub de Inovação, Ingombota',
    modalidade: 'presencial',
    beneficios: ['Conversar com mentores', 'Receber sugestões de próximos passos', 'Construir uma rede de contactos'],
    requisitos: ['Levar uma pergunta sobre o teu percurso'],
    vagas: 20,
    vagasOcupadas: 20,
    estado: 'sem-vagas',
  }),
  makeExperience({
    id: 'exp-004',
    slug: 'futuro-tech-2026',
    titulo: 'Futuro Tech 2026',
    subtitulo: 'Descobre aplicações da tecnologia em Angola.',
    descricao: 'Experiência para explorar tecnologia e as suas aplicações.',
    descricaoLonga: 'Um encontro em Benguela para conhecer áreas tecnológicas, experimentar ferramentas digitais e conversar sobre oportunidades de aprendizagem e trabalho no sector.',
    tipo: 'evento',
    data: '2027-02-05',
    hora: '09:30',
    dataFim: null,
    local: 'Benguela',
    localDetalhado: 'Instituto Superior Politécnico de Benguela',
    modalidade: 'hibrido',
    beneficios: ['Experimentar ferramentas digitais', 'Conhecer percursos em tecnologia', 'Participar em conversas com profissionais'],
    requisitos: ['Interesse por tecnologia', 'Levar um dispositivo para as actividades práticas, se disponível'],
    vagas: 80,
    vagasOcupadas: 36,
    estado: 'aberta',
  }),
  makeExperience({
    id: 'exp-005',
    slug: 'futuro-empreendedor',
    titulo: 'Futuro Empreendedor',
    subtitulo: 'Explora ideias e testa soluções para a tua comunidade.',
    descricao: 'Programa sobre ideias e caminhos de empreendedorismo.',
    descricaoLonga: 'Um programa introdutório para transformar problemas observados na comunidade em ideias de solução. Vais trabalhar em equipa, validar uma hipótese e apresentar uma proposta inicial.',
    tipo: 'programa',
    data: '2027-02-20',
    hora: '09:00',
    dataFim: null,
    local: 'Luanda',
    localDetalhado: 'Espaço de empreendedorismo, Talatona',
    modalidade: 'presencial',
    beneficios: ['Desenvolver uma ideia de negócio', 'Praticar trabalho em equipa', 'Receber feedback de facilitadores'],
    requisitos: ['Disponibilidade para participar nas sessões'],
    vagas: 60,
    vagasOcupadas: 18,
    estado: 'futura',
  }),
  makeExperience({
    id: 'exp-006',
    slug: 'desafio-de-inovacao',
    titulo: 'Desafio de Inovação',
    subtitulo: 'Colabora online para resolver um desafio real.',
    descricao: 'Desafio online para explorar ideias e propostas de inovação.',
    descricaoLonga: 'Trabalha com uma equipa remota para compreender um desafio e propor uma solução. O percurso combina pesquisa, ideação e uma apresentação final.',
    tipo: 'desafio',
    data: '2027-03-10',
    hora: '08:00',
    dataFim: '2027-03-12',
    local: 'Online',
    localDetalhado: null,
    modalidade: 'online',
    beneficios: ['Praticar pensamento criativo', 'Trabalhar com uma equipa', 'Apresentar uma proposta'],
    requisitos: ['Acesso à internet', 'Disponibilidade durante os três dias'],
    vagas: 200,
    vagasOcupadas: 72,
    estado: 'futura',
  }),
];

export const mockExperienceRegistrations = [
  {
    id: 'registration-user-mock-01-exp-001',
    userId: 'user-mock-01',
    experienceId: 'exp-001',
    estado: 'inscrito' as const,
    inscritoEm: '2026-09-01T10:00:00Z',
  },
];
