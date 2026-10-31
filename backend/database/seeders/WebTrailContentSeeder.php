<?php

namespace Database\Seeders;

use App\Models\Trail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Rewrites the first module of "Introdução à Programação Web" to the Phase 1 content standard:
 * explanations with live HTML examples, a checkpoint per lesson and a quiz bank with explanations.
 * Runs once: a module that already has checkpoint questions is left untouched.
 */
class WebTrailContentSeeder extends Seeder
{
    public const TRAIL_SLUG = 'introducao-programacao-web';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $module = Trail::query()->where('slug', self::TRAIL_SLUG)->first()?->modules()->orderBy('position')->first();

        if ($module === null || $module->questions()->where('is_checkpoint', true)->exists()) {
            return;
        }

        DB::transaction(function () use ($module): void {
            $module->update([
                'title' => 'Estruturar uma página web',
                'description' => 'Percebe como o HTML organiza o conteúdo e cria a tua primeira página, acessível a todos.',
                'duration_minutes' => 45,
                'quiz_question_count' => 6,
                'quiz_passing_score' => 80,
            ]);

            $module->questions()->delete();
            $module->lessons()->delete();

            foreach ($this->lessons() as $position => $lessonData) {
                $lesson = $module->lessons()->create([
                    'title' => $lessonData['title'],
                    'summary' => $lessonData['summary'],
                    'duration_minutes' => $lessonData['minutes'],
                    'position' => $position + 1,
                ]);

                foreach ($lessonData['blocks'] as $blockPosition => $body) {
                    $lesson->blocks()->create(['type' => 'texto', 'body' => $body, 'position' => $blockPosition + 1]);
                }

                foreach ($lessonData['checkpoint'] as $questionPosition => $question) {
                    $module->questions()->create([...$question, 'lesson_id' => $lesson->id, 'is_checkpoint' => true, 'position' => $questionPosition + 1]);
                }

                foreach ($lessonData['bank'] as $questionPosition => $question) {
                    $module->questions()->create([...$question, 'lesson_id' => $lesson->id, 'position' => $questionPosition + 1]);
                }
            }

            // Completions of the old, text-only version no longer prove the new checkpoints were passed.
            $module->completions()->delete();
        });
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function lessons(): array
    {
        return [
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
                'checkpoint' => [
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
                'checkpoint' => [
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
                'checkpoint' => [
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
        ];
    }
}
