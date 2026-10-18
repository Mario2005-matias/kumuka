# KUMUKA

Plataforma de aprendizagem e desenvolvimento profissional que ajuda jovens a
desenvolver competências, acompanhar o seu percurso, construir um portefólio e
descobrir experiências e oportunidades.

> **Estado do projecto:** este repositório contém actualmente o frontend da
> KUMUKA. Os dados de demonstração são servidos por mocks locais; não existe
> aqui uma API/backend de produção.

## Funcionalidades

- **Aprendizagem:** catálogo de trilhas e cursos, módulos, actividades,
  acompanhamento de progresso e páginas de conclusão.
- **Experiências e oportunidades:** pesquisa e filtros, páginas de detalhe,
  inscrições em experiências e candidaturas a oportunidades, usando os mocks.
- **Perfil e jornada:** painel, perfil, competências, projectos, conquistas e
  visão do progresso de aprendizagem.
- **Onboarding e autenticação:** fluxo de apresentação e entrada na aplicação,
  actualmente apoiados por dados de demonstração.
- **Interface multilingue:** português (predefinido), inglês e francês. A
  preferência é guardada no navegador.
- **Temas:** claro, escuro e preferência do sistema, com a escolha guardada no
  navegador.
- **Design responsivo:** layouts públicos e autenticados adaptados a diferentes
  tamanhos de ecrã.

O conteúdo de demonstração pode permanecer no seu idioma de origem; os rótulos,
acções, mensagens de validação e restantes textos da interface estão
localizados.

## Tecnologias

- React 19 e TypeScript
- Vite 8
- React Router
- Tailwind CSS 4 e componentes React
- TanStack Query e Axios
- Zustand
- React Hook Form e Zod
- i18next e react-i18next
- GSAP e Motion para interacções e animações seleccionadas

## Requisitos

- Node.js **20.19+** ou **22.12+**
- npm
- Git, para clonar o repositório

## Começar

Na raiz do repositório, instala as dependências do frontend:

```bash
cd frontend
npm ci
```

Cria o ficheiro local de ambiente a partir do exemplo.

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

O `.env.example` activa os mocks para desenvolvimento:

```dotenv
VITE_USE_MOCKS=true
VITE_API_URL=/api
```

Inicia o servidor local:

```bash
npm run dev
```

Abre no navegador o endereço apresentado pelo Vite, normalmente
`http://localhost:5173`.

### Conta de demonstração

Com os mocks activos, pode iniciar sessão com:

- **Email:** `maria.silva@kumuka.ao`
- **Palavra-passe:** `123456`

Esta conta é apenas para desenvolvimento e demonstração. Não reutilizes estas
credenciais fora do ambiente local. Os registos e o progresso mock podem ser
guardados no `localStorage` do navegador.

## Comandos disponíveis

Executa estes comandos a partir de `frontend/`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite. |
| `npm run build` | Verifica os tipos TypeScript e cria a build de produção em `dist/`. |
| `npm run lint` | Executa o ESLint no frontend. |
| `npm run preview` | Serve localmente a build de produção para pré-visualização. |

## Configuração de ambiente

| Variável | Finalidade | Valor local de exemplo |
| --- | --- | --- |
| `VITE_USE_MOCKS` | Activa os dados e handlers de demonstração em desenvolvimento. | `true` |
| `VITE_API_URL` | URL base da API usada quando os mocks estão desactivados. | `/api` |

As variáveis `VITE_*` são incorporadas no código cliente durante a build. Não
coloques segredos, tokens privados ou credenciais reais nestas variáveis.

Os mocks só são usados em desenvolvimento e não podem ser activados numa build
de produção. Para apontar o frontend a uma API, define `VITE_USE_MOCKS=false` e
configura `VITE_API_URL` com a URL acessível pelo navegador. O backend não faz
parte deste repositório: a API terá de estar disponível e implementar os
contratos esperados pelo frontend.

## Idiomas

A aplicação inclui:

- `pt` — português, idioma predefinido e de fallback;
- `en` — inglês;
- `fr` — francês.

Os recursos estão em `frontend/public/locales/<idioma>/<namespace>.json`.
Para acrescentar ou alterar texto:

1. Actualiza o recurso português e replica a mesma chave nos recursos inglês e
   francês.
2. Usa `useTranslation('<namespace>')` nos componentes React.
3. Mantém as chaves alinhadas entre idiomas e usa os formatos de plural do
   i18next para textos contáveis.
4. Preserva o idioma de origem dos dados de demonstração e do conteúdo de
   domínio, salvo se existir uma necessidade explícita de o traduzir.

O idioma seleccionado é guardado em `localStorage` com a chave
`kumuka-language`. A documentação adicional encontra-se em
[frontend/README.md](./frontend/README.md).

## Estrutura do repositório

```text
.
├── README.md
└── frontend/
    ├── public/
    │   └── locales/       # Recursos de tradução
    └── src/
        ├── app/            # Router, guards e configuração da aplicação
        ├── components/     # Componentes partilhados e layouts
        ├── features/       # Funcionalidades organizadas por área
        ├── i18n/           # Configuração e tipos de tradução
        ├── lib/            # Utilitários, API e mocks
        ├── stores/          # Estado partilhado
        └── types/           # Tipos TypeScript
```

Para conhecer os handlers, entidades e limitações dos dados de demonstração,
consulta [a documentação dos mocks](./frontend/src/lib/mocks/README.md).

## Contribuir

1. Cria uma branch para a tua alteração.
2. Mantém as mudanças focadas e segue os padrões existentes no frontend.
3. Actualiza os três idiomas ao alterar textos da interface.
4. Executa `npm run lint` e `npm run build` em `frontend/`.
5. Abre um pull request com um resumo das alterações e os passos usados para as
   validar.

## Licença

Não foi identificada uma licença de distribuição neste repositório. Até ser
adicionada uma licença, não assumas que o código pode ser reutilizado,
redistribuído ou modificado fora dos termos aplicáveis.
