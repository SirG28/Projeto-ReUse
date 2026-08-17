# ReUse — App de Reutilização

## Sobre o projeto

O **ReUse** é um aplicativo mobile desenvolvido em **React Native (Expo)** com o objetivo de conectar pessoas para reutilização de itens, reduzindo desperdício e incentivando o consumo consciente.

Nesta fase, o aplicativo evoluiu de uma aplicação puramente local para uma aplicação **conectada a APIs externas**, com **autenticação real**, **gerenciamento de sessões** e **caching local com fallback offline**.

---

## Objetivos da fase atual

- Consumir múltiplas APIs externas (públicas e com autenticação)
- Implementar autenticação real com sessões persistentes
- Aplicar caching local com TTL e fallback offline
- Detectar mudanças de conectividade em tempo real

---

## APIs integradas

| API | Tipo | Telas onde é usada |
|---|---|---|
| **MockAPI** (`/users`) | REST (GET/POST) | Login, Cadastro |
| **MockAPI** (`/items`) | REST (GET/POST) | Home (feed), Publicar Item |
| **ViaCEP** | API pública | Cadastro (autopreenchimento de endereço) |
| **GNews** | API com chave (token) | Dicas Sustentáveis |

---

## Autenticação e sessões

- **Cadastro**: cria usuário no MockAPI via POST e faz auto-login.
- **Login**: busca usuário pelo e-mail no MockAPI e valida senha (filtragem client-side, ver Considerações Técnicas abaixo).
- **Sessão persistente**: `@reuse_logado` e `@reuse_usuario` salvos em AsyncStorage; ao abrir o app, redireciona automaticamente para a Home se houver sessão ativa.
- **Logout**: limpa as chaves de sessão do AsyncStorage.

---

## Caching local

Helper centralizado em `services/cacheService.ts` com **TTL configurável** e **fallback para cache antigo (stale)** em caso de falha de rede.

| Chave | Conteúdo | TTL |
|---|---|---|
| `@cache_items` | Feed de itens (MockAPI) | 5 min |
| `@cache_news` | Notícias da GNews | 1 hora |
| `@reuse_usuario` | Dados do usuário logado | sem expiração |
| `@reuse_logado` | Flag de sessão ativa | sem expiração |
| `@reuse_email` / `@reuse_lembrar` | Lembrar de mim | sem expiração |
| `@reuse_itens` | Itens próprios publicados | sem expiração |
| `@reuse_pontos` | Pontos de gamificação (XP) | sem expiração |

**Estratégia:** cache-first → fallback API → fallback cache antigo. Detecção de offline via `@react-native-community/netinfo` exibe banner amarelo no topo das telas Home e Dicas.

---

## Telas

| Tela | Fase em que foi criada | Recursos |
|---|---|---|
| Apresentação | Anterior | Boas-vindas + redirecionamento para login |
| Login | Anterior (atualizada) | Autenticação real via MockAPI |
| **Cadastro** | **Atual (nova)** | POST no MockAPI + ViaCEP autopreenchendo endereço |
| Home / Feed | Anterior (atualizada) | Lista de itens da API, cache 5 min, pull-to-refresh, banner offline |
| Publicar Item | Anterior (atualizada) | POST no MockAPI + persistência local em AsyncStorage |
| **Dicas Sustentáveis** | **Atual (nova)** | Notícias da GNews, cache 1 h, abertura no navegador |
| Perfil | Anterior (atualizada) | Dados do usuário autenticado + logout |
| Meus Itens | Anterior | Itens próprios persistidos localmente |

---

## Estrutura de pastas relevante

