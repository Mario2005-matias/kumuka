<?php

return [
    'slug' => 'gestao-de-tempo',
    'version' => 1,
    'trail' => [
        'title' => 'Gestão de Tempo',
        'summary' => 'Define prioridades, planeia a semana com blocos de tempo e mantém o foco com hábitos simples.',
        'description' => "Ter mais tempo não é possível; usá-lo melhor é. Nesta trilha aprendes a separar o urgente do importante, a planear uma semana realista e a proteger o foco de distracções.\n\nNo fim tens um plano semanal teu, testado durante uma semana, e uma rotina de revisão para o ajustar.",
        'category' => 'Produtividade',
        'core_competence' => 'Gestão de Tempo',
        'expected_outcome' => 'Um plano semanal com prioridades e blocos de tempo, testado e revisto.',
        'learning_objectives' => [
            'Priorizar tarefas com a matriz de Eisenhower.',
            'Planear a semana com blocos de tempo e estimativas realistas.',
            'Manter o foco com a técnica Pomodoro e uma revisão semanal.',
        ],
        'target_audience' => 'Estudantes que conciliam estudos, trabalho, família ou um negócio.',
        'prerequisites' => [],
    ],
    'modules' => [
        [
            'title' => 'Prioridades',
            'description' => 'Distingue o urgente do importante e escolhe o que fazer primeiro.',
            'activity' => ['escrita', 'Classifica a tua lista de tarefas.', 'Lista 10 tarefas desta semana e coloca cada uma num quadrante da matriz de Eisenhower. Indica as 3 que vais fazer primeiro e porquê.'],
            'lessons' => [
                [
                    'title' => 'Urgente não é o mesmo que importante',
                    'summary' => 'A matriz de Eisenhower em quatro quadrantes.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Dois critérios

- **Urgente** — tem prazo próximo ou exige reacção imediata.
- **Importante** — contribui para os teus objectivos (estudos, carreira, saúde, família).

## A matriz

| | Urgente | Não urgente |
|---|---|---|
| **Importante** | 1. **Fazer já** (exame amanhã) | 2. **Agendar** (estudar regularmente, procurar estágio) |
| **Não importante** | 3. **Delegar ou despachar** (algumas mensagens) | 4. **Eliminar** (scroll sem fim) |

O segredo é o **quadrante 2**: o que é importante mas não urgente. Se o planeares, evitas que vire urgente.
MD,
                    ],
                    'check' => [
                        ['match', 'Coloca cada tarefa no quadrante certo.', ['Exame amanhã' => 'Fazer já', 'Começar a preparar o CV para o estágio do próximo mês' => 'Agendar', 'Ver vídeos sem objectivo durante 2 horas' => 'Eliminar'], 'Importante e não urgente deve ser agendado antes que se torne urgente.'],
                    ],
                    'bank' => [
                        ['single', 'Que quadrante deves proteger mais na tua agenda?', ['* Importante e não urgente', 'Urgente e não importante', 'Não urgente e não importante'], 'Investir no quadrante 2 reduz as urgências futuras.'],
                    ],
                ],
                [
                    'title' => 'Objectivos que orientam as escolhas',
                    'summary' => 'Saber para onde vais torna mais fácil dizer não.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Do objectivo à semana

1. **Objectivo do trimestre** — *"Conseguir um estágio até Junho."*
2. **Resultados da semana** — *"Enviar 3 candidaturas; terminar o módulo de Excel."*
3. **Tarefas do dia** — *"Adaptar o CV para a vaga X (45 min)."*

Quando surgir um pedido novo, pergunta: *"Isto aproxima-me do meu objectivo?"* Se não, talvez possa esperar — ou ser recusado com educação.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena do mais geral para o mais concreto.', ['Objectivo do trimestre', 'Resultados da semana', 'Tarefas do dia'], 'Objectivos grandes dividem-se em resultados semanais e tarefas diárias.'],
                    ],
                    'bank' => [
                        ['tf', 'Ter objectivos claros ajuda a decidir que pedidos aceitar.', true, 'Os objectivos funcionam como filtro para as tuas escolhas.'],
                    ],
                ],
                [
                    'title' => 'Dizer não com educação',
                    'summary' => 'Proteger o tempo sem estragar relações.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Fórmulas que funcionam

- **Não + alternativa:** *"Hoje não consigo, mas posso ajudar-te na quinta à tarde."*
- **Prioridade:** *"Estou a terminar o trabalho para amanhã. Posso responder-te depois das 18h?"*
- **Pedido de escolha** (no trabalho): *"Se pegar nesta tarefa, o relatório atrasa um dia. Qual é a prioridade?"*

Dizer sim a tudo significa dizer não ao que é importante para ti.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é a melhor forma de recusar um pedido quando estás ocupado?', ['* Recusar agora e propor uma alternativa', 'Aceitar e não cumprir', 'Ignorar a mensagem'], 'Uma alternativa mostra boa vontade e protege o teu tempo.'],
                    ],
                    'bank' => [
                        ['tf', 'No trabalho, pedir ao chefe que escolha a prioridade entre duas tarefas é uma forma profissional de gerir o tempo.', true, 'Deixa claras as consequências e evita compromissos impossíveis.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Planear a semana',
            'description' => 'Transforma prioridades num plano com blocos de tempo realistas.',
            'activity' => ['upload', 'Envia o teu plano semanal.', 'Planeia a próxima semana com blocos de tempo (estudo, trabalho, deslocações, descanso). Envia uma foto ou captura de ecrã.'],
            'lessons' => [
                [
                    'title' => 'O planeamento semanal',
                    'summary' => '30 minutos ao domingo que poupam horas durante a semana.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Passos

1. **Revê** a semana anterior: o que ficou por fazer?
2. **Escolhe 3 resultados** principais para a semana.
3. **Marca os compromissos fixos**: aulas, trabalho, deslocações.
4. **Encaixa blocos** para os 3 resultados, de preferência nas horas em que tens mais energia.
5. **Deixa margens** — imprevistos acontecem (trânsito, falta de luz, recados da família).
MD,
                    ],
                    'check' => [
                        ['single', 'Porque deves deixar margens no plano semanal?', ['* Para absorver imprevistos sem desorganizar tudo', 'Para ter menos trabalho', 'Porque o plano não serve para nada'], 'Planos sem margem quebram ao primeiro imprevisto.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena os passos do planeamento semanal.', ['Rever a semana anterior', 'Escolher 3 resultados', 'Marcar compromissos fixos', 'Encaixar blocos para os resultados'], 'Primeiro sabes onde estás, depois o que queres e só então onde cabe.'],
                    ],
                ],
                [
                    'title' => 'Blocos de tempo',
                    'summary' => 'Reservar tempo na agenda para o trabalho que importa.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que é

**Time blocking** é marcar na agenda blocos para tarefas específicas, como se fossem reuniões contigo próprio.

## Exemplo resolvido: terça-feira

| Hora | Bloco |
|---|---|
| 06h30–07h30 | Estudo de Estatística (energia alta) |
| 08h–13h | Aulas |
| 14h–17h | Estágio |
| 18h30–19h15 | Candidaturas (2 vagas) |
| 21h–21h30 | Revisão do dia e plano de amanhã |

Agrupa tarefas parecidas (responder mensagens, recados) num só bloco em vez de as espalhar pelo dia.
MD,
                    ],
                    'check' => [
                        ['tf', 'Agrupar tarefas parecidas num só bloco reduz o tempo perdido a mudar de actividade.', true, 'Mudar constantemente de tarefa custa concentração.'],
                    ],
                    'bank' => [
                        ['single', 'Quando é melhor marcar tarefas que exigem muita concentração?', ['* Nas horas em que tens mais energia', 'Depois de um dia inteiro cansativo', 'Entre duas reuniões de 5 minutos'], 'Tarefas difíceis rendem mais quando estás com energia.'],
                    ],
                ],
                [
                    'title' => 'Estimar quanto tempo demora',
                    'summary' => 'Evitar o optimismo que destrói planos.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## A falácia do planeamento

Tendemos a achar que as tarefas demoram menos do que realmente demoram.

## Três correcções

1. **Divide** tarefas grandes em partes: "fazer o trabalho" → pesquisar, esboço, escrever, rever.
2. **Usa o histórico** — quanto demorou da última vez?
3. **Acrescenta uma margem** de cerca de 50 % a tarefas novas.

Regista durante uma semana quanto tempo demoram realmente as tuas tarefas. Vais calibrar as estimativas muito depressa.
MD,
                    ],
                    'check' => [
                        ['single', 'Achas que uma tarefa nova demora 2 horas. Com uma margem de 50 %, quanto tempo reservas?', ['* 3 horas', '2 horas', '1 hora'], '2 horas + 50 % = 3 horas.'],
                    ],
                    'bank' => [
                        ['tf', 'Dividir uma tarefa grande em partes torna a estimativa mais precisa.', true, 'Partes pequenas são mais fáceis de imaginar e medir.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Foco e hábitos',
            'description' => 'Protege a atenção e cria rotinas que se mantêm.',
            'activity' => ['escrita', 'Faz a tua revisão semanal.', 'Depois de testar o plano durante uma semana, responde: o que funcionou, o que não funcionou, quantos Pomodoros fizeste e o que vais mudar na próxima semana.'],
            'lessons' => [
                [
                    'title' => 'A técnica Pomodoro',
                    'summary' => '25 minutos de foco, 5 de pausa.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Como funciona

1. Escolhe **uma** tarefa.
2. Trabalha **25 minutos** sem interrupções.
3. Faz uma **pausa de 5 minutos** (levanta-te, bebe água).
4. A cada 4 ciclos, faz uma pausa maior (15–30 minutos).

## Porque funciona

Um bloco curto é fácil de começar e cria uma "pressão boa". As pausas evitam o cansaço. E contar Pomodoros mostra quanto tempo de foco real tiveste.
MD,
                    ],
                    'check' => [
                        ['single', 'Num ciclo Pomodoro clássico, quanto dura o foco e a pausa?', ['* 25 minutos de foco e 5 de pausa', '2 horas de foco e 1 de pausa', '5 minutos de foco e 25 de pausa'], 'O ciclo clássico é 25 + 5 minutos.'],
                    ],
                    'bank' => [
                        ['tf', 'Durante um Pomodoro deves responder às mensagens que chegam.', false, 'O objectivo é proteger o foco; as mensagens esperam pela pausa.'],
                    ],
                ],
                [
                    'title' => 'Vencer as distracções',
                    'summary' => 'Preparar o ambiente para que o foco seja o caminho mais fácil.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Ajusta o ambiente

- Telemóvel **noutra divisão** ou em modo não incomodar.
- **Uma aba** aberta no computador: a da tarefa.
- Avisa a família ou os colegas: *"Das 19h às 20h estou a estudar."*
- Tem à mão o que precisas (água, carregador, materiais) para não te levantares.

## Quando a distracção é interna

Aparece uma ideia ("tenho de ligar ao primo")? **Anota num papel** e volta à tarefa. Tratas disso na pausa.
MD,
                    ],
                    'check' => [
                        ['single', 'Surge um pensamento sobre outra tarefa durante o foco. O que fazes?', ['* Anoto e volto à tarefa', 'Paro e faço logo a outra tarefa', 'Abro as redes sociais para descansar'], 'Anotar liberta a mente sem interromper o trabalho.'],
                    ],
                    'bank' => [
                        ['multiple', 'Quais destas acções reduzem distracções?', ['* Telemóvel noutra divisão', '* Uma só aba aberta', '* Avisar quem está por perto', 'Ter a televisão ligada'], 'Ruído e ecrãs extra competem pela tua atenção.'],
                    ],
                ],
                [
                    'title' => 'Hábitos e revisão semanal',
                    'summary' => 'Começar pequeno e melhorar o sistema todas as semanas.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Começa ridiculamente pequeno

Em vez de "estudar 3 horas por dia", começa com **"um Pomodoro depois do jantar"**. Hábitos pequenos e regulares vencem esforços grandes e raros.

## Liga o hábito a algo que já fazes

*"Depois de jantar, abro o caderno de Estatística."*

## A revisão semanal (20 minutos)

1. O que cumpri?
2. O que ficou por fazer e porquê?
3. O que vou mudar na próxima semana?

Assim o teu sistema melhora todas as semanas.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é o melhor começo para um novo hábito de estudo?', ['* Um Pomodoro por dia, depois do jantar', 'Estudar 5 horas por dia a partir de amanhã', 'Esperar pela motivação'], 'Começar pequeno torna o hábito fácil de manter.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena as perguntas da revisão semanal.', ['O que cumpri?', 'O que ficou por fazer e porquê?', 'O que vou mudar?'], 'A revisão termina sempre numa mudança concreta.'],
                    ],
                ],
            ],
        ],
    ],
];
