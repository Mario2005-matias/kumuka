<?php

return [
    'slug' => 'comunicacao-eficaz',
    'version' => 1,
    'trail' => [
        'title' => 'Comunicação Eficaz',
        'summary' => 'Ouve com atenção, escreve mensagens profissionais claras e apresenta ideias em público com confiança.',
        'description' => "Comunicar bem é a competência que mais aparece nos anúncios de emprego — e a que mais se nota numa entrevista.\n\nNesta trilha praticas escuta activa, escreves emails e mensagens profissionais que obtêm resposta e preparas uma apresentação curta com estrutura, voz e slides simples.",
        'category' => 'Comunicação',
        'core_competence' => 'Comunicação',
        'expected_outcome' => 'Um email profissional revisto e uma apresentação de 3 minutos estruturada e ensaiada.',
        'learning_objectives' => [
            'Praticar escuta activa e fazer perguntas abertas.',
            'Escrever emails e mensagens profissionais claros e curtos.',
            'Estruturar e apresentar uma ideia em público com confiança.',
        ],
        'target_audience' => 'Estudantes e jovens profissionais que querem comunicar com mais clareza e confiança.',
        'prerequisites' => [],
    ],
    'modules' => [
        [
            'title' => 'Ouvir e perguntar',
            'description' => 'A comunicação começa por perceber bem o outro.',
            'activity' => ['escrita', 'Pratica a escuta activa numa conversa.', 'Tem uma conversa de 10 minutos com alguém sobre o trabalho ou os estudos dessa pessoa. Usa perguntas abertas e paráfrases. Escreve 3 perguntas que fizeste e o que aprendeste.'],
            'lessons' => [
                [
                    'title' => 'Escuta activa',
                    'summary' => 'Ouvir para perceber, não para responder.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que é

**Escuta activa** é dar atenção total ao que a outra pessoa diz e mostrar que percebeste.

## Quatro comportamentos

1. **Atenção** — telemóvel guardado, olhar para a pessoa.
2. **Não interromper** — deixa terminar a ideia.
3. **Parafrasear** — repetir por palavras tuas: *"Então, o que te preocupa é o prazo, certo?"*
4. **Perguntar para aprofundar** — *"Podes dar-me um exemplo?"*

## Porque importa

Em entrevistas, reuniões e atendimento ao cliente, quem ouve bem responde melhor, comete menos erros e cria confiança.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destas frases é uma paráfrase?', ['* "Então o problema é que o fornecedor atrasou a entrega, é isso?"', '"Eu também tive esse problema uma vez."', '"Não te preocupes."'], 'Parafrasear é repetir por palavras tuas para confirmar que percebeste.'],
                    ],
                    'bank' => [
                        ['multiple', 'Quais são comportamentos de escuta activa?', ['* Não interromper', '* Parafrasear', '* Fazer perguntas para aprofundar', 'Preparar a resposta enquanto o outro fala'], 'Preparar a resposta enquanto o outro fala impede-te de ouvir de verdade.'],
                    ],
                ],
                [
                    'title' => 'Perguntas abertas e fechadas',
                    'summary' => 'Escolher o tipo de pergunta conforme o que queres saber.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Fechadas

Respondem-se com "sim", "não" ou um dado: *"Terminaste o relatório?"* — úteis para **confirmar**.

## Abertas

Começam com **como, o quê, porquê, conta-me**: *"Como correu a reunião com o cliente?"* — úteis para **compreender** e abrir a conversa.

## Exemplo resolvido

❌ "Gostaste do estágio?" → "Sim."
✅ "O que aprendeste de mais útil no estágio?" → uma resposta com detalhes.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é uma pergunta aberta?', ['* O que te levou a escolher este curso?', 'Gostas do teu curso?', 'Estás no 3.º ano?'], 'Perguntas abertas pedem explicações, não apenas sim ou não.'],
                    ],
                    'bank' => [
                        ['match', 'Classifica cada pergunta.', ['"Já enviaste o email?"' => 'Fechada', '"Como pensas resolver isto?"' => 'Aberta'], 'Fechadas confirmam; abertas exploram.'],
                    ],
                ],
                [
                    'title' => 'Comunicação não verbal',
                    'summary' => 'Postura, olhar e tom de voz também falam.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## O que o corpo diz

- **Postura** aberta (braços descruzados, ombros direitos) transmite segurança.
- **Contacto visual** natural mostra atenção — sem fixar demasiado.
- **Tom e ritmo** de voz: falar depressa demais transmite nervosismo.
- **Expressão facial** coerente com a mensagem.

## Em videochamadas

Câmara à altura dos olhos, luz de frente, olhar para a câmara quando falas e microfone desligado quando não falas.
MD,
                    ],
                    'check' => [
                        ['tf', 'Numa videochamada, olhar para a câmara quando falas dá a sensação de contacto visual.', true, 'Para quem está do outro lado, olhar para a câmara equivale a olhar nos olhos.'],
                    ],
                    'bank' => [
                        ['single', 'Que postura transmite mais segurança?', ['* Ombros direitos e braços descruzados', 'Braços cruzados e olhar para o chão', 'Costas curvadas'], 'Uma postura aberta comunica confiança e disponibilidade.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Escrever com clareza',
            'description' => 'Emails e mensagens profissionais curtos, claros e que obtêm resposta.',
            'activity' => ['escrita', 'Escreve um email profissional.', 'Escreve um email a pedir uma informação a uma empresa ou professor (assunto, saudação, pedido, contexto, despedida). Máximo de 120 palavras.'],
            'lessons' => [
                [
                    'title' => 'A estrutura de um email profissional',
                    'summary' => 'Assunto, saudação, mensagem principal e fecho.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## As partes

1. **Assunto** específico — *"Candidatura: Estágio em Contabilidade — Ana Mateus"*.
2. **Saudação** — *"Bom dia, Dra. Joana Silva,"*.
3. **Pedido ou ideia principal primeiro** — numa frase.
4. **Contexto** — só o necessário.
5. **Fecho com próximo passo** — *"Fico a aguardar a sua resposta."*
6. **Assinatura** — nome, telefone, link do LinkedIn.

## Exemplo resolvido

> **Assunto:** Pedido de declaração de frequência — Ana Mateus, n.º 20231234
>
> Bom dia,
> Venho pedir uma declaração de frequência do 3.º ano de Gestão, para apresentar numa candidatura de estágio.
> Preciso do documento até sexta-feira, dia 14. Posso levantá-lo na secretaria.
> Obrigada pela atenção.
> Ana Mateus · 9XX XXX XXX
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destes assuntos de email é melhor?', ['* Candidatura: Estágio em Marketing — João Pedro', 'Olá', 'Urgente!!!'], 'Um assunto específico diz logo do que se trata e facilita a pesquisa.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena as partes de um email profissional.', ['Saudação', 'Pedido principal', 'Contexto', 'Fecho e assinatura'], 'O pedido logo no início poupa tempo a quem lê.'],
                    ],
                ],
                [
                    'title' => 'Clareza: frases curtas e linguagem simples',
                    'summary' => 'Cortar palavras desnecessárias sem perder educação.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Regras práticas

- **Uma ideia por frase.**
- Prefere palavras simples: *"usar"* em vez de *"proceder à utilização de"*.
- Evita abreviaturas de chat (*"vc", "tbm", "pq"*) em contextos profissionais.
- Usa **listas** quando há vários pontos.
- Lê em voz alta antes de enviar: se te falta o ar, a frase é longa demais.

## Exemplo resolvido

❌ *"Venho por este meio, com os melhores cumprimentos, informar Vossa Excelência que, no seguimento do anteriormente referido, procederemos ao envio do documento."*

✅ *"Envio o documento em anexo, como combinado."*
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destas frases é mais clara?', ['* Envio o relatório em anexo.', 'Procedo por este meio ao envio, em anexo, do supramencionado relatório.', 'Mando o relatorio tbm.'], 'Curta, educada e sem abreviaturas de chat.'],
                    ],
                    'bank' => [
                        ['tf', 'Abreviaturas como "vc" e "pq" são adequadas em emails para empresas.', false, 'Em contextos profissionais escreve as palavras por extenso.'],
                    ],
                ],
                [
                    'title' => 'Mensagens profissionais no WhatsApp',
                    'summary' => 'Quando usar, como escrever e o que evitar.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Boas práticas

- **Apresenta-te** na primeira mensagem: nome e motivo.
- Escreve **uma mensagem completa**, não cinco seguidas ("Olá" … "Tudo bem?" … "Queria saber…").
- Respeita **horários** — evita mensagens profissionais muito cedo, tarde ou ao fim de semana, salvo urgência.
- Áudios só se a outra pessoa preferir; texto é mais fácil de consultar.
- Confirma combinados por escrito: *"Confirmo a entrevista amanhã, dia 5, às 10h, no edifício X."*
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é a melhor primeira mensagem a um recrutador no WhatsApp?', ['* "Bom dia, Sr. Carlos. Sou a Marta Lopes, candidata ao estágio em Logística. Queria confirmar a hora da entrevista de amanhã."', '"Olá"', '"Tás?"'], 'Apresenta-te e diz logo o motivo numa só mensagem.'],
                    ],
                    'bank' => [
                        ['tf', 'Enviar várias mensagens curtas seguidas é melhor do que uma mensagem completa.', false, 'Uma mensagem completa é mais fácil de ler e responder.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Falar em público',
            'description' => 'Estrutura, slides simples e técnicas para controlar o nervosismo.',
            'activity' => ['link', 'Grava a tua apresentação de 3 minutos.', 'Prepara uma apresentação de 3 minutos sobre um tema que domines (com a estrutura da lição 1). Grava em vídeo, publica como não listado (YouTube ou Drive) e cola o link.'],
            'lessons' => [
                [
                    'title' => 'Estruturar uma apresentação',
                    'summary' => 'Abertura forte, três ideias e um fecho com acção.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## A estrutura simples

1. **Abertura** (15–20 segundos) — uma pergunta, um número ou uma história curta.
2. **Três ideias principais** — mais do que três, a audiência esquece.
3. **Fecho** — resume e diz o que queres que façam ou lembrem.

## Exemplo resolvido: 3 minutos sobre reciclagem na escola

- **Abertura:** "Esta semana, a nossa escola deitou fora cerca de 200 garrafas de plástico."
- **Ideia 1:** o problema (lixo e custos).
- **Ideia 2:** a solução (pontos de recolha por turma).
- **Ideia 3:** o resultado esperado (parceria com uma recicladora).
- **Fecho:** "Proponho começarmos na próxima segunda-feira. Quem quer coordenar a sua turma?"
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena a estrutura de uma apresentação.', ['Abertura que capta a atenção', 'Três ideias principais', 'Fecho com resumo e acção'], 'Uma estrutura clara ajuda-te a ti e à audiência.'],
                    ],
                    'bank' => [
                        ['single', 'Quantas ideias principais é recomendado ter numa apresentação curta?', ['* Três', 'Dez', 'Uma lista de todas as que conheces'], 'Com mais de três ideias, a audiência tem dificuldade em lembrar-se.'],
                    ],
                ],
                [
                    'title' => 'Slides que ajudam',
                    'summary' => 'Menos texto, mais clareza.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Regras

- **Uma ideia por slide.**
- **Poucas palavras** — títulos curtos e, no máximo, 3 tópicos. O detalhe diz-se, não se lê.
- **Letras grandes** (pelo menos 24 pt) e **contraste** forte.
- Imagens e gráficos simples em vez de parágrafos.

> Se estás a ler os slides, a audiência também está — e deixa de te ouvir.
MD,
                    ],
                    'check' => [
                        ['tf', 'Os slides devem conter todo o texto que vais dizer.', false, 'Slides com muito texto competem com a tua voz; servem para apoiar, não para ler.'],
                    ],
                    'bank' => [
                        ['multiple', 'O que torna um slide mais claro?', ['* Uma ideia por slide', '* Letras grandes', '* Contraste forte', 'Parágrafos completos'], 'Parágrafos completos tornam os slides difíceis de ler à distância.'],
                    ],
                ],
                [
                    'title' => 'Controlar o nervosismo',
                    'summary' => 'Preparação, respiração e ensaio.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## O nervosismo é normal

Até oradores experientes ficam nervosos. O objectivo não é eliminá-lo, é **controlá-lo**.

## Técnicas

1. **Ensaia em voz alta** pelo menos 3 vezes, de preferência com um amigo ou gravando-te.
2. **Domina a abertura** — os primeiros 30 segundos são os mais difíceis.
3. **Respiração 4-4-4** antes de começar: inspira 4 segundos, segura 4, expira 4.
4. **Pausa** em vez de "ééé" — um silêncio curto parece confiança.
5. **Olha para pessoas amigáveis** na audiência no início.
MD,
                    ],
                    'check' => [
                        ['single', 'O que fazer quando esqueces a palavra a meio da frase?', ['* Fazer uma pausa curta e continuar', 'Pedir desculpa várias vezes', 'Dizer "ééé" até lembrar'], 'Uma pausa curta passa despercebida e transmite calma.'],
                    ],
                    'bank' => [
                        ['tf', 'Ensaiar em voz alta reduz o nervosismo no dia da apresentação.', true, 'Conhecer bem o conteúdo diminui a incerteza que causa nervosismo.'],
                    ],
                ],
            ],
        ],
    ],
];
