<?php

return [
    'slug' => 'design-grafico-com-canva',
    'version' => 1,
    'trail' => [
        'title' => 'Design Gráfico com Canva',
        'summary' => 'Aprende os princípios de design, usa cor e tipografia com intenção e cria peças profissionais no Canva.',
        'description' => "O Canva torna o design acessível, mas sem princípios as peças ficam confusas. Nesta trilha aprendes o que faz um design funcionar — hierarquia, alinhamento, contraste e espaço — e aplicas tudo no Canva.\n\nCrias um kit de marca simples e três peças para um negócio real: um post, um story e um cartaz, exportados nos formatos certos.",
        'category' => 'Design',
        'core_competence' => 'Design Gráfico',
        'expected_outcome' => 'Um kit de marca e três peças (post, story e cartaz) criadas no Canva para um negócio real.',
        'learning_objectives' => [
            'Aplicar hierarquia, alinhamento, contraste e espaço em branco.',
            'Escolher paletas de cor e combinações de letras legíveis.',
            'Criar, organizar e exportar peças no Canva com um kit de marca.',
        ],
        'target_audience' => 'Estudantes, empreendedores e quem cria conteúdo para redes sociais.',
        'prerequisites' => ['Conta gratuita no Canva (canva.com ou app).'],
    ],
    'modules' => [
        [
            'title' => 'Princípios de design',
            'description' => 'As regras que fazem uma peça parecer profissional.',
            'activity' => ['upload', 'Redesenha uma peça mal feita.', 'Escolhe um cartaz ou post confuso (podes criá-lo de propósito). Faz uma nova versão aplicando hierarquia, alinhamento, contraste e espaço. Envia as duas versões numa imagem.'],
            'lessons' => [
                [
                    'title' => 'Hierarquia visual',
                    'summary' => 'Guiar o olhar do mais importante para o menos importante.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que o olho vê primeiro

**Hierarquia** é a ordem em que a informação é vista. Em 3 segundos a pessoa deve perceber **o que é** e **o que fazer**.

## Como criar hierarquia

- **Tamanho** — o mais importante é o maior.
- **Peso** — negrito para destacar.
- **Cor** — uma cor de destaque para o essencial (o preço, o botão).
- **Posição** — o topo e o centro são vistos primeiro.

## Exemplo resolvido: cartaz de evento

1. **Título grande:** FEIRA DE EMPREGO
2. **Data e local, médio:** Sábado, 15 · Escola X
3. **Detalhes, pequeno:** empresas, o que levar
4. **Acção, em destaque:** Inscreve-te: kumuka.ao
MD,
                    ],
                    'check' => [
                        ['single', 'Num cartaz de promoção, o que deve ser visto primeiro?', ['* A oferta principal (ex.: -30%)', 'O endereço completo', 'O logótipo do fornecedor'], 'O elemento mais importante para a decisão deve dominar a peça.'],
                    ],
                    'bank' => [
                        ['multiple', 'Que recursos criam hierarquia visual?', ['* Tamanho', '* Peso (negrito)', '* Cor de destaque', 'Usar o mesmo tamanho para tudo'], 'Se tudo tem o mesmo tamanho, nada se destaca.'],
                    ],
                ],
                [
                    'title' => 'Alinhamento e proximidade',
                    'summary' => 'Organizar elementos para que pareçam pertencer uns aos outros.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Alinhamento

Cada elemento deve estar alinhado com outro. Escolhe **um** eixo (esquerda, centro) e mantém-no. Textos longos leem-se melhor **alinhados à esquerda**.

## Proximidade

Elementos relacionados ficam **juntos**; grupos diferentes ficam **afastados**. Data e hora do evento juntas; contactos noutro grupo.

> No Canva, as linhas cor-de-rosa que aparecem ao arrastar ajudam-te a alinhar.
MD,
                    ],
                    'check' => [
                        ['tf', 'Informações relacionadas, como data e hora, devem ficar próximas uma da outra.', true, 'A proximidade mostra que os elementos fazem parte do mesmo grupo.'],
                    ],
                    'bank' => [
                        ['single', 'Como deve estar alinhado um parágrafo longo para facilitar a leitura?', ['* À esquerda', 'Centrado', 'Cada linha numa posição diferente'], 'O alinhamento à esquerda dá um ponto de partida fixo a cada linha.'],
                    ],
                ],
                [
                    'title' => 'Contraste e espaço em branco',
                    'summary' => 'Legibilidade e respiração na peça.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Contraste

Texto escuro em fundo claro (ou o contrário). Evita texto amarelo em fundo branco ou cinzento em fundo cinzento. Em fotos, coloca uma **faixa** ou **sombra** por trás do texto.

## Espaço em branco

É o espaço vazio à volta dos elementos. Não é desperdício: **dá destaque** e faz a peça parecer mais profissional. Se a peça parece cheia, **retira** algo em vez de diminuir tudo.
MD,
                    ],
                    'check' => [
                        ['single', 'Uma peça parece confusa e cheia. Qual é a melhor solução?', ['* Retirar elementos e dar espaço', 'Diminuir todas as letras', 'Acrescentar mais cores'], 'Menos elementos com espaço à volta comunicam melhor.'],
                    ],
                    'bank' => [
                        ['tf', 'Texto amarelo-claro sobre fundo branco tem bom contraste.', false, 'Cores claras sobre fundo claro são difíceis de ler.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Cor e tipografia',
            'description' => 'Escolhe cores e letras com intenção e consistência.',
            'activity' => ['upload', 'Cria o kit de marca.', 'Para um negócio real, define 3 cores (com códigos HEX), 2 tipos de letra (títulos e texto) e o logótipo. Monta tudo numa página do Canva e envia em PNG ou PDF.'],
            'lessons' => [
                [
                    'title' => 'Paletas de cor',
                    'summary' => 'Poucas cores, bem escolhidas e sempre as mesmas.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## A regra 60-30-10

- **60 %** — cor dominante (normalmente o fundo, clara ou neutra).
- **30 %** — cor secundária (blocos, títulos).
- **10 %** — cor de destaque (botões, preço, chamada à acção).

## Exemplo

Para a KUMUKA: 60 % branco frio **#F2F6FA**, 30 % azul **#123B72**, 10 % dourado **#F5BE35**.

## Dicas

- Usa sempre os **mesmos códigos HEX** — "azul" pode ter mil tons.
- Cores transmitem sensações: verde (natureza, saúde), azul (confiança), laranja (energia).
- Confirma o contraste do texto com a cor de fundo.
MD,
                    ],
                    'check' => [
                        ['single', 'Na regra 60-30-10, para que serve a cor dos 10 %?', ['* Destacar o mais importante, como a chamada à acção', 'Ser o fundo da peça', 'Não serve para nada'], 'A cor de destaque, usada com moderação, chama a atenção para o essencial.'],
                    ],
                    'bank' => [
                        ['fill', 'Como se chama o código de cor no formato #123B72?', ['HEX', 'hex', 'hexadecimal'], 'Os códigos HEX garantem sempre o mesmo tom.'],
                    ],
                ],
                [
                    'title' => 'Tipografia legível',
                    'summary' => 'Escolher e combinar tipos de letra.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Regras práticas

- **No máximo 2 tipos de letra**: um para títulos, outro para texto.
- Letras **sem serifa** (como Poppins, Montserrat) leem-se bem em ecrãs.
- Letras decorativas e manuscritas **só** em palavras curtas.
- **Tamanho** mínimo legível no telemóvel: texto principal grande o suficiente para ler sem zoom.
- Evita textos inteiros em MAIÚSCULAS — cansam a leitura.

## Combinação segura

Títulos em **Montserrat Bold** + texto em **Poppins Regular**.
MD,
                    ],
                    'check' => [
                        ['single', 'Quantos tipos de letra deves usar numa peça?', ['* Até 2', '5 ou mais', 'Um diferente em cada linha'], 'Mais de dois tipos de letra tornam a peça confusa.'],
                    ],
                    'bank' => [
                        ['tf', 'Letras manuscritas decorativas são boas para parágrafos longos.', false, 'São difíceis de ler em textos longos; usa-as só em palavras curtas.'],
                    ],
                ],
                [
                    'title' => 'Consistência de marca',
                    'summary' => 'Repetir cores, letras e estilo para ser reconhecido.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Porque importa

Quando todas as peças usam as **mesmas cores, letras e estilo de imagem**, as pessoas reconhecem a marca antes de lerem o nome.

## O kit de marca

- Logótipo (versão clara e escura).
- 3 cores com HEX.
- 2 tipos de letra.
- Estilo de fotografia (por exemplo, fotos reais, luz natural).

No Canva, guarda tudo em **Marca → Kit de marca** para usar com um clique.
MD,
                    ],
                    'check' => [
                        ['multiple', 'O que faz parte de um kit de marca?', ['* Logótipo', '* Cores com código HEX', '* Tipos de letra', 'A palavra-passe da conta'], 'O kit reúne os elementos visuais da marca.'],
                    ],
                    'bank' => [
                        ['tf', 'Mudar as cores da marca em cada publicação ajuda a ser reconhecido.', false, 'A repetição consistente é o que cria reconhecimento.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Criar no Canva',
            'description' => 'Do modelo à peça final, nos formatos certos para cada uso.',
            'activity' => ['upload', 'Envia as três peças.', 'Usando o kit de marca, cria um post (1080×1080), um story (1080×1920) e um cartaz A4. Exporta nos formatos certos e envia (podes juntar num PDF).'],
            'lessons' => [
                [
                    'title' => 'Usar e adaptar modelos',
                    'summary' => 'Começar de um modelo sem que pareça igual a todos os outros.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Passos

1. Escolhe o **formato** certo (Post Instagram, Story, A4…).
2. Procura um modelo com a **estrutura** que precisas (não pela cor).
3. Aplica o **kit de marca**: troca cores e letras.
4. Substitui as imagens por **fotos reais** tuas ou do negócio.
5. Revê a **hierarquia**: o mais importante é o maior?
6. **Apaga** o que não precisas.

> Um modelo é um ponto de partida. Se a peça final se parece com o modelo original, ainda não está tua.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena os passos para adaptar um modelo.', ['Escolher o formato', 'Escolher um modelo pela estrutura', 'Aplicar as cores e letras da marca', 'Rever a hierarquia'], 'Primeiro o formato e a estrutura; depois a marca; por fim a revisão.'],
                    ],
                    'bank' => [
                        ['single', 'Por que critério deves escolher um modelo no Canva?', ['* Pela estrutura de que precisas', 'Pela cor que mais gostas', 'Pelo número de elementos'], 'As cores mudam-se facilmente; a estrutura é o que poupa trabalho.'],
                    ],
                ],
                [
                    'title' => 'Formatos e medidas',
                    'summary' => 'O tamanho certo para cada rede e para impressão.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Medidas comuns (em pixels)

| Peça | Medida |
|---|---|
| Post quadrado | 1080 × 1080 |
| Post vertical | 1080 × 1350 |
| Story / Reels / Estado | 1080 × 1920 |
| Capa de YouTube | 1280 × 720 |

Para impressão (cartaz, flyer), usa formatos em papel como **A4** ou **A5** e deixa margens.

> Nas stories, mantém textos importantes longe do topo e do fundo — é onde aparecem o nome e os botões da app.
MD,
                    ],
                    'check' => [
                        ['match', 'Liga cada peça à medida certa.', ['Story' => '1080 × 1920', 'Post quadrado' => '1080 × 1080', 'Capa de YouTube' => '1280 × 720'], 'Cada plataforma tem proporções próprias.'],
                    ],
                    'bank' => [
                        ['tf', 'Numa story, o texto importante deve ficar encostado ao topo.', false, 'O topo e o fundo ficam tapados pelos elementos da app.'],
                    ],
                ],
                [
                    'title' => 'Exportar e partilhar',
                    'summary' => 'PNG, JPG, PDF ou MP4: quando usar cada formato.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Formatos de exportação

- **PNG** — imagens com texto e logótipos (nitidez máxima).
- **JPG** — fotografias; ficheiros mais leves.
- **PDF para impressão** — cartazes e flyers para gráfica.
- **MP4** — peças com animação ou vídeo.

## Antes de exportar

- Revê a ortografia (lê em voz alta).
- Confirma números de telefone, datas e preços.
- Vê a peça no **telemóvel** antes de publicar.
MD,
                    ],
                    'check' => [
                        ['single', 'Que formato escolhes para enviar um cartaz para a gráfica?', ['* PDF para impressão', 'MP4', 'GIF'], 'O PDF de impressão mantém a qualidade e as medidas.'],
                    ],
                    'bank' => [
                        ['match', 'Liga cada uso ao formato.', ['Logótipo com texto nítido' => 'PNG', 'Fotografia leve' => 'JPG', 'Peça animada' => 'MP4'], 'O formato certo equilibra qualidade e peso.'],
                    ],
                ],
            ],
        ],
    ],
];
