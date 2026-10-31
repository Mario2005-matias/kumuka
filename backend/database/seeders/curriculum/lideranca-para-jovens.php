<?php

return [
    'slug' => 'lideranca-para-jovens',
    'version' => 1,
    'trail' => [
        'title' => 'Liderança para Jovens',
        'summary' => 'Lidera-te a ti próprio, comunica com clareza, dá feedback útil e resolve conflitos em equipa.',
        'description' => "Liderar não depende de um cargo. Lideras quando organizas um trabalho de grupo, coordenas uma actividade na comunidade ou ajudas um colega a melhorar.\n\nNesta trilha praticas competências que as empresas procuram em qualquer função: responsabilidade, comunicação, feedback, tomada de decisão e gestão de conflitos — sempre com exemplos do dia-a-dia de estudantes e jovens profissionais.",
        'category' => 'Liderança',
        'core_competence' => 'Liderança',
        'expected_outcome' => 'Um plano de liderança para um projecto real, com objectivos da equipa, regras de comunicação e um feedback estruturado.',
        'learning_objectives' => [
            'Reconhecer os teus pontos fortes e comportamentos de liderança.',
            'Comunicar objectivos e dar feedback com o modelo SCI.',
            'Tomar decisões em grupo, delegar e gerir conflitos.',
        ],
        'target_audience' => 'Estudantes, líderes de associações e jovens que coordenam equipas ou projectos.',
        'prerequisites' => [],
    ],
    'modules' => [
        [
            'title' => 'Liderar começa por ti',
            'description' => 'Autoconhecimento, responsabilidade e dar o exemplo.',
            'activity' => ['escrita', 'Escreve o teu perfil de liderança.', 'Indica dois pontos fortes e um ponto a melhorar, com um exemplo real de cada. Termina com uma acção concreta para as próximas duas semanas.'],
            'lessons' => [
                [
                    'title' => 'O que é liderar',
                    'summary' => 'Liderança como influência, não como cargo.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Liderar é influenciar

Um **líder** ajuda um grupo a chegar a um objectivo comum. Pode ser o chefe — ou o colega que organiza a equipa quando ninguém sabe por onde começar.

## O que os líderes fazem (e os chefes nem sempre)

- Explicam **o porquê**, não só o quê.
- **Ouvem** antes de decidir.
- Assumem os erros e partilham os méritos.
- Desenvolvem as pessoas, em vez de fazerem tudo sozinhos.

## Exemplo

Num trabalho de grupo, a Inês não foi eleita coordenadora. Mas criou o grupo de WhatsApp, propôs um calendário e perguntou a cada um em que parte se sentia mais à vontade. O grupo seguiu-a. **Isso é liderança.**
MD,
                    ],
                    'check' => [
                        ['tf', 'Só é possível liderar quem tem um cargo de chefia.', false, 'Liderança é influência: qualquer pessoa pode liderar num grupo.'],
                    ],
                    'bank' => [
                        ['multiple', 'Quais destes comportamentos são de liderança?', ['* Explicar o porquê das tarefas', '* Ouvir antes de decidir', 'Fazer tudo sozinho para garantir a qualidade', '* Partilhar os méritos com a equipa'], 'Fazer tudo sozinho não desenvolve a equipa nem é sustentável.'],
                    ],
                ],
                [
                    'title' => 'Conhecer os teus pontos fortes',
                    'summary' => 'Usar feedback e reflexão para saber onde contribuis mais.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Três fontes de autoconhecimento

1. **Reflexão** — em que actividades o tempo passa depressa? O que te pedem ajuda para fazer?
2. **Feedback** — pergunta a três pessoas: *"Em que é que achas que sou bom? O que podia fazer melhor?"*
3. **Resultados** — que projectos correram bem e qual foi o teu papel?

## Um exercício rápido

Completa:
- "As pessoas costumam pedir-me ajuda para…"
- "Fico sem energia quando…"
- "Um momento em que liderei bem foi…"

Os bons líderes não são bons em tudo: **conhecem os seus pontos fortes** e rodeiam-se de pessoas que complementam os seus pontos fracos.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é uma boa forma de descobrir os teus pontos fortes?', ['* Pedir feedback a pessoas que trabalharam contigo', 'Comparar-te com influenciadores', 'Evitar perguntar para não parecer inseguro'], 'O feedback de quem trabalhou contigo mostra o que os outros vêem e tu não.'],
                    ],
                    'bank' => [
                        ['tf', 'Um bom líder é bom em todas as tarefas.', false, 'Bons líderes conhecem os seus limites e formam equipas complementares.'],
                    ],
                ],
                [
                    'title' => 'Responsabilidade e exemplo',
                    'summary' => 'Cumprir compromissos e assumir erros cria confiança.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## A confiança constrói-se com pequenos actos

- Chegar **a horas**.
- Fazer **o que disseste** que farias, quando disseste.
- Avisar **cedo** quando não vais conseguir — e propor uma alternativa.
- Admitir um erro: *"Errei no cálculo; já corrigi e vou rever duas vezes daqui para a frente."*

## A equipa copia o líder

Se o líder chega atrasado, a equipa também começa a atrasar-se. Se o líder cumpre e reconhece erros, a equipa sente-se segura para fazer o mesmo. **O exemplo vale mais do que qualquer discurso.**
MD,
                    ],
                    'check' => [
                        ['single', 'Percebes que não vais conseguir entregar a tua parte a tempo. O que fazes?', ['* Aviso cedo e proponho uma alternativa', 'Não digo nada e entrego quando der', 'Culpo outra pessoa'], 'Avisar cedo dá tempo à equipa para se reorganizar e mantém a confiança.'],
                    ],
                    'bank' => [
                        ['single', 'Porque é importante o líder admitir os seus erros?', ['* Cria um ambiente em que todos se sentem seguros para corrigir problemas', 'Porque fica bem nas redes sociais', 'Para evitar ter de os corrigir'], 'Equipas que escondem erros repetem-nos.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Comunicar e motivar',
            'description' => 'Partilhar uma visão, dar feedback útil e conduzir reuniões que resolvem.',
            'activity' => ['escrita', 'Escreve um feedback com o modelo SCI.', 'Pensa numa situação real (positiva ou a melhorar) com um colega. Escreve o feedback usando Situação, Comportamento e Impacto, e termina com uma pergunta ou proposta.'],
            'lessons' => [
                [
                    'title' => 'Partilhar uma visão',
                    'summary' => 'Explicar o objectivo e o porquê para alinhar a equipa.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que, porquê e como saberemos

Antes de distribuir tarefas, responde em voz alta a três perguntas:

1. **O que queremos alcançar?** — *"Angariar 200 000 Kz para a viagem de finalistas."*
2. **Porquê importa?** — *"Para que ninguém fique de fora por falta de dinheiro."*
3. **Como saberemos que conseguimos?** — *"Valor na conta até 30 de Junho."*

Uma equipa que conhece o porquê toma melhores decisões sozinha e mantém-se motivada quando surgem dificuldades.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena as perguntas para partilhar uma visão.', ['O que queremos alcançar?', 'Porquê é importante?', 'Como saberemos que conseguimos?'], 'Objectivo, motivo e critério de sucesso alinham a equipa.'],
                    ],
                    'bank' => [
                        ['tf', 'Explicar o porquê de um objectivo ajuda a equipa a decidir melhor sem depender sempre do líder.', true, 'Quem percebe o propósito consegue adaptar-se a situações novas.'],
                    ],
                ],
                [
                    'title' => 'Dar feedback com o modelo SCI',
                    'summary' => 'Situação, Comportamento e Impacto: feedback claro e respeitoso.',
                    'minutes' => 9,
                    'blocks' => [
                        <<<'MD'
## O modelo SCI

- **Situação** — quando e onde aconteceu.
- **Comportamento** — o que a pessoa fez (observável, sem julgamentos).
- **Impacto** — o efeito que teve.

Termina com uma pergunta ou proposta.

## Exemplo resolvido

❌ *"És desorganizado."* (julgamento, sem informação útil)

✅ *"Na apresentação de ontem (S), os slides chegaram 10 minutos antes de começarmos (C). Não tivemos tempo de ensaiar e saltámos uma parte importante (I). Podemos combinar enviar tudo na véspera?"*

Usa o SCI também para **elogiar**: *"Na reunião com o cliente (S), explicaste os números com exemplos simples (C) e ele aprovou logo a proposta (I). Obrigado!"*
MD,
                    ],
                    'check' => [
                        ['match', 'Liga cada parte do feedback ao modelo SCI.', ['"Na reunião de segunda-feira"' => 'Situação', '"interrompeste a Joana três vezes"' => 'Comportamento', '"e ela deixou de partilhar ideias"' => 'Impacto'], 'Situação, Comportamento observável e Impacto tornam o feedback concreto.'],
                    ],
                    'bank' => [
                        ['single', 'Qual destas frases descreve um comportamento observável?', ['* Entregaste o relatório dois dias depois do prazo', 'És preguiçoso', 'Não te importas com a equipa'], 'Comportamentos descrevem factos; as outras opções são julgamentos.'],
                        ['tf', 'O modelo SCI só serve para críticas.', false, 'Também torna os elogios mais específicos e úteis.'],
                    ],
                ],
                [
                    'title' => 'Reuniões curtas e úteis',
                    'summary' => 'Agenda, tempo e decisões registadas.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Regras simples

1. **Objectivo e agenda** enviados antes (3 pontos no máximo).
2. **Duração definida** — 30 minutos chegam para a maioria dos assuntos.
3. Alguém **regista** decisões, responsáveis e prazos.
4. Termina com **"quem faz o quê até quando"**.

## Modelo de registo

| Decisão | Responsável | Prazo |
|---|---|---|
| Pedir orçamento a 3 gráficas | Paulo | Sexta |
| Criar o cartaz | Ana | Segunda |

Envia este registo no grupo logo a seguir à reunião.
MD,
                    ],
                    'check' => [
                        ['single', 'Como deve terminar uma reunião útil?', ['* Com quem faz o quê e até quando', 'Com uma conversa livre', 'Marcando outra reunião sem objectivo'], 'Sem responsáveis e prazos, as decisões ficam esquecidas.'],
                    ],
                    'bank' => [
                        ['multiple', 'O que torna uma reunião mais eficaz?', ['* Agenda enviada antes', '* Duração definida', '* Registo de decisões', 'Convidar o máximo de pessoas possível'], 'Convidar pessoas sem papel na reunião torna-a mais longa e menos útil.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Decidir, delegar e resolver conflitos',
            'description' => 'Tomar boas decisões em grupo, distribuir trabalho e lidar com desacordos.',
            'activity' => ['escrita', 'Resolve um conflito com o método dos interesses.', 'Descreve um conflito real ou imaginário numa equipa. Indica as posições de cada parte, os interesses por trás delas e uma solução que respeite ambos.'],
            'lessons' => [
                [
                    'title' => 'Decidir em grupo',
                    'summary' => 'Quando decidir sozinho, quando consultar e quando votar.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Três formas de decidir

- **Decidir sozinho** — urgências ou assuntos simples em que és responsável.
- **Consultar e decidir** — ouves a equipa, mas a decisão final é tua. Bom para assuntos importantes com prazo.
- **Consenso ou votação** — decisões que afectam todos e precisam de compromisso.

## Um processo simples

1. Define o problema numa frase.
2. Junta pelo menos três opções.
3. Lista prós e contras de cada uma.
4. Decide, **explica o porquê** e define quando vais rever a decisão.
MD,
                    ],
                    'check' => [
                        ['single', 'O espaço do evento cancelou a dois dias da data. Que forma de decisão faz mais sentido?', ['* Decidir rapidamente, consultando quem for possível', 'Esperar uma semana por consenso', 'Não decidir'], 'Urgências exigem rapidez; consultar quem estiver disponível melhora a decisão sem a atrasar.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena o processo de decisão.', ['Definir o problema', 'Juntar opções', 'Comparar prós e contras', 'Decidir e explicar o porquê'], 'Saltar etapas leva a decisões precipitadas.'],
                    ],
                ],
                [
                    'title' => 'Delegar bem',
                    'summary' => 'Distribuir tarefas com clareza e acompanhar sem controlar demais.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Delegar não é "despachar"

Ao delegar, deixa claro:

- **O resultado esperado** — como é "feito"?
- **O prazo**.
- **A autonomia** — pode decidir sozinho ou deve consultar-te?
- **O apoio** — recursos, contactos, exemplos.

## Acompanhar

Combina **um ponto de controlo** (por exemplo, a meio do prazo) em vez de perguntar todos os dias. Assim a pessoa ganha confiança e tu evitas surpresas no fim.
MD,
                    ],
                    'check' => [
                        ['multiple', 'O que deves deixar claro ao delegar uma tarefa?', ['* O resultado esperado', '* O prazo', '* A autonomia que a pessoa tem', 'Que vais verificar o trabalho a cada hora'], 'Controlar em excesso tira a autonomia e a motivação.'],
                    ],
                    'bank' => [
                        ['tf', 'Delegar uma tarefa significa deixar de ter qualquer responsabilidade sobre ela.', false, 'O líder continua responsável pelo resultado da equipa e apoia quem executa.'],
                    ],
                ],
                [
                    'title' => 'Gerir conflitos',
                    'summary' => 'Separar posições de interesses para encontrar soluções.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Posições e interesses

- **Posição** — o que a pessoa diz que quer.
- **Interesse** — a razão por trás.

## Exemplo resolvido

O Pedro quer reunir **à noite**; a Marta quer reunir **de manhã** (posições).
- O Pedro trabalha durante o dia (interesse: não faltar ao trabalho).
- A Marta mora longe e não tem transporte à noite (interesse: segurança).

Solução que serve os dois: **reunião online ao fim da tarde** ou ao sábado de manhã.

## Passos

1. Ouve cada parte em separado, sem interromper.
2. Resume o que ouviste: *"Se percebi bem, o que te preocupa é…"*
3. Procura os interesses comuns e só depois as soluções.
MD,
                    ],
                    'check' => [
                        ['single', 'No exemplo, qual era o interesse da Marta?', ['* Segurança no regresso a casa', 'Reunir de manhã', 'Contrariar o Pedro'], '"Reunir de manhã" era a posição; o interesse era a segurança.'],
                    ],
                    'bank' => [
                        ['match', 'Liga cada frase ao que representa.', ['"Quero a reunião à noite"' => 'Posição', '"Não posso faltar ao trabalho"' => 'Interesse'], 'Soluções duradouras respondem aos interesses, não às posições.'],
                        ['single', 'Qual é um bom primeiro passo para mediar um conflito?', ['* Ouvir cada parte sem interromper', 'Decidir logo quem tem razão', 'Ignorar até passar'], 'Ouvir com atenção mostra respeito e revela os interesses.'],
                    ],
                ],
            ],
        ],
    ],
];
