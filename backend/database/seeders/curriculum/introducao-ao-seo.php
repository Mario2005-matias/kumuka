<?php

return [
    'slug' => 'introducao-ao-seo',
    'version' => 1,
    'trail' => [
        'title' => 'Introdução ao SEO',
        'summary' => 'Percebe como funcionam os motores de pesquisa e optimiza páginas para aparecerem no Google.',
        'description' => "SEO (Search Engine Optimization) é o conjunto de práticas que ajudam uma página a aparecer nos resultados de pesquisa sem pagar anúncios.\n\nNesta trilha percebes como o Google encontra e ordena páginas, escolhes palavras-chave com base na intenção de pesquisa, optimizas títulos e conteúdo e aprendes a medir resultados com o Google Search Console.",
        'category' => 'Marketing',
        'core_competence' => 'SEO',
        'expected_outcome' => 'A auditoria SEO de uma página real com palavras-chave, título, descrição e três melhorias priorizadas.',
        'learning_objectives' => [
            'Explicar como os motores de pesquisa rastreiam, indexam e ordenam páginas.',
            'Escolher palavras-chave pela intenção de pesquisa e optimizar o conteúdo.',
            'Verificar requisitos técnicos e medir resultados no Search Console.',
        ],
        'target_audience' => 'Quem cria sites, blogues ou trabalha em marketing digital.',
        'prerequisites' => ['Recomendado: noções de HTML (trilha "Introdução à Programação Web").'],
    ],
    'modules' => [
        [
            'title' => 'Como funciona a pesquisa',
            'description' => 'Rastreio, indexação, ordenação e intenção de pesquisa.',
            'activity' => ['escrita', 'Analisa uma página de resultados.', 'Pesquisa no Google um tema do teu interesse (ex.: "estágio em Luanda"). Indica a intenção de pesquisa, os tipos de resultados que aparecem e porque achas que o primeiro resultado está em primeiro.'],
            'lessons' => [
                [
                    'title' => 'Rastrear, indexar e ordenar',
                    'summary' => 'As três etapas entre publicares uma página e ela aparecer no Google.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## As três etapas

1. **Rastreio (crawling)** — robôs do Google seguem links para descobrir páginas.
2. **Indexação** — o Google analisa o conteúdo e guarda-o no seu índice.
3. **Ordenação (ranking)** — quando alguém pesquisa, o Google escolhe e ordena as páginas mais úteis.

## O que influencia a ordenação

- **Relevância** — a página responde à pesquisa?
- **Qualidade** — conteúdo útil, original e fiável.
- **Experiência** — rápida, funciona bem no telemóvel, segura (https).
- **Autoridade** — outros sites de confiança apontam para ela.

> Uma página sem links para ela pode nunca ser descoberta.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena as etapas da pesquisa.', ['Rastreio', 'Indexação', 'Ordenação'], 'Primeiro o Google descobre a página, depois guarda-a, e só então a pode mostrar.'],
                    ],
                    'bank' => [
                        ['multiple', 'Que factores influenciam a posição de uma página?', ['* Relevância para a pesquisa', '* Qualidade do conteúdo', '* Velocidade e versão para telemóvel', 'Número de cores do site'], 'O design visual por si só não é um factor de ordenação.'],
                    ],
                ],
                [
                    'title' => 'Intenção de pesquisa',
                    'summary' => 'Perceber o que a pessoa quer quando pesquisa.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Quatro tipos de intenção

- **Informativa** — quer aprender: *"como fazer um CV"*.
- **Navegacional** — quer ir a um site: *"login banco"*.
- **Comercial** — compara opções: *"melhor curso de Excel online"*.
- **Transaccional** — quer agir: *"comprar portátil Luanda"*.

## Porque importa

O Google mostra o tipo de página que melhor serve a intenção. Para *"como fazer um CV"*, aparecem guias e vídeos — não lojas. Antes de escrever, **pesquisa a palavra-chave** e vê que tipo de páginas estão no topo.
MD,
                    ],
                    'check' => [
                        ['match', 'Liga cada pesquisa à intenção.', ['"como escrever uma carta de motivação"' => 'Informativa', '"comprar ténis de corrida Luanda"' => 'Transaccional', '"melhor portátil para estudantes"' => 'Comercial'], 'A intenção define o tipo de conteúdo que deves criar.'],
                    ],
                    'bank' => [
                        ['single', 'Antes de escrever para uma palavra-chave, o que deves fazer?', ['* Pesquisá-la e ver que tipo de páginas aparecem no topo', 'Repeti-la 50 vezes no texto', 'Escolher a mais longa possível'], 'Os resultados mostram o que o Google considera útil para essa intenção.'],
                    ],
                ],
                [
                    'title' => 'Ler uma página de resultados',
                    'summary' => 'Título, endereço e descrição: o que o utilizador vê antes de clicar.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Um resultado tem três partes

1. **Título** (azul, clicável) — vem normalmente da etiqueta `<title>`.
2. **Endereço** (URL).
3. **Descrição** — muitas vezes vem da `meta description`.

```
<head>
  <title>Como fazer um CV para o primeiro emprego | KUMUKA</title>
  <meta name="description" content="Guia passo a passo com modelo gratuito para escreveres um CV de uma página.">
</head>
```

Um bom título e descrição **aumentam os cliques**, mesmo sem mudar a posição.
MD,
                    ],
                    'check' => [
                        ['single', 'De onde vem normalmente o título azul que aparece no Google?', ['* Da etiqueta <title> da página', 'Do primeiro parágrafo', 'Do nome do ficheiro da imagem'], 'O <title> é o principal candidato a título do resultado.'],
                    ],
                    'bank' => [
                        ['tf', 'Uma boa meta description pode aumentar o número de cliques.', true, 'É o texto que convence a pessoa a escolher o teu resultado.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Palavras-chave e conteúdo',
            'description' => 'Escolhe palavras-chave e escreve páginas que respondem melhor do que as outras.',
            'activity' => ['escrita', 'Optimiza uma página.', 'Escolhe uma palavra-chave principal e duas relacionadas para uma página real ou imaginária. Escreve o title (até 60 caracteres), a meta description (até 155) e os títulos H1 e H2.'],
            'lessons' => [
                [
                    'title' => 'Encontrar palavras-chave',
                    'summary' => 'Usar as palavras que as pessoas realmente pesquisam.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Onde encontrar ideias

- **Sugestões do Google** — começa a escrever e vê o que aparece.
- **"Outras perguntas dos utilizadores"** na página de resultados.
- **Pesquisas relacionadas** no fundo da página.
- Ferramentas gratuitas como o **Google Trends** e o planeador de palavras-chave do Google Ads.

## Curtas vs. de cauda longa

- **Curta:** *"curso Excel"* — muita procura, muita concorrência.
- **Cauda longa:** *"curso de Excel gratuito para iniciantes em Luanda"* — menos procura, mas mais fácil de alcançar e com intenção clara.

Para sites novos, as de **cauda longa** são o melhor ponto de partida.
MD,
                    ],
                    'check' => [
                        ['single', 'Para um site novo, que palavras-chave são normalmente melhor ponto de partida?', ['* De cauda longa, mais específicas', 'As mais curtas e genéricas', 'Palavras em inglês sem relação com o tema'], 'Têm menos concorrência e uma intenção mais clara.'],
                    ],
                    'bank' => [
                        ['multiple', 'Onde encontras ideias de palavras-chave gratuitamente?', ['* Sugestões ao escrever no Google', '* Pesquisas relacionadas', '* Google Trends', 'No código-fonte de sites aleatórios'], 'As próprias sugestões do Google mostram o que as pessoas pesquisam.'],
                    ],
                ],
                [
                    'title' => 'Título, descrição e títulos internos',
                    'summary' => 'Onde colocar a palavra-chave sem exagerar.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Onde colocar a palavra-chave

- No **`<title>`** — de preferência no início, até ~60 caracteres.
- Na **meta description** — até ~155 caracteres, com uma chamada à acção.
- No **`<h1>`** — um por página.
- Nos **`<h2>`** — variações e perguntas relacionadas.
- No **endereço**: `/curso-excel-iniciantes`.

## Não exageres

Repetir a palavra-chave dezenas de vezes (*keyword stuffing*) piora a leitura e pode prejudicar a página. Escreve para pessoas.
MD,
                    ],
                    'check' => [
                        ['tf', 'Repetir a palavra-chave o máximo de vezes possível melhora sempre a posição.', false, 'O excesso prejudica a leitura e pode ser penalizado.'],
                    ],
                    'bank' => [
                        ['single', 'Qual destes endereços é melhor para SEO?', ['* /curso-excel-iniciantes', '/pagina?id=4382', '/Curso_EXCEL_Iniciantes_2026_final'], 'Curto, em minúsculas, com hífens e palavras descritivas.'],
                    ],
                ],
                [
                    'title' => 'Conteúdo útil',
                    'summary' => 'Responder melhor do que as páginas que já estão no topo.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que torna o conteúdo útil

- Responde **logo no início** à pergunta principal.
- Tem **exemplos** e passos práticos.
- Está **actualizado** e é **original** (não copiado).
- Mostra **experiência real**: fotos próprias, casos, dados locais.
- É fácil de ler: títulos, listas, parágrafos curtos.

## Exemplo resolvido

Para *"como abrir conta bancária para estudante em Angola"*, a página que responde melhor lista os documentos, compara condições de vários bancos e conta a experiência de quem abriu — muito mais útil do que um texto genérico sobre "a importância das contas bancárias".
MD,
                    ],
                    'check' => [
                        ['multiple', 'O que torna uma página mais útil?', ['* Responder logo à pergunta', '* Exemplos práticos', '* Informação actualizada', 'Texto copiado de outros sites'], 'Conteúdo copiado não acrescenta valor e é ignorado pelos motores de pesquisa.'],
                    ],
                    'bank' => [
                        ['tf', 'Exemplos e dados locais tornam o conteúdo mais útil para quem pesquisa.', true, 'Mostram experiência real e respondem a necessidades concretas.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'SEO técnico e medição',
            'description' => 'Velocidade, telemóvel, links e o Google Search Console.',
            'activity' => ['escrita', 'Faz uma mini-auditoria técnica.', 'Analisa uma página com o PageSpeed Insights e verifica se funciona no telemóvel. Indica a pontuação, os 3 problemas principais e o que farias primeiro.'],
            'lessons' => [
                [
                    'title' => 'Velocidade e telemóvel',
                    'summary' => 'Páginas rápidas e adaptadas ao telemóvel são favorecidas.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Porque importa

O Google avalia principalmente a **versão para telemóvel** das páginas. E páginas lentas perdem visitantes — sobretudo com dados móveis caros.

## Melhorias com maior impacto

1. **Comprimir imagens** e usar formatos modernos (WebP).
2. Indicar `width` e `height` nas imagens para evitar saltos no carregamento.
3. Ter a etiqueta `viewport` e um layout responsivo.
4. Evitar scripts e tipos de letra desnecessários.

> Testa com o **PageSpeed Insights** (pagespeed.web.dev): mostra a pontuação e o que corrigir.
MD,
                    ],
                    'check' => [
                        ['single', 'Que melhoria tem normalmente maior impacto na velocidade?', ['* Comprimir imagens', 'Mudar a cor do fundo', 'Aumentar o tamanho das letras'], 'Imagens pesadas são a causa mais comum de páginas lentas.'],
                    ],
                    'bank' => [
                        ['tf', 'O Google avalia principalmente a versão da página para telemóvel.', true, 'A maioria das pesquisas é feita em telemóveis.'],
                    ],
                ],
                [
                    'title' => 'Links internos e externos',
                    'summary' => 'Como os links ajudam o Google e os visitantes.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Links internos

Ligam páginas do **teu** site. Ajudam o Google a descobrir páginas e os visitantes a continuar a navegar. Usa **texto descritivo**:

- ❌ *clica aqui*
- ✅ *vê o [guia de CV para o primeiro emprego](/guias/cv)*

## Links de outros sites (backlinks)

Quando um site de confiança aponta para o teu, é um sinal de autoridade. Consegues-los criando conteúdo útil, com parcerias e participação em eventos e meios locais — **nunca comprando links**.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é o melhor texto para um link interno?', ['* guia de CV para o primeiro emprego', 'clica aqui', 'link'], 'Texto descritivo ajuda visitantes e motores de pesquisa a perceber o destino.'],
                    ],
                    'bank' => [
                        ['tf', 'Comprar links de outros sites é uma boa estratégia de SEO.', false, 'É contra as regras do Google e pode prejudicar o site.'],
                    ],
                ],
                [
                    'title' => 'Medir com o Google Search Console',
                    'summary' => 'Ver como o Google vê o teu site e que pesquisas trazem visitantes.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que é

O **Google Search Console** é uma ferramenta gratuita que mostra como o teu site aparece no Google.

## Métricas principais

- **Impressões** — quantas vezes apareceste nos resultados.
- **Cliques** — quantas vezes clicaram.
- **CTR** — cliques ÷ impressões.
- **Posição média**.

## Exemplo resolvido

Uma página tem **2 000 impressões, 40 cliques (CTR 2 %)** e posição média 6. Aparece muito mas é pouco clicada → melhora o **title e a descrição** para serem mais apelativos.
MD,
                    ],
                    'check' => [
                        ['fill', 'Uma página teve 1 000 impressões e 30 cliques. Qual é o CTR, em %? (só o número)', ['3', '3%'], '30 ÷ 1 000 × 100 = 3 %.'],
                    ],
                    'bank' => [
                        ['single', 'Muitas impressões e poucos cliques indicam que deves melhorar…', ['* O título e a descrição do resultado', 'O endereço do servidor', 'A cor dos botões'], 'São o que o utilizador vê antes de decidir clicar.'],
                    ],
                ],
            ],
        ],
    ],
];
