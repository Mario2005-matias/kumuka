<?php

return [
    'slug' => 'financas-pessoais-jovens',
    'version' => 1,
    'trail' => [
        'title' => 'Finanças Pessoais para Jovens',
        'summary' => 'Controla o teu dinheiro, cria um fundo de emergência, usa o crédito com cuidado e protege-te contra burlas.',
        'description' => "Não precisas de ganhar muito para começar a organizar o dinheiro. Precisas de saber para onde ele vai e de algumas regras simples.\n\nNesta trilha registas os teus gastos, montas um orçamento mensal em kwanzas, defines metas de poupança e aprendes a avaliar crédito e produtos financeiros — e a reconhecer esquemas que prometem dinheiro fácil.\n\nEsta trilha é educativa e não substitui aconselhamento financeiro personalizado.",
        'category' => 'Finanças',
        'core_competence' => 'Gestão financeira pessoal',
        'expected_outcome' => 'Um orçamento mensal real, uma meta de poupança com prazo e uma lista de verificação para avaliar crédito e investimentos.',
        'learning_objectives' => [
            'Registar gastos e criar um orçamento mensal.',
            'Construir um fundo de emergência e perceber o custo do crédito.',
            'Definir metas financeiras e reconhecer esquemas fraudulentos.',
        ],
        'target_audience' => 'Estudantes e jovens com o primeiro rendimento (estágio, mesada, negócio próprio).',
        'prerequisites' => [],
    ],
    'modules' => [
        [
            'title' => 'Saber para onde vai o dinheiro',
            'description' => 'Regista gastos, separa necessidades de desejos e monta o teu orçamento.',
            'activity' => ['upload', 'Envia o teu orçamento do mês.', 'Regista os teus gastos de uma semana e monta o orçamento do mês numa folha (papel, Excel ou app). Envia uma foto ou PDF.'],
            'lessons' => [
                [
                    'title' => 'Registar os gastos',
                    'summary' => 'Uma semana de registos mostra mais do que qualquer palpite.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Porque registar

Pequenos gastos repetidos — saldo, lanches, táxi — parecem pouco, mas somam muito no fim do mês.

## Como fazer durante 7 dias

Anota **cada** gasto: data, valor e categoria (transporte, alimentação, comunicação, lazer, família…). Pode ser no bloco de notas do telemóvel, numa folha ou numa app.

## Exemplo resolvido

| Gasto diário | Valor | Em 30 dias |
|---|---|---|
| Lanche | 500 Kz | 15 000 Kz |
| Saldo | 300 Kz | 9 000 Kz |
| Táxi extra | 400 Kz | 12 000 Kz |

**36 000 Kz por mês** em gastos que "não contavam". Saber isto é o primeiro passo para decidir onde cortar.
MD,
                    ],
                    'check' => [
                        ['fill', 'Se gastas 400 Kz por dia em lanches, quanto gastas em 30 dias? (só o número, sem Kz)', ['12000', '12 000', '12.000'], '400 × 30 = 12 000 Kz.'],
                    ],
                    'bank' => [
                        ['tf', 'Os gastos pequenos e diários têm pouco impacto no orçamento mensal.', false, 'Multiplicados por 30 dias, tornam-se uma parte grande do orçamento.'],
                    ],
                ],
                [
                    'title' => 'Necessidades e desejos',
                    'summary' => 'Distinguir o essencial do adiável para decidir com calma.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Duas perguntas

- **Necessidade** — sem isto, a tua vida, estudo ou trabalho fica comprometido? (renda, transporte para a escola, alimentação básica, propinas)
- **Desejo** — é bom ter, mas podes adiar ou escolher uma versão mais barata. (roupa nova de marca, telemóvel novo, saídas)

## A regra das 24 horas

Para compras de desejo acima de um valor (por exemplo 10 000 Kz), **espera 24 horas** antes de comprar. Muitas vezes a vontade passa — e o dinheiro fica.
MD,
                    ],
                    'check' => [
                        ['match', 'Classifica cada gasto.', ['Propinas do curso' => 'Necessidade', 'Ténis de marca novos' => 'Desejo', 'Transporte para o estágio' => 'Necessidade'], 'Necessidades mantêm a tua vida, estudo ou trabalho a funcionar.'],
                    ],
                    'bank' => [
                        ['single', 'O que propõe a regra das 24 horas?', ['* Esperar um dia antes de compras de desejo maiores', 'Pagar todas as contas em 24 horas', 'Gastar o salário no primeiro dia'], 'A espera ajuda a separar impulso de necessidade.'],
                    ],
                ],
                [
                    'title' => 'O teu orçamento mensal',
                    'summary' => 'Uma distribuição simples do rendimento: necessidades, desejos e poupança.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## A regra 50/30/20 (como ponto de partida)

- **50 %** para necessidades;
- **30 %** para desejos;
- **20 %** para poupança e objectivos.

Não é uma lei: com um rendimento baixo, as necessidades podem ocupar 70 % ou mais. O importante é **decidir antes de gastar** e poupar alguma coisa, mesmo pouca.

## Exemplo resolvido

Estágio de **60 000 Kz**:
- Necessidades (transporte, comunicação, contributo em casa): 36 000 Kz (60 %)
- Desejos: 12 000 Kz (20 %)
- Poupança: 12 000 Kz (20 %)

> Paga-te primeiro: transfere a poupança **no dia em que recebes**, não "o que sobrar no fim do mês".
MD,
                    ],
                    'check' => [
                        ['single', 'Quando é melhor separar o dinheiro da poupança?', ['* No dia em que recebes', 'No fim do mês, se sobrar', 'Só quando houver uma emergência'], 'Se esperas pelo fim do mês, normalmente não sobra nada.'],
                    ],
                    'bank' => [
                        ['fill', 'Pela regra 50/30/20, quanto vai para poupança num rendimento de 50 000 Kz? (só o número)', ['10000', '10 000', '10.000'], '20 % de 50 000 = 10 000 Kz.'],
                        ['tf', 'A regra 50/30/20 tem de ser seguida exactamente por todas as pessoas.', false, 'É um ponto de partida; ajusta-se ao rendimento e à realidade de cada um.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Poupança e crédito',
            'description' => 'Constrói um fundo de emergência e percebe quanto custa pedir dinheiro emprestado.',
            'activity' => ['escrita', 'Calcula o teu fundo de emergência.', 'Indica as tuas despesas essenciais mensais, o valor do fundo de emergência para 3 meses e quanto podes poupar por mês para o atingir. Em quantos meses lá chegas?'],
            'lessons' => [
                [
                    'title' => 'O fundo de emergência',
                    'summary' => 'Dinheiro guardado para imprevistos, para não teres de pedir emprestado.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Para que serve

Doença, telemóvel avariado, perder o rendimento: imprevistos acontecem. Um **fundo de emergência** evita que tenhas de pedir emprestado (muitas vezes com juros altos) ou vender coisas à pressa.

## Quanto juntar

Uma referência comum é **3 a 6 meses de despesas essenciais**. Começa por uma meta pequena — por exemplo, um mês.

## Onde guardar

Num sítio **seguro e de acesso rápido**, separado da conta do dia-a-dia: uma conta poupança ou um depósito que possas mobilizar depressa. Não é dinheiro para investir em coisas arriscadas.
MD,
                    ],
                    'check' => [
                        ['fill', 'As tuas despesas essenciais são 40 000 Kz/mês. Quanto deve ter um fundo de emergência de 3 meses? (só o número)', ['120000', '120 000', '120.000'], '40 000 × 3 = 120 000 Kz.'],
                    ],
                    'bank' => [
                        ['single', 'Onde deve estar o fundo de emergência?', ['* Num sítio seguro e de acesso rápido, separado do dia-a-dia', 'Investido num esquema com grandes retornos', 'Emprestado a amigos'], 'O fundo tem de estar disponível e seguro quando precisares.'],
                    ],
                ],
                [
                    'title' => 'Como funcionam os juros',
                    'summary' => 'Taxa, prazo e custo total: o que olhar antes de pedir crédito.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## O preço do dinheiro

Quando pedes emprestado, pagas **juros** — o preço de usar dinheiro que não é teu. Quanto **maior a taxa** e **mais longo o prazo**, mais pagas no total.

## Olha sempre para o custo total

> **Custo total = soma de todas as prestações + comissões**

## Exemplo resolvido

Pedes **100 000 Kz** e pagas **12 prestações de 10 000 Kz**.
Total pago: 120 000 Kz. **O empréstimo custou 20 000 Kz.**

Antes de aceitar, pergunta por escrito: taxa anual, comissões, seguros obrigatórios e o que acontece se atrasares uma prestação.
MD,
                    ],
                    'check' => [
                        ['fill', 'Pedes 50 000 Kz e pagas 6 prestações de 10 000 Kz. Quanto custou o crédito? (só o número)', ['10000', '10 000', '10.000'], '6 × 10 000 = 60 000; 60 000 − 50 000 = 10 000 Kz.'],
                    ],
                    'bank' => [
                        ['multiple', 'O que deves perguntar antes de aceitar um crédito?', ['* A taxa de juro anual', '* As comissões', '* O que acontece se atrasar', 'A cor do cartão'], 'Estes elementos determinam o custo real e o risco.'],
                        ['tf', 'Um prazo mais longo com a mesma taxa faz com que pagues mais juros no total.', true, 'Pagas juros durante mais tempo, mesmo que cada prestação seja menor.'],
                    ],
                ],
                [
                    'title' => 'Dívidas boas e más',
                    'summary' => 'Quando o crédito pode ajudar e quando é uma armadilha.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## Uma pergunta-chave

> Isto que vou comprar vai **aumentar o meu rendimento ou poupar-me dinheiro** no futuro?

- Formação que aumenta a empregabilidade, ou um equipamento para um negócio que já vende, **podem** justificar crédito.
- Roupa, festas ou o telemóvel mais recente a crédito são dívidas que **só custam**.

## Sinais de alerta

- Pedir um empréstimo para pagar outro.
- Prestações acima de **30 % do rendimento**.
- Não saber quanto deves no total.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destes créditos tem mais probabilidade de ser útil?', ['* Comprar uma máquina para um negócio que já tem clientes', 'Pagar uma festa de aniversário', 'Trocar de telemóvel todos os anos'], 'O crédito pode fazer sentido quando ajuda a gerar rendimento.'],
                    ],
                    'bank' => [
                        ['tf', 'Pedir um empréstimo para pagar outro empréstimo é um sinal de alerta.', true, 'Indica que as dívidas estão acima da capacidade de pagamento.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Metas e protecção',
            'description' => 'Define metas financeiras, percebe a inflação e protege-te de esquemas.',
            'activity' => ['escrita', 'Define uma meta financeira SMART.', 'Escreve uma meta (valor, prazo e para quê), quanto vais poupar por mês e onde vais guardar o dinheiro.'],
            'lessons' => [
                [
                    'title' => 'Metas financeiras',
                    'summary' => 'Transformar desejos em planos com valor, prazo e passos mensais.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## De "quero um portátil" a um plano

1. **O quê e quanto** — portátil para o curso: 300 000 Kz.
2. **Até quando** — 10 meses.
3. **Quanto por mês** — 300 000 ÷ 10 = **30 000 Kz**.
4. **Onde guardar** — numa conta separada.

Se 30 000 Kz por mês é demasiado, ajusta: alarga o prazo, procura uma opção mais barata ou um rendimento extra.
MD,
                    ],
                    'check' => [
                        ['fill', 'Queres juntar 120 000 Kz em 8 meses. Quanto deves poupar por mês? (só o número)', ['15000', '15 000', '15.000'], '120 000 ÷ 8 = 15 000 Kz.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena os passos de uma meta financeira.', ['Definir o objectivo e o valor', 'Escolher o prazo', 'Calcular quanto poupar por mês', 'Escolher onde guardar'], 'Com valor e prazo consegues calcular o esforço mensal.'],
                    ],
                ],
                [
                    'title' => 'Inflação: o dinheiro parado perde valor',
                    'summary' => 'Porque os preços sobem e o que isso significa para as tuas poupanças.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## O que é

**Inflação** é a subida geral dos preços. Se a inflação for de 20 % num ano, o que custava 10 000 Kz passa a custar cerca de 12 000 Kz — com o mesmo dinheiro compras menos.

## O que fazer

- Para objectivos de **curto prazo** e para o fundo de emergência, a prioridade é a **segurança**, não o rendimento.
- Para objectivos de **médio e longo prazo**, informa-te sobre produtos de poupança regulados (por exemplo, depósitos a prazo em bancos) e compara a taxa com a inflação.
- Investir em **ti** (formação, competências) também protege o teu rendimento futuro.

> Antes de qualquer produto financeiro, confirma que a entidade está autorizada pelas autoridades de supervisão e lê as condições.
MD,
                    ],
                    'check' => [
                        ['tf', 'Com inflação, o mesmo valor em kwanzas compra menos coisas ao longo do tempo.', true, 'Os preços sobem e o poder de compra do dinheiro parado diminui.'],
                    ],
                    'bank' => [
                        ['single', 'Para o fundo de emergência, qual é a prioridade?', ['* Segurança e acesso rápido', 'O retorno mais alto possível', 'Investir em criptomoedas'], 'O fundo tem de estar lá quando precisares.'],
                    ],
                ],
                [
                    'title' => 'Esquemas e burlas',
                    'summary' => 'Pirâmides, "investimentos garantidos" e como dizer não.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Sinais de esquema

- **Retornos garantidos e muito altos** ("duplica o teu dinheiro em 30 dias").
- Ganhas sobretudo por **recrutar outras pessoas** (pirâmide).
- Pressão para entrar **já** e pedidos de segredo.
- Pagamentos para contas pessoais ou em criptomoedas, sem empresa identificável.

## Regra de ouro

> Se parece bom demais para ser verdade, **é**.

Os primeiros participantes podem receber — pagos com o dinheiro dos novos. Quando deixam de entrar pessoas, o esquema cai e a maioria perde tudo.
MD,
                    ],
                    'check' => [
                        ['single', 'Um amigo diz que duplicas o dinheiro em 30 dias se entrares e trouxeres mais 3 pessoas. O que é provável?', ['* Um esquema em pirâmide', 'Um depósito a prazo', 'Uma conta poupança'], 'Retornos garantidos e altos que dependem de recrutar pessoas são típicos de pirâmides.'],
                    ],
                    'bank' => [
                        ['multiple', 'Quais são sinais de esquema fraudulento?', ['* Retorno alto garantido', '* Ganhar por recrutar pessoas', '* Pressão para decidir no mesmo dia', 'Contrato escrito com entidade autorizada'], 'Entidades autorizadas e contratos claros são sinais de seriedade, não de esquema.'],
                    ],
                ],
            ],
        ],
    ],
];
