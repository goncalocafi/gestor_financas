# O Meu Gestor 💶

Aplicação web de gestão financeira pessoal — mobile-first, com despesas variáveis,
despesas fixas recorrentes, filtros por mês/ano e gráfico de gastos por categoria.

## Stack

- **React 19 + TypeScript + Vite** — rápido e deploy direto em Vercel/Netlify
- **Tailwind CSS v4** — estilo
- **Recharts** — gráfico circular por categoria
- **Firebase** — Auth (Google) + Cloud Firestore (tempo real)

## Estrutura

```
src/
  lib/firebase.ts        # inicialização do Firebase (env vars)
  types.ts               # tipos de domínio + helpers (mês, moeda)
  services/              # camada de dados (Firestore) — sem UI
    expenses.ts          # despesas variáveis
    fixedExpenses.ts     # despesas fixas recorrentes
  hooks/
    useAuth.tsx          # contexto de autenticação
    useMonthData.ts      # agregação do mês: totais + categorias
  components/            # UI reutilizável (forms, listas, gráfico, nav)
  pages/                 # Login, Dashboard (Resumo), Despesas, Fixas
firestore.rules          # regras de segurança (isolamento por utilizador)
```

## Modelo de dados (Firestore)

- `users/{uid}/expenses/{id}` — `description, amount, date ("YYYY-MM-DD"), category, createdAt`
- `users/{uid}/fixedExpenses/{id}` — `description, amount, category, startMonth ("YYYY-MM"), endMonth (null = ativa), createdAt`

Uma despesa fixa conta automaticamente em todos os meses entre `startMonth` e
`endMonth` — sem registos repetidos. As regras em `firestore.rules` garantem que
cada utilizador só lê/escreve os seus próprios dados.

## Configuração

1. Cria um projeto na [Consola Firebase](https://console.firebase.google.com):
   - **Authentication** → ativa o fornecedor **Google**
   - **Firestore Database** → cria a base de dados e publica o conteúdo de `firestore.rules`
2. Copia `.env.example` para `.env.local` e preenche com a config da tua web app.
3. Instala e corre:

```bash
npm install
npm run dev
```

## Deploy (Vercel ou Netlify)

- Importa o repositório; build `npm run build`, output `dist` (já configurado em
  `vercel.json` / `netlify.toml`, incluindo rewrites para SPA).
- Define as variáveis `VITE_FIREBASE_*` nas settings do projeto.
- Adiciona o domínio de produção em Firebase → Authentication → **Authorized domains**.
