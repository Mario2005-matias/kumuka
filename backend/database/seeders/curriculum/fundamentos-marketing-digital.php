<?php

return [
    'slug' => 'fundamentos-marketing-digital',
    'version' => 1,
    'trail' => [
        'title' => 'Fundamentos de Marketing Digital',
        'summary' => 'Define o teu público, cria conteúdo que funciona nas redes sociais e mede os resultados para melhorar.',
        'description' => "Marketing digital não é publicar todos os dias e esperar. É perceber para quem comunicas, o que essas pessoas precisam e medir o que resulta.\n\nNesta trilha crias a persona de um negócio real (pode ser o teu, da tua família ou de um amigo), planeias um mês de conteúdos e aprendes a ler as métricas que mostram o que está a funcionar.",
        'category' => 'Marketing',
        'core_competence' => 'Marketing Digital',
        'expected_outcome' => 'Um plano de conteúdos de um mês para um negócio real, com persona, mensagens e métricas definidas.',
        'learning_objectives' => [
            'Definir uma persona e uma proposta de valor clara.',
            'Planear conteúdos com objectivos e chamadas à acção.',
            'Ler métricas de alcance, interacção e conversão e decidir o que melhorar.',
        ],
        'target_audience' => 'Estudantes, empreendedores e quem quer trabalhar em comunicação ou vendas.',
        'prerequisites' => [],
    ],
    'modules' => [
        [
            'title' => 'Público e proposta de valor',
            'description' => 'Antes de publicar, percebe com quem falas e porque te devem escolher.',
            'activity' => ['escrita', 'Escreve a persona e a proposta de valor de um negócio.', 'Escolhe um negócio real. Descreve a persona (idade, rotina, problema, onde passa tempo online) e escreve a proposta de valor numa frase.'],
            'lessons' => [
                [
                    'title' => 'Criar uma persona',
                    'summary' => 'Uma descrição concreta do cliente ideal para guiar todas as decisões.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## O que é uma persona

Uma **persona** é a descrição de um cliente típico, baseada em informação real (conversas, comentários, vendas). Ajuda a decidir *o que dizer, onde e como*.

## O que incluir

- **Quem é**: idade, cidade, ocupação.
- **O dia-a-dia**: horários, que redes usa, quanto gasta em dados.
- **O problema** que o teu produto resolve.
- **O que a faz decidir**: preço, rapidez, confiança, opinião de amigos.

## Exemplo resolvido

> **Carla, 24 anos, Talatona.** Trabalha num escritório das 8h às 17h, almoça à secretária e usa Instagram e WhatsApp no intervalo. Quer comer bem sem gastar muito tempo. Decide pelo preço e por fotos reais da comida.

Para uma cozinha que vende marmitas, isto diz tudo: publicar **antes das 11h**, mostrar **fotos reais** e destacar **entrega rápida**.
MD,
                    ],
                    'check' => [
                        ['single', 'Em que se deve basear uma persona?', ['* Em informação real sobre clientes', 'No gosto pessoal do dono do negócio', 'No que fazem os concorrentes estrangeiros'], 'Uma persona inventada sem dados leva a decisões erradas.'],
                    ],
                    'bank' => [
                        ['multiple', 'O que é útil incluir numa persona?', ['* As redes sociais que usa', '* O problema que quer resolver', '* O que a faz decidir uma compra', 'O nome dos teus concorrentes'], 'A persona descreve o cliente, não o mercado.'],
                        ['single', 'Com a persona "Carla" do exemplo, qual é a melhor hora para publicar o menu do dia?', ['* Antes das 11h', 'Às 22h', 'Ao domingo à tarde'], 'A Carla decide o almoço durante a manhã de trabalho.'],
                    ],
                ],
                [
                    'title' => 'Proposta de valor',
                    'summary' => 'Uma frase que explica porque o cliente te deve escolher.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## A fórmula

> **Ajudamos [cliente] a [resultado] sem [problema/obstáculo].**

Exemplos:
- *Ajudamos quem trabalha em Talatona a almoçar comida caseira sem sair do escritório.*
- *Ajudamos estudantes a imprimir trabalhos em 10 minutos sem filas.*

## Três testes para a tua frase

1. Um cliente percebe-a em **5 segundos**?
2. Fala de um **resultado** para o cliente, não da tua empresa?
3. Diz algo que **os concorrentes não dizem**?

Se falhar algum teste, reescreve. É esta frase que vai inspirar as tuas publicações, a tua bio e os teus anúncios.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destas é uma boa proposta de valor?', ['* Ajudamos estudantes a imprimir trabalhos em 10 minutos sem filas', 'Somos a melhor reprografia de Luanda', 'Temos máquinas modernas'], 'Fala do cliente e do resultado concreto, não só da empresa.'],
                    ],
                    'bank' => [
                        ['fill', 'Completa a fórmula: "Ajudamos [cliente] a [___] sem [obstáculo]."', ['resultado', 'resultados'], 'O centro da proposta de valor é o resultado que o cliente obtém.'],
                        ['tf', 'Uma proposta de valor deve ser compreendida em poucos segundos.', true, 'Nas redes sociais tens segundos para captar atenção.'],
                    ],
                ],
                [
                    'title' => 'Posicionamento e concorrência',
                    'summary' => 'Escolher em que te destacas e comunicá-lo de forma consistente.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Não podes ser tudo para todos

**Posicionamento** é o lugar que queres ocupar na cabeça do cliente: o mais rápido, o mais barato, o mais saudável, o mais próximo…

## Como escolher

1. Lista 3 concorrentes e o que cada um destaca.
2. Pergunta a clientes o que valorizam mais.
3. Escolhe **um** atributo em que és realmente bom e que os clientes valorizam.

## Consistência

Depois de escolher, repete-o em tudo: bio, fotos, legendas, respostas a clientes. Se o teu posicionamento é "entrega em 30 minutos", cumpre-o e mostra-o — e não publiques promoções de "o mais barato".
MD,
                    ],
                    'check' => [
                        ['single', 'O que significa posicionamento?', ['* O lugar que queres ocupar na mente do cliente', 'A localização física da loja', 'A posição do logótipo nas imagens'], 'É a ideia principal que o cliente associa à tua marca.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena os passos para escolher um posicionamento.', ['Analisar o que destacam os concorrentes', 'Perguntar aos clientes o que valorizam', 'Escolher um atributo forte e comunicá-lo sempre'], 'Primeiro conheces o mercado e os clientes, depois decides e mantens.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Conteúdo e redes sociais',
            'description' => 'Planeia publicações com objectivo, formatos certos e chamadas à acção claras.',
            'activity' => ['escrita', 'Planeia uma semana de publicações.', 'Para o negócio do módulo anterior, escreve 5 publicações: objectivo, formato, texto (com chamada à acção) e dia/hora.'],
            'lessons' => [
                [
                    'title' => 'O calendário editorial',
                    'summary' => 'Planear com antecedência e equilibrar tipos de conteúdo.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Porque planear

Publicar "quando dá" gera falhas, repetições e mensagens sem objectivo. Um **calendário editorial** define o quê, quando e porquê.

## A regra dos três tipos

Equilibra a semana entre:
- **Educar** — dicas úteis para o cliente (*"3 formas de conservar a marmita"*).
- **Inspirar/criar ligação** — bastidores, equipa, histórias de clientes.
- **Vender** — produto, preço, promoção, como encomendar.

Uma referência comum é cerca de **uma publicação de venda por cada três ou quatro** de valor. Quem só vende perde seguidores.

## Colunas do calendário

Data · Rede · Formato · Objectivo · Texto · Chamada à acção · Estado.
MD,
                    ],
                    'check' => [
                        ['single', 'Porque não é boa ideia publicar só promoções?', ['* Os seguidores perdem interesse se só recebem pedidos de compra', 'As redes proíbem promoções', 'As promoções não aparecem no telemóvel'], 'Conteúdo útil e próximo cria a confiança que depois leva à compra.'],
                    ],
                    'bank' => [
                        ['match', 'Liga cada publicação ao seu tipo.', ['"5 dicas para poupar no almoço"' => 'Educar', '"Conhece a Dona Rosa, a nossa cozinheira"' => 'Inspirar/ligação', '"Marmita do dia: 2 500 Kz, encomenda já"' => 'Vender'], 'Equilibrar os três tipos mantém a audiência interessada.'],
                    ],
                ],
                [
                    'title' => 'Formatos que funcionam',
                    'summary' => 'Vídeo curto, carrossel, stories e estado do WhatsApp: quando usar cada um.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Cada formato tem uma função

- **Vídeo curto (Reels/TikTok)** — alcançar pessoas novas. Começa com algo forte nos primeiros 2 segundos.
- **Carrossel** — ensinar passo a passo; guarda-se e partilha-se muito.
- **Stories** — proximidade e urgência (disponível hoje, bastidores, sondagens).
- **Estado e catálogo do WhatsApp Business** — muito usado em Angola para vender directamente a quem já te conhece.

## Boas práticas

- Fotos **reais** e bem iluminadas valem mais do que imagens de banco.
- Escreve legendas curtas: primeira linha forte, depois detalhes.
- Pensa no **custo dos dados**: vídeos curtos e leves chegam a mais pessoas.
MD,
                    ],
                    'check' => [
                        ['single', 'Que formato é mais indicado para alcançar pessoas que ainda não te seguem?', ['* Vídeo curto', 'Mensagem privada', 'Story para os seguidores actuais'], 'Os algoritmos distribuem vídeos curtos a pessoas fora da tua rede.'],
                    ],
                    'bank' => [
                        ['tf', 'Os primeiros segundos de um vídeo curto são decisivos para que as pessoas continuem a ver.', true, 'Se não captares atenção logo, a pessoa passa ao vídeo seguinte.'],
                        ['single', 'Qual formato é melhor para ensinar um processo passo a passo?', ['* Carrossel', 'Story de 5 segundos', 'Foto de perfil'], 'O carrossel permite um passo por imagem e é muito guardado e partilhado.'],
                    ],
                ],
                [
                    'title' => 'Textos que levam à acção',
                    'summary' => 'Escrever legendas claras com uma chamada à acção concreta.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## A estrutura AIDA

- **Atenção** — uma primeira linha que pare o scroll.
- **Interesse** — um detalhe relevante para a persona.
- **Desejo** — o benefício.
- **Acção** — o que fazer agora.

## Exemplo resolvido

> 🍲 Almoço caseiro sem sair do escritório. *(Atenção)*
> Hoje: funge de bombó com peixe grelhado, feito esta manhã. *(Interesse)*
> Chega quentinho em 30 minutos, por 2 500 Kz. *(Desejo)*
> 👉 Encomenda até às 11h pelo WhatsApp 9XX XXX XXX. *(Acção)*

Uma **chamada à acção** boa é específica: diz *o quê*, *como* e, se possível, *até quando*.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destas é a chamada à acção mais eficaz?', ['* Encomenda até às 11h pelo WhatsApp', 'Gostamos muito de vocês', 'Sigam-nos'], 'Diz claramente o que fazer, por onde e até quando.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena as etapas do AIDA.', ['Atenção', 'Interesse', 'Desejo', 'Acção'], 'O texto leva a pessoa da atenção até à acção.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Medir e melhorar',
            'description' => 'Lê as métricas certas, define objectivos e testa para melhorar.',
            'activity' => ['escrita', 'Analisa os resultados de uma semana.', 'Usa as estatísticas de uma conta (tua ou de um negócio) ou os dados do exemplo. Indica o alcance, a taxa de interacção e uma decisão que tomarias com base nos números.'],
            'lessons' => [
                [
                    'title' => 'As métricas que importam',
                    'summary' => 'Alcance, interacção e conversão — e as métricas de vaidade.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Três níveis

1. **Alcance** — quantas pessoas viram.
2. **Interacção (engagement)** — quantas reagiram: gostos, comentários, partilhas, guardados.
3. **Conversão** — quantas fizeram o que querias: mensagem, encomenda, inscrição.

## Taxa de interacção

> **Taxa de interacção = interacções ÷ alcance × 100**

Uma publicação vista por 2 000 pessoas com 80 interacções tem **4 %**.

## Cuidado com as métricas de vaidade

Seguidores e gostos parecem bons, mas não pagam contas. Para um negócio, a pergunta final é: **quantas conversas e vendas vieram desta publicação?**
MD,
                    ],
                    'check' => [
                        ['fill', 'Uma publicação teve 1 000 de alcance e 50 interacções. Qual é a taxa de interacção, em %? (só o número)', ['5', '5%'], '50 ÷ 1 000 × 100 = 5 %.'],
                    ],
                    'bank' => [
                        ['match', 'Liga cada métrica ao que mede.', ['Alcance' => 'Quantas pessoas viram', 'Interacção' => 'Quantas reagiram', 'Conversão' => 'Quantas fizeram a acção pretendida'], 'Os três níveis contam a história completa de uma publicação.'],
                        ['tf', 'Ter muitos seguidores garante muitas vendas.', false, 'Seguidores é uma métrica de vaidade se não se transformarem em conversas e compras.'],
                    ],
                ],
                [
                    'title' => 'Objectivos SMART para marketing',
                    'summary' => 'Transformar "quero crescer" num objectivo que se pode medir.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## SMART

Um objectivo deve ser **E**specífico, **M**ensurável, **A**tingível, **R**elevante e **T**emporal (em inglês, SMART).

- ❌ "Quero mais clientes."
- ✅ "Receber 40 encomendas pelo WhatsApp em Março, através de publicações no Instagram."

Com um objectivo assim sabes que métrica acompanhar (encomendas pelo WhatsApp) e quando avaliar (fim de Março).
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destes objectivos é SMART?', ['* Receber 40 encomendas pelo WhatsApp em Março', 'Ser famoso nas redes', 'Melhorar o marketing'], 'Tem número, canal e prazo.'],
                    ],
                    'bank' => [
                        ['multiple', 'O que torna um objectivo mensurável e temporal?', ['* Um número', '* Uma data limite', 'Um logótipo novo', 'Mais cores nas publicações'], 'Sem número e prazo não sabes se o atingiste.'],
                    ],
                ],
                [
                    'title' => 'Testar e aprender',
                    'summary' => 'Testes A/B simples para descobrir o que funciona com a tua audiência.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O teste A/B

Publica **duas versões que diferem numa só coisa** e compara o resultado:

- mesma foto, legendas diferentes;
- mesmo texto, hora diferente;
- mesmo produto, vídeo vs. foto.

## Exemplo resolvido

Semana 1: menu publicado às 9h → 18 encomendas.
Semana 2: menu publicado às 11h30 → 7 encomendas.

**Conclusão:** para esta persona, publicar cedo funciona melhor. Mantém as 9h e testa agora outra variável (por exemplo, vídeo em vez de foto).

> Muda **uma coisa de cada vez**; se mudares tudo, não sabes o que causou a diferença.
MD,
                    ],
                    'check' => [
                        ['tf', 'Num teste A/B deves mudar várias coisas ao mesmo tempo para poupar tempo.', false, 'Só mudando uma variável sabes o que provocou a diferença.'],
                    ],
                    'bank' => [
                        ['single', 'No exemplo, que decisão faz sentido?', ['* Manter as 9h e testar outra variável', 'Publicar às 11h30', 'Parar de publicar o menu'], 'Os dados mostraram melhores resultados às 9h.'],
                    ],
                ],
            ],
        ],
    ],
];
