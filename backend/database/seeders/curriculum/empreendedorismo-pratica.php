<?php

return [
    'slug' => 'empreendedorismo-pratica',
    'version' => 1,
    'trail' => [
        'title' => 'Empreendedorismo na Prática',
        'summary' => 'Valida uma ideia com clientes reais, monta o modelo de negócio, calcula preços e faz as primeiras vendas.',
        'description' => "A maioria dos negócios não falha por falta de ideias, mas por construir algo que ninguém quer comprar.\n\nNesta trilha segues um método prático: começas pelo problema e pelo cliente, testas antes de investir, calculas custos e preço e preparas o lançamento — com exemplos de pequenos negócios angolanos.",
        'category' => 'Empreendedorismo',
        'core_competence' => 'Empreendedorismo',
        'expected_outcome' => 'Um modelo de negócio validado com pelo menos 5 entrevistas a clientes, um preço calculado e um plano de lançamento.',
        'learning_objectives' => [
            'Identificar um problema real e validá-lo com entrevistas.',
            'Preencher o Business Model Canvas e calcular preço e ponto de equilíbrio.',
            'Testar com um produto mínimo, fazer as primeiras vendas e apresentar a ideia.',
        ],
        'target_audience' => 'Jovens com uma ideia de negócio ou que já vendem algo e querem crescer.',
        'prerequisites' => [],
    ],
    'modules' => [
        [
            'title' => 'Problema e cliente',
            'description' => 'Começa pelo problema que vale a pena resolver e por quem o sente.',
            'activity' => ['escrita', 'Resume 5 entrevistas a potenciais clientes.', 'Faz 5 conversas com potenciais clientes. Para cada uma, regista o problema que descreveram, como o resolvem hoje e quanto gastam. Termina com o que aprendeste.'],
            'lessons' => [
                [
                    'title' => 'Encontrar um problema que vale a pena',
                    'summary' => 'Ideias começam em problemas frequentes, dolorosos e pelos quais as pessoas já pagam.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Comece pelo problema, não pela solução

Um bom problema de negócio é:

- **Frequente** — acontece muitas vezes.
- **Doloroso** — custa tempo, dinheiro ou stress.
- **Já tem gastos** — as pessoas já pagam por alguma solução, mesmo má.

## Exemplo

> *"Os estudantes do meu bairro perdem a manhã nas filas da reprografia em época de exames."*

Frequente (todas as épocas de exames), doloroso (perdem tempo de estudo) e já pagam (imprimem de qualquer forma). É um problema com potencial — a solução ainda está por descobrir.
MD,
                    ],
                    'check' => [
                        ['multiple', 'Quais são características de um bom problema de negócio?', ['* Acontece com frequência', '* Causa dor (tempo, dinheiro, stress)', '* As pessoas já gastam dinheiro com ele', 'Só tu o sentes'], 'Um problema só teu dificilmente sustenta um negócio.'],
                    ],
                    'bank' => [
                        ['tf', 'É melhor começar por desenhar a solução e só depois procurar quem tenha o problema.', false, 'Começar pela solução aumenta o risco de criar algo que ninguém compra.'],
                    ],
                ],
                [
                    'title' => 'Entrevistar potenciais clientes',
                    'summary' => 'Perguntas sobre o passado, não opiniões sobre o futuro.',
                    'minutes' => 9,
                    'blocks' => [
                        <<<'MD'
## A regra principal

Pergunta sobre **o que as pessoas fizeram**, não sobre o que **acham que fariam**. Toda a gente diz "sim, comprava!" — poucos compram.

## Perguntas boas e más

- ❌ "Comprarias uma app para imprimir sem filas?"
- ✅ "Da última vez que precisaste de imprimir, como fizeste?"
- ✅ "Quanto tempo esperaste? Quanto pagaste?"
- ✅ "Já tentaste resolver isso de outra forma?"

## Durante a conversa

- Fala pouco e ouve muito.
- Não apresentes a tua ideia antes do fim.
- Anota frases exactas — são ouro para o teu marketing.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destas perguntas dá informação mais fiável?', ['* Da última vez que precisaste de imprimir, como fizeste?', 'Achas que a minha ideia é boa?', 'Comprarias o meu produto?'], 'Comportamentos passados mostram o que as pessoas realmente fazem.'],
                    ],
                    'bank' => [
                        ['tf', 'Deves explicar a tua ideia logo no início da entrevista.', false, 'Se apresentares a ideia primeiro, as pessoas tendem a concordar para serem simpáticas.'],
                        ['single', 'Porque é útil anotar as frases exactas dos clientes?', ['* Mostram como descrevem o problema e servem para comunicar melhor', 'Para as publicar sem autorização', 'Não é útil'], 'Usar as palavras dos clientes torna a tua mensagem mais clara para eles.'],
                    ],
                ],
                [
                    'title' => 'Definir o cliente inicial',
                    'summary' => 'Escolher um grupo pequeno e concreto para começar.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Comece estreito

"Toda a gente" não é um cliente. Escolhe um **primeiro grupo** que:

- sente o problema com mais força;
- consegues alcançar facilmente;
- pode pagar.

## Exemplo

Em vez de "estudantes de Luanda", começa com "**finalistas das duas escolas secundárias do meu bairro, em época de exames**". Consegues falar com eles pessoalmente, perceber o que querem e ganhar os primeiros clientes. Depois alargas.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é um cliente inicial bem definido?', ['* Finalistas de duas escolas do bairro em época de exames', 'Toda a gente em Angola', 'Jovens'], 'Um grupo concreto e alcançável permite aprender e vender mais depressa.'],
                    ],
                    'bank' => [
                        ['multiple', 'Que características deve ter o primeiro grupo de clientes?', ['* Sente o problema com força', '* É fácil de alcançar', '* Pode pagar', 'É o maior grupo possível'], 'Começar pelo maior grupo dispersa recursos.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Modelo de negócio e números',
            'description' => 'Organiza o negócio numa página e descobre se as contas fecham.',
            'activity' => ['upload', 'Envia o teu Business Model Canvas e cálculo de preço.', 'Preenche os 9 blocos do Canvas para a tua ideia e calcula o preço e o ponto de equilíbrio. Envia foto ou PDF.'],
            'lessons' => [
                [
                    'title' => 'O Business Model Canvas',
                    'summary' => 'Nove blocos que descrevem como o negócio cria, entrega e captura valor.',
                    'minutes' => 9,
                    'blocks' => [
                        <<<'MD'
## Os nove blocos

1. **Segmentos de clientes** — para quem?
2. **Proposta de valor** — que problema resolves?
3. **Canais** — como chegas ao cliente?
4. **Relação com clientes** — como os conquistas e manténs?
5. **Fontes de receita** — como ganhas dinheiro?
6. **Recursos-chave** — o que precisas de ter?
7. **Actividades-chave** — o que precisas de fazer bem?
8. **Parcerias-chave** — com quem trabalhas?
9. **Estrutura de custos** — onde gastas?

Preenche-o com **post-its** numa folha: assim podes mudar à medida que aprendes com os clientes.
MD,
                    ],
                    'check' => [
                        ['match', 'Liga cada pergunta ao bloco do Canvas.', ['Para quem?' => 'Segmentos de clientes', 'Que problema resolves?' => 'Proposta de valor', 'Como ganhas dinheiro?' => 'Fontes de receita'], 'O Canvas responde às perguntas essenciais do negócio numa só página.'],
                    ],
                    'bank' => [
                        ['tf', 'O Canvas deve ser preenchido uma vez e nunca mais alterado.', false, 'É uma ferramenta viva: muda à medida que aprendes com os clientes.'],
                    ],
                ],
                [
                    'title' => 'Custos e preço',
                    'summary' => 'Custos fixos e variáveis, margem e como definir o preço.',
                    'minutes' => 9,
                    'blocks' => [
                        <<<'MD'
## Dois tipos de custos

- **Fixos** — pagas sempre, vendas ou não: renda, internet, salário fixo.
- **Variáveis** — aumentam com cada unidade vendida: ingredientes, embalagem, impressão.

## Preço a partir do custo

> **Preço = custo variável por unidade + margem**

## Exemplo resolvido: sumos naturais

- Fruta, açúcar e copo por sumo: **350 Kz** (variável)
- Preço praticado na zona: 700–900 Kz
- Preço escolhido: **800 Kz** → margem de **450 Kz** por sumo

Confirma também o preço dos concorrentes e quanto os clientes estão dispostos a pagar — o custo diz o **mínimo**, o mercado diz o **máximo**.
MD,
                    ],
                    'check' => [
                        ['match', 'Classifica cada custo.', ['Renda da banca' => 'Fixo', 'Copos descartáveis' => 'Variável', 'Fruta para cada sumo' => 'Variável'], 'Os custos variáveis crescem com cada unidade vendida.'],
                    ],
                    'bank' => [
                        ['fill', 'Um produto custa 600 Kz a fazer e vende-se a 1 000 Kz. Qual é a margem por unidade? (só o número)', ['400'], '1 000 − 600 = 400 Kz.'],
                    ],
                ],
                [
                    'title' => 'Ponto de equilíbrio',
                    'summary' => 'Quantas unidades precisas de vender para não perder dinheiro.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## A fórmula

> **Ponto de equilíbrio (unidades) = custos fixos mensais ÷ margem por unidade**

## Exemplo resolvido

- Custos fixos: renda da banca + transporte = **36 000 Kz/mês**
- Margem por sumo: **450 Kz**

36 000 ÷ 450 = **80 sumos por mês** (cerca de 4 por dia útil).

Abaixo de 80, perdes dinheiro; acima, tens lucro. Se 80 parece impossível, ajusta: reduz custos fixos, aumenta a margem ou encontra mais clientes.
MD,
                    ],
                    'check' => [
                        ['fill', 'Custos fixos de 20 000 Kz e margem de 500 Kz por unidade. Quantas unidades para o ponto de equilíbrio? (só o número)', ['40'], '20 000 ÷ 500 = 40 unidades.'],
                    ],
                    'bank' => [
                        ['single', 'O que significa vender abaixo do ponto de equilíbrio?', ['* O negócio está a perder dinheiro', 'O negócio tem lucro', 'Os custos fixos desaparecem'], 'Só acima do ponto de equilíbrio as margens cobrem todos os custos fixos.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Testar, vender e apresentar',
            'description' => 'Testa barato, conquista os primeiros clientes e apresenta a tua ideia com confiança.',
            'activity' => ['escrita', 'Escreve o teu pitch de 1 minuto.', 'Escreve um pitch com problema, solução, cliente, prova (resultados do teste) e pedido. Máximo de 150 palavras.'],
            'lessons' => [
                [
                    'title' => 'O produto mínimo viável',
                    'summary' => 'A versão mais simples que permite testar se as pessoas compram.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Testar antes de investir

O **produto mínimo viável (MVP)** é a forma mais barata de verificar se alguém **paga** pela solução.

## Exemplos

- Antes de abrir uma loja de bolos: aceitar **encomendas pelo WhatsApp** durante duas semanas.
- Antes de criar uma app de explicações: organizar **explicações em grupo** e cobrar.
- Antes de comprar 100 t-shirts: publicar o design e **aceitar pré-encomendas**.

O objectivo não é ter um produto perfeito, é **aprender depressa** com pouco dinheiro.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é um bom MVP para testar um negócio de bolos?', ['* Aceitar encomendas pelo WhatsApp durante duas semanas', 'Alugar uma loja e comprar fornos industriais', 'Criar uma app completa'], 'Um MVP testa a procura com o mínimo de investimento.'],
                    ],
                    'bank' => [
                        ['tf', 'O objectivo de um MVP é lançar o produto perfeito.', false, 'O objectivo é aprender rapidamente se as pessoas compram.'],
                    ],
                ],
                [
                    'title' => 'As primeiras vendas',
                    'summary' => 'Começar pela rede próxima, pedir indicações e ouvir o feedback.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Onde estão os primeiros clientes

1. **A tua rede** — família, amigos, colegas e vizinhos que encaixam no cliente inicial.
2. **Indicações** — no fim de cada venda: *"Conheces mais alguém a quem isto seria útil?"*
3. **Pontos de passagem** — escolas, igrejas, mercados, grupos de WhatsApp da comunidade.

## Depois de vender

- Pergunta o que gostaram e o que mudariam.
- Pede uma **fotografia ou testemunho** para usares (com autorização).
- Regista vendas e custos desde o primeiro dia.
MD,
                    ],
                    'check' => [
                        ['single', 'O que deves perguntar no fim de uma venda para conseguir mais clientes?', ['* Se conhecem mais alguém a quem o produto seria útil', 'Se querem pagar mais', 'Nada, para não incomodar'], 'As indicações são uma das formas mais baratas e eficazes de crescer.'],
                    ],
                    'bank' => [
                        ['tf', 'Registar vendas e custos desde o primeiro dia ajuda a saber se o negócio dá lucro.', true, 'Sem registos não sabes se estás a ganhar ou a perder dinheiro.'],
                    ],
                ],
                [
                    'title' => 'Apresentar a tua ideia (pitch) e formalizar',
                    'summary' => 'Um pitch de um minuto e os primeiros passos para legalizar o negócio.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## O pitch de 1 minuto

1. **Problema** — uma frase com um número ou história.
2. **Solução** — o que fazes.
3. **Cliente** — para quem.
4. **Prova** — o que já testaste (vendas, entrevistas).
5. **Pedido** — o que precisas (parceria, financiamento, espaço).

> *"Em época de exames, os estudantes do Cazenga perdem até 3 horas em filas para imprimir. Criámos um serviço de impressão por encomenda com entrega na escola. Em duas semanas tivemos 64 encomendas de 3 escolas. Procuramos um parceiro com impressora de grande volume."*

## Formalizar

Quando o negócio começar a ter clientes regulares, informa-te sobre a constituição de empresa e o registo fiscal. Em Angola, o **Guiché Único da Empresa** concentra vários destes passos. Formalizar dá acesso a contratos com empresas, crédito e concursos.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena as partes de um pitch.', ['Problema', 'Solução', 'Cliente', 'Prova', 'Pedido'], 'Esta ordem conta uma história lógica e termina com o que precisas.'],
                    ],
                    'bank' => [
                        ['single', 'O que torna um pitch mais convincente?', ['* Provas concretas, como vendas ou entrevistas', 'Adjectivos como "revolucionário"', 'Falar durante 10 minutos'], 'Dados reais valem mais do que promessas.'],
                    ],
                ],
            ],
        ],
    ],
];
