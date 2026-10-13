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
experiências, conquistas, progresso e competências. Há seis trilhas, cinco
cursos (a lista de cursos especifica cinco embora a regra de cobertura exija
seis), oito aprendizados, seis guias, dois projectos, seis experiências e seis
conquistas.

As seis experiências mantêm as datas do pedido, todas futuras; por isso não
existe uma experiência encerrada. As datas dos eventos continuam em formato
ISO de calendário (`YYYY-MM-DD`), tal como fornecidas.

## Convenções

- IDs sequenciais por entidade; slugs em português, kebab-case e sem acentos.
- Textos em português de Angola, com tratamento por tu.
- Datas de registo em ISO 8601 UTC; percentagens inteiras de 0 a 100.
- Duracões de trilhas e cursos em horas; de módulos e aprendizados em minutos.
- Preços expressos em kwanzas inteiros ou `null` para conteúdos gratuitos.
