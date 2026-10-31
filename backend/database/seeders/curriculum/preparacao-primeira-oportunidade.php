<?php

return [
    'slug' => 'preparacao-primeira-oportunidade',
    'version' => 1,
    'trail' => [
        'title' => 'Encontrar a primeira oportunidade',
        'summary' => 'Descobre onde estão as vagas, cria contactos profissionais e organiza a tua procura para conseguir o primeiro estágio ou emprego.',
        'description' => "Ter um bom CV não chega: é preciso saber onde procurar, como chegar às pessoas certas e como manter a procura organizada sem desanimar.\n\nEsta trilha complementa \"Primeiro emprego: do CV à entrevista\". Vais mapear os canais de recrutamento em Angola, montar um perfil profissional online, enviar mensagens de contacto que obtêm resposta e criar um plano semanal de candidaturas.",
        'category' => 'Carreira',
        'core_competence' => 'Procura de emprego',
        'expected_outcome' => 'Um plano de procura com 10 oportunidades identificadas, um perfil LinkedIn completo e três contactos profissionais iniciados.',
        'learning_objectives' => [
            'Identificar canais de recrutamento fiáveis e reconhecer ofertas fraudulentas.',
            'Criar um perfil profissional online e iniciar conversas com profissionais da área.',
            'Organizar candidaturas, fazer seguimento e manter a motivação.',
        ],
        'target_audience' => 'Finalistas e recém-formados à procura do primeiro estágio, trainee ou emprego.',
        'prerequisites' => ['Ter um CV de uma página (podes criá-lo na trilha "Primeiro emprego: do CV à entrevista").'],
    ],
    'modules' => [
        [
            'title' => 'Onde estão as oportunidades',
            'description' => 'Mapeia os canais onde as empresas recrutam e aprende a evitar burlas.',
            'activity' => ['escrita', 'Faz o teu mapa de 10 oportunidades.', 'Lista 10 vagas ou empresas que te interessam. Para cada uma indica o canal onde a encontraste (portal, site da empresa, contacto, feira) e o prazo, se existir.'],
            'lessons' => [
                [
                    'title' => 'Os canais de recrutamento',
                    'summary' => 'Portais, sites de empresas, universidades, feiras e o mercado escondido.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Cinco sítios onde procurar

1. **Portais de emprego e o LinkedIn** — reúnem muitas vagas; usa filtros por cidade e "estágio" ou "júnior".
2. **Páginas de carreira das empresas** — bancos, operadoras de telecomunicações e grandes grupos publicam programas de estágio e trainee nos seus sites, muitas vezes com datas fixas todos os anos.
3. **A tua universidade ou instituto** — gabinetes de estágios, professores e associações de estudantes recebem pedidos directos das empresas.
4. **Feiras de emprego e eventos** — permitem falar com recrutadores pessoalmente. Leva CV impresso e uma apresentação de 30 segundos.
5. **O "mercado escondido"** — muitas vagas nunca são publicadas: são preenchidas por indicação. É aqui que entram os contactos (módulo 2).

> Regra prática: não dependas de um só canal. Combina pelo menos três.
MD,
                    ],
                    'check' => [
                        ['single', 'O que é o "mercado escondido" de emprego?', ['* Vagas preenchidas por indicação, sem anúncio público', 'Vagas para trabalhar fora do país', 'Vagas que pedem muita experiência'], 'Muitas empresas preenchem vagas através de contactos e recomendações antes de publicar um anúncio.'],
                    ],
                    'bank' => [
                        ['multiple', 'Quais destes são canais de recrutamento legítimos?', ['* Página de carreiras da empresa', '* Gabinete de estágios da universidade', '* Feira de emprego', 'Mensagem anónima a pedir dinheiro para "garantir" a vaga'], 'Pedir pagamento para garantir uma vaga é sinal de burla.'],
                        ['tf', 'Usar apenas um portal de emprego é suficiente para encontrar a maioria das oportunidades.', false, 'Cada canal mostra só uma parte do mercado; combinar canais aumenta muito as hipóteses.'],
                    ],
                ],
                [
                    'title' => 'Ler um anúncio como um recrutador',
                    'summary' => 'Separar requisitos obrigatórios de desejáveis e decidir se vale a pena candidatar.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que procurar num anúncio

- **Função e responsabilidades** — o que vais fazer no dia-a-dia.
- **Requisitos obrigatórios** — normalmente formação e uma ou duas competências-chave.
- **Requisitos desejáveis** — "preferencialmente", "é uma vantagem". Não são eliminatórios.
- **Como candidatar e prazo** — formato do CV, documentos, email ou formulário.

## Exemplo resolvido

> *Estágio em Contabilidade — Luanda. Requisitos: frequência do último ano de Contabilidade ou Gestão; Excel intermédio. Preferencial: experiência com software de facturação.*

Se estás no último ano de Gestão e sabes Excel, **cumpres os obrigatórios**. Não conhecer o software de facturação não te impede — menciona que aprendes depressa e dá um exemplo.
MD,
                    ],
                    'check' => [
                        ['single', 'Num anúncio, "preferencialmente com experiência em vendas" é um requisito…', ['* Desejável, não eliminatório', 'Obrigatório', 'Ilegal'], 'Palavras como "preferencialmente" ou "é uma vantagem" indicam requisitos desejáveis.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena a leitura de um anúncio.', ['Ver a função e as responsabilidades', 'Separar requisitos obrigatórios e desejáveis', 'Confirmar como candidatar e o prazo'], 'Primeiro percebes se a função te interessa, depois se és elegível e por fim como e até quando te candidatas.'],
                        ['tf', 'Se cumpres os requisitos obrigatórios mas não todos os desejáveis, deves candidatar-te.', true, 'Os desejáveis servem para desempatar; raramente alguém os cumpre todos.'],
                    ],
                ],
                [
                    'title' => 'Reconhecer ofertas falsas',
                    'summary' => 'Sinais de alerta de burlas de emprego e o que fazer.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Sinais de alerta

- Pedem **dinheiro** para formação, inscrição, "taxa de processamento" ou para "garantir" a vaga.
- Salário muito acima do normal para pouca exigência.
- Contacto só por WhatsApp, sem nome de empresa verificável nem email com domínio próprio.
- Pressa: "responde hoje ou perdes a vaga".
- Pedem dados bancários ou cópia do BI antes de qualquer entrevista.

## O que fazer

1. Pesquisa o nome da empresa e do recrutador.
2. Confirma a vaga na página oficial da empresa ou ligando para o número publicado no site.
3. **Nunca pagues** para conseguir um emprego. Empresas sérias não cobram aos candidatos.
MD,
                    ],
                    'check' => [
                        ['single', 'Uma "empresa" pede 5 000 Kz para reservar a tua vaga de estágio. O que fazes?', ['* Não pago e confirmo a vaga nos canais oficiais da empresa', 'Pago, porque é pouco dinheiro', 'Envio o meu BI para acelerar'], 'Pedir dinheiro aos candidatos é o sinal mais claro de burla.'],
                    ],
                    'bank' => [
                        ['multiple', 'Quais são sinais de alerta numa oferta de emprego?', ['* Pedido de pagamento', '* Pressão para responder no próprio dia', '* Contacto só por WhatsApp, sem empresa verificável', 'Anúncio publicado na página oficial da empresa'], 'Uma vaga na página oficial é um bom sinal; as outras são típicas de burlas.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Contactos e presença profissional',
            'description' => 'Cria um perfil profissional online e começa conversas com pessoas da tua área.',
            'activity' => ['link', 'Partilha o teu perfil profissional.', 'Completa o teu perfil no LinkedIn (foto, título, resumo, formação e um projecto) e cola aqui o link público.'],
            'lessons' => [
                [
                    'title' => 'Um perfil LinkedIn que te representa',
                    'summary' => 'Foto, título, resumo e projectos: o que um recrutador vê primeiro.',
                    'minutes' => 9,
                    'blocks' => [
                        <<<'MD'
## As quatro partes que mais contam

1. **Foto** — rosto bem iluminado, fundo simples, roupa adequada à tua área.
2. **Título** — não escrevas só "Estudante". Diz a tua área e o que procuras: *"Finalista de Engenharia Informática | Desenvolvimento web | À procura de estágio em Luanda"*.
3. **Sobre** — 3 a 5 frases: o que estudas, duas competências com provas e o tipo de oportunidade que procuras.
4. **Projectos e experiência** — trabalhos académicos, voluntariado, negócios familiares. Usa a fórmula *verbo + tarefa + resultado*.

> Activa a opção "Disponível para trabalhar" (Open to work) com os cargos e cidades que procuras.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destes títulos de perfil é mais eficaz?', ['* Finalista de Gestão | Análise de dados em Excel | À procura de estágio', 'Estudante', 'Pessoa trabalhadora e dedicada'], 'Um bom título diz a área, uma competência e o que procuras — ajuda-te a aparecer nas pesquisas dos recrutadores.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena o que um recrutador costuma ver no teu perfil.', ['Foto e título', 'Secção "Sobre"', 'Experiência e projectos'], 'A foto e o título aparecem logo nos resultados de pesquisa; o resto só é lido se esses chamarem a atenção.'],
                        ['tf', 'Voluntariado e projectos académicos podem entrar no perfil profissional.', true, 'Mostram competências reais, sobretudo no início da carreira.'],
                    ],
                ],
                [
                    'title' => 'Mensagens de contacto que obtêm resposta',
                    'summary' => 'Como escrever a uma pessoa que não conheces de forma curta e respeitosa.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## A estrutura em quatro frases

1. **Quem és** — numa linha.
2. **Porquê essa pessoa** — algo concreto que viste no perfil ou no trabalho dela.
3. **Um pedido pequeno** — 15 minutos de conversa ou um conselho, **não** um emprego.
4. **Agradecimento** — sem pressão.

## Exemplo resolvido

> Olá, Sra. Dra. Ana. Sou finalista de Marketing no ISCAC. Vi a campanha de Natal que coordenou na operadora e gostei muito da forma como usaram vídeos curtos. Teria 15 minutos esta semana para me dar um conselho sobre como começar em marketing digital? Agradeço desde já.

Repara: não pede emprego. Pede uma conversa — que é muito mais fácil de aceitar e, muitas vezes, é o caminho para uma indicação.
MD,
                    ],
                    'check' => [
                        ['single', 'Numa primeira mensagem a um profissional que não conheces, o melhor pedido é…', ['* Uma conversa curta ou um conselho', 'Um emprego na empresa dele', 'Que reencaminhe o teu CV a toda a equipa'], 'Pedidos pequenos são mais fáceis de aceitar e criam uma relação.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena as partes de uma mensagem de contacto.', ['Apresentar-te numa linha', 'Dizer porque escolheste essa pessoa', 'Fazer um pedido pequeno', 'Agradecer'], 'Esta ordem responde às perguntas que a pessoa faz ao ler: quem és, porquê eu e o que queres.'],
                        ['single', 'Porque deves mencionar algo concreto do trabalho da pessoa?', ['* Mostra que a mensagem não é genérica e aumenta a probabilidade de resposta', 'Para parecer mais formal', 'Porque é obrigatório no LinkedIn'], 'As pessoas respondem mais quando percebem que a mensagem foi escrita para elas.'],
                    ],
                ],
                [
                    'title' => 'Entrevistas informativas',
                    'summary' => 'Conversas curtas para aprender sobre uma profissão e ser lembrado.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que é

Uma **entrevista informativa** é uma conversa de 15 a 20 minutos em que **tu fazes as perguntas** a alguém que trabalha na área que te interessa.

## Perguntas que funcionam

- Como é um dia normal no seu trabalho?
- Que competências fazem mais diferença nos primeiros meses?
- O que faria se estivesse hoje no meu lugar?
- Há mais alguém com quem me aconselharia a falar?

## Depois da conversa

Envia uma mensagem de agradecimento **no mesmo dia** e, semanas depois, conta o que fizeste com o conselho. É assim que te lembram quando surge uma vaga.
MD,
                    ],
                    'check' => [
                        ['tf', 'Numa entrevista informativa és tu que fazes a maioria das perguntas.', true, 'O objectivo é aprender sobre a profissão; quem conduz a conversa és tu.'],
                    ],
                    'bank' => [
                        ['single', 'Quando deves enviar o agradecimento depois da conversa?', ['* No mesmo dia', 'Só se conseguires uma vaga', 'Um mês depois'], 'Um agradecimento rápido mostra profissionalismo e reforça a boa impressão.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Organizar a procura e manter o ritmo',
            'description' => 'Transforma a procura num plano semanal, faz seguimento e lida com as respostas negativas.',
            'activity' => ['upload', 'Envia a tua folha de acompanhamento.', 'Cria uma folha (Excel ou Google Sheets) com pelo menos 5 candidaturas: empresa, função, data, estado e próximo passo. Exporta em PDF ou imagem e envia.'],
            'lessons' => [
                [
                    'title' => 'Um plano semanal de procura',
                    'summary' => 'Metas pequenas e regulares em vez de dias inteiros de candidaturas.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Metas de actividade, não de resultado

Não controlas se uma empresa te chama. Controlas **o que fazes**. Define metas semanais como:

- 3 candidaturas bem adaptadas;
- 2 mensagens a profissionais da área;
- 1 hora a melhorar uma competência (uma trilha da KUMUKA, por exemplo).

## Exemplo de semana

| Dia | Actividade |
|---|---|
| Segunda | Procurar e escolher 5 vagas |
| Terça e quarta | Adaptar CV e candidatar a 3 |
| Quinta | Enviar 2 mensagens de contacto |
| Sexta | Rever a folha de candidaturas e fazer seguimento |

Blocos curtos e regulares rendem mais do que um dia inteiro de candidaturas copiadas.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é um exemplo de meta de actividade?', ['* Enviar 3 candidaturas adaptadas por semana', 'Ser chamado para 3 entrevistas', 'Receber uma proposta este mês'], 'As metas de actividade dependem de ti; as de resultado dependem também das empresas.'],
                    ],
                    'bank' => [
                        ['tf', 'Enviar muitas candidaturas iguais num só dia é mais eficaz do que poucas candidaturas adaptadas ao longo da semana.', false, 'Candidaturas adaptadas têm taxas de resposta muito maiores.'],
                    ],
                ],
                [
                    'title' => 'Registar candidaturas e fazer seguimento',
                    'summary' => 'Uma folha simples e mensagens de seguimento no momento certo.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## A folha de acompanhamento

Cria colunas: **Empresa · Função · Data · Canal · Estado · Próximo passo · Data do próximo passo**.

Estados possíveis: *Por enviar → Enviada → Entrevista → Proposta → Fechada*.

## Seguimento

Se não houver resposta **10 a 14 dias** depois do prazo, envia uma mensagem curta:

> Bom dia. Candidatei-me ao estágio em Contabilidade no dia 3 de Março e continuo muito interessado. Gostaria de saber se o processo já tem novidades. Obrigado pela atenção.

Uma mensagem educada mostra interesse. Mais do que duas mensagens sem resposta é insistência — passa à próxima.
MD,
                    ],
                    'check' => [
                        ['single', 'Quanto tempo esperar, em média, antes de fazer seguimento a uma candidatura sem resposta?', ['* 10 a 14 dias após o prazo', 'No dia seguinte ao envio', 'Nunca se deve fazer seguimento'], 'Dar tempo à empresa e depois mostrar interesse, sem insistir em excesso.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena os estados de uma candidatura.', ['Por enviar', 'Enviada', 'Entrevista', 'Proposta'], 'A folha mostra em que fase está cada candidatura e o que fazer a seguir.'],
                    ],
                ],
                [
                    'title' => 'Lidar com rejeições',
                    'summary' => 'Transformar um "não" em informação útil e manter a motivação.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Um "não" é normal

Mesmo bons candidatos recebem muitas respostas negativas — muitas vezes por razões que não controlam (número de vagas, candidatos internos, orçamento).

## Três passos depois de um "não"

1. **Agradece** e pergunta, com educação, se há algo que possas melhorar.
2. **Regista** o que aprendeste: em que fase ficaste? Faltou alguma competência?
3. **Ajusta uma coisa** no processo seguinte (o CV, a preparação para entrevista, o tipo de vagas).

> Celebra as metas de actividade cumpridas — elas são o que, com tempo, gera resultados.
MD,
                    ],
                    'check' => [
                        ['single', 'Depois de uma resposta negativa, o que é mais útil fazer?', ['* Agradecer, pedir feedback e ajustar o próximo passo', 'Deixar de procurar durante um mês', 'Responder a criticar a decisão'], 'Cada processo dá informação para melhorar o seguinte.'],
                    ],
                    'bank' => [
                        ['tf', 'Ser rejeitado significa sempre que o candidato não tinha qualidade.', false, 'Muitas decisões dependem de factores externos ao candidato.'],
                    ],
                ],
            ],
        ],
    ],
];
