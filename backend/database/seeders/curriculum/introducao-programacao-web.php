<?php

return [
    'slug' => 'introducao-programacao-web',
    'version' => 1,
    'trail' => [
        'title' => 'Introdução à Programação Web',
        'summary' => 'Cria e publica o teu primeiro site com HTML, CSS e JavaScript, com exemplos que podes testar na própria lição.',
        'description' => "Nesta trilha constróis um site pessoal do zero: estruturas o conteúdo com HTML, dás-lhe estilo com CSS, acrescentas interactividade com JavaScript e publicas tudo online, de graça.\n\nCada exemplo de código mostra o resultado ao vivo, por isso podes experimentar sem instalar nada. No fim tens um site publicado para o teu portefólio.",
        'expected_outcome' => 'Um site pessoal responsivo, publicado online, com HTML, CSS e JavaScript.',
        'learning_objectives' => [
            'Estruturar páginas com HTML semântico e acessível.',
            'Aplicar estilos e layouts responsivos com CSS e Flexbox.',
            'Criar interacções simples com JavaScript.',
            'Publicar um site no GitHub Pages e apresentá-lo no portefólio.',
        ],
        'target_audience' => 'Jovens sem experiência em programação que querem criar sites ou seguir uma carreira em tecnologia.',
        'prerequisites' => [],
    ],
    'phases' => [
        ['title' => 'Estrutura e estilo', 'description' => 'HTML e CSS: o que a página é e como aparece.'],
        ['title' => 'Interactividade e publicação', 'description' => 'JavaScript e pôr o site online.'],
    ],
    'modules' => [
        [
            'title' => 'Estruturar uma página web',
            'description' => 'Percebe como o HTML organiza o conteúdo e cria a tua primeira página, acessível a todos.',
            'phase' => 0,
            'quiz' => 6,
            'activity' => ['escrita', 'Desenha a estrutura de uma página sobre um tema que conheces.', 'Indica o título principal, três secções e uma ligação que seria útil ao visitante. Escreve os elementos HTML que usarias em cada parte.'],
            'lessons' => [
                [
                    'title' => 'Elementos HTML: as peças de uma página',
                    'summary' => 'O que é uma etiqueta, como se escreve um elemento e quais usar para títulos, texto, listas, links e imagens.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## O que é o HTML

Cada página que abres no navegador é um ficheiro de texto escrito em **HTML** (*HyperText Markup Language*). O HTML não decide cores nem tamanhos — isso é trabalho do CSS. O HTML diz **o que cada parte do conteúdo é**: um título, um parágrafo, uma lista, uma imagem.

## Anatomia de um elemento

Um **elemento** é formado por uma etiqueta de abertura, o conteúdo e uma etiqueta de fecho:

```
<p>Olá, Luanda!</p>
```

- `<p>` é a etiqueta de abertura (p de *paragraph*).
- `Olá, Luanda!` é o conteúdo.
- `</p>` é a etiqueta de fecho — repara na barra `/`.

Alguns elementos também têm **atributos**, que dão informação extra. Escrevem-se dentro da etiqueta de abertura, no formato `nome="valor"`:

```
<a href="https://kumuka.ao">Visitar a KUMUKA</a>
```

Aqui, `href` diz para onde a ligação leva.
MD,
                        <<<'MD'
## Os elementos que vais usar todos os dias

Experimenta o exemplo: o código está em cima e o resultado no navegador está em baixo.

```html
<h1>Feira de Emprego de Luanda</h1>
<h2>Sobre o evento</h2>
<p>A feira reúne <strong>40 empresas</strong> e decorre no <em>sábado de manhã</em>.</p>

<h2>O que levar</h2>
<ul>
  <li>Currículo impresso</li>
  <li>Bilhete de identidade</li>
  <li>Caneta e caderno</li>
</ul>

<p>Inscreve-te no <a href="https://kumuka.ao">site da KUMUKA</a>.</p>
```

- `<h1>` a `<h6>` — **títulos**, do mais importante (`h1`) ao menos importante. Usa um só `h1` por página.
- `<p>` — **parágrafo** de texto.
- `<strong>` e `<em>` — dão **importância** e *ênfase* a uma palavra.
- `<ul>` e `<li>` — **lista** com marcas; cada `<li>` é um item. Para listas numeradas usa `<ol>`.
- `<a href="...">` — **ligação** para outra página.
- `<img src="..." alt="...">` — **imagem**. Não tem etiqueta de fecho.
MD,
                        <<<'MD'
## Exemplo resolvido: elementos dentro de elementos

Os elementos podem estar **dentro** de outros. Isto chama-se *aninhar*. A regra é: fecha primeiro o que abriste por último.

```html
<p>Preço: <strong>2 500 Kz</strong></p>
```

- ✅ Certo: `<p> … <strong> … </strong> … </p>`
- ❌ Errado: `<p> … <strong> … </p> … </strong>` — as etiquetas cruzam-se.

> Dica: indenta (afasta da margem) os elementos que estão dentro de outros. O navegador não precisa disso, mas tu e os teus colegas lêem o código muito mais depressa.
MD,
                    ],
                    'check' => [
                        ['type' => 'single', 'prompt' => 'No código `<a href="https://kumuka.ao">Entrar</a>`, o que é `href`?', 'options' => [
                            ['id' => 'a', 'text' => 'Um atributo que indica o destino da ligação', 'correct' => true],
                            ['id' => 'b', 'text' => 'A etiqueta de fecho', 'correct' => false],
                            ['id' => 'c', 'text' => 'O texto que aparece no ecrã', 'correct' => false],
                        ], 'explanation' => 'Os atributos ficam dentro da etiqueta de abertura e dão informação extra. O texto visível é "Entrar".'],
                        ['type' => 'fill_blank', 'prompt' => 'Que elemento usas para cada item de uma lista? Escreve só o nome, sem < >.', 'accepted_answers' => ['li'], 'explanation' => 'Cada item é um `<li>`, dentro de `<ul>` (lista com marcas) ou `<ol>` (lista numerada).'],
                    ],
                    'bank' => [
                        ['type' => 'matching', 'prompt' => 'Liga cada elemento ao que representa.', 'options' => [
                            ['id' => 'h1', 'left' => '<h1>', 'right' => 'Título principal da página'],
                            ['id' => 'p', 'left' => '<p>', 'right' => 'Parágrafo de texto'],
                            ['id' => 'a', 'left' => '<a>', 'right' => 'Ligação para outra página'],
                            ['id' => 'img', 'left' => '<img>', 'right' => 'Imagem'],
                        ], 'explanation' => 'Estes são os elementos mais usados em qualquer página web.'],
                        ['type' => 'single', 'prompt' => 'Qual destas linhas está bem aninhada?', 'options' => [
                            ['id' => 'a', 'text' => '<p>Olá <strong>mundo</p></strong>', 'correct' => false],
                            ['id' => 'b', 'text' => '<p>Olá <strong>mundo</strong></p>', 'correct' => true],
                            ['id' => 'c', 'text' => '<strong>Olá <p>mundo</strong></p>', 'correct' => false],
                        ], 'explanation' => 'Fecha-se primeiro o elemento que se abriu por último: `<strong>` fecha antes de `<p>`.'],
                        ['type' => 'true_false', 'prompt' => 'Uma página pode ter vários elementos <h1>, um por secção.', 'correct_boolean' => false, 'explanation' => 'Usa um só `<h1>` com o título principal; para secções usa `<h2>`, `<h3>`…'],
                    ],
                ],
                [
                    'title' => 'Criar a tua primeira página',
                    'summary' => 'A estrutura obrigatória de um documento HTML e como abri-lo no navegador.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## O esqueleto de qualquer página

Todas as páginas HTML seguem a mesma estrutura base:

```html
<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>O meu portefólio</title>
  </head>
  <body>
    <h1>Olá, sou a Joana</h1>
    <p>Estudante de Informática em Benguela.</p>
  </body>
</html>
```

- `<!DOCTYPE html>` — diz ao navegador que é uma página HTML moderna.
- `<html lang="pt">` — envolve tudo e indica a língua (ajuda tradutores e leitores de ecrã).
- `<head>` — informação **sobre** a página, que não aparece no conteúdo:
  - `charset="utf-8"` permite acentos e "ç";
  - `viewport` faz a página adaptar-se ao telemóvel;
  - `<title>` é o texto que aparece no separador do navegador.
- `<body>` — tudo o que o visitante **vê**.
MD,
                        <<<'MD'
## Passo a passo no teu computador

1. Instala um editor de código gratuito, como o **Visual Studio Code**.
2. Cria uma pasta chamada `meu-site`.
3. Dentro dela, cria um ficheiro chamado `index.html`.
4. Copia o esqueleto acima (botão **Copiar**) e cola-o no ficheiro.
5. Guarda e faz duplo clique no ficheiro: abre no navegador.
6. Muda o texto do `<h1>`, guarda e recarrega a página (F5) para ver a alteração.

> No telemóvel também dá para praticar: apps como "Acode" (Android) permitem editar e pré-visualizar HTML.
MD,
                    ],
                    'check' => [
                        ['type' => 'ordering', 'prompt' => 'Ordena as partes do documento, de fora para dentro.', 'options' => [
                            ['id' => 'doctype', 'text' => '<!DOCTYPE html>'],
                            ['id' => 'html', 'text' => '<html>'],
                            ['id' => 'head', 'text' => '<head>'],
                            ['id' => 'body', 'text' => '<body>'],
                        ], 'explanation' => 'O DOCTYPE vem primeiro; `<html>` envolve tudo; dentro dele vem `<head>` e depois `<body>`.'],
                    ],
                    'bank' => [
                        ['type' => 'single', 'prompt' => 'Onde colocas o texto que aparece no separador do navegador?', 'options' => [
                            ['id' => 'a', 'text' => 'Em <title>, dentro de <head>', 'correct' => true],
                            ['id' => 'b', 'text' => 'Em <h1>, dentro de <body>', 'correct' => false],
                            ['id' => 'c', 'text' => 'Num atributo de <html>', 'correct' => false],
                        ], 'explanation' => 'O `<title>` fica no `<head>`; o `<h1>` é o título visível dentro da página.'],
                        ['type' => 'single', 'context' => 'A página do Paulo mostra "AcÃ§Ã£o" em vez de "Acção".', 'prompt' => 'O que lhe falta provavelmente?', 'options' => [
                            ['id' => 'a', 'text' => '<meta charset="utf-8"> no <head>', 'correct' => true],
                            ['id' => 'b', 'text' => 'Mais um <h1>', 'correct' => false],
                            ['id' => 'c', 'text' => 'O atributo href', 'correct' => false],
                        ], 'explanation' => 'Sem `charset="utf-8"` o navegador pode interpretar mal acentos e "ç".'],
                        ['type' => 'true_false', 'prompt' => 'O conteúdo dentro de <head> aparece no corpo da página para o visitante.', 'correct_boolean' => false, 'explanation' => 'O `<head>` guarda informação sobre a página; só o `<body>` é mostrado.'],
                    ],
                ],
                [
                    'title' => 'Acessibilidade básica',
                    'summary' => 'Como escrever HTML que funciona para todos, incluindo quem usa leitores de ecrã.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## Porque importa

Muitas pessoas usam a web de formas diferentes: com leitores de ecrã (que lêem a página em voz alta), só com o teclado, ou com ligações lentas que não carregam imagens. HTML bem escrito ajuda todas elas — e também ajuda o Google a perceber a tua página.

## Quatro regras que fazem a diferença

1. **Usa elementos com significado.** Organiza a página com `<header>`, `<nav>`, `<main>` e `<footer>` em vez de só `<div>`.
2. **Descreve as imagens** com o atributo `alt`: `<img src="feira.jpg" alt="Estudantes numa banca da feira de emprego">`.
3. **Respeita a ordem dos títulos:** `h1` → `h2` → `h3`, sem saltar níveis.
4. **Escreve ligações que se percebem sozinhas:** "Ver as vagas de estágio" em vez de "clica aqui".
MD,
                        <<<'MD'
## Exemplo resolvido

```html
<header>
  <h1>Joana Domingos</h1>
  <nav>
    <a href="#projectos">Projectos</a> ·
    <a href="#contactos">Contactos</a>
  </nav>
</header>

<main>
  <h2 id="projectos">Projectos</h2>
  <p>Loja online para a cantina da escola.</p>
  <img src="loja.png" alt="Página inicial da loja com três menus do dia">
</main>

<footer>
  <p id="contactos">Email: joana@exemplo.ao</p>
</footer>
```

Repara: a imagem não aparece no resultado porque o ficheiro não existe aqui — mas o navegador mostra o texto do `alt`. É exactamente isso que uma pessoa com ligação lenta ou um leitor de ecrã recebe.
MD,
                    ],
                    'check' => [
                        ['type' => 'single', 'prompt' => 'Qual é o melhor texto para uma ligação para as vagas de estágio?', 'options' => [
                            ['id' => 'a', 'text' => 'Clica aqui', 'correct' => false],
                            ['id' => 'b', 'text' => 'Ver as vagas de estágio', 'correct' => true],
                            ['id' => 'c', 'text' => 'Link', 'correct' => false],
                        ], 'explanation' => 'Quem usa leitor de ecrã muitas vezes ouve só a lista de ligações; "clica aqui" não diz para onde vai.'],
                    ],
                    'bank' => [
                        ['type' => 'multiple', 'prompt' => 'Quais destes elementos dão significado à estrutura da página?', 'options' => [
                            ['id' => 'a', 'text' => '<header>', 'correct' => true],
                            ['id' => 'b', 'text' => '<main>', 'correct' => true],
                            ['id' => 'c', 'text' => '<div>', 'correct' => false],
                            ['id' => 'd', 'text' => '<footer>', 'correct' => true],
                        ], 'explanation' => '`<div>` é genérico e não diz nada sobre o conteúdo; os outros indicam o cabeçalho, o conteúdo principal e o rodapé.'],
                        ['type' => 'fill_blank', 'prompt' => 'Que atributo descreve uma imagem para quem não a consegue ver?', 'accepted_answers' => ['alt'], 'explanation' => 'O `alt` é lido pelos leitores de ecrã e mostrado quando a imagem não carrega.'],
                        ['type' => 'single', 'prompt' => 'Depois de um <h2>, qual é o título seguinte correcto para uma subsecção?', 'options' => [
                            ['id' => 'a', 'text' => '<h3>', 'correct' => true],
                            ['id' => 'b', 'text' => '<h5>', 'correct' => false],
                            ['id' => 'c', 'text' => '<h1>', 'correct' => false],
                        ], 'explanation' => 'Os títulos descem um nível de cada vez, sem saltar: h2 → h3.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Dar estilo com CSS',
            'description' => 'Muda cores, letras e espaços, e faz a página adaptar-se ao telemóvel.',
            'phase' => 0,
            'activity' => ['link', 'Partilha a tua página com estilo.', 'Publica o teu index.html com uma folha de estilos (por exemplo no CodePen ou no GitHub) e cola aqui o link. Deve ter cores, espaçamentos e funcionar no telemóvel.'],
            'lessons' => [
                [
                    'title' => 'Seletores e propriedades',
                    'summary' => 'Como o CSS escolhe elementos e lhes aplica estilos.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## O que faz o CSS

O HTML diz **o que** cada conteúdo é; o **CSS** (*Cascading Style Sheets*) diz **como** aparece: cores, tamanhos, espaços, posições.

Uma regra CSS tem duas partes:

```
h1 {
  color: #123b72;
  font-size: 32px;
}
```

- `h1` é o **seletor**: escolhe os elementos a que a regra se aplica.
- Dentro das chavetas estão as **declarações**, no formato `propriedade: valor;`.

## Os três seletores mais usados

- **Elemento**: `p { … }` — todos os parágrafos.
- **Classe**: `.destaque { … }` — elementos com `class="destaque"`. Podes reutilizar em vários elementos.
- **Identificador**: `#topo { … }` — o único elemento com `id="topo"`.
MD,
                        <<<'MD'
## Experimenta

O CSS pode ficar dentro de `<style>`. Muda as cores e vê o resultado:

```html
<style>
  body { background: #f2f6fa; font-family: sans-serif; }
  h1 { color: #123b72; }
  .destaque { background: #f5be35; padding: 4px 8px; border-radius: 6px; }
  #nota { color: #64748b; font-size: 14px; }
</style>

<h1>Menu da cantina</h1>
<p>Hoje temos <span class="destaque">muamba de galinha</span>.</p>
<p id="nota">Preço: 1 500 Kz</p>
```

> Num projecto real, o CSS vai para um ficheiro `estilos.css`, ligado no `<head>` com `<link rel="stylesheet" href="estilos.css">`.
MD,
                    ],
                    'check' => [
                        ['single', 'Que seletor aplica um estilo a todos os elementos com class="aviso"?', ['* .aviso', '#aviso', 'aviso'], 'O ponto indica uma classe; o cardinal (#) indica um id; sem símbolo, procura um elemento chamado <aviso>.'],
                    ],
                    'bank' => [
                        ['match', 'Liga cada parte da regra ao seu nome.', ['h1' => 'Seletor', 'color' => 'Propriedade', '#123b72' => 'Valor'], 'Uma regra é seletor { propriedade: valor; }.'],
                        ['tf', 'O mesmo id pode ser usado em vários elementos da mesma página.', false, 'O id é único. Para reutilizar estilos usa classes.'],
                        ['single', 'Onde colocas o link para um ficheiro estilos.css?', ['* Em <link> dentro de <head>', 'Em <a> dentro de <body>', 'No fim do ficheiro HTML, depois de </html>'], 'Os estilos são carregados no <head>, com <link rel="stylesheet">.'],
                    ],
                ],
                [
                    'title' => 'O modelo de caixa',
                    'summary' => 'Margem, borda, espaço interno e conteúdo: como cada elemento ocupa espaço.',
                    'minutes' => 9,
                    'blocks' => [
                        <<<'MD'
## Cada elemento é uma caixa

O navegador desenha cada elemento como uma caixa com quatro camadas, de dentro para fora:

1. **Conteúdo** — o texto ou a imagem.
2. **Padding** — espaço interno, entre o conteúdo e a borda.
3. **Border** — a borda.
4. **Margin** — espaço externo, que afasta a caixa das outras.

```html
<style>
  .cartao {
    background: #ffffff;
    padding: 16px;
    border: 2px solid #123b72;
    border-radius: 12px;
    margin: 12px;
  }
</style>
<div class="cartao">Cartão com padding de 16px</div>
<div class="cartao">Outro cartão, afastado pela margem</div>
```

> Dica: escreve `* { box-sizing: border-box; }` no início do CSS. Assim, a largura que defines já inclui o padding e a borda — fica muito mais previsível.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena as camadas da caixa, de dentro para fora.', ['Conteúdo', 'Padding', 'Border', 'Margin'], 'O padding fica dentro da borda; a margem fica fora.'],
                    ],
                    'bank' => [
                        ['single', 'Queres afastar o texto da borda de um botão. Que propriedade usas?', ['* padding', 'margin', 'border'], 'O padding cria espaço entre o conteúdo e a borda; a margem afasta o botão dos outros elementos.'],
                        ['fill', 'Que propriedade arredonda os cantos de uma caixa? (sem dois pontos)', ['border-radius'], 'border-radius define o raio dos cantos.'],
                    ],
                ],
                [
                    'title' => 'Layout com Flexbox e páginas responsivas',
                    'summary' => 'Alinhar elementos em linha e adaptar a página ao ecrã do telemóvel.',
                    'minutes' => 12,
                    'blocks' => [
                        <<<'MD'
## Flexbox em 3 propriedades

Com `display: flex` num elemento pai, os filhos ficam lado a lado e podes alinhá-los facilmente:

- `justify-content` — distribui na horizontal (`space-between`, `center`…).
- `align-items` — alinha na vertical.
- `gap` — espaço entre os filhos.

```html
<style>
  .menu { display: flex; justify-content: space-between; align-items: center; gap: 12px;
          background: #123b72; color: white; padding: 12px 16px; border-radius: 12px; }
  .menu a { color: #f5be35; }
</style>
<nav class="menu">
  <strong>KUMUKA</strong>
  <span><a href="#">Trilhas</a> · <a href="#">Vagas</a></span>
</nav>
```
MD,
                        <<<'MD'
## Pensar primeiro no telemóvel

A maioria dos jovens em Angola navega pelo telemóvel. Escreve o CSS para ecrãs pequenos e acrescenta regras para ecrãs maiores com uma **media query**:

```html
<style>
  .grelha { display: flex; flex-direction: column; gap: 8px; }
  .grelha div { background: #f5be35; padding: 16px; border-radius: 8px; }
  @media (min-width: 600px) {
    .grelha { flex-direction: row; }
  }
</style>
<div class="grelha"><div>1</div><div>2</div><div>3</div></div>
```

Arrasta a margem do resultado (ou muda a largura da janela): abaixo de 600px os blocos ficam em coluna.
MD,
                    ],
                    'check' => [
                        ['single', 'Num contentor flex, que propriedade cria espaço igual entre os filhos?', ['* gap', 'margin-top', 'font-size'], 'gap define o espaço entre os itens de um contentor flex (ou grid).'],
                    ],
                    'bank' => [
                        ['single', 'O que faz @media (min-width: 600px) { … }?', ['* Aplica as regras só em ecrãs com 600px ou mais', 'Aplica as regras só em telemóveis', 'Muda a largura da página para 600px'], 'A media query só activa as regras quando a condição é verdadeira.'],
                        ['tf', 'Escrever o CSS primeiro para ecrãs pequenos e depois alargar é uma boa prática.', true, 'Chama-se mobile first: garante que a experiência mais comum funciona bem.'],
                        ['multiple', 'Quais destas propriedades são usadas com Flexbox?', ['* justify-content', '* align-items', 'border-radius', '* flex-direction'], 'border-radius arredonda cantos; as outras controlam o layout flex.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Dar vida com JavaScript',
            'description' => 'Guarda dados, cria funções e reage a cliques para tornar a página interactiva.',
            'phase' => 1,
            'activity' => ['link', 'Cria uma calculadora de gorjeta ou de propinas.', 'Usa um campo de texto, um botão e JavaScript para mostrar o resultado na página. Publica (por exemplo no CodePen) e cola o link aqui.'],
            'lessons' => [
                [
                    'title' => 'Variáveis e tipos de dados',
                    'summary' => 'Guardar informação com let e const e conhecer texto, números e verdadeiro/falso.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## Guardar informação

Uma **variável** é uma caixa com nome onde guardas um valor:

- `const` — para valores que não mudam: `const pais = "Angola";`
- `let` — para valores que vão mudar: `let pontos = 0;`

## Os tipos mais comuns

- **Texto** (string), entre aspas: `"Luanda"`
- **Número**: `2500`, `3.5`
- **Booleano**: `true` ou `false`
- **Lista** (array): `["HTML", "CSS", "JS"]`

```html
<p id="saida"></p>
<script>
  const nome = "Joana";
  let propina = 25000;
  propina = propina + 5000;
  document.getElementById("saida").textContent =
    nome + " vai pagar " + propina + " Kz este mês.";
</script>
```

> Usa `const` por defeito e `let` só quando precisas de mudar o valor. Evita `var`, que é uma forma antiga.
MD,
                    ],
                    'check' => [
                        ['single', 'Que palavra usas para uma variável cujo valor vai mudar?', ['* let', 'const', 'string'], 'const não permite reatribuir; let permite.'],
                    ],
                    'bank' => [
                        ['match', 'Liga cada valor ao seu tipo.', ['"Benguela"' => 'Texto (string)', '42' => 'Número', 'true' => 'Booleano'], 'Texto vai entre aspas; true/false são booleanos.'],
                        ['tf', 'O valor de uma variável declarada com const pode ser substituído mais tarde.', false, 'Com const a variável não pode receber outro valor.'],
                    ],
                ],
                [
                    'title' => 'Funções e condições',
                    'summary' => 'Agrupar instruções numa função e tomar decisões com if.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## Funções

Uma **função** agrupa instruções que podes reutilizar. Recebe valores (parâmetros) e pode devolver um resultado com `return`.

## Condições

Com `if` / `else` o programa decide o que fazer:

```html
<p id="r"></p>
<script>
  function classificar(nota) {
    if (nota >= 14) {
      return "Muito bom";
    } else if (nota >= 10) {
      return "Aprovado";
    } else {
      return "Reprovado";
    }
  }
  document.getElementById("r").textContent =
    "16 valores: " + classificar(16) + " · 9 valores: " + classificar(9);
</script>
```

Compara valores com `===` (igual), `!==` (diferente), `>`, `<`, `>=` e `<=`.
MD,
                    ],
                    'check' => [
                        ['single', 'O que devolve classificar(12) no exemplo?', ['* "Aprovado"', '"Muito bom"', '"Reprovado"'], '12 não é ≥ 14, mas é ≥ 10, por isso entra no else if.'],
                    ],
                    'bank' => [
                        ['fill', 'Que palavra devolve um valor de dentro de uma função?', ['return'], 'return termina a função e devolve o valor.'],
                        ['single', 'Qual operador compara se dois valores são exactamente iguais?', ['* ===', '=', '=>'], '= atribui um valor; === compara valor e tipo.'],
                    ],
                ],
                [
                    'title' => 'Reagir ao utilizador (DOM e eventos)',
                    'summary' => 'Ler campos, responder a cliques e mudar a página sem a recarregar.',
                    'minutes' => 12,
                    'blocks' => [
                        <<<'MD'
## O DOM

O navegador transforma o HTML numa árvore de objectos — o **DOM**. O JavaScript pode encontrar elementos (`document.querySelector`) e mudá-los (`textContent`, `classList`…).

## Eventos

Um **evento** é algo que acontece: um clique, uma tecla, o envio de um formulário. Com `addEventListener` dizes o que fazer quando acontece.

```html
<label>Valor da conta (Kz) <input id="conta" type="number" value="10000"></label>
<button id="calcular">Calcular gorjeta de 10%</button>
<p id="resultado"></p>
<script>
  const botao = document.querySelector("#calcular");
  botao.addEventListener("click", () => {
    const conta = Number(document.querySelector("#conta").value);
    const gorjeta = conta * 0.1;
    document.querySelector("#resultado").textContent = "Gorjeta: " + gorjeta + " Kz";
  });
</script>
```

Experimenta mudar o valor e carregar no botão.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena os passos para reagir a um clique.', ['Encontrar o botão com querySelector', 'Adicionar um addEventListener("click", …)', 'Ler os dados e actualizar a página dentro da função'], 'Primeiro encontras o elemento, depois registas o evento e só então, quando acontece, actualizas a página.'],
                    ],
                    'bank' => [
                        ['single', 'O que devolve document.querySelector("#conta")?', ['* O elemento com id="conta"', 'Todos os elementos da classe conta', 'O texto "conta"'], '# indica um id, tal como no CSS.'],
                        ['tf', 'O valor de um <input> chega ao JavaScript como texto, por isso convém convertê-lo com Number() antes de fazer contas.', true, 'Sem Number(), "100" + 10 dá "10010" em vez de 110.'],
                    ],
                ],
            ],
        ],
        [
            'title' => 'Publicar e apresentar o teu projecto',
            'description' => 'Põe o site online, revê a qualidade e transforma-o numa peça do teu portefólio.',
            'phase' => 1,
            'activity' => ['link', 'Publica o teu site pessoal.', 'Cria um site de uma página com o teu nome, competências, um projecto e contactos. Publica-o no GitHub Pages ou Netlify e cola aqui o link público.'],
            'lessons' => [
                [
                    'title' => 'Organizar os ficheiros do projecto',
                    'summary' => 'Uma estrutura de pastas simples e nomes que funcionam em qualquer servidor.',
                    'minutes' => 7,
                    'blocks' => [
                        <<<'MD'
## Uma estrutura que funciona sempre

```
meu-site/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   └── app.js
└── img/
    └── foto.jpg
```

- O ficheiro principal chama-se **index.html** — é o que os servidores abrem por defeito.
- Usa nomes **em minúsculas, sem espaços nem acentos**: `minha-foto.jpg`, não `Minha Foto Nova.JPG`. Muitos servidores distinguem maiúsculas.
- Liga os ficheiros com caminhos relativos: `<link rel="stylesheet" href="css/estilos.css">`.
- Comprime as imagens antes de publicar (por exemplo para WebP): páginas leves abrem depressa com dados móveis.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual destes nomes de ficheiro é o mais seguro para publicar?', ['* foto-perfil.jpg', 'Foto Perfil.JPG', 'fotoPérfil.jpg'], 'Minúsculas, sem espaços nem acentos evitam erros em servidores.'],
                    ],
                    'bank' => [
                        ['fill', 'Como deve chamar-se o ficheiro principal do site? (com extensão)', ['index.html'], 'Os servidores abrem index.html por defeito.'],
                        ['tf', 'Imagens muito pesadas tornam a página lenta para quem usa dados móveis.', true, 'Comprimir imagens é das melhorias de velocidade mais eficazes.'],
                    ],
                ],
                [
                    'title' => 'Publicar no GitHub Pages',
                    'summary' => 'Pôr o site online de graça, com um endereço que podes partilhar.',
                    'minutes' => 10,
                    'blocks' => [
                        <<<'MD'
## Passo a passo

1. Cria uma conta gratuita em **github.com**.
2. Cria um repositório novo, por exemplo `meu-site`, marcado como **Public**.
3. Clica em **Add file → Upload files** e arrasta os ficheiros do projecto (incluindo o `index.html`). Confirma com **Commit changes**.
4. Vai a **Settings → Pages**, em *Branch* escolhe `main` e a pasta `/ (root)`, e guarda.
5. Em um ou dois minutos aparece o endereço: `https://o-teu-utilizador.github.io/meu-site/`.

Sempre que actualizares os ficheiros no repositório, o site actualiza-se sozinho.

> Alternativa igualmente gratuita: **Netlify**, onde basta arrastar a pasta do projecto para o site.
MD,
                    ],
                    'check' => [
                        ['order', 'Ordena os passos para publicar no GitHub Pages.', ['Criar o repositório público', 'Enviar os ficheiros do projecto', 'Activar o Pages em Settings', 'Partilhar o endereço gerado'], 'Sem ficheiros no repositório não há nada para publicar; o endereço só aparece depois de activar o Pages.'],
                    ],
                    'bank' => [
                        ['single', 'O repositório tem de ser de que tipo para usar o GitHub Pages gratuito?', ['* Público', 'Privado', 'Arquivado'], 'Na conta gratuita, o Pages funciona com repositórios públicos.'],
                    ],
                ],
                [
                    'title' => 'Rever e apresentar no portefólio',
                    'summary' => 'Uma lista de verificação antes de partilhar e como descrever o projecto.',
                    'minutes' => 8,
                    'blocks' => [
                        <<<'MD'
## Lista de verificação

- [ ] Abre bem no telemóvel e no computador.
- [ ] Todas as imagens têm `alt`.
- [ ] Os links funcionam.
- [ ] O `<title>` descreve a página.
- [ ] Sem erros de ortografia.
- [ ] Carrega em poucos segundos com dados móveis.

## Como apresentar

No portefólio (e na KUMUKA), descreve cada projecto com a mesma estrutura de uma conquista no CV:

> **Problema → o que fizeste → resultado.**
> "A cantina não tinha menu online. Criei uma página responsiva em HTML, CSS e JavaScript com o menu do dia e os preços. Os colegas passaram a consultar o menu antes do intervalo."

Inclui o link para o site publicado e para o código.
MD,
                    ],
                    'check' => [
                        ['single', 'Qual é a melhor descrição de um projecto no portefólio?', ['* Problema, o que fizeste e o resultado, com o link', 'Só o link do site', 'A lista de todas as tecnologias que conheces'], 'Quem avalia quer perceber o problema, o teu papel e o resultado — e poder ver o trabalho.'],
                    ],
                    'bank' => [
                        ['multiple', 'O que deves verificar antes de partilhar o site?', ['* Se funciona no telemóvel', '* Se as imagens têm alt', '* Se os links funcionam', 'Se usaste todas as cores possíveis'], 'Funcionalidade, acessibilidade e links partidos são o que mais afecta a primeira impressão.'],
                    ],
                ],
            ],
        ],
    ],
];
