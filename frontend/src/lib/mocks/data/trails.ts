import type {
  Activity,
  Trail,
  TrailContentItem,
  TrailModule,
  TrailPhase,
} from '@/types/trail';

type Reading = { titulo: string; conteudo: string };
type ActivityDraft = Pick<
  Activity,
  'tipo' | 'enunciado' | 'instrucoes' | 'obrigatoria' | 'pontos'
>;

function createModule(
  trailId: string,
  ordem: number,
  titulo: string,
  descricao: string,
  readings: [Reading, Reading, Reading],
  activityDraft: ActivityDraft,
): TrailModule {
  const moduleId = `module-${trailId}-${String(ordem).padStart(2, '0')}`;
  const contentItems: TrailContentItem[] = readings.map((reading, index) => ({
    id: `content-${moduleId}-${String(index + 1).padStart(2, '0')}`,
    moduleId,
    tipo: 'texto',
    titulo: reading.titulo,
    conteudo: reading.conteudo,
    ordem: index + 1,
  }));
  const activityId = `activity-${moduleId}`;
  const atividade: Activity = {
    ...activityDraft,
    id: activityId,
    moduleId,
    ...(activityDraft.tipo === 'quiz'
      ? {
          perguntas: [
            {
              id: `question-${moduleId}-01`,
              enunciado: `Qual é o primeiro passo recomendado para ${titulo.toLocaleLowerCase()}?`,
              opcoes: [
                { id: `${activityId}-a`, texto: 'Definir o objectivo e o público.' },
                { id: `${activityId}-b`, texto: 'Publicar sem fazer um plano.' },
                { id: `${activityId}-c`, texto: 'Ignorar os resultados.' },
              ],
              respostaCorretaId: `${activityId}-a`,
            },
          ],
        }
      : {}),
  };

  return {
    id: moduleId,
    trailId,
    faseId: '',
    titulo,
    descricao,
    ordem,
    duracao: 75,
    contentItems,
    atividade,
  };
}

const extraTopics: Record<string, string[]> = {
  'trail-001': [
    'Pesquisar oportunidades adequadas',
    'Escrever uma carta de apresentação',
    'Criar uma presença profissional online',
    'Avaliar propostas e preparar a candidatura',
    'Organizar o teu plano de procura',
  ],
  'trail-002': [
    'Definir o público e a proposta de valor',
    'Planear conteúdos para canais digitais',
    'Medir resultados e melhorar uma campanha',
  ],
  'trail-003': [
    'Estruturar páginas com HTML',
    'Aplicar estilos com CSS',
    'Criar interacções com JavaScript',
    'Testar a experiência em diferentes ecrãs',
    'Publicar e apresentar um projecto web',
    'Rever acessibilidade e qualidade do código',
    'Preparar o teu portefólio de programação',
  ],
  'trail-004': [
    'Comunicar uma visão partilhada',
    'Tomar decisões em equipa',
    'Dar feedback construtivo',
  ],
  'trail-005': [
    'Planear um orçamento mensal',
    'Criar uma estratégia de poupança',
  ],
  'trail-006': [
    'Identificar um problema e o público',
    'Desenhar uma proposta de valor',
    'Estimar custos e recursos',
    'Testar uma ideia com potenciais clientes',
    'Preparar uma apresentação do projecto',
  ],
};

