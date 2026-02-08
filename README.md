# Billing UI

Frontend React para o backend [app-billing](../app-billing). Consome a API REST para gerenciar portfólios, buckets, transações e usuários.

## Tecnologias

- **React 19** + **Vite**
- **TanStack Query** – cache e sincronização de dados
- **React Router** – navegação
- **Tailwind CSS** – estilos
- **TypeScript**

## Práticas aplicadas

Baseado em [vercel-react-native-skills](.agents/skills/vercel-react-native-skills/):

- **Estado**: minimizar variáveis, derivar valores, fallback state, dispatch updaters
- **Renderização**: evitar `&&` com valores falsy, usar ternário ou early return
- **Design system**: componentes reutilizáveis em `src/components/ui`
- **Intl**: formatadores hoisted em `src/lib/formatters.ts`
- **API client**: tipagem forte, cliente centralizado em `src/lib/api.ts`

## Como rodar

1. Inicie o backend (app-billing):
   ```bash
   cd ../app-billing && npm run dev
   ```

2. Instale dependências e inicie o frontend:
   ```bash
   npm install
   npm run dev
   ```

3. Acesse http://localhost:3000

O Vite está configurado para fazer proxy de `/api` para o backend em `localhost:8787`.

## Estrutura

```
src/
├── components/    # Layout, UI primitivos
├── hooks/         # TanStack Query hooks (use-api.ts)
├── lib/           # API client, formatters
├── pages/         # Páginas por rota
├── types/         # Tipos da API
├── App.tsx
├── main.tsx
└── index.css
```
