# Desafio Front-End GitHub

**Preview:** https://desafio-front-lake.vercel.app/

Aplicacao para buscar usuarios do GitHub, visualizar os dados publicos do perfil e navegar pelos repositorios desse usuario. A ideia foi construir uma experiencia simples, responsiva e direta, com foco em consulta rapida e leitura clara das informacoes retornadas pela API do GitHub.

## O que a aplicacao faz

- Busca um usuario do GitHub pelo username.
- Exibe avatar, nome/login, bio, e-mail, seguidores e seguindo.
- Lista os repositorios publicos do usuario.
- Ordena os repositorios por estrelas, nome ou atualizacao.
- Pagina a listagem para evitar uma tela muito longa.
- Abre uma pagina de detalhes para cada repositorio.
- Mostra dados extras do repositorio, como dono, avatar, branch padrao, forks, watchers, issues abertas e branches publicas.
- Mantem a busca anterior ao voltar da pagina de detalhes.

## Stack usada

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Axios
- TanStack Query

## Como rodar o projeto

Instale as dependencias:

```bash
npm install
```

Crie o arquivo de ambiente local:

```bash
cp .env.example .env.local
```

O valor padrao esperado e:

```env
NEXT_PUBLIC_GITHUB_API_URL=https://api.github.com
```

Rode o projeto em desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Arquitetura

A estrutura foi pensada para separar responsabilidades e manter cada parte facil de entender.

```text
app/
  page.tsx
  repos/[owner]/[repo]/page.tsx
  layout.tsx
  providers.tsx

components/
  github-search-flow.tsx
  repository-details.tsx
  repository-list.tsx
  user-profile-summary.tsx
  ui/

hooks/
  use-github-user.ts
  use-github-user-repositories.ts
  use-github-repository.ts
  use-github-repository-branches.ts

lib/
  github-api.ts
  utils.ts

services/
  github.ts

types/
  github.ts
```

### `app`

Contem as rotas do Next.js. A home fica em `/`, e os detalhes do repositorio ficam em `/repos/[owner]/[repo]`.

### `components`

Contem as partes visuais da aplicacao. A busca, o card do usuario, a lista de repositorios e a tela de detalhes foram separados para evitar componentes grandes demais.

### `hooks`

Contem os hooks que conectam os componentes ao TanStack Query. Eles cuidam de cache, loading, erro e controle de quando uma requisicao pode ser feita.

### `services`

Contem a integracao com a API do GitHub. Os componentes nao chamam Axios diretamente.

### `lib`

Contem configuracoes e utilitarios compartilhados, como o cliente Axios.

### `types`

Contem os tipos TypeScript usados para os dados retornados pelo GitHub.

## Decisoes de implementacao

Usei TanStack Query para evitar controle manual demais de loading, erro e cache. Isso tambem ajuda quando o usuario navega entre a listagem e os detalhes de um repositorio.

A URL da API fica em variavel de ambiente:

```env
NEXT_PUBLIC_GITHUB_API_URL=https://api.github.com
```

Como a aplicacao consome uma API publica diretamente no navegador, nao ha token privado no projeto. Isso evita expor segredo no front-end, mas tambem significa que a aplicacao esta sujeita ao rate limit publico do GitHub.

O layout segue uma abordagem responsiva, com cards, grid, espacamentos consistentes e leitura confortavel em mobile e desktop.

## Problemas resolvidos

### Busca e estados da API

A aplicacao trata estado inicial, carregamento, erro e sucesso. Erros comuns, como usuario inexistente, falha de rede e limite de requisicoes do GitHub, sao convertidos em mensagens amigaveis.

### Rate limit do GitHub

Como a API e consumida sem autenticacao, o limite publico pode ser atingido durante testes repetidos. O projeto trata esse caso com mensagem de erro, sem quebrar a interface.

### Navegacao entre listagem e detalhes

Ao abrir um repositorio e voltar para a busca, a aplicacao preserva o username anterior na URL usando `?username=...`.

### Ordenacao e paginacao

A lista de repositorios e ordenada localmente, sem fazer novas chamadas HTTP. A paginacao tambem e local e reseta corretamente quando uma nova busca e feita.

### Seguranca basica

- Nenhum token privado e exposto.
- Links externos usam `rel="noreferrer"`.
- Textos vindos da API sao renderizados como texto, nao como HTML.
- Parametros de rota sao codificados com `encodeURIComponent`.
- O parametro de retorno da pagina de detalhes so aceita o formato esperado da busca.

## API usada

- Usuario: `GET /users/{username}`
- Repositorios do usuario: `GET /users/{username}/repos`
- Detalhes do repositorio: `GET /repos/{owner}/{repo}`
- Branches do repositorio: `GET /repos/{owner}/{repo}/branches`

Documentacao oficial: https://docs.github.com/rest