function createTrail(input: {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  descricaoLonga: string;
  categoria: string;
  competenciaCentral: string;
  nivel: Trail['nivel'];
  duracao: number;
  resultadoEsperado: string;
  modulos: TrailModule[];
  totalFases: number;
  nomesFases: string[];
}): Trail {
  const { totalFases, nomesFases, ...trailInput } = input;
  const supplemental = extraTopics[input.id] ?? [];
  const modules = [
    ...input.modulos,
    ...supplemental.map((topic, index) => {
      const order = input.modulos.length + index + 1;
      return createModule(input.id, order, topic, `Aplica ${topic.toLocaleLowerCase()} a uma situação concreta.`, [
        { titulo: 'Compreender o contexto', conteudo: `Começa por identificar o objectivo e as pessoas envolvidas em ${topic.toLocaleLowerCase()}.` },
        { titulo: 'Escolher uma abordagem', conteudo: `Compara opções e escolhe uma abordagem de ${topic.toLocaleLowerCase()} adequada aos recursos disponíveis.` },
        { titulo: 'Rever o resultado', conteudo: `Regista o que aprendeste e define como vais melhorar a tua prática de ${topic.toLocaleLowerCase()}.` },
      ], {
        tipo: 'escrita',
        enunciado: `Prepara um pequeno plano para ${topic.toLocaleLowerCase()}.`,
        instrucoes: 'Indica o objectivo, os passos principais e a forma como vais rever o resultado.',
        obrigatoria: true,
        pontos: 20,
      });
    }),
  ];
  const modulesWithPhases = modules.map((module, index) => ({
    ...module,
    faseId: `fase-${input.id}-${String(Math.min(
      totalFases - 1,
      Math.floor((index * totalFases) / modules.length),
    ) + 1).padStart(2, '0')}`,
  }));
  const phases: TrailPhase[] = Array.from({ length: totalFases }, (_, index) => {
    const phaseModules = modulesWithPhases.filter(
      (module) => module.faseId === `fase-${input.id}-${String(index + 1).padStart(2, '0')}`,
    );
    return {
      id: `fase-${input.id}-${String(index + 1).padStart(2, '0')}`,
      trailId: input.id,
      titulo: nomesFases[index] ?? `Fase ${index + 1}`,
      descricao: `Desenvolve competências de ${input.competenciaCentral.toLocaleLowerCase()} nesta fase.`,
      ordem: index + 1,
      duracao: phaseModules.reduce((total, module) => total + module.duracao, 0),
      modulos: phaseModules,
    };
  });
  return {
    ...trailInput,
    modulos: modulesWithPhases,
    fases: phases,
    totalModulos: modulesWithPhases.length,
    publicoAlvo: `Jovens interessados em desenvolver ${input.competenciaCentral.toLocaleLowerCase()}.`,
    preRequisitos: [],
    objetivosAprendizagem: [
      `Compreender os fundamentos de ${input.competenciaCentral.toLocaleLowerCase()}.`,
      'Aplicar os conceitos em actividades práticas.',
      'Apresentar evidências do que aprendeste.',
    ],
    status: 'published',
    acesso: 'free',
    preco: null,
    imagem: null,
    certificado: true,
    totalFases: phases.length,
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z',
  };
}

/**
 * Seis trilhas demonstrativas com três módulos, conteúdos e actividades.
 * Consumidas por trails.handler.ts.
 */
