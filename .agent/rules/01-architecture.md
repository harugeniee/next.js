---
alwaysApply: true
---

# Architecture & Environment

## Project Structure

```
src/
├── app/                        # App Router pages (all client components)
│   ├── admin/                  # Admin panel (15+ management sections)
│   ├── article/                # Article viewing
│   ├── auth/                   # Authentication (login, register, callback)
│   ├── organizations/          # Organization pages
│   ├── segments/               # Segment pages
│   ├── series/                 # Series pages
│   ├── settings/               # User settings
│   ├── user/                   # User profiles
│   ├── write/                  # Article writing
│   └── layout.tsx              # Root layout with providers
├── components/
│   ├── ui/                     # shadcn/ui primitives + custom
│   │   ├── core/               # Basic components (button, input, card)
│   │   ├── layout/             # Dialogs, forms, dropdowns
│   │   ├── navigation/         # Breadcrumb, sidebar, nav
│   │   ├── theme/              # Theme switchers, color pickers
│   │   ├── utilities/          # Utility components
│   │   └── dracula/            # Dracula theme variants
│   ├── features/               # Domain components
│   │   ├── admin/              # Admin components (129 files)
│   │   ├── auth/               # Authentication
│   │   ├── navigation/         # Site navigation
│   │   ├── series/             # Series management
│   │   ├── text-editor/        # TipTap editor
│   │   └── ...                 # Other domains
│   ├── providers/              # Context providers
│   │   ├── auth-provider.tsx
│   │   ├── i18n-provider.tsx
│   │   ├── react-query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── ...
│   └── shared/                 # Reusable utilities
│       ├── animated-section.tsx
│       ├── animated-grid.tsx
│       ├── animated-header.tsx
│       └── skeletonize.tsx
├── hooks/                      # Custom React hooks
│   ├── admin/                  # Admin CRUD hooks (17 files)
│   ├── series/                 # Series hooks
│   ├── auth/                   # Auth hooks
│   ├── ui/                     # UI hooks (metadata, breadcrumb)
│   └── ...                     # Domain hooks
├── lib/
│   ├── api/                    # API wrapper classes (24 files)
│   ├── http/                   # HTTP client + interceptors
│   ├── auth/                   # Firebase + auth store (Jotai)
│   ├── interface/              # TypeScript interfaces (20 files)
│   ├── types/                  # TypeScript types (10 files)
│   ├── validators/             # Zod schemas (14 files)
│   ├── utils/                  # Utilities
│   │   ├── query-keys.ts       # TanStack Query key factory
│   │   └── animations.ts       # Animation variants
│   └── constants/              # App constants
├── i18n/
│   └── locales/                # Translation files
│       ├── en/                 # English (19 JSON files)
│       └── vi/                 # Vietnamese (19 JSON files)
└── __tests__/                  # Jest + RTL tests
```

## Frontend-Only Rules

This is a **frontend-only** application. The following are strictly prohibited:

| Prohibited | Reason |
|------------|--------|
| `"use server"` directives | No server actions |
| `app/api/*` routes | No API routes |
| Direct database access | No DB SDKs in client |
| Non-public env vars | Only `NEXT_PUBLIC_*` allowed |
| Server-side secrets | All secrets on backend |

**All network requests MUST go through `@/lib/http/client.ts`**

## Core Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.0.8 |
| UI Library | React | 19.2.1 |
| Language | TypeScript | 5.x (strict) |
| Styling | TailwindCSS | 4.x |
| Components | shadcn/ui | Latest |
| Server State | TanStack Query | 5.90.3 |
| Client State | Jotai | 2.13.1 |
| Forms | React Hook Form | 7.62.0 |
| Validation | Zod | 4.1.5 |
| HTTP | Axios | 1.12.0 |
| Auth | Firebase | 12.2.1 |
| i18n | next-intl | 4.5.8 |
| Editor | TipTap | 3.6.6 |
| Animation | framer-motion | 12.23.24 |

## Environment & Tooling

| Tool | Configuration |
|------|---------------|
| Package Manager | Yarn 4.12.0 (`packageManager` in package.json) |
| Bundler | Turbopack (dev and build) |
| Dev Port | 3001 (`cross-env PORT=3001`) |
| Node.js | 20.9+ required |
| Linting | ESLint 9 + eslint-config-next |
| Formatting | Prettier 3.6.2 |
| Testing | Jest 30 + Testing Library |

## Yarn Commands

```bash
# Development
yarn dev              # Start dev server (PORT=3001 with turbopack)
yarn build            # Build for production with turbopack
yarn start            # Start production server (PORT=3001)

# Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint issues
yarn format           # Format with Prettier
yarn format:check     # Check formatting
yarn type-check       # TypeScript type checking
yarn check:all        # Run lint + type-check + format:check

# Testing
yarn test             # Run Jest tests
yarn test:watch       # Watch mode
yarn test:coverage    # Coverage report (80% threshold)

# Maintenance
yarn clean            # Remove .next, out, dist
yarn clean:all        # Remove node_modules and reinstall
yarn outdated         # Check for outdated packages
```

## Provider Hierarchy

The root layout wraps the app in providers in this order:

```tsx
// src/app/layout.tsx
<NoSSR>
  <ReactQueryProvider>
    <I18nProvider>
      <ThemeProvider>
        <FontProvider>
          <AuthProvider>
            <LoadingProvider>
              <RateLimitProvider>
                <GoogleOneTapProvider />
                <ConditionalLayout>{children}</ConditionalLayout>
              </RateLimitProvider>
            </LoadingProvider>
          </AuthProvider>
        </FontProvider>
      </ThemeProvider>
    </I18nProvider>
  </ReactQueryProvider>
</NoSSR>
```

**Note:** The entire app is wrapped in `NoSSR`, meaning all rendering is client-side.
