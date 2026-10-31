<?php

namespace Database\Seeders;

use App\Models\Trail;
use App\Models\TrailModule;
use Illuminate\Database\Seeder;

/**
 * Pilot trail written to the Phase 1 content standard: short lessons with worked examples,
 * a checkpoint per lesson, a module question bank with explanations and a practical task.
 */
class PilotTrailSeeder extends Seeder
{
    public const SLUG = 'primeiro-emprego-do-cv-a-entrevista';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Trail::query()->where('slug', self::SLUG)->exists()) {
            return;
        }

        $trail = Trail::create([
            'slug' => self::SLUG,
            'title' => 'Primeiro emprego: do CV à entrevista',
            'summary' => 'Define o teu alvo, escreve um CV que passa na triagem e prepara-te para a entrevista com métodos usados por recrutadores.',
            'description' => "Esta trilha leva-te do \"não sei por onde começar\" até uma candidatura pronta a enviar.\n\nVais identificar as tuas competências a partir do que já fizeste (estudos, projectos, voluntariado), escolher oportunidades realistas, escrever um CV de uma página com conquistas concretas e treinar respostas de entrevista com o método STAR.\n\nCada lição termina com uma verificação rápida e cada módulo com um quiz. No fim terás um CV e respostas de entrevista prontas a usar.",
            'category' => 'Carreira',
            'core_competence' => 'Empregabilidade',
            'level' => 'iniciante',
            'duration_minutes' => 180,
            'expected_outcome' => 'Um CV de uma página adaptado a uma vaga real e três respostas de entrevista estruturadas com o método STAR.',
            'target_audience' => 'Estudantes finalistas e recém-formados à procura do primeiro estágio ou emprego.',
            'prerequisites' => [],
            'learning_objectives' => [
                'Identificar competências transferíveis a partir de experiências académicas e pessoais.',
                'Escrever um CV de uma página com conquistas mensuráveis.',
                'Responder a perguntas comportamentais com o método STAR.',
            ],
            'status' => 'published',
            'access' => 'free',
            'has_certificate' => true,
            'is_sequential' => true,
        ]);

        foreach ($this->modules() as $position => $moduleData) {
            $module = $trail->modules()->create([
                'title' => $moduleData['title'],
                'description' => $moduleData['description'],
                'position' => $position + 1,
                'duration_minutes' => 60,
                'quiz_question_count' => 6,
                'quiz_passing_score' => 80,
                'quiz_cooldown_minutes' => 5,
            ]);

            $this->seedModule($module, $moduleData);
        }
    }

    /**
     * @param  array<string, mixed>  $moduleData
     */
    private function seedModule(TrailModule $module, array $moduleData): void
    {
        foreach ($moduleData['lessons'] as $lessonPosition => $lessonData) {
            $lesson = $module->lessons()->create([
                'title' => $lessonData['title'],
                'summary' => $lessonData['summary'],
                'duration_minutes' => $lessonData['minutes'],
                'position' => $lessonPosition + 1,
            ]);

            foreach ($lessonData['blocks'] as $blockPosition => $block) {
                $lesson->blocks()->create([...$block, 'position' => $blockPosition + 1]);
            }

            foreach ($lessonData['checkpoint'] as $questionPosition => $question) {
                $module->questions()->create([
                    ...$question,
                    'lesson_id' => $lesson->id,
                    'is_checkpoint' => true,
                    'position' => $questionPosition + 1,
                ]);
            }

            foreach ($lessonData['bank'] as $questionPosition => $question) {
                $module->questions()->create([...$question, 'lesson_id' => $lesson->id, 'position' => $questionPosition + 1]);
            }
        }

        $module->activity()->create($moduleData['activity']);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function modules(): array
    {
        return [
            [
                'title' => 'Conhecer-te e definir o alvo',
                'description' => 'Descobre o que já sabes fazer e escolhe oportunidades à tua medida antes de escrever uma única linha do CV.',
                'activity' => [
                    'type' => 'escrita',
                    'prompt' => 'Escreve o teu inventário de competências.',
                    'instructions' => 'Lista três experiências (aulas, projectos, voluntariado, trabalho informal). Para cada uma indica uma competência técnica e uma transferível, com uma prova concreta.',
                    'is_required' => true,
                    'points' => 20,
                ],
                'lessons' => [
                    [
                        'title' => 'Já tens mais competências do que pensas',
                        'summary' => 'Como transformar aulas, projectos e voluntariado em competências que um recrutador reconhece.',
                        'minutes' => 7,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## Dois tipos de competências\n\nOs recrutadores procuram dois tipos de competências:\n\n- **Técnicas**: conhecimentos específicos de uma área. Exemplos: Excel, contabilidade, programação, atendimento ao cliente, redacção.\n- **Transferíveis**: servem em qualquer trabalho. Exemplos: comunicação, trabalho em equipa, organização, resolução de problemas.\n\nQuem procura o primeiro emprego costuma achar que não tem experiência. Mas um trabalho de grupo na faculdade mostra trabalho em equipa. Organizar um evento da igreja ou do bairro mostra planeamento. Ajudar no negócio da família mostra atendimento e gestão de dinheiro.\n\n## A regra da prova\n\nUma competência sem prova não convence. \"Sou organizado\" é uma opinião; \"coordenei a entrega de um trabalho de 5 pessoas dois dias antes do prazo\" é uma prova.\n\nPara cada competência, pergunta: *onde é que já a usei e o que aconteceu por causa disso?*"],
                            ['type' => 'texto', 'title' => 'Exemplo resolvido', 'body' => "A Joana estudou Gestão e nunca teve emprego formal. Fez este inventário:\n\n- **Trabalho de grupo sobre uma PME em Viana** → Técnica: análise financeira básica. Transferível: liderança (dividiu as tarefas e marcou as reuniões).\n- **Venda de bolos com a mãe** → Técnica: controlo de caixa em Excel. Transferível: atendimento ao cliente.\n- **Voluntariado numa campanha de vacinação** → Transferível: comunicação com o público e trabalho sob pressão.\n\nEm 15 minutos, a Joana passou de \"não tenho experiência\" para seis competências com provas."],
                        ],
                        'checkpoint' => [
                            ['type' => 'single', 'prompt' => 'Qual destas frases apresenta uma competência com prova?', 'options' => [
                                ['id' => 'a', 'text' => 'Sou muito responsável e dedicado.', 'correct' => false],
                                ['id' => 'b', 'text' => 'Organizei a angariação de fundos da turma e juntámos 150 000 Kz em três semanas.', 'correct' => true],
                                ['id' => 'c', 'text' => 'Tenho facilidade em aprender coisas novas.', 'correct' => false],
                            ], 'explanation' => 'Só a opção B mostra o que fizeste e o resultado. As outras são opiniões sobre ti próprio que qualquer candidato pode escrever.'],
                        ],
                        'bank' => [
                            ['type' => 'multiple', 'prompt' => 'Quais destas são competências transferíveis?', 'options' => [
                                ['id' => 'a', 'text' => 'Comunicação', 'correct' => true],
                                ['id' => 'b', 'text' => 'Contabilidade', 'correct' => false],
                                ['id' => 'c', 'text' => 'Trabalho em equipa', 'correct' => true],
                                ['id' => 'd', 'text' => 'Programação em Python', 'correct' => false],
                            ], 'explanation' => 'Comunicação e trabalho em equipa servem em qualquer função. Contabilidade e Python são competências técnicas de áreas específicas.'],
                            ['type' => 'true_false', 'prompt' => 'Experiências fora do trabalho formal, como voluntariado, não contam para o CV.', 'correct_boolean' => false, 'explanation' => 'Contam, sim. O que importa é a competência que mostraste e o resultado, não se foste pago.'],
                            ['type' => 'matching', 'prompt' => 'Liga cada experiência à competência que melhor demonstra.', 'options' => [
                                ['id' => 'a', 'left' => 'Dividir tarefas num trabalho de grupo', 'right' => 'Liderança'],
                                ['id' => 'b', 'left' => 'Registar vendas diárias em Excel', 'right' => 'Controlo financeiro'],
                                ['id' => 'c', 'left' => 'Explicar a vacinação a moradores', 'right' => 'Comunicação com o público'],
                            ], 'explanation' => 'Cada experiência é uma prova concreta de uma competência. É assim que se constrói o inventário.'],
                        ],
                    ],
                    [
                        'title' => 'Escolher o tipo de oportunidade certa',
                        'summary' => 'Estágio, trainee, emprego ou bolsa: o que cada um oferece e como decidir.',
                        'minutes' => 6,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## Os quatro caminhos mais comuns\n\n- **Estágio**: duração curta (3 a 6 meses), foco em aprender. Bom para ganhar a primeira experiência.\n- **Programa trainee**: 12 a 24 meses, com rotação por áreas e formação. É muito disputado e tem várias fases de selecção.\n- **Emprego júnior**: contrato normal com responsabilidades reais desde o início.\n- **Bolsa ou formação profissional**: investe nas tuas competências antes de entrares no mercado.\n\n## Como decidir\n\nFaz três perguntas a ti próprio:\n\n1. **O que preciso agora?** Rendimento, experiência ou formação?\n2. **Cumpro os requisitos?** Lê a vaga com atenção. Se cumpres cerca de 70% do que pedem, candidata-te.\n3. **Onde aprendo mais?** No início da carreira, o que aprendes vale mais do que o cargo.\n\nCandidatar-te a tudo cansa e baixa a qualidade de cada candidatura. Escolhe 5 a 10 vagas bem alinhadas e prepara cada uma com cuidado."],
                        ],
                        'checkpoint' => [
                            ['type' => 'single', 'prompt' => 'Uma vaga pede 5 requisitos e tu cumpres 4. O que deves fazer?', 'options' => [
                                ['id' => 'a', 'text' => 'Não te candidatar, porque não cumpres tudo.', 'correct' => false],
                                ['id' => 'b', 'text' => 'Candidatar-te e mostrar como compensas o requisito em falta.', 'correct' => true],
                                ['id' => 'c', 'text' => 'Candidatar-te e dizer que cumpres os 5.', 'correct' => false],
                            ], 'explanation' => 'Cumprir cerca de 70% dos requisitos já justifica a candidatura. Mentir sobre requisitos é descoberto na entrevista ou no período experimental.'],
                        ],
                        'bank' => [
                            ['type' => 'single', 'prompt' => 'Qual oportunidade costuma ter rotação por várias áreas da empresa?', 'options' => [
                                ['id' => 'a', 'text' => 'Programa trainee', 'correct' => true],
                                ['id' => 'b', 'text' => 'Estágio de verão', 'correct' => false],
                                ['id' => 'c', 'text' => 'Bolsa de estudo', 'correct' => false],
                            ], 'explanation' => 'Os programas trainee são longos e preparam futuros quadros com rotação por diferentes departamentos.'],
                            ['type' => 'true_false', 'prompt' => 'Enviar a mesma candidatura genérica para 50 vagas é a estratégia mais eficaz.', 'correct_boolean' => false, 'explanation' => 'Candidaturas genéricas têm taxas de resposta muito baixas. Poucas vagas bem escolhidas e adaptadas funcionam melhor.'],
                        ],
                    ],
                    [
                        'title' => 'Investigar a empresa antes de te candidatares',
                        'summary' => 'O que procurar sobre uma empresa e como usar essa informação.',
                        'minutes' => 6,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## Porquê investigar\n\nQuem conhece a empresa escreve candidaturas mais certeiras e responde melhor na entrevista. É também a melhor forma de perceber se queres mesmo trabalhar lá.\n\n## O que procurar (em 20 minutos)\n\n- **O que fazem e para quem**: produtos, serviços e clientes principais.\n- **Notícias recentes**: expansões, novos projectos, prémios.\n- **Cultura**: valores publicados, publicações dos colaboradores no LinkedIn.\n- **A vaga em detalhe**: as tarefas do dia-a-dia e as competências que repetem várias vezes.\n\n## Como usar\n\nEscolhe **um facto concreto** e liga-o a ti. Por exemplo: \"Vi que a empresa abriu duas agências no Huambo este ano; a minha experiência de atendimento em Kwanza Sul pode ajudar na relação com clientes fora de Luanda.\"\n\nUm facto bem usado vale mais do que dez elogios genéricos à empresa."],
                        ],
                        'checkpoint' => [
                            ['type' => 'fill_blank', 'prompt' => 'Na candidatura, deves ligar um facto concreto sobre a empresa a uma experiência ou competência ___.', 'accepted_answers' => ['tua', 'minha', 'própria', 'propria'], 'explanation' => 'O objectivo é mostrar a ligação entre o que a empresa precisa e o que tu ofereces.'],
                        ],
                        'bank' => [
                            ['type' => 'single', 'prompt' => 'Qual destas frases mostra melhor que investigaste a empresa?', 'options' => [
                                ['id' => 'a', 'text' => 'A vossa empresa é líder de mercado e muito prestigiada.', 'correct' => false],
                                ['id' => 'b', 'text' => 'O vosso novo serviço de pagamentos móveis interessa-me porque criei um protótipo semelhante na faculdade.', 'correct' => true],
                                ['id' => 'c', 'text' => 'Sempre sonhei trabalhar numa grande empresa.', 'correct' => false],
                            ], 'explanation' => 'A opção B cita algo concreto da empresa e liga-o a uma experiência do candidato. As outras servem para qualquer empresa.'],
                            ['type' => 'ordering', 'prompt' => 'Ordena os passos para preparar uma candidatura.', 'options' => [
                                ['id' => 'a', 'text' => 'Ler a vaga e sublinhar as competências pedidas'],
                                ['id' => 'b', 'text' => 'Investigar a empresa'],
                                ['id' => 'c', 'text' => 'Adaptar o CV às competências da vaga'],
                                ['id' => 'd', 'text' => 'Enviar e registar a candidatura'],
                            ], 'explanation' => 'Primeiro percebes o que pedem, depois conheces a empresa, adaptas o CV e só então envias e registas.'],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Um CV que passa na triagem',
                'description' => 'Escreve um CV de uma página, fácil de ler em 30 segundos e com conquistas concretas.',
                'activity' => [
                    'type' => 'escrita',
                    'prompt' => 'Escreve três linhas de conquistas para o teu CV.',
                    'instructions' => 'Usa a fórmula verbo de acção + tarefa + resultado. Inclui números sempre que possível (pessoas, kwanzas, prazos, percentagens).',
                    'is_required' => true,
                    'points' => 20,
                ],
                'lessons' => [
                    [
                        'title' => 'A estrutura de um CV de primeiro emprego',
                        'summary' => 'Secções, ordem e tamanho certos para quem tem pouca experiência formal.',
                        'minutes' => 7,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## Uma página chega\n\nUm recrutador passa em média menos de um minuto na primeira leitura de um CV. Com pouca experiência, **uma página** é suficiente e obriga-te a escolher o mais importante.\n\n## A ordem recomendada\n\n1. **Contactos**: nome, telefone, email profissional, cidade e LinkedIn. Não é preciso BI, estado civil nem fotografia, salvo se a vaga pedir.\n2. **Resumo profissional**: 2 a 3 linhas sobre a tua área, as tuas competências principais e o tipo de oportunidade que procuras.\n3. **Formação**: curso, instituição e ano de conclusão (ou previsão).\n4. **Experiência e projectos**: estágios, projectos académicos, voluntariado, negócio familiar.\n5. **Competências**: técnicas (ferramentas, línguas) e transferíveis, com o nível.\n\n## Detalhes que eliminam\n\n- Email pouco profissional (por exemplo \"princesa2003@...\").\n- Erros de ortografia.\n- Formatação confusa, com muitas cores e tipos de letra.\n- Enviar em Word quando a vaga pede PDF."],
                        ],
                        'checkpoint' => [
                            ['type' => 'ordering', 'prompt' => 'Ordena as secções do CV de primeiro emprego.', 'options' => [
                                ['id' => 'a', 'text' => 'Contactos'],
                                ['id' => 'b', 'text' => 'Resumo profissional'],
                                ['id' => 'c', 'text' => 'Formação'],
                                ['id' => 'd', 'text' => 'Experiência e projectos'],
                            ], 'explanation' => 'Os contactos vêm primeiro, depois o resumo que capta a atenção, a formação (o teu ponto mais forte no início) e a experiência.'],
                        ],
                        'bank' => [
                            ['type' => 'multiple', 'prompt' => 'O que NÃO precisa de constar num CV, salvo pedido da vaga?', 'options' => [
                                ['id' => 'a', 'text' => 'Número do BI', 'correct' => true],
                                ['id' => 'b', 'text' => 'Estado civil', 'correct' => true],
                                ['id' => 'c', 'text' => 'Email profissional', 'correct' => false],
                                ['id' => 'd', 'text' => 'Formação académica', 'correct' => false],
                            ], 'explanation' => 'Dados pessoais como BI e estado civil não ajudam a avaliar competências e expõem informação sensível.'],
                            ['type' => 'true_false', 'prompt' => 'Para quem procura o primeiro emprego, um CV de uma página é suficiente.', 'correct_boolean' => true, 'explanation' => 'Com pouca experiência, uma página bem escolhida é mais forte do que duas páginas com enchimento.'],
                        ],
                    ],
                    [
                        'title' => 'Escrever conquistas, não tarefas',
                        'summary' => 'A fórmula verbo + tarefa + resultado transforma descrições vagas em provas.',
                        'minutes' => 8,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## Tarefa vs. conquista\n\nA maioria dos CV lista **tarefas**: \"Responsável pelo atendimento ao cliente\". Isto diz o que te pediram, não o que conseguiste.\n\nUma **conquista** mostra o resultado:\n\n> **Verbo de acção + tarefa + resultado (com número, se possível)**\n\n## Verbos que funcionam\n\nOrganizei, criei, reduzi, aumentei, coordenei, formei, resolvi, implementei, analisei, vendi.\n\nEvita \"ajudei em\" e \"participei em\": escondem o teu papel."],
                            ['type' => 'texto', 'title' => 'Exemplo resolvido', 'body' => "- ❌ Responsável pelas redes sociais da associação de estudantes.\n- ✅ **Criei** um calendário de publicações para a associação de estudantes e **aumentei** os seguidores do Instagram de 400 para 1 200 em seis meses.\n\n- ❌ Ajudei no negócio da família.\n- ✅ **Organizei** o controlo de stock da mercearia da família em Excel, **reduzindo** as faltas de produtos de 10 para 2 por mês.\n\nRepara: cada linha tem um verbo forte, o que fizeste e um resultado que se pode verificar."],
                        ],
                        'checkpoint' => [
                            ['type' => 'single', 'prompt' => 'Qual linha segue a fórmula verbo + tarefa + resultado?', 'options' => [
                                ['id' => 'a', 'text' => 'Participei na organização da semana académica.', 'correct' => false],
                                ['id' => 'b', 'text' => 'Coordenei 8 voluntários na semana académica, que recebeu 600 participantes.', 'correct' => true],
                                ['id' => 'c', 'text' => 'Responsável pela semana académica.', 'correct' => false],
                            ], 'explanation' => 'A opção B tem verbo forte (coordenei), a tarefa e números verificáveis. "Participei" esconde o teu papel.'],
                        ],
                        'bank' => [
                            ['type' => 'fill_blank', 'prompt' => 'Fórmula de uma conquista: verbo de acção + tarefa + ___.', 'accepted_answers' => ['resultado', 'resultados'], 'explanation' => 'O resultado é o que distingue uma conquista de uma simples tarefa.'],
                            ['type' => 'multiple', 'prompt' => 'Quais destes verbos mostram melhor o teu papel?', 'options' => [
                                ['id' => 'a', 'text' => 'Implementei', 'correct' => true],
                                ['id' => 'b', 'text' => 'Ajudei em', 'correct' => false],
                                ['id' => 'c', 'text' => 'Reduzi', 'correct' => true],
                                ['id' => 'd', 'text' => 'Participei em', 'correct' => false],
                            ], 'explanation' => '"Ajudei em" e "participei em" são vagos. Verbos de acção como implementei e reduzi mostram o que fizeste.'],
                            ['type' => 'single', 'context' => 'O Paulo foi monitor de Matemática durante um semestre e explicava exercícios a colegas do 1.º ano.', 'prompt' => 'Qual é a melhor forma de o Paulo escrever isto no CV?', 'options' => [
                                ['id' => 'a', 'text' => 'Monitor de Matemática.', 'correct' => false],
                                ['id' => 'b', 'text' => 'Dei explicações de Matemática a 25 colegas do 1.º ano; 20 passaram no exame final.', 'correct' => true],
                                ['id' => 'c', 'text' => 'Gosto muito de ensinar Matemática.', 'correct' => false],
                            ], 'explanation' => 'A opção B mostra quantas pessoas ajudou e o resultado. Um título solto ou um gosto pessoal não provam nada.'],
                        ],
                    ],
                    [
                        'title' => 'Adaptar o CV a cada vaga',
                        'summary' => 'Como usar as palavras da vaga sem copiar e sem mentir.',
                        'minutes' => 6,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## Porque adaptar\n\nMuitas empresas, sobretudo as grandes, fazem uma primeira triagem rápida (às vezes automática) à procura das competências da vaga. Se o teu CV usa outras palavras, pode ficar de fora mesmo que sejas adequado.\n\n## Como adaptar em 15 minutos\n\n1. Sublinha na vaga as competências e ferramentas que aparecem **mais de uma vez**.\n2. Confirma quais tens de verdade.\n3. Usa **as mesmas palavras** no resumo e nas conquistas. Se a vaga diz \"atendimento ao cliente\" e o teu CV diz \"apoio ao público\", troca.\n4. Põe primeiro as conquistas mais ligadas à vaga.\n\n## O limite\n\nAdaptar não é inventar. Nunca acrescentes competências que não tens: são verificadas na entrevista, em testes práticos ou no período experimental."],
                        ],
                        'checkpoint' => [
                            ['type' => 'true_false', 'prompt' => 'Adaptar o CV a uma vaga inclui acrescentar competências que ainda não tens, para passar na triagem.', 'correct_boolean' => false, 'explanation' => 'Adaptar é escolher e reescrever o que é verdade com as palavras da vaga. Inventar é descoberto e elimina-te.'],
                        ],
                        'bank' => [
                            ['type' => 'single', 'prompt' => 'A vaga pede "atendimento ao cliente" três vezes. O teu CV diz "apoio ao público". O que fazes?', 'options' => [
                                ['id' => 'a', 'text' => 'Mantens, porque é a mesma coisa.', 'correct' => false],
                                ['id' => 'b', 'text' => 'Usas "atendimento ao cliente", porque é o termo da vaga.', 'correct' => true],
                                ['id' => 'c', 'text' => 'Removes a experiência.', 'correct' => false],
                            ], 'explanation' => 'Usar o termo da vaga ajuda na triagem, sobretudo se for automática, e mostra alinhamento.'],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Preparar e vencer a entrevista',
                'description' => 'Prepara-te antes, responde com estrutura e termina com perguntas que mostram interesse.',
                'activity' => [
                    'type' => 'escrita',
                    'prompt' => 'Escreve uma resposta STAR para "Fala-me de um desafio que ultrapassaste".',
                    'instructions' => 'Usa as quatro partes: Situação, Tarefa, Acção e Resultado. Escreve entre 80 e 150 palavras e foca-te no que tu fizeste.',
                    'is_required' => true,
                    'points' => 30,
                ],
                'lessons' => [
                    [
                        'title' => 'O que fazer antes da entrevista',
                        'summary' => 'Preparação prática para chegar seguro e a horas.',
                        'minutes' => 6,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## Na véspera\n\n- Relê a vaga e o teu CV: o recrutador vai fazer perguntas sobre o que escreveste.\n- Prepara **três histórias** da tua experiência (desafio, trabalho em equipa, erro de que aprendeste). Servem para muitas perguntas.\n- Confirma a morada e o tempo de deslocação. Em Luanda, conta com o trânsito: chega 10 a 15 minutos antes.\n- Para entrevistas online: testa a ligação, a câmara e o som, carrega o telemóvel e escolhe um lugar silencioso com luz de frente.\n\n## No dia\n\n- Leva cópias do CV e um caderno.\n- Veste-te um pouco mais formal do que o ambiente da empresa.\n- Desliga as notificações do telemóvel.\n\nA preparação não elimina o nervosismo, mas dá-te o que dizer quando ele aparece."],
                        ],
                        'checkpoint' => [
                            ['type' => 'multiple', 'prompt' => 'O que deves preparar antes de uma entrevista online?', 'options' => [
                                ['id' => 'a', 'text' => 'Testar a ligação e o som', 'correct' => true],
                                ['id' => 'b', 'text' => 'Carregar o telemóvel ou portátil', 'correct' => true],
                                ['id' => 'c', 'text' => 'Ter a televisão ligada para te acalmares', 'correct' => false],
                            ], 'explanation' => 'Problemas técnicos e ruído de fundo são os erros mais comuns em entrevistas online e são fáceis de evitar.'],
                        ],
                        'bank' => [
                            ['type' => 'single', 'prompt' => 'Quantas histórias da tua experiência deves ter preparadas?', 'options' => [
                                ['id' => 'a', 'text' => 'Nenhuma: é melhor improvisar.', 'correct' => false],
                                ['id' => 'b', 'text' => 'Cerca de três, que sirvam para várias perguntas.', 'correct' => true],
                                ['id' => 'c', 'text' => 'Uma resposta decorada para cada pergunta possível.', 'correct' => false],
                            ], 'explanation' => 'Três boas histórias adaptam-se a muitas perguntas comportamentais. Decorar respostas soa artificial.'],
                        ],
                    ],
                    [
                        'title' => 'Responder com o método STAR',
                        'summary' => 'Uma estrutura simples para respostas claras e convincentes.',
                        'minutes' => 8,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## As quatro partes\n\nPerguntas como \"Fala-me de uma vez em que…\" são **perguntas comportamentais**. Partem da ideia de que o que fizeste no passado mostra o que farás no futuro. O método STAR organiza a resposta:\n\n- **S — Situação**: o contexto, em uma ou duas frases.\n- **T — Tarefa**: o que era preciso fazer, ou o teu papel.\n- **A — Acção**: o que **tu** fizeste, passo a passo. É a parte mais longa.\n- **R — Resultado**: o que aconteceu, com números se possível, e o que aprendeste.\n\n## Erros comuns\n\n- Falar só da equipa (\"nós fizemos\") e esconder o teu papel.\n- Esquecer o resultado.\n- Gastar metade do tempo a descrever a situação."],
                            ['type' => 'texto', 'title' => 'Exemplo resolvido', 'body' => "**Pergunta:** Fala-me de um conflito numa equipa.\n\n- **S:** No 3.º ano, o meu grupo de 4 pessoas tinha de entregar um plano de negócio e dois colegas não cumpriam os prazos.\n- **T:** Como coordenador, tinha de garantir a entrega sem estragar a relação com eles.\n- **A:** Falei com cada um em separado para perceber o problema. Um trabalhava à noite, por isso trocámos as tarefas dele para outras que podia fazer ao fim de semana. Criei um grupo de WhatsApp com prazos semanais e uma tabela partilhada.\n- **R:** Entregámos com dois dias de antecedência e tivemos 16 valores. Aprendi a perguntar o porquê antes de julgar."],
                        ],
                        'checkpoint' => [
                            ['type' => 'matching', 'prompt' => 'Liga cada letra do STAR ao seu significado.', 'options' => [
                                ['id' => 's', 'left' => 'S', 'right' => 'Situação'],
                                ['id' => 't', 'left' => 'T', 'right' => 'Tarefa'],
                                ['id' => 'a', 'left' => 'A', 'right' => 'Acção'],
                                ['id' => 'r', 'left' => 'R', 'right' => 'Resultado'],
                            ], 'explanation' => 'Situação, Tarefa, Acção e Resultado: o contexto, o teu papel, o que fizeste e o que aconteceu.'],
                        ],
                        'bank' => [
                            ['type' => 'single', 'prompt' => 'Qual é normalmente a parte mais longa de uma resposta STAR?', 'options' => [
                                ['id' => 'a', 'text' => 'Situação', 'correct' => false],
                                ['id' => 'b', 'text' => 'Acção', 'correct' => true],
                                ['id' => 'c', 'text' => 'Resultado', 'correct' => false],
                            ], 'explanation' => 'A acção é onde mostras as tuas competências. A situação deve ser curta.'],
                            ['type' => 'single', 'context' => 'A Ana respondeu: "No estágio, a equipa tinha muitos pedidos atrasados. Nós organizámo-nos melhor e conseguimos resolver tudo."', 'prompt' => 'O que falta de mais importante nesta resposta?', 'options' => [
                                ['id' => 'a', 'text' => 'O papel dela e um resultado concreto.', 'correct' => true],
                                ['id' => 'b', 'text' => 'O nome da empresa.', 'correct' => false],
                                ['id' => 'c', 'text' => 'Mais detalhe sobre a situação.', 'correct' => false],
                            ], 'explanation' => 'Usar "nós" esconde o que a Ana fez e "resolver tudo" não é um resultado verificável. Deveria dizer o que fez e quantos pedidos resolveu, em quanto tempo.'],
                            ['type' => 'ordering', 'prompt' => 'Ordena as partes de uma resposta STAR.', 'options' => [
                                ['id' => 's', 'text' => 'Situação'],
                                ['id' => 't', 'text' => 'Tarefa'],
                                ['id' => 'a', 'text' => 'Acção'],
                                ['id' => 'r', 'text' => 'Resultado'],
                            ], 'explanation' => 'A ordem segue a história: contexto, papel, o que fizeste e o resultado.'],
                        ],
                    ],
                    [
                        'title' => 'Perguntas difíceis e o fecho da entrevista',
                        'summary' => 'Como responder sobre fraquezas e salário, e o que perguntar no fim.',
                        'minutes' => 7,
                        'blocks' => [
                            ['type' => 'texto', 'body' => "## \"Qual é o teu maior defeito?\"\n\nEscolhe um ponto fraco **real mas não essencial** para a vaga e mostra o que estás a fazer para melhorar. Evita respostas como \"sou perfeccionista\": soam a fuga à pergunta.\n\n> \"Tinha dificuldade em falar em público. Inscrevi-me num clube de debate na faculdade e apresentei três trabalhos este semestre. Ainda fico nervoso, mas já consigo apresentar com clareza.\"\n\n## \"Quanto esperas ganhar?\"\n\nPesquisa antes quanto se paga para a função (colegas, anúncios, associações profissionais). Se possível, devolve a pergunta: \"Qual é o intervalo previsto para a função?\". Se insistirem, dá um intervalo realista.\n\n## As tuas perguntas no fim\n\nTer perguntas mostra interesse. Bons exemplos:\n\n- Como é um dia normal nesta função?\n- Como vai ser avaliado o meu desempenho nos primeiros meses?\n- Quais são os próximos passos do processo?\n\nNão perguntes, na primeira entrevista, sobre férias ou se podes faltar."],
                        ],
                        'checkpoint' => [
                            ['type' => 'single', 'prompt' => 'Qual é a melhor resposta para "Qual é o teu maior defeito?"', 'options' => [
                                ['id' => 'a', 'text' => 'Não tenho defeitos.', 'correct' => false],
                                ['id' => 'b', 'text' => 'Sou perfeccionista demais.', 'correct' => false],
                                ['id' => 'c', 'text' => 'Um ponto fraco real e o que estou a fazer para melhorar.', 'correct' => true],
                            ], 'explanation' => 'Os recrutadores querem ver autoconhecimento e vontade de melhorar. As outras respostas evitam a pergunta.'],
                        ],
                        'bank' => [
                            ['type' => 'multiple', 'prompt' => 'Quais são boas perguntas para fazer no fim da entrevista?', 'options' => [
                                ['id' => 'a', 'text' => 'Como é um dia normal nesta função?', 'correct' => true],
                                ['id' => 'b', 'text' => 'Quantos dias de férias tenho?', 'correct' => false],
                                ['id' => 'c', 'text' => 'Quais são os próximos passos do processo?', 'correct' => true],
                            ], 'explanation' => 'Perguntas sobre o trabalho e o processo mostram interesse. Férias e regalias ficam para a fase de proposta.'],
                            ['type' => 'true_false', 'prompt' => 'Antes de uma entrevista, deves pesquisar quanto se paga para a função.', 'correct_boolean' => true, 'explanation' => 'Saber o valor de mercado ajuda-te a dar um intervalo realista e a não te desvalorizares.'],
                        ],
                    ],
                ],
            ],
        ];
    }
}
