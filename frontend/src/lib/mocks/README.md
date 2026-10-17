# Sistema de mocks KUMUKA

## Visão geral

Os mocks substituem temporariamente a API Laravel, ainda não disponível. Os
dados ficam em `data/`, o acesso é concentrado em `handlers/` e as páginas
consomem os dados por hooks TanStack Query. Os componentes não importam dados
mockados directamente.

## Activar ou desactivar

Em desenvolvimento, define `VITE_USE_MOCKS=true` no `.env`. Para usar a API,
define `VITE_USE_MOCKS=false`. O ficheiro `.env.production` mantém a flag
desactivada e a configuração também impede o uso de mocks em produção.

O utilizador de demonstração é `maria.silva@kumuka.ao`, com a palavra-passe
`123456`. Esta conta e os seus dados só são carregados pelo bundle de
desenvolvimento. A inicialização executa `seedMocks` e grava os registos em
`localStorage`.

## Estrutura

- `data/`: um ficheiro tipado por entidade e o barrel `index.ts`.
- `handlers/`: operações assíncronas que simulam os endpoints da API.
- `utils/`: atraso, filtragem, paginação, pesquisa e ordenação.
- `types/`: tipos de configuração específicos dos mocks.
- `seed.ts`: grava os registos de demonstração no armazenamento local.
- `config.ts`: latência, utilizador demo e simulação de erros.

## Adicionar uma entidade

1. Define o tipo de domínio em `src/types/`.
2. Cria `data/<entidade>.ts` com `import type`, JSDoc e `export const mock...`.
3. Exporta o conjunto em `data/index.ts`.
4. Cria um handler assíncrono em `handlers/<entidade>.handler.ts`; cada método
   começa com `await delay()` e retorna `null` quando um detalhe não existe.
5. Exporta o handler em `handlers/index.ts`.
6. Cria um hook TanStack Query que testa `env.useMocks` antes de chamar o
   handler, e usa Axios quando a flag estiver desligada.
7. Actualiza `seed.ts` e esta lista.

## Migrar para o backend

Configura `VITE_USE_MOCKS=false` e `VITE_API_URL` para a raiz da API. Os hooks
e `authApi` já encaminham as chamadas para Axios nessa configuração. Confirma
os contratos de resposta do Laravel e ajusta os tipos e caminhos da API; depois
remove `src/lib/mocks/` e as chamadas dinâmicas aos handlers.

## Mocks existentes

Utilizadores, perfis, trilhas, cursos, aprendizados curtos, guias, projectos,
experiências, oportunidades, empresas, conquistas, progresso e competências.
Há seis trilhas com 8, 6, 10, 6, 5 e 8 módulos, cinco cursos com 5, 4, 3, 5 e
4 módulos, oito aprendizados, seis guias, dois projectos, seis experiências,
cinco oportunidades, cinco empresas e oito conquistas.

### Trilhas e progresso

Cada trilha tem fases ordenadas, módulos, conteúdos (`contentItems`) e uma
actividade. O catálogo permite filtrar por pesquisa, nível, duração e
categoria. O progresso demonstra a trilha 1 concluída e a trilha 2 a 35%,
na fase 2, módulo 1. O catálogo guarda filtros na URL e em `localStorage`
(`kumuka-trails-filters`).

O progresso detalhado é guardado em `kumuka-mock-progress`: conteúdos lidos,
actividades submetidas, rascunhos e módulos concluídos. O fluxo é sequencial:
é necessário iniciar a trilha, ler todos os conteúdos do módulo e submeter a
actividade quando obrigatória antes de avançar. A conclusão final desbloqueia
a conquista `ach-007`. Os uploads de demonstração guardam apenas o nome do
ficheiro, não enviam conteúdo binário.

### Cursos e progresso

Os cinco cursos têm a quantidade de módulos especificada, três conteúdos e
uma actividade por módulo. O curso “Excel do Zero ao Avançado” tem cinco
módulos e retoma no quinto com 70% de progresso. A leitura, os rascunhos, as
actividades submetidas, os módulos concluídos e a conquista `ach-008` são
guardados em `kumuka-mock-progress`, partilhado com o painel e a jornada.
Os filtros de cursos ficam na URL e em `kumuka-courses-filters`. Uploads
guardam apenas o nome do ficheiro.

Para testar manualmente, inicia sessão como `maria.silva@kumuka.ao` /
`123456` e abre `/aprender/cursos`. Pesquisa “Excel” e confirma o progresso
demonstrativo; abre o curso e usa “Continuar” para retomar no módulo 5. Lê
cada conteúdo, guarda um rascunho, submete a actividade e avança pelos módulos.
No último módulo, conclui o curso e confirma a página de conclusão, o
certificado demonstrativo e a conquista no perfil. Actualiza a página durante
um módulo para verificar a persistência. Os módulos seguintes permanecem
bloqueados até à conclusão do anterior.

### Experiências

O catálogo permite filtrar por tipo, modalidade, período e localização, com
os filtros representados na URL. O detalhe inclui benefícios, requisitos,
programa, oradores, organizador e informação logística. As inscrições são
guardadas em `kumuka-mock-experience-registrations`, verificam vagas e impedem
uma segunda inscrição activa.

### Oportunidades e empresas

O catálogo filtra por tipo, área, empresa, localização, modalidade e prazo.
Os detalhes mostram responsabilidades, requisitos, benefícios e perfil da
empresa. Candidaturas e manifestações de interesse ficam em
`kumuka-mock-opportunity-applications` e são únicas por utilizador e
oportunidade. Os dados de demonstração incluem cinco empresas e cinco
oportunidades.

Para testar, inicia sessão como `maria.silva@kumuka.ao` / `123456` e abre
`/experiencias` ou `/oportunidades`. Abre um cartão para consultar os detalhes
e testar inscrição ou candidatura; regressa ou actualiza a página para
confirmar o estado guardado. A experiência `Futuro Carreira 2026` começa com
inscrição demo activa. As datas dos eventos e prazos usam ISO de calendário
(`YYYY-MM-DD`).

## Convenções

- IDs sequenciais por entidade; slugs em português, kebab-case e sem acentos.
- Textos em português de Angola, com tratamento por tu.
- Datas de registo em ISO 8601 UTC; percentagens inteiras de 0 a 100.
- Duracões de trilhas e cursos em horas; de módulos e aprendizados em minutos.
- Preços expressos em kwanzas inteiros ou `null` para conteúdos gratuitos.
