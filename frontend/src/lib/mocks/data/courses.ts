import type {
  Course,
  CourseActivity,
  CourseContentItem,
  CourseModule,
} from '@/types/course';

type ModuleDraft = {
  titulo: string;
  descricao: string;
  duracao: number;
  conteudos: [string, string, string];
  activityType: CourseActivity['tipo'];
  activityPrompt: string;
  activityInstructions: string;
  obrigatoria?: boolean;
};

type CourseDraft = Omit<
  Course,
  'modulos' | 'totalModulos' | 'status' | 'acesso' | 'preco' | 'imagem' | 'certifica' | 'createdAt' | 'updatedAt'
> & { modulos: ModuleDraft[] };

function createModules(courseId: string, drafts: ModuleDraft[]): CourseModule[] {
  return drafts.map((draft, moduleIndex) => {
    const order = moduleIndex + 1;
    const moduleId = `module-${courseId}-${String(order).padStart(2, '0')}`;
    const contentItems: CourseContentItem[] = draft.conteudos.map(
      (conteudo, contentIndex) => ({
        id: `content-${moduleId}-${String(contentIndex + 1).padStart(2, '0')}`,
        moduleId,
        tipo: 'texto',
        titulo: ['Conceito principal', 'Aplicar o método', 'Rever resultados'][contentIndex],
        conteudo,
        ordem: contentIndex + 1,
      }),
    );
    const activityId = `activity-${moduleId}`;
    const activity: CourseActivity = {
      id: activityId,
      moduleId,
      tipo: draft.activityType,
      enunciado: draft.activityPrompt,
      instrucoes: draft.activityInstructions,
      obrigatoria: draft.obrigatoria ?? true,
      pontos: 20,
      ...(draft.activityType === 'quiz'
        ? {
            perguntas: [
              {
                id: `question-${moduleId}-01`,
                enunciado: `Qual é uma prática essencial para ${draft.titulo.toLocaleLowerCase()}?`,
                opcoes: [
                  { id: `${activityId}-a`, texto: 'Definir o objectivo e rever os dados.' },
                  { id: `${activityId}-b`, texto: 'Ignorar o contexto e avançar sem verificar.' },
                  { id: `${activityId}-c`, texto: 'Usar sempre a primeira opção disponível.' },
                ],
                respostaCorretaId: `${activityId}-a`,
              },
            ],
          }
        : {}),
    };
    return {
      id: moduleId,
      courseId,
      titulo: draft.titulo,
      descricao: draft.descricao,
      ordem: order,
      duracao: draft.duracao,
      contentItems,
      activity,
    };
  });
}

function createCourse(draft: CourseDraft): Course {
  const modulos = createModules(draft.id, draft.modulos);
  return {
    ...draft,
    modulos,
    totalModulos: modulos.length,
    certifica: true,
    status: 'published',
    acesso: 'free',
    preco: null,
    imagem: null,
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z',
  };
}

