<?php

return [
    'slug' => 'excel-zero-avancado',
    'version' => 1,
    'trail' => [
        'title' => 'Excel do Zero ao Avançado',
        'summary' => 'Domina fórmulas, as funções mais pedidas no trabalho, tabelas dinâmicas e gráficos para criar um dashboard.',
        'description' => "O Excel aparece em quase todos os anúncios de estágio em gestão, finanças, logística e administração. Nesta trilha aprendes o que realmente se usa no trabalho.\n\nComeças pelas fórmulas e referências, passas pelas funções essenciais (SOMA, SE, PROCV, SOMA.SE…) e terminas com tabelas dinâmicas e um dashboard de vendas. Os nomes das funções seguem o Excel em português de Portugal, o mais comum em Angola.",
        'category' => 'Dados',
        'core_competence' => 'Excel',
        'expected_outcome' => 'Um dashboard de vendas em Excel com fórmulas, tabela dinâmica e gráficos.',
        'learning_objectives' => [
            'Escrever fórmulas com referências relativas e absolutas.',
            'Usar SE, PROCV/PROCX, SOMA.SE e CONTAR.SE em casos reais.',
            'Resumir dados com tabelas dinâmicas e apresentá-los em gráficos.',
        ],
        'target_audience' => 'Estudantes e jovens profissionais que precisam de Excel no estágio ou no trabalho.',
        'prerequisites' => ['Acesso ao Excel, LibreOffice Calc ou Google Sheets.'],
    ],
    'modules' => [
        [
            'title' => 'Fundamentos das folhas de cálculo',
            'description' => 'Células, fórmulas e referências: a base de tudo.',
            'activity' => ['upload', 'Envia a tua folha de despesas com fórmulas.', 'Cria uma folha com 10 despesas (descrição, quantidade, preço unitário), calcula o total de cada linha com fórmulas e o total geral, incluindo IVA numa célula fixa. Envia o ficheiro.'],
            'lessons' => [
                [
                    'title' => 'Células, linhas e colunas',
                    'summary' => 'Como se organiza uma folha e boas práticas para tabelas.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## A grelha

- **Colunas** têm letras (A, B, C…); **linhas** têm números (1, 2, 3…).
- Cada **célula** tem um endereço: `B3` é a coluna B, linha 3.
- Um **intervalo** junta várias células: `A2:A10`.

## Boas práticas para tabelas

1. **Uma linha de cabeçalhos** no topo, com nomes curtos: Data, Produto, Quantidade, Preço.
2. **Um registo por linha** (uma venda, uma despesa).
3. **Sem linhas em branco** no meio dos dados.
4. **Um tipo de dado por coluna** — só números na coluna Preço, só datas na coluna Data.

Tabelas assim funcionam com filtros, fórmulas e tabelas dinâmicas sem dar erros.
MD,
                    ],
                    'check' => [
                        ['single', 'O que representa a célula D7?', ['* Coluna D, linha 7', 'Linha D, coluna 7', 'O intervalo de D a 7'], 'Primeiro a letra da coluna, depois o número da linha.'],
                    ],
                    'bank' => [
                        ['multiple', 'Quais são boas práticas para uma tabela de dados?', ['* Uma linha de cabeçalhos', '* Um registo por linha', '* Sem linhas em branco no meio', 'Juntar datas e preços na mesma coluna'], 'Misturar tipos de dados numa coluna impede cálculos e filtros.'],
                    ],
                ],
                [
                    'title' => 'Fórmulas e operações',
                    'summary' => 'Escrever cálculos que se actualizam sozinhos.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Começa sempre com =

```excel
=B2*C2         quantidade × preço
=D2+D3+D4      soma de três células
=D10*14%       14% do total
=(B2+C2)/2     média de dois valores
```

Operadores: `+` somar, `-` subtrair, `*` multiplicar, `/` dividir, `^` potência.

## Escreve referências, não números

❌ `=3*1500`
✅ `=B2*C2`

Se o preço em C2 mudar, a segunda fórmula actualiza-se sozinha. É isto que torna a folha de cálculo poderosa.

> Para copiar uma fórmula para as linhas de baixo, arrasta o pequeno quadrado no canto inferior direito da célula.
MD,
                    ],
                    'check' => [
                        ['single', 'Porque é melhor escrever =B2*C2 do que =3*1500?', ['* O resultado actualiza-se quando os valores mudam', 'Ocupa menos espaço', 'O Excel não aceita números em fórmulas'], 'Fórmulas com referências reagem a mudanças nos dados.'],
                    ],
                    'bank' => [
                        ['fill', 'Que símbolo deve começar qualquer fórmula?', ['='], 'Sem o = o Excel trata o conteúdo como texto.'],
                        ['match', 'Liga cada operador à operação.', ['*' => 'Multiplicar', '/' => 'Dividir', '^' => 'Potência'], 'São os operadores aritméticos básicos.'],
                    ],
                ],
                [
                    'title' => 'Referências relativas e absolutas',
                    'summary' => 'O símbolo $ e porque as fórmulas "se estragam" ao copiar.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## O problema

Tens o IVA (14 %) na célula `F1` e calculas `=D2*F1`. Copias para baixo e a linha 3 fica `=D3*F2` — mas `F2` está vazia! A referência **deslocou-se**.

## A solução: referência absoluta

```excel
=D2*$F$1
```

O `$` **fixa** a coluna e a linha. Ao copiar, `D2` muda para `D3`, `D4`… mas `$F$1` fica sempre igual.

- `F1` — relativa (muda ao copiar)
- `$F$1` — absoluta (nunca muda)
- `$F1` ou `F$1` — mista (fixa só a coluna ou só a linha)

> Atalho: depois de escrever `F1`, carrega em **F4** para alternar entre os tipos.
MD,
                    ],
                    'check' => [
                        ['single', 'Que referência fica igual quando copias a fórmula para outras células?', ['* $F$1', 'F1', 'F$'], 'O $ antes da coluna e da linha fixa ambas.'],
                    ],
                    'bank' => [
                        ['single', 'Copias =B2*C2 da linha 2 para a linha 5. Que fórmula aparece?', ['* =B5*C5', '=B2*C2', '=B5*C2'], 'Referências relativas acompanham a nova posição.'],
                        ['fill', 'Que tecla alterna entre referência relativa e absoluta enquanto escreves? (ex.: F1)', ['F4', 'f4'], 'O F4 acrescenta e remove os $ na referência.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Funções essenciais',
            'description' => 'As funções que aparecem em quase todos os testes de Excel em entrevistas.',
            'activity' => ['upload', 'Envia a folha de vendas com funções.', 'Numa tabela de 20 vendas (vendedor, produto, região, valor), calcula: total por vendedor (SOMA.SE), número de vendas acima de 50 000 Kz (CONTAR.SE), uma coluna "Meta atingida?" (SE) e o preço de cada produto a partir de outra tabela (PROCV ou PROCX).'],
            'lessons' => [
                [
                    'title' => 'SOMA, MÉDIA, MÁXIMO e MÍNIMO',
                    'summary' => 'Resumir uma coluna de números com uma função.',
                    'minutes' => 6,
                    'blocks' => [
                        <<<'MD'
## A estrutura de uma função

```excel
=NOME(argumentos)
=SOMA(D2:D21)
```

## As quatro primeiras

```excel
=SOMA(D2:D21)      total de vendas
=MÉDIA(D2:D21)     venda média
=MÁXIMO(D2:D21)    maior venda
=MÍNIMO(D2:D21)    menor venda
=CONTAR(D2:D21)    quantas células têm números
```

> No Excel em português de Portugal os argumentos separam-se com **ponto e vírgula**: `=SE(A1>10;"Sim";"Não")`. No Google Sheets em inglês usa-se vírgula.
MD,
                    ],
                    'check' => [
                        ['match', 'Liga cada função ao que calcula.', ['SOMA' => 'Total', 'MÉDIA' => 'Valor médio', 'MÁXIMO' => 'Maior valor'], 'São as funções de resumo mais usadas.'],
                    ],
                    'bank' => [
                        ['single', 'No Excel em português de Portugal, que separador usas entre argumentos?', ['* Ponto e vírgula (;)', 'Vírgula (,)', 'Dois pontos (:)'], 'Os dois pontos indicam um intervalo; a vírgula é usada nas versões em inglês.'],
                    ],
                ],
                [
                    'title' => 'Decisões com SE',
                    'summary' => 'Mostrar resultados diferentes conforme uma condição.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## A estrutura

```excel
=SE(condição; valor_se_verdadeiro; valor_se_falso)
```

## Exemplos

```excel
=SE(D2>=50000; "Meta atingida"; "Abaixo da meta")
=SE(C2="Luanda"; D2*5%; 0)        comissão só em Luanda
=SE(E2>=10; "Aprovado"; "Reprovado")
```

## Várias condições

```excel
=SE(E2>=14; "Muito bom"; SE(E2>=10; "Aprovado"; "Reprovado"))
```

Nas versões recentes, `SE.S` simplifica condições encadeadas.
MD,
                    ],
                    'check' => [
                        ['single', 'O que devolve =SE(B2>100;"Alto";"Baixo") se B2 for 80?', ['* "Baixo"', '"Alto"', '80'], '80 não é maior que 100, por isso devolve o valor se falso.'],
                    ],
                    'bank' => [
                        ['order', 'Ordena os argumentos da função SE.', ['Condição', 'Valor se verdadeiro', 'Valor se falso'], 'Primeiro o teste, depois o que mostrar em cada caso.'],
                    ],
                ],
                [
                    'title' => 'Procurar e somar com critérios: PROCV, PROCX, SOMA.SE, CONTAR.SE',
                    'summary' => 'Ir buscar dados a outra tabela e somar ou contar só o que interessa.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## PROCV — procurar um valor numa tabela

```excel
=PROCV(B2; Produtos!A:C; 3; FALSO)
```

Procura o código em `B2` na primeira coluna da tabela `Produtos!A:C` e devolve a **3.ª coluna**. O `FALSO` exige correspondência exacta — usa-o quase sempre.

Nas versões recentes, **PROCX** é mais simples e flexível:

```excel
=PROCX(B2; Produtos!A:A; Produtos!C:C)
```

## SOMA.SE e CONTAR.SE

```excel
=SOMA.SE(A2:A21; "Ana"; D2:D21)      total vendido pela Ana
=CONTAR.SE(D2:D21; ">50000")         vendas acima de 50 000 Kz
=SOMA.SE.S(D2:D21; A2:A21; "Ana"; C2:C21; "Luanda")   Ana em Luanda
```
MD,
                    ],
                    'check' => [
                        ['single', 'O que significa o FALSO no fim do PROCV?', ['* Exige correspondência exacta', 'Devolve sempre falso', 'Ignora a tabela'], 'Sem FALSO, o PROCV pode devolver um valor aproximado errado.'],
                    ],
                    'bank' => [
                        ['match', 'Liga cada necessidade à função.', ['Total vendido por um vendedor' => 'SOMA.SE', 'Quantas vendas acima de um valor' => 'CONTAR.SE', 'Preço de um produto noutra tabela' => 'PROCV'], 'Cada função resolve um tipo de pergunta sobre os dados.'],
                        ['fill', 'Que função conta células que cumprem um critério (Excel em pt-PT)?', ['CONTAR.SE', 'contar.se'], 'CONTAR.SE conta as células do intervalo que cumprem o critério.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Analisar e apresentar dados',
            'description' => 'Filtrar, resumir com tabelas dinâmicas e criar um dashboard com gráficos.',
            'activity' => ['upload', 'Envia o teu dashboard de vendas.', 'Com a tabela de vendas, cria uma tabela dinâmica (vendas por região e mês) e pelo menos dois gráficos numa folha "Dashboard". Envia o ficheiro.'],
            'lessons' => [
                [
                    'title' => 'Ordenar, filtrar e formatar como tabela',
                    'summary' => 'Encontrar respostas depressa sem fórmulas.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Formatar como Tabela

Selecciona os dados e usa **Base → Formatar como Tabela** (ou Ctrl+T). Ganhas:

- filtros em cada cabeçalho;
- cores alternadas que facilitam a leitura;
- fórmulas e gráficos que **crescem sozinhos** quando acrescentas linhas.

## Ordenar e filtrar

- Ordena por **valor** (maior → menor) para ver as melhores vendas.
- Filtra por **região** ou **vendedor** para analisar um grupo.
- Filtros de número: *"maior do que 50 000"*.

> Formatação condicional (**Base → Formatação Condicional**) pinta automaticamente, por exemplo, as vendas abaixo da meta a vermelho.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é uma vantagem de usar "Formatar como Tabela"?', ['* Fórmulas e gráficos acompanham as novas linhas automaticamente', 'Apaga os dados duplicados', 'Converte os números em texto'], 'As tabelas estruturadas expandem-se quando acrescentas dados.'],
                    ],
                    'bank' => [
                        ['tf', 'A formatação condicional pode destacar automaticamente valores abaixo de uma meta.', true, 'Aplica cores conforme regras que defines.'],
                    ],
                ],
                [
                    'title' => 'Tabelas dinâmicas',
                    'summary' => 'Resumir milhares de linhas em segundos, sem fórmulas.',
                    'minutes' => 9,
                    'blocks' => [
                        <<<'MD'
## Criar

1. Clica dentro da tabela de dados.
2. **Inserir → Tabela Dinâmica → Nova folha**.
3. Arrasta os campos para as áreas:
   - **Linhas**: Região
   - **Colunas**: Mês
   - **Valores**: Soma de Valor

## O que consegues responder em segundos

- Qual a região que mais vendeu?
- Como evoluíram as vendas mês a mês?
- Qual o vendedor com mais vendas em Benguela?

Quando os dados mudarem, clica com o botão direito na tabela dinâmica → **Actualizar**.
MD,
                    ],
                    'check' => [
                        ['single', 'Para ver o total de vendas por região, onde colocas o campo Valor?', ['* Em Valores', 'Em Filtros', 'Em Linhas'], 'A área Valores agrega (soma, conta, média) os números.'],
                    ],
                    'bank' => [
                        ['tf', 'Uma tabela dinâmica actualiza-se sozinha, sem nunca ser preciso clicar em Actualizar.', false, 'É preciso actualizar depois de alterar os dados de origem.'],
                    ],
                ],
                [
                    'title' => 'Gráficos e dashboard',
                    'summary' => 'Escolher o gráfico certo e montar uma página de resumo.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Que gráfico usar

- **Colunas/barras** — comparar categorias (vendas por região).
- **Linhas** — evolução no tempo (vendas por mês).
- **Circular** — partes de um todo, com **poucas** categorias (até 4 ou 5).

## Um dashboard simples

Numa folha "Dashboard":

1. Três **números-chave** no topo: total de vendas, venda média, número de vendas.
2. Um gráfico de **linhas** com a evolução mensal.
3. Um gráfico de **barras** por região.
4. Títulos claros e **pouca cor** — uma cor de destaque para o que importa.

> Quem lê o dashboard deve perceber a mensagem principal em 5 segundos.
MD,
                    ],
                    'check' => [
                        ['match', 'Liga cada objectivo ao gráfico mais indicado.', ['Evolução das vendas por mês' => 'Linhas', 'Comparar vendas entre regiões' => 'Barras', 'Peso de 3 produtos no total' => 'Circular'], 'O tipo de gráfico deve servir a pergunta.'],
                    ],
                    'bank' => [
                        ['tf', 'Um gráfico circular funciona bem com 15 categorias.', false, 'Com muitas categorias as fatias ficam ilegíveis; usa barras.'],
                    ],
                ],
            ],
        ],
    ],
];