```
app/
  index.tsx          → splash / verificação de sessão
  login.tsx          → tela de login
  register.tsx       → tela de cadastro (nova)
  home.tsx           → feed de itens (consome MockAPI + cache)
  tips.tsx           → dicas sustentáveis (nova, GNews + cache)
  PublicItem.tsx     → publicar item (POST MockAPI + AsyncStorage)
  myItems.tsx        → itens publicados pelo usuário
  profile.tsx        → perfil + logout

services/            ← camada de comunicação com APIs
  api.ts             → cliente axios base + interceptors
  authService.ts     → login, cadastro, logout, sessão
  itemsService.ts    → busca e cria itens (com cache)
  cepService.ts      → integração com ViaCEP
  newsService.ts     → integração com GNews (com cache)
  cacheService.ts    → utilitário genérico de cache com TTL

components/
  OfflineBanner.tsx  → banner de offline (NetInfo)
  ...                → componentes existentes
```

---

## Tecnologias

- **React Native** + **Expo** (SDK 54) + **Expo Router**
- **TypeScript**
- **axios** (cliente HTTP)
- **@react-native-async-storage/async-storage** (cache e sessão)
- **@react-native-community/netinfo** (detecção de conectividade)
- **expo-image-picker** (câmera, mantida da fase anterior)

---

## Como rodar o projeto

### Pré-requisitos

- **Node.js** 18 ou superior
- **npm** (instalado com o Node)
- App **Expo Go** instalado no celular (Android ou iOS) — disponível na Google Play e App Store
- Celular e computador na mesma rede Wi-Fi

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/SirG28/app-reuse.git
cd app-reuse

# 2. Instalar dependências
npm install

# 3. Rodar o servidor de desenvolvimento
npx expo start
```

O Expo vai abrir um terminal interativo com um QR Code. Abra o **Expo Go** no celular e escaneie o QR Code para carregar o app.

> Se preferir rodar em emulador Android/iOS, use `npx expo start --android` ou `npx expo start --ios` (requer Android Studio ou Xcode configurados).

### Testando o aplicativo

1. Na tela inicial, clique em **"Começar"** → vai para a tela de Login.
2. Como não há mais usuários hardcoded, **clique em "Criar conta"** para abrir a tela de Cadastro.
3. Preencha:
   - Nome, e-mail (qualquer e-mail novo), senha (mínimo 4 caracteres)
   - **CEP** — digite um CEP válido (ex.: `01310100`) e veja **cidade/estado serem preenchidos automaticamente** pelo ViaCEP.
4. Clique em **"Criar conta"** → será redirecionada para a Home.
5. Na Home: explore o **feed de itens** (vindos do MockAPI) e o atalho **"Dicas Sustentáveis"** (notícias reais da GNews).
6. Teste o **modo offline**: ative o modo avião do celular e veja o banner amarelo aparecer no topo, com os dados ainda sendo exibidos do cache.
7. Toque em uma dica sustentável → o artigo abre no navegador externo.
8. Vá ao **Perfil** → veja os dados cadastrados (incluindo cidade/estado preenchidos pelo CEP) → clique em "Sair da conta" para fazer logout.

### Configuração das APIs

O projeto usa **MockAPI** e **GNews**, ambas com configurações via constantes no código:

- **MockAPI**: a `API_BASE_URL` está configurada em `services/api.ts`. O projeto público usado já está populado com dados de teste.
- **GNews**: a `GNEWS_API_KEY` está configurada em `services/newsService.ts`.

> **Para o professor:** caso queira recriar o ambiente em uma instância MockAPI própria, basta criar um projeto em [mockapi.io](https://mockapi.io) com os resources `users` e `items`, e substituir a `API_BASE_URL`. O schema de campos está documentado no PDF de entrega.

---

## Considerações técnicas

- **Filtragem de usuários por e-mail é feita client-side** porque a instância do MockAPI utilizada retorna 404 ao receber filtros via query string em GET. Em produção real, seria feita no backend.
- **Senhas são armazenadas em texto puro no MockAPI** — apenas para fins acadêmicos. Em produção, usaria-se hash (bcrypt), JWT e backend customizado.
- **Cache stale**: em caso de falha da API, o app retorna os dados em cache mesmo expirados, garantindo experiência offline.

---

## Integrantes

- **Ana Carolina Cantarelli Fernandes** — RM: 561491
- **Sarah Gonçalves Garcia** — RM: 563539