# Project Overview — Next.js 16+ Frontend-Only Project

> **Detailed rules are in separate files in this directory.**

## Project Overview

| Property | Value |
|----------|-------|
| Name | MangaSBS (msbs) |
| Stack | Next.js 16.0.8, React 19.2.1, TypeScript 5, TailwindCSS 4, shadcn/ui |
| Package Manager | Yarn 4.12.0 |
| Dev Server | \`PORT=3001\` with Turbopack |
| Testing | Jest + Testing Library (80% coverage threshold) |

## Quick Commands

\`\`\`bash
yarn dev          # Start dev server (PORT=3001 with turbopack)
yarn build        # Build for production with turbopack
yarn start        # Start production server (PORT=3001)
yarn lint         # Run linter (ESLint)
yarn format       # Format code (Prettier)
yarn type-check   # TypeScript type checking
yarn test         # Run tests (Jest + RTL, ≥80% coverage)
\`\`\`

## Frontend-Only Rules (CRITICAL)

- **NO** Server Actions (\`"use server"\`)
- **NO** \`app/api/*\` routes
- **NO** secrets/DB SDKs in client
- **ONLY** \`NEXT_PUBLIC_*\` environment variables
- **ALL** network through \`@/lib/http/client.ts\`

## Key Principles

1. **MCP Tools First** — Always use MCP tools when available.
2. **Mobile-first** — Base styles for mobile, scale up with \`sm\`/\`md\`/\`lg\`/\`xl\`/\`2xl\`
3. **Theme-aware** — Use shadcn tokens, no hardcoded colors
4. **i18n-first** — All text from \`src/i18n/locales/{en,vi}/*.json\` (19 namespaces)
5. **Type-safe** — TypeScript strict mode, Zod validation
6. **Client Components** — All pages use \`"use client"\` (wrapped in NoSSR)

## AI Assistant Guidelines

### Core Responsibilities
- Follow user requirements precisely
- Think step-by-step: describe plan in pseudocode first, then implement
- Write correct, DRY, bug-free, fully functional code
- Prioritize readable code over performance optimization
- Leave NO todos, placeholders, or missing pieces
- Include all required imports and proper component naming
- Be concise and minimize unnecessary prose

### Code Quality Rules
- Use early returns for better readability
- Use descriptive variable and function names
- Prefix event handlers with "handle" (handleClick, handleKeyDown)
- Use \`const\` arrow functions: \`const toggle = () => {}\`
- Define TypeScript types explicitly
- Implement accessibility features (tabindex, aria-label, keyboard events)

### Styling Rules
- Always use Tailwind classes for styling
- Avoid CSS files or inline styles
- Use conditional classes efficiently
- Follow shadcn/ui patterns for component styling

### Next.js 16 Specific
- All pages are client components with \`"use client"\`
- App is wrapped in \`NoSSR\` provider (no server-side rendering)
- Use \`useParams()\` hook for route parameters
- No Server Actions or API routes (frontend-only)

## MCP Tools Usage (MANDATORY)

**Always use MCP tools when available. This is MANDATORY.**

### Available MCP Servers
| Server | Purpose |
|--------|---------|
| **shadcn MCP** | Add/manage shadcn/ui components |
| **GitHub MCP** | Repository management, issues, PRs |
| **Next.js DevTools MCP** | Documentation, diagnostics |
| **Browser Extension MCP** | Browser automation and testing |

### MCP Workflow
Before creating any component:
1. **Search**: \`mcp_shadcn_search_items_in_registries\`
2. **Get command**: \`mcp_shadcn_get_add_command_for_items\`
3. **Get examples**: \`mcp_shadcn_get_item_examples_from_registries\`
4. Only create custom if not available

## Core Stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 16.0.8, React 19.2.1, TypeScript 5 |
| Styling | TailwindCSS 4, shadcn/ui, Radix UI |
| State | Jotai (client), TanStack Query (server) |
| Forms | React Hook Form + Zod |
| HTTP | Axios with interceptors |
| Auth | Firebase Auth + OAuth |
| i18n | next-intl (19 namespaces) |
| Editor | TipTap 3.6.6 |
| Animation | framer-motion |
| Testing | Jest + Testing Library |

## Key Patterns

### Data Fetching
\`\`\`typescript
// Use query key factory from @/lib/utils/query-keys
import { queryKeys } from "@/lib/utils/query-keys";

useQuery({
  queryKey: queryKeys.series.detail(seriesId),
  queryFn: () => SeriesAPI.getSeries(seriesId),
});
\`\`\`

### i18n
\`\`\`typescript
// Use useI18n() hook with namespace
const { t } = useI18n();
t("actions.edit", "common")  // namespace as second param
t("studios.list.title", "admin", { name: studio.name })  // with variables
\`\`\`

### HTTP Client
\`\`\`typescript
// All API calls through @/lib/http/client.ts
import { http } from "@/lib/http/client";

const response = await http.get<ApiResponse<T>>("/endpoint");
return response.data.data;
\`\`\`

### State Management
\`\`\`typescript
// Jotai atoms in @/lib/auth/auth-store.ts
import { currentUserAtom, authLoadingAtom } from "@/lib/auth";
const [user, setUser] = useAtom(currentUserAtom);
\`\`\`

## Project Structure

\`\`\`
src/
├── app/                    # App Router pages (all client components)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── features/           # Domain components
│   ├── providers/          # Context providers
│   └── shared/             # Reusable utilities
├── hooks/                  # React Query hooks + custom hooks
├── lib/
│   ├── api/                # API wrapper classes
│   ├── http/               # HTTP client + interceptors
│   ├── auth/               # Firebase + auth store
│   ├── interface/          # TypeScript interfaces
│   ├── types/              # TypeScript types
│   ├── validators/         # Zod schemas
│   └── utils/              # Utilities (query-keys, animations)
├── i18n/                   # Locales (en, vi)
└── __tests__/              # Jest tests
\`\`\`

## Definition of Done

- [ ] No TS/ESLint warnings
- [ ] Theme works in dark/light modes
- [ ] Mobile-first responsive
- [ ] No server actions or secrets
- [ ] Uses shadcn primitives with proper states
- [ ] i18n present for EN + VI
- [ ] Accessible (focus, aria, contrast)
- [ ] Uses query key factory
- [ ] Loading states implemented
- [ ] Toast notifications working