export const mockTrails: Trail[] = [
  createTrail({
    id: 'trail-001',
    slug: 'preparacao-primeira-oportunidade',
    titulo: 'Preparação para a Primeira Oportunidade',
    descricao: 'Prepara-te para procurar uma oportunidade com confiança. Organiza o teu perfil e pratica a apresentação das tuas competências.',
    descricaoLonga: 'Uma primeira oportunidade começa com uma boa preparação. Nesta trilha, vais organizar a tua experiência, preparar um currículo claro e praticar a forma como apresentas o que sabes fazer. No fim, terás materiais concretos para adaptar a oportunidades de estágio ou emprego.',
    categoria: 'Carreira',
    competenciaCentral: 'Empregabilidade',
    nivel: 'iniciante',
    duracao: 8,
    totalFases: 4,
    nomesFases: ['Fundamentos', 'Prática', 'Projecto Final', 'Revisão'],
    resultadoEsperado: 'Um currículo revisto e respostas preparadas para apresentar as tuas competências numa oportunidade.',
    modulos: [
      createModule('trail-001', 1, 'Criar um currículo claro', 'Organiza a tua formação e as tuas competências num currículo simples.', [
        { titulo: 'O que incluir', conteudo: 'Um currículo reúne contactos, formação, competências e experiências relevantes. Mesmo sem emprego anterior, podes incluir projectos, voluntariado e actividades académicas.' },
        { titulo: 'Estruturar a informação', conteudo: 'Usa títulos consistentes e organiza a informação da mais recente para a mais antiga. Mantém cada descrição curta e ligada à oportunidade que procuras.' },
        { titulo: 'Rever antes de enviar', conteudo: 'Confirma contactos, datas e ortografia. Guarda uma versão em PDF e adapta o resumo às responsabilidades da vaga.' },
      ], { tipo: 'escrita', enunciado: 'Escreve um resumo profissional de três a cinco linhas.', instrucoes: 'Apresenta a tua área de interesse, duas competências e o tipo de oportunidade que procuras.', obrigatoria: true, pontos: 20 }),
      createModule('trail-001', 2, 'Preparar uma entrevista', 'Conhece perguntas frequentes e pratica respostas directas.', [
        { titulo: 'Antes da entrevista', conteudo: 'Lê a descrição da oportunidade e pesquisa a organização. Escolhe exemplos que mostrem como aprendeste, colaboraste ou resolveste um problema.' },
        { titulo: 'Organizar respostas', conteudo: 'Usa uma situação concreta, explica o que fizeste e termina com o resultado ou aprendizagem. Responde com clareza, sem decorar um discurso inteiro.' },
        { titulo: 'Fazer perguntas', conteudo: 'Prepara perguntas sobre a equipa, as tarefas e os próximos passos do processo. Confirma também a hora e o formato da entrevista.' },
      ], { tipo: 'quiz', enunciado: 'Revê os princípios de preparação para uma entrevista.', instrucoes: 'Escolhe a opção que melhor representa uma preparação útil.', obrigatoria: true, pontos: 20 }),
      createModule('trail-001', 3, 'Comunicar as tuas competências', 'Liga as tuas competências a exemplos concretos do dia a dia.', [
        { titulo: 'Competências com evidências', conteudo: 'Uma competência torna-se mais clara quando a ligas a uma situação observável. Pensa em trabalhos de grupo, projectos pessoais, actividades comunitárias ou tarefas académicas.' },
        { titulo: 'Escolher exemplos', conteudo: 'Selecciona exemplos relevantes para a oportunidade. Explica o desafio, a tua contribuição e aquilo que aprendeste com o resultado.' },
        { titulo: 'Preparar o próximo passo', conteudo: 'Guarda o currículo e os exemplos num local acessível. Revê-os antes de cada candidatura e actualiza-os à medida que ganhas experiência.' },
      ], { tipo: 'link', enunciado: 'Partilha uma ligação para o teu currículo ou portefólio.', instrucoes: 'Usa uma ligação acessível para quem vai avaliar o teu trabalho. Se ainda não tens uma, podes criar um documento partilhável.', obrigatoria: false, pontos: 20 }),
    ],
  }),
  createTrail({
    id: 'trail-002',
    slug: 'fundamentos-marketing-digital',
    titulo: 'Fundamentos de Marketing Digital',
    descricao: 'Explora os princípios do marketing digital e a forma como as marcas comunicam. Aprende a planear conteúdos e observar resultados.',
    descricaoLonga: 'O marketing digital ajuda organizações a comunicar com pessoas através de canais online. Nesta trilha, vais definir públicos, planear conteúdos e observar indicadores simples. Cada módulo contribui para um plano de comunicação que podes apresentar no teu portefólio.',
    categoria: 'Marketing',
    competenciaCentral: 'Marketing Digital',
    nivel: 'iniciante',
    duracao: 12,
    totalFases: 4,
    nomesFases: ['Fundamentos', 'Público e estratégia', 'Conteúdos e canais', 'Análise e próximos passos'],
    resultadoEsperado: 'Um plano inicial de comunicação digital com público, conteúdos e indicadores definidos.',
    modulos: [
      createModule('trail-002', 1, 'Conhecer o marketing digital', 'Compreende canais digitais e os seus objectivos de comunicação.', [
        { titulo: 'Canais e objectivos', conteudo: 'Um canal digital é um meio de comunicar, como um website, uma newsletter ou uma rede social. O objectivo pode ser informar, criar confiança ou incentivar uma acção.' },
        { titulo: 'Escolher o canal', conteudo: 'A escolha depende do público, do formato e dos recursos disponíveis. Não é necessário estar em todas as plataformas para comunicar bem.' },
        { titulo: 'Definir uma mensagem', conteudo: 'Uma mensagem eficaz tem um propósito e usa linguagem adequada ao público. Mantém a ideia principal visível em cada formato.' },
      ], { tipo: 'escrita', enunciado: 'Define um objectivo de comunicação para uma marca local.', instrucoes: 'Indica a marca, o público que queres alcançar e a acção que esperas que esse público tome.', obrigatoria: true, pontos: 20 }),
      createModule('trail-002', 2, 'Identificar o público-alvo', 'Define para quem é uma mensagem e que necessidade pretende responder.', [
        { titulo: 'Público e necessidade', conteudo: 'Descreve o público por necessidades e contexto, evitando pressupostos. Observa que perguntas essas pessoas fazem e que problemas tentam resolver.' },
        { titulo: 'Criar uma descrição útil', conteudo: 'Uma descrição de público resume os seus interesses e necessidades. Mantém o foco em características que ajudam a tomar decisões de comunicação.' },
        { titulo: 'Adaptar a mensagem', conteudo: 'Escolhe palavras e exemplos que façam sentido para o público. Testa se a mensagem é compreendida sem explicações adicionais.' },
      ], { tipo: 'quiz', enunciado: 'Escolhe a melhor forma de definir um público-alvo.', instrucoes: 'Considera necessidades e contexto antes de escolher um canal.', obrigatoria: true, pontos: 20 }),
      createModule('trail-002', 3, 'Planear conteúdos digitais', 'Organiza ideias de conteúdo de acordo com o tema e o canal.', [
        { titulo: 'Escolher temas', conteudo: 'Agrupa temas relacionados com as perguntas do público e os objectivos da marca. Varia entre informação útil, histórias e convites à participação.' },
        { titulo: 'Montar um calendário', conteudo: 'Um calendário simples regista tema, formato, canal e data. Reserva tempo para rever cada conteúdo antes de publicar.' },
        { titulo: 'Observar resultados', conteudo: 'Define um indicador para cada objectivo, como visitas a uma página ou respostas a uma publicação. Usa os resultados para melhorar o próximo plano.' },
      ], { tipo: 'link', enunciado: 'Partilha o teu calendário de conteúdos.', instrucoes: 'Coloca uma ligação para um documento ou quadro que possa ser consultado pela equipa.', obrigatoria: true, pontos: 20 }),
    ],
  }),
  createTrail({
    id: 'trail-003',
    slug: 'introducao-programacao-web',
    titulo: 'Introdução à Programação Web',
    descricao: 'Descobre os elementos que formam uma página web. Dá os primeiros passos na estrutura, no estilo e na interacção.',
    descricaoLonga: 'Uma página web combina estrutura, apresentação e interacção. Vais conhecer o papel do HTML e do CSS e publicar uma primeira página simples. Não precisas de experiência anterior: cada passo explica os conceitos essenciais e termina com prática.',
    categoria: 'Tecnologia',
    competenciaCentral: 'Desenvolvimento Web',
    nivel: 'iniciante',
    duracao: 20,
    totalFases: 5,
    nomesFases: ['Fundamentos', 'Estrutura', 'Estilos', 'Interactividade', 'Publicação'],
    resultadoEsperado: 'Uma página web simples, publicada e com estrutura semântica e estilo próprio.',
    modulos: [
      createModule('trail-003', 1, 'Estruturar uma página web', 'Conhece os elementos usados para organizar conteúdo numa página.', [
        { titulo: 'Elementos HTML', conteudo: 'HTML descreve a estrutura e o significado do conteúdo. Usa títulos, parágrafos e ligações para organizar a informação.' },
        { titulo: 'Criar uma página', conteudo: 'Uma página começa com um título principal e secções que agrupam ideias relacionadas. Mantém a hierarquia de títulos coerente.' },
        { titulo: 'Acessibilidade básica', conteudo: 'Texto descritivo nas ligações e títulos claros ajudam todas as pessoas a navegar. Escolhe elementos de acordo com a função do conteúdo.' },
      ], { tipo: 'escrita', enunciado: 'Desenha a estrutura de uma página sobre um tema que conheces.', instrucoes: 'Indica o título principal, três secções e uma ligação que seria útil ao visitante.', obrigatoria: true, pontos: 20 }),
      createModule('trail-003', 2, 'Dar estilo com CSS', 'Aplica cor, espaçamento e tipografia sem prejudicar a leitura.', [
        { titulo: 'Separar estrutura e estilo', conteudo: 'CSS define como os elementos aparecem sem alterar o significado do HTML. Agrupa regras relacionadas e reutiliza estilos.' },
        { titulo: 'Espaçamento e tipografia', conteudo: 'Usa espaçamento para separar secções e cria uma hierarquia de tamanhos legível. Verifica o resultado num ecrã pequeno.' },
        { titulo: 'Cores com contraste', conteudo: 'Escolhe cores que mantenham o texto legível sobre o fundo. Não uses apenas a cor para transmitir uma informação importante.' },
      ], { tipo: 'upload', enunciado: 'Entrega uma captura da tua página com estilos aplicados.', instrucoes: 'Selecciona uma imagem PNG, JPG ou WebP que mostre a página completa.', obrigatoria: true, pontos: 20 }),
      createModule('trail-003', 3, 'Publicar e rever a página', 'Testa a página em vários ecrãs e prepara uma ligação para o projecto.', [
        { titulo: 'Verificar o resultado', conteudo: 'Abre a página em diferentes larguras e testa todas as ligações. Corrige texto cortado, imagens demasiado largas e elementos que não respondem.' },
        { titulo: 'Partilhar o projecto', conteudo: 'Uma demonstração publicada facilita a revisão do teu trabalho. Confirma que o endereço é público e abre numa janela privada.' },
        { titulo: 'Registar aprendizagem', conteudo: 'Anota o que construíste, os obstáculos que resolveste e o que melhorarias a seguir. Estas notas ajudam a explicar o projecto.' },
      ], { tipo: 'link', enunciado: 'Partilha a ligação para a página que criaste.', instrucoes: 'Confirma que a página abre sem autenticação e que os elementos principais funcionam.', obrigatoria: true, pontos: 20 }),
    ],
  }),
  createTrail({
    id: 'trail-004',
    slug: 'lideranca-para-jovens',
    titulo: 'Liderança para Jovens',
    descricao: 'Explora formas de colaborar e orientar uma equipa. Pratica comunicação e tomada de decisão em grupo.',
    descricaoLonga: 'Liderar também significa criar condições para que outras pessoas contribuam. Nesta trilha, vais praticar escuta, distribuição de tarefas e tomada de decisão. O resultado é um plano simples que podes aplicar num projecto, associação ou actividade de estudo.',
    categoria: 'Liderança',
    competenciaCentral: 'Liderança',
    nivel: 'intermedio',
    duracao: 10,
    totalFases: 3,
    nomesFases: ['Autoconhecimento', 'Colaboração', 'Liderança na prática'],
    resultadoEsperado: 'Um plano de acção de equipa com responsabilidades, decisões e próximos passos claros.',
    modulos: [
      createModule('trail-004', 1, 'Colaborar em equipa', 'Identifica formas de partilhar responsabilidades e ouvir diferentes ideias.', [
        { titulo: 'Papéis e colaboração', conteudo: 'Clarifica responsabilidades e mantém a equipa informada sobre os próximos passos. A colaboração melhora quando cada pessoa sabe onde pode contribuir.' },
        { titulo: 'Escuta activa', conteudo: 'Faz perguntas para compreender diferentes pontos de vista antes de responder. Resume o que ouviste para confirmar que todos estão alinhados.' },
        { titulo: 'Acordos de equipa', conteudo: 'Combina como partilhar actualizações, resolver dúvidas e pedir ajuda. Revê os acordos quando as necessidades do grupo mudam.' },
      ], { tipo: 'escrita', enunciado: 'Propõe três acordos para uma equipa de projecto.', instrucoes: 'Inclui uma forma de distribuir tarefas, uma regra de comunicação e uma forma de pedir ajuda.', obrigatoria: true, pontos: 20 }),
      createModule('trail-004', 2, 'Tomar decisões em conjunto', 'Compara opções e escolhe próximos passos com a equipa.', [
        { titulo: 'Definir o problema', conteudo: 'Antes de escolher uma solução, descreve a situação e o resultado pretendido. Distingue factos observados de suposições.' },
        { titulo: 'Comparar opções', conteudo: 'Lista alternativas e considera tempo, impacto e recursos. Dá espaço a opiniões diferentes e regista as razões da decisão.' },
        { titulo: 'Acompanhar a decisão', conteudo: 'Atribui uma pessoa responsável e uma data para rever o progresso. Ajusta o plano quando surgem novas informações.' },
      ], { tipo: 'quiz', enunciado: 'Escolhe uma abordagem colaborativa para decidir.', instrucoes: 'Pensa em como clarificar o problema e ouvir a equipa antes de agir.', obrigatoria: true, pontos: 20 }),
      createModule('trail-004', 3, 'Dar e receber feedback', 'Transforma observações em conversas respeitosas e úteis.', [
        { titulo: 'Feedback concreto', conteudo: 'Descreve comportamentos observáveis e o seu impacto, sem fazer julgamentos sobre a pessoa. Dá um exemplo específico e sugere um próximo passo.' },
        { titulo: 'Receber feedback', conteudo: 'Escuta até ao fim e pede um exemplo se algo não estiver claro. Decide que sugestão podes experimentar e agradece a contribuição.' },
        { titulo: 'Acordar acções', conteudo: 'Fecha a conversa com um compromisso que possa ser revisto. O feedback torna-se útil quando se transforma numa acção possível.' },
      ], { tipo: 'link', enunciado: 'Partilha o plano de acção da tua equipa.', instrucoes: 'Inclui o objectivo, as responsabilidades e a data de revisão do plano.', obrigatoria: false, pontos: 20 }),
    ],
  }),
  createTrail({
    id: 'trail-005',
    slug: 'financas-pessoais-jovens',
    titulo: 'Finanças Pessoais para Jovens',
    descricao: 'Aprende a organizar receitas e despesas do dia a dia. Define prioridades para tomar decisões financeiras mais conscientes.',
    descricaoLonga: 'Um orçamento ajuda a perceber como o dinheiro entra e sai ao longo do mês. Vais registar receitas, organizar despesas e definir prioridades usando exemplos simples em kwanzas. O objectivo é criar um plano que possas rever e adaptar à tua realidade.',
    categoria: 'Finanças',
    competenciaCentral: 'Literacia Financeira',
    nivel: 'iniciante',
    duracao: 6,
    totalFases: 3,
    nomesFases: ['Fundamentos', 'Planeamento', 'Decisões financeiras'],
    resultadoEsperado: 'Um orçamento pessoal simples em kwanzas, com despesas organizadas e uma prioridade de poupança.',
    modulos: [
      createModule('trail-005', 1, 'Organizar um orçamento', 'Regista receitas e despesas para perceber como distribuis o teu dinheiro.', [
        { titulo: 'Receitas e despesas', conteudo: 'Anota entradas e saídas e revê as despesas que podes planear. Usa valores reais apenas se te sentires confortável; também podes praticar com um exemplo fictício.' },
        { titulo: 'Separar categorias', conteudo: 'Agrupa despesas essenciais, variáveis e ocasionais. Esta separação ajuda a perceber quais os custos que mudam de mês para mês.' },
        { titulo: 'Definir prioridades', conteudo: 'Escolhe uma prioridade realista para o próximo mês. Um plano útil pode ser ajustado quando a situação muda.' },
      ], { tipo: 'escrita', enunciado: 'Cria um orçamento mensal de exemplo em Kz.', instrucoes: 'Regista pelo menos três categorias de despesa e explica uma prioridade. Não incluas dados financeiros pessoais.', obrigatoria: true, pontos: 20 }),
      createModule('trail-005', 2, 'Planear despesas e poupança', 'Define limites e prepara-te para despesas que não acontecem todos os meses.', [
        { titulo: 'Despesas previstas', conteudo: 'Algumas despesas acontecem apenas em certas alturas. Regista-as quando possível para evitar que apareçam como uma surpresa.' },
        { titulo: 'Objectivo de poupança', conteudo: 'Define para que estás a poupar e em que prazo. Divide o objectivo em passos que caibam no teu orçamento.' },
        { titulo: 'Rever o plano', conteudo: 'Compara o plano com o que realmente aconteceu. Ajusta categorias e prazos sem perder de vista a prioridade escolhida.' },
      ], { tipo: 'quiz', enunciado: 'Escolhe a forma mais realista de planear uma despesa futura.', instrucoes: 'Considera o prazo, a prioridade e os valores disponíveis.', obrigatoria: true, pontos: 20 }),
      createModule('trail-005', 3, 'Tomar decisões financeiras', 'Avalia custos e considera opções antes de assumir um compromisso.', [
        { titulo: 'Comparar alternativas', conteudo: 'Compara o custo total, as condições e o momento de pagamento. Pede esclarecimentos quando alguma condição não estiver clara.' },
        { titulo: 'Reconhecer riscos', conteudo: 'Desconfia de promessas de retorno garantido ou pressão para decidir imediatamente. Procura fontes confiáveis antes de partilhar dados.' },
        { titulo: 'Manter hábitos úteis', conteudo: 'Uma revisão regular ajuda a perceber o que mudou e a manter prioridades visíveis. Escolhe um momento simples para actualizar o teu orçamento.' },
      ], { tipo: 'escrita', enunciado: 'Descreve os critérios que usarias para comparar duas opções de compra.', instrucoes: 'Considera custo total, necessidade, prazo e condições. Não partilhes dados pessoais.', obrigatoria: false, pontos: 20 }),
    ],
  }),
  createTrail({
    id: 'trail-006',
    slug: 'empreendedorismo-pratica',
    titulo: 'Empreendedorismo na Prática',
    descricao: 'Transforma uma ideia num plano inicial de negócio. Observa necessidades e pensa em formas de testar uma solução.',
    descricaoLonga: 'Uma ideia ganha força quando responde a uma necessidade observada. Nesta trilha, vais conversar com potenciais utilizadores, desenhar uma proposta de valor e preparar um teste de baixo custo. O trabalho final é um plano curto para aprender com as primeiras respostas.',
    categoria: 'Empreendedorismo',
    competenciaCentral: 'Empreendedorismo',
    nivel: 'intermedio',
    duracao: 15,
    totalFases: 4,
    nomesFases: ['Oportunidade', 'Proposta de valor', 'Validação', 'Apresentação'],
    resultadoEsperado: 'Uma proposta de negócio inicial e um plano de teste com próximos passos definidos.',
    modulos: [
      createModule('trail-006', 1, 'Definir uma ideia de negócio', 'Relaciona uma necessidade observada com uma solução que possas testar.', [
        { titulo: 'Necessidade e solução', conteudo: 'Descreve quem enfrenta a necessidade e como a tua ideia pode ajudar. Evita começar pela solução antes de compreender o problema.' },
        { titulo: 'Observar o contexto', conteudo: 'Fala com pessoas que conhecem a situação e ouve como lidam com ela hoje. Procura padrões sem assumir que uma opinião representa todas as pessoas.' },
        { titulo: 'Escrever uma hipótese', conteudo: 'Formula quem beneficiaria, que problema resolverias e que mudança esperas observar. Mantém a hipótese simples para a poderes testar.' },
      ], { tipo: 'escrita', enunciado: 'Escreve uma hipótese para a tua ideia de negócio.', instrucoes: 'Indica quem enfrenta a necessidade, que solução propões e como saberias se ajuda.', obrigatoria: true, pontos: 20 }),
      createModule('trail-006', 2, 'Testar uma proposta de valor', 'Explica o benefício da ideia e recolhe reacções antes de investir.', [
        { titulo: 'Proposta de valor', conteudo: 'Resume o benefício principal e para quem foi pensado. Usa palavras que as pessoas do público reconheceriam.' },
        { titulo: 'Teste de baixo custo', conteudo: 'Um esboço, uma conversa ou uma demonstração simples pode revelar dúvidas importantes. Define o que queres aprender antes de preparar o teste.' },
        { titulo: 'Registar aprendizagens', conteudo: 'Anota reacções e perguntas sem tentar defender a ideia. Usa o que descobriste para ajustar a proposta ou escolher outro problema.' },
      ], { tipo: 'upload', enunciado: 'Entrega um esboço simples da tua proposta.', instrucoes: 'Carrega uma imagem do esboço, cartaz ou protótipo em PNG, JPG ou WebP.', obrigatoria: true, pontos: 20 }),
      createModule('trail-006', 3, 'Preparar os próximos passos', 'Organiza recursos, custos e uma experiência inicial de validação.', [
        { titulo: 'Recursos necessários', conteudo: 'Lista as pessoas, materiais e ferramentas necessárias para fazer um primeiro teste. Distingue o essencial do que pode esperar.' },
        { titulo: 'Custos e sustentabilidade', conteudo: 'Regista custos previsíveis e considera como a proposta poderia manter-se ao longo do tempo. Usa estimativas e identifica o que ainda precisas de confirmar.' },
        { titulo: 'Plano de acção', conteudo: 'Define a próxima experiência, uma data e o resultado que queres observar. Partilha o plano com alguém que possa dar feedback.' },
      ], { tipo: 'link', enunciado: 'Partilha o teu plano de validação.', instrucoes: 'Inclui a experiência, o público, os recursos e como vais registar o que aprendeste.', obrigatoria: false, pontos: 20 }),
    ],
  }),
];