export const mockCourses: Course[] = [
  createCourse({
    id: 'course-001',
    slug: 'excel-zero-avancado',
    titulo: 'Excel do Zero ao Avançado',
    descricao: 'Aprende a organizar informação e trabalhar com folhas de cálculo. Explora fórmulas, tabelas dinâmicas e análise de dados.',
    descricaoLonga: 'Começa pelos fundamentos das folhas de cálculo e avança para ferramentas que apoiam decisões. Vais praticar fórmulas, organizar tabelas, criar gráficos e resumir informação com tabelas dinâmicas. Cada módulo combina explicações directas com uma actividade prática. No fim, terás uma análise pronta para apresentar.',
    categoria: 'Tecnologia',
    competenciaCentral: 'Excel Avançado',
    nivel: 'iniciante',
    duracao: 10,
    resultadoEsperado: 'Vais dominar Excel do básico ao avançado, incluindo fórmulas, tabelas dinâmicas e análise de dados.',
    preRequisitos: [],
    publicoAlvo: 'Jovens que querem organizar dados e desenvolver competências digitais para estudar ou trabalhar.',
    modulos: [
      {
        titulo: 'Introdução ao Excel',
        descricao: 'Conhece o ambiente de trabalho, células e tipos de dados.',
        duracao: 30,
        conteudos: [
          'Um livro do Excel é composto por folhas, células, linhas e colunas. Cada célula tem um endereço que combina a coluna e a linha, como A1.',
          'Texto, números e datas são tipos de dados diferentes. Usa cabeçalhos para identificar cada coluna e mantém um registo por linha.',
          'Guarda o ficheiro com um nome claro e confirma a folha activa antes de introduzir dados.',
        ],
        activityType: 'escrita',
        activityPrompt: 'Descreve uma pequena tabela que gostarias de organizar no Excel.',
        activityInstructions: 'Indica o objectivo da tabela e pelo menos três colunas que usarias.',
      },
      {
        titulo: 'Fórmulas Básicas',
        descricao: 'Calcula totais, médias e contagens com fórmulas simples.',
        duracao: 60,
        conteudos: [
          'As fórmulas começam com o sinal de igual. Podes combinar referências a células com operadores como +, -, * e /.',
          'SOMA agrega vários valores e MÉDIA calcula o valor médio. Intervalos como B2:B8 tornam as fórmulas mais fáceis de rever.',
          'Confirma o intervalo seleccionado e testa o resultado com um cálculo simples antes de copiar a fórmula para outras linhas.',
        ],
        activityType: 'quiz',
        activityPrompt: 'Escolhe a fórmula mais adequada para somar valores de B2 a B8.',
        activityInstructions: 'Selecciona uma resposta. A submissão valida as respostas do questionário.',
      },
      {
        titulo: 'Tabelas e Gráficos',
        descricao: 'Transforma listas em tabelas e escolhe um gráfico legível.',
        duracao: 90,
        conteudos: [
          'Uma tabela estruturada facilita filtrar, ordenar e acrescentar registos sem perder os cabeçalhos.',
          'Colunas e barras ajudam a comparar valores. Gráficos de linhas mostram alterações ao longo do tempo.',
          'Usa um título descritivo, unidades visíveis e poucas cores para que a mensagem principal se destaque.',
        ],
        activityType: 'upload',
        activityPrompt: 'Partilha uma imagem de uma tabela ou gráfico que criaste.',
        activityInstructions: 'Escolhe uma captura PNG, JPG ou WebP. O mock regista apenas o nome do ficheiro.',
      },
      {
        titulo: 'Fórmulas Avançadas',
        descricao: 'Combina funções condicionais e de pesquisa para responder a perguntas.',
        duracao: 90,
        conteudos: [
          'A função SE devolve um resultado quando uma condição é verdadeira e outro quando é falsa.',
          'Funções de contagem condicionada ajudam a contar apenas registos que correspondem a critérios definidos.',
          'Divide fórmulas complexas em partes e verifica referências e critérios com alguns exemplos conhecidos.',
        ],
        activityType: 'quiz',
        activityPrompt: 'Verifica como escolher uma função para analisar condições.',
        activityInstructions: 'Responde ao questionário sobre funções condicionais.',
      },
      {
        titulo: 'Tabelas Dinâmicas',
        descricao: 'Resume grandes listas e compara resultados por categoria.',
        duracao: 120,
        conteudos: [
          'Uma tabela dinâmica resume dados sem alterar a lista original. Confirma que os dados têm cabeçalhos e não têm linhas vazias.',
          'Arrasta campos para linhas, colunas e valores para agrupar e comparar. Podes alterar a operação de soma para contagem ou média.',
          'Actualiza a tabela depois de acrescentar registos e valida o resumo comparando-o com a fonte.',
        ],
        activityType: 'escrita',
        activityPrompt: 'Planeia uma análise que poderias apresentar com uma tabela dinâmica.',
        activityInstructions: 'Escreve a pergunta que queres responder, os campos de agrupamento e o valor que vais resumir.',
      },
    ],
  }),
  createCourse({
    id: 'course-002',
    slug: 'comunicacao-eficaz',
    titulo: 'Comunicação Eficaz',
    descricao: 'Pratica formas claras de partilhar ideias em diferentes situações. Trabalha a escuta e a organização da mensagem.',
    descricaoLonga: 'Comunicar com clareza ajuda a trocar ideias, colaborar e resolver mal-entendidos. Vais organizar mensagens, praticar escuta activa e adaptar a comunicação ao público. Os exercícios usam situações do quotidiano e de trabalho.',
    categoria: 'Comunicação',
    competenciaCentral: 'Comunicação',
    nivel: 'iniciante',
    duracao: 6,
    resultadoEsperado: 'Vais dominar técnicas para estruturar mensagens claras, ouvir activamente e comunicar com confiança.',
    preRequisitos: [],
    publicoAlvo: 'Jovens que querem apresentar ideias com clareza em estudos, projectos e oportunidades profissionais.',
    modulos: [
      { titulo: 'Organizar uma mensagem', descricao: 'Define a ideia principal e apresenta-a com clareza.', duracao: 45, conteudos: ['Identifica primeiro o que queres que a outra pessoa saiba ou faça.', 'Organiza a mensagem em ideia principal, contexto e próximo passo.', 'Remove detalhes que não ajudam a compreender o ponto central.'], activityType: 'escrita', activityPrompt: 'Escreve uma mensagem curta para apresentar uma ideia.', activityInstructions: 'Indica o público e termina com um próximo passo claro.' },
      { titulo: 'Praticar escuta activa', descricao: 'Ouve para compreender antes de responder.', duracao: 60, conteudos: ['Escuta sem interromper e observa as perguntas e preocupações da outra pessoa.', 'Resume o que entendeste com as tuas palavras e confirma se está correcto.', 'Faz perguntas abertas quando precisares de contexto adicional.'], activityType: 'quiz', activityPrompt: 'Revê situações de escuta activa.', activityInstructions: 'Escolhe a resposta que demonstra compreensão e respeito.' },
      { titulo: 'Adaptar a comunicação', descricao: 'Ajusta o tom, o canal e os exemplos ao contexto.', duracao: 60, conteudos: ['Pensa no que o público já sabe e no contexto em que vai receber a mensagem.', 'Escolhe um canal acessível e uma linguagem adequada à situação.', 'Pede feedback e ajusta a mensagem quando não for compreendida.'], activityType: 'link', activityPrompt: 'Partilha um exemplo de apresentação ou mensagem.', activityInstructions: 'Cola uma ligação acessível para o teu exemplo.' },
      { titulo: 'Comunicar em equipa', descricao: 'Partilha responsabilidades e mantém uma equipa alinhada.', duracao: 60, conteudos: ['Combina objectivos, responsabilidades e prazos antes de começar um trabalho conjunto.', 'Partilha actualizações de forma breve e escolhe um canal acessível à equipa.', 'Quando houver desacordo, descreve o problema e procura uma solução concreta.'], activityType: 'escrita', activityPrompt: 'Descreve como alinharias uma tarefa com uma equipa.', activityInstructions: 'Inclui um objectivo, uma responsabilidade e uma forma de acompanhar o progresso.' },
    ],
  }),
  createCourse({
    id: 'course-003',
    slug: 'gestao-de-tempo',
    titulo: 'Gestão de Tempo',
    descricao: 'Organiza tarefas e prioridades para usar melhor o teu tempo. Cria um plano realista para a semana.',
    descricaoLonga: 'Uma boa gestão do tempo começa por compreender compromissos, energia e prioridades. Vais dividir tarefas, planear blocos de trabalho e rever o que precisa de ser ajustado. O objectivo é construir um plano sustentável, não preencher cada minuto.',
    categoria: 'Produtividade',
    competenciaCentral: 'Gestão de Tempo',
    nivel: 'iniciante',
    duracao: 4,
    resultadoEsperado: 'Vais dominar métodos de priorização e criar um plano semanal realista.',
    preRequisitos: [],
    publicoAlvo: 'Estudantes e jovens profissionais que querem equilibrar responsabilidades e objectivos.',
    modulos: [
      { titulo: 'Priorizar tarefas', descricao: 'Distingue tarefas urgentes, importantes e adiáveis.', duracao: 45, conteudos: ['Regista tarefas e prazos para libertar espaço mental.', 'Compara impacto, urgência e esforço antes de escolher o que fazer.', 'Divide tarefas grandes em passos que possas concluir.'], activityType: 'quiz', activityPrompt: 'Escolhe uma estratégia para priorizar tarefas.', activityInstructions: 'Selecciona a opção mais realista para organizar a semana.' },
      { titulo: 'Planear a semana', descricao: 'Distribui trabalho e pausas de forma sustentável.', duracao: 60, conteudos: ['Reserva primeiro os compromissos fixos e depois os blocos de foco.', 'Estima a duração e deixa espaço para imprevistos e pausas.', 'Agrupa tarefas semelhantes quando isso reduzir mudanças de contexto.'], activityType: 'escrita', activityPrompt: 'Cria um plano para uma semana de trabalho ou estudo.', activityInstructions: 'Define três prioridades e quando vais avançar em cada uma.' },
      { titulo: 'Rever e ajustar', descricao: 'Aprende com o plano e adapta prioridades.', duracao: 60, conteudos: ['No fim do dia, observa o que avançou e o que ficou pendente.', 'Procura causas e dependências em vez de te culpares por atrasos.', 'Actualiza prazos e comunica cedo quando uma prioridade muda.'], activityType: 'link', activityPrompt: 'Partilha o teu plano semanal.', activityInstructions: 'Cola a ligação para um documento ou quadro que possas consultar.' },
    ],
  }),
  createCourse({
    id: 'course-004',
    slug: 'design-grafico-com-canva',
    titulo: 'Design Gráfico com Canva',
    descricao: 'Explora princípios visuais e organiza elementos numa composição. Prepara peças gráficas simples a partir de uma ideia.',
    descricaoLonga: 'Aprende a transformar uma mensagem numa peça visual simples e legível. Vais praticar hierarquia, cor e composição e preparar um design para um público e canal definidos. Não precisas de experiência anterior em design.',
    categoria: 'Design',
    competenciaCentral: 'Design Gráfico',
    nivel: 'iniciante',
    duracao: 8,
    resultadoEsperado: 'Vais dominar os fundamentos de composição, hierarquia visual e criação de peças no Canva.',
    preRequisitos: [],
    publicoAlvo: 'Jovens que querem criar materiais visuais para projectos, pequenos negócios ou portefólio.',
    modulos: [
      { titulo: 'Composição visual', descricao: 'Combina texto e elementos visuais com equilíbrio.', duracao: 45, conteudos: ['Define uma mensagem principal antes de escolher imagens e formas.', 'Usa alinhamento, proximidade e espaço para organizar elementos.', 'Mantém contraste suficiente entre texto e fundo.'], activityType: 'quiz', activityPrompt: 'Identifica princípios de uma composição legível.', activityInstructions: 'Escolhe a opção que melhora a hierarquia visual.' },
      { titulo: 'Cores e tipografia', descricao: 'Escolhe cores e tipos de letra coerentes.', duracao: 60, conteudos: ['Uma paleta curta ajuda a manter consistência visual.', 'Limita o número de tipos de letra e define níveis para títulos e corpo.', 'Verifica o contraste e a leitura em ecrãs pequenos.'], activityType: 'escrita', activityPrompt: 'Descreve a paleta e a tipografia para uma peça.', activityInstructions: 'Explica como as escolhas apoiam a mensagem e o público.' },
      { titulo: 'Criar e exportar no Canva', descricao: 'Constrói uma peça e prepara-a para partilha.', duracao: 75, conteudos: ['Escolhe dimensões adequadas ao canal onde a peça será publicada.', 'Usa modelos como ponto de partida e adapta-os à identidade do projecto.', 'Revê ortografia e exporta no formato apropriado ao destino.'], activityType: 'upload', activityPrompt: 'Partilha uma imagem da peça criada.', activityInstructions: 'Escolhe um ficheiro PNG, JPG ou WebP com o teu design.' },
      { titulo: 'Criar uma identidade visual', descricao: 'Mantém uma linguagem visual consistente num projecto.', duracao: 60, conteudos: ['Define a personalidade e o público antes de escolher cores e formas.', 'Selecciona elementos que possam ser repetidos em diferentes peças.', 'Guarda as escolhas num guia simples para manter consistência.'], activityType: 'escrita', activityPrompt: 'Propõe uma identidade visual para um pequeno projecto.', activityInstructions: 'Indica o público, uma paleta e dois elementos visuais recorrentes.' },
      { titulo: 'Preparar um portefólio visual', descricao: 'Apresenta peças e explica as decisões de design.', duracao: 60, conteudos: ['Escolhe peças que demonstrem competências diferentes e relevantes.', 'Apresenta cada peça com contexto, objectivo e contributo pessoal.', 'Confirma que as imagens estão nítidas e as ligações funcionam.'], activityType: 'link', activityPrompt: 'Partilha uma página ou pasta com as tuas peças.', activityInstructions: 'Usa uma ligação acessível e descreve o conteúdo do portefólio.' },
    ],
  }),
  createCourse({
    id: 'course-005',
    slug: 'introducao-ao-seo',
    titulo: 'Introdução ao SEO',
    descricao: 'Conhece práticas básicas para tornar conteúdos mais fáceis de encontrar. Relaciona palavras-chave, páginas e intenção de pesquisa.',
    descricaoLonga: 'SEO reúne práticas que ajudam motores de pesquisa e pessoas a compreender uma página. Vais identificar intenção de pesquisa, estruturar conteúdo útil e rever elementos básicos da página. As actividades aplicam os conceitos a um tema à tua escolha.',
    categoria: 'Marketing',
    competenciaCentral: 'SEO',
    nivel: 'intermedio',
    duracao: 5,
    resultadoEsperado: 'Vais dominar os fundamentos de SEO e estruturar uma página alinhada com a intenção de pesquisa.',
    preRequisitos: ['Saber navegar na web e editar um documento de texto.'],
    publicoAlvo: 'Jovens criadores de conteúdo e empreendedores que querem melhorar a descoberta das suas páginas.',
    modulos: [
      { titulo: 'Conhecer a intenção de pesquisa', descricao: 'Relaciona palavras-chave com as necessidades de quem pesquisa.', duracao: 45, conteudos: ['Uma pesquisa pode procurar informação, comparar opções ou encontrar um serviço.', 'Escolhe termos que descrevam o tema sem repetir palavras artificialmente.', 'Analisa resultados para perceber formatos e perguntas frequentes.'], activityType: 'quiz', activityPrompt: 'Relaciona uma pesquisa com a intenção correspondente.', activityInstructions: 'Escolhe a opção que melhor explica a necessidade do público.' },
      { titulo: 'Estruturar uma página', descricao: 'Organiza títulos e informação para leitores e pesquisa.', duracao: 60, conteudos: ['Usa um título específico e cabeçalhos que descrevam cada secção.', 'Responde à pergunta principal antes de acrescentar informação complementar.', 'Escreve uma descrição breve que represente com exactidão a página.'], activityType: 'escrita', activityPrompt: 'Escreve um título e uma descrição para uma página.', activityInstructions: 'Escolhe um tema e explica claramente o valor da página.' },
      { titulo: 'Rever e melhorar conteúdo', descricao: 'Verifica qualidade, ligações e clareza do conteúdo.', duracao: 60, conteudos: ['Conteúdo útil responde às necessidades do público e mantém informação actualizada.', 'Liga páginas relacionadas com texto descritivo e confirma que as ligações funcionam.', 'Observa resultados ao longo do tempo e melhora páginas com base em evidências.'], activityType: 'link', activityPrompt: 'Partilha uma página optimizada ou um rascunho.', activityInstructions: 'Cola uma ligação para uma página ou documento partilhável.' },
      { titulo: 'Optimizar uma página', descricao: 'Aplica fundamentos de SEO a uma página concreta.', duracao: 75, conteudos: ['Confirma que o título e o conteúdo respondem à mesma necessidade de pesquisa.', 'Usa ligações internas úteis e texto alternativo descritivo nas imagens.', 'Revê a página num telemóvel e melhora a velocidade e a leitura quando possível.'], activityType: 'escrita', activityPrompt: 'Prepara uma lista de melhorias para uma página.', activityInstructions: 'Inclui título, estrutura, ligação interna e uma melhoria de acessibilidade.' },
    ],
  }),
];
