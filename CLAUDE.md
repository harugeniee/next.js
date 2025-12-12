---
alwaysApply: true
---

# CLAUDE.md — Next.js 16+ Frontend-Only Project Specification

## 📋 Project Overview

This repository contains a **Next.js 16+ frontend-only application**, built as a modern blogging and article publishing platform.  
It leverages the latest ecosystem tools to deliver **a beautiful UI, responsive experience, and strong maintainability**.

---

## 🤖 AI Development Assistant Guidelines

You are a Senior Front-End Developer and expert in ReactJS, Next.js 16, JavaScript, TypeScript, HTML, CSS, and modern UI/UX frameworks (TailwindCSS, shadcn/ui, Radix). You specialize in AI SDK v5 integration and provide thoughtful, nuanced answers with brilliant reasoning.

### Core Responsibilities
* Follow user requirements precisely and to the letter
* Think step-by-step: describe your plan in detailed pseudocode first
* Confirm approach, then write complete, working code
* Write correct, best practice, DRY, bug-free, fully functional code
* Prioritize readable code over performance optimization
* Implement all requested functionality completely
* Leave NO todos, placeholders, or missing pieces
* Include all required imports and proper component naming
* Be concise and minimize unnecessary prose

## Technology Stack Focus
* **Next.js 16**: App Router, Server Components, Server Actions
* **AI SDK v5**: Latest patterns and integrations
* **shadcn/ui**: Component library implementation
* **TypeScript**: Strict typing and best practices
* **TailwindCSS**: Utility-first styling
* **Radix UI**: Accessible component primitives

### Code Implementation Rules

#### Code Quality
* Use early returns for better readability
* Use descriptive variable and function names
* Prefix event handlers with "handle" (handleClick, handleKeyDown)
* Use const over function declarations: `const toggle = () => {}`
* Define types when possible
* Implement proper accessibility features (tabindex, aria-label, keyboard events)

#### Styling Guidelines
* Always use Tailwind classes for styling
* Avoid CSS files or inline styles
* Use conditional classes efficiently
* Follow shadcn/ui patterns for component styling

#### Next.js 16 Specific
* Leverage App Router architecture
* Use Server Components by default, Client Components when needed
* Implement proper data fetching patterns
* Follow Next.js 16 caching and optimization strategies
* Use async params/searchParams in Server Components (all pages are client components, so useParams hook is used)

#### AI SDK v5 Integration
* Use latest AI SDK v5 patterns and APIs
* Implement proper error handling for AI operations
* Follow streaming and real-time response patterns
* Integrate with Next.js Server Actions when appropriate

### Response Protocol
1. If uncertain about correctness, state so explicitly
2. If you don't know something, admit it rather than guessing
3. Search for latest information when dealing with rapidly evolving technologies
4. Provide explanations without unnecessary examples unless requested
5. Stay on-point and avoid verbose explanations

### Knowledge Updates
When working with Next.js 16, AI SDK v5, or other rapidly evolving technologies, search for the latest documentation and best practices to ensure accuracy and current implementation patterns.

### MCP Tools Usage (MANDATORY)
**⚠️ CRITICAL: Always use MCP (Model Context Protocol) tools when available for tasks. This is MANDATORY.**

When performing any development task, you MUST prioritize using MCP tools over manual implementations or assumptions:

#### Available MCP Servers:
1. **shadcn MCP** — For adding/managing shadcn/ui components
   - Use `mcp_shadcn_*` tools to search, view, and add components
   - Always check available components before creating custom ones
   - Use `mcp_shadcn_get_add_command_for_items` to get installation commands
   - Use `mcp_shadcn_get_item_examples_from_registries` for usage examples

2. **GitHub MCP** — For repository management and GitHub operations
   - Use for creating issues, PRs, searching code, managing branches
   - Use `mcp_github_*` tools for all GitHub-related operations

3. **Next.js DevTools MCP** — For Next.js-specific operations
   - Use `mcp_next-devtools_*` tools for Next.js documentation and diagnostics
   - Use `mcp_next-devtools_nextjs_index` to discover running dev servers
   - Use `mcp_next-devtools_nextjs_call` for runtime diagnostics

4. **NX MCP** — For Nx workspace operations (if applicable)
   - Use `mcp_extension-nx-mcp_*` tools for Nx documentation and plugins

5. **Browser Extension MCP** — For browser automation and testing
   - Use `mcp_cursor-browser-extension_*` tools for browser interactions

#### MCP Usage Rules:
- **Before creating components**: Check shadcn MCP for existing components
- **Before adding UI primitives**: Use `mcp_shadcn_search_items_in_registries` to find available components
- **Before implementing features**: Check Next.js MCP for official documentation
- **When working with GitHub**: Use GitHub MCP tools instead of manual git operations
- **Always prefer MCP tools** over manual implementations when equivalent functionality exists

#### Example Workflow:
1. User requests: "Add a hover card component"
2. **MUST DO**: Use `mcp_shadcn_search_items_in_registries` to find hover-card
3. **MUST DO**: Use `mcp_shadcn_get_add_command_for_items` to get installation command
4. **MUST DO**: Use `mcp_shadcn_get_item_examples_from_registries` for usage examples
5. Then implement using the MCP-provided component

**Failure to use MCP tools when available will result in incomplete or incorrect implementations.**

---

## 🛠️ Core Technologies

### 🧱 Framework & Core
- **Next.js 16.0.8** — React framework with App Router
- **React 19.2.1** — Core UI library
- **TypeScript 5** — Full type safety
- **Yarn v3+ (Berry)** — Package manager
- **AI SDK v5** — Latest AI integration patterns and APIs

### 🎨 UI & Styling
- **shadcn/ui** — New York–style component system with custom theme variants
- **TailwindCSS 4** — Utility-first CSS
- **Radix UI** — Accessible primitives
- **Lucide React** — Icon library
- **next-themes** — Dark/light theme management
- **framer-motion** — Animation library for smooth transitions and page animations
- **Global Animation System** — Reusable animation components (AnimatedSection, AnimatedGrid, AnimatedHeader) with pre-configured variants

### 🖋️ Rich Text Editor
- **TipTap 3.6.6** — Modern rich text editor
- **@tiptap/react** — React integration
- **@tiptap/starter-kit** — Base extension set
- **@tiptap/extension-*** — Code blocks, links, highlights, tasks, etc.
- **highlight.js / lowlight** — Syntax highlighting
- **mermaid** — Diagram rendering
- **tiptap-markdown** — Markdown support

### 💾 State & Data Management
- **Jotai** — Atomic state management
- **TanStack Query** — Server state management and data fetching
- **Axios** — HTTP client with interceptors
- **React Hook Form** — Form control
- **Zod** — Schema validation

### 🔐 Authentication
- **Firebase Auth** — Authentication provider
- **OAuth (Google, GitHub, Twitter)** — Social login support
- **Custom auth store** — Jotai-based auth state management

### 🌐 Internationalization
- **next-intl** — Multi-language support  
  → Supported: **English** and **Vietnamese**
  → Namespaces: auth, article, common, demo, home, profile, toast, user, write

### 🧪 Testing & Quality
- **Jest** — Unit testing framework
- **@testing-library/react** — UI test utilities
- **Coverage threshold: 80%**
- **ESLint + Prettier** — Code quality and style enforcement
- **Turbopack** — Development bundler

---

## 🏗️ Project Architecture

### 📂 Folder Structure
```
src/
├── app/                    # App Router pages (no server actions)
│   ├── auth/              # Authentication pages (login, register)
│   ├── article/           # Article viewing pages
│   ├── user/              # User profile pages
│   ├── write/             # Article writing page
│   └── theme-*/           # Theme testing pages
├── components/
│   ├── ui/                 # shadcn/ui primitives + custom components
│   │   ├── core/          # Basic UI components (button, input, card, etc.)
│   │   ├── layout/        # Layout components (dialog, dropdown, form)
│   │   ├── navigation/     # Navigation components
│   │   ├── theme/         # Theme-related components
│   │   ├── utilities/     # Utility components
│   │   └── dracula/       # Dracula theme variants
│   ├── features/          # Business logic & domain components
│   │   ├── auth/          # Authentication components
│   │   ├── navigation/    # Site navigation
│   │   ├── reactions/    # Like/reaction components
│   │   └── text-editor/   # TipTap editor components
│   ├── providers/         # Context providers (auth, i18n, theme, loading, rate-limit)
│   └── shared/            # Reusable utilities (skeletons, helpers, animations)
├── hooks/                  # Custom React hooks
│   ├── auth/              # Authentication hooks
│   ├── article/           # Article-related hooks
│   ├── content/           # Content rendering hooks
│   ├── media/             # Media handling hooks
│   ├── reactions/         # Reaction hooks
│   └── ui/                # UI-related hooks
├── lib/                    # Utilities, API, validators, stores
│   ├── api/               # API wrapper functions
│   ├── auth/              # Firebase auth configuration
│   ├── constants/         # Application constants
│   ├── http/              # HTTP client with interceptors
│   ├── interface/         # TypeScript interfaces
│   ├── rate-limit/        # Rate limiting utilities
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions (including animations.ts)
│   └── validators/        # Zod validation schemas
├── i18n/                   # Internationalization configuration
│   └── locales/           # Translation files (en, vi)
└── __tests__/              # Jest & RTL tests
```

### ⚙️ Architecture Principles
- **Frontend-only** — No `app/api` or `"use server"` blocks
- **Type-safe data flow** — All schemas validated via Zod
- **Atomic state** — Jotai for isolated reactive state
- **Strict typing** — TypeScript strict mode enabled
- **Theming** — Dark/light modes with multiple color variants
- **i18n-first design** — All text comes from locale files (`src/i18n/locales/{en,vi}`)
- **Rate limiting** — Client-side rate limit handling with event bus
- **HTTP interceptors** — Automatic token management and error handling

---

## ✨ Core Features

1. 🖋️ **Rich Text Editor** — TipTap-based editor with code highlighting, Mermaid diagrams, and Markdown support.  
2. 🎨 **Advanced Theme System** — Multiple color themes: Neutral, Stone, Zinc, Gray, Slate, Dracula with light/dark modes.  
3. 🔐 **Authentication** — Firebase Auth + OAuth (Google, GitHub, Twitter) with custom auth store.  
4. 🌍 **Internationalization** — Multi-language UI (EN + VI) with 9 namespaces.  
5. 📱 **Responsive Design** — Mobile-first layout with adaptive components.  
6. 🖼️ **Image Management** — Upload, crop, and render with Next.js Image optimization.  
7. ⚡ **Content Rendering** — Custom renderer for rich media and Markdown-like blocks.  
8. 🚦 **Rate Limiting** — Client-side rate limit handling with event bus system.  
9. ⌛ **Skeleton Loading** — Placeholder states for async content with Skeletonize component and CSS shimmer animations.  
10. 🎬 **Animation System** — Global animation system with framer-motion (AnimatedSection, AnimatedGrid, AnimatedHeader) for consistent page transitions.  
11. 🔔 **Toast Notifications** — Rich toast system with Sonner integration.  
12. 📝 **Form Validation** — Real-time Zod schema validation with React Hook Form.  
13. 🎯 **Middleware Protection** — Route-based authentication middleware.  
14. 🔄 **TanStack Query** — Advanced server state management with caching, background updates, and optimistic updates.

---

## 🎨 UI/UX Features

| Feature | Description |
|----------|--------------|
| 🌗 Dark/Light Mode | Theme toggle with `next-themes` + multiple color variants |
| 📱 Responsive Design | Mobile-first + adaptive layouts with TailwindCSS |
| ♿ Accessibility | WCAG 2.1 compliance via Radix primitives |
| ⏳ Skeleton Loading | Smooth loading transitions with Skeletonize component and CSS shimmer animations |
| 🎬 Page Animations | Global animation system with framer-motion (AnimatedSection/Grid/Header) |
| 🔔 Toast Notifications | Rich toast system with Sonner (success, error, info) |
| ✅ Form Validation | Real-time Zod schema validation with error messages |
| 🖼️ Image Optimization | Next.js `Image` with crop functionality |
| 🎨 Theme Variants | 12+ color themes (Neutral, Stone, Zinc, Gray, Slate, Dracula, etc.) |
| 🔐 Auth States | Loading states, error handling, OAuth integration |
| 🌍 Language Switching | Dynamic language switching with next-intl |
| 📝 Rich Editor | TipTap with syntax highlighting, diagrams, tasks |
| 🚦 Rate Limit UI | User-friendly rate limit notifications |

---

## 🔧 Development Features

- **TypeScript Strict Mode** — Full type safety with strict configuration  
- **Path Aliases** — Cleaner imports with `@/` alias system  
- **ESLint + Prettier** — Enforced lint & format with Next.js config  
- **Jest + RTL** — Comprehensive unit testing with 80% coverage threshold  
- **Hot Reloading** — Fast local iteration with Turbopack  
- **HTTP Interceptors** — Automatic token refresh and error handling  
- **Rate Limit Handling** — Client-side rate limit with event bus  
- **TanStack Query** — Advanced server state management with caching and background updates
- **Animation System** — Global animation components with framer-motion for consistent page transitions
- **Skeleton Loading** — CSS-based shimmer animations with Skeletonize component
- **Custom Hooks** — Reusable logic for auth, content, media, reactions  
- **Theme Testing** — Multiple theme testing pages for development  

---

## 🧭 Development Guidelines

- **MCP Tools First (MANDATORY)** — Always use available MCP tools before manual implementations. Check shadcn MCP for components, Next.js MCP for documentation, GitHub MCP for repository operations.
- **Frontend-only architecture** — No backend logic or database SDKs included.  
- **Centralized HTTP** — All API calls go through `src/lib/http/client.ts`.  
- **Environment variables** — Only use `NEXT_PUBLIC_*` environment variables.  
- **Styling** — Avoid inline styling; use TailwindCSS utilities and shadcn tokens.  
- **Internationalization** — All user-visible text must be i18n-driven from locale files.  
- **Testing** — Maintain ≥ 80% unit test coverage with Jest + RTL.  
- **File organization** — Keep files ≤ 300 lines, components ≤ 200 lines.  
- **Type safety** — Use Zod for validation, TypeScript interfaces for data structures.  
- **State management** — Use Jotai atoms for reactive state, avoid prop drilling.  
- **Error handling** — Implement proper error boundaries and user feedback.
- **Animations** — Use global animation components (AnimatedSection, AnimatedGrid, AnimatedHeader) from `@/components/shared` instead of custom animation code.
- **Skeleton loading** — Always provide placeholder divs with dimension classes (`h-*`, `w-*`, `aspect-*`) when using Skeletonize.

---

## ✅ Definition of Done

| Checkpoint | Required |
|-------------|-----------|
| MCP tools used when available | ✅ |
| No ESLint/TS warnings | ✅ |
| Theme supports dark/light + color variants | ✅ |
| Fully responsive (mobile-first) | ✅ |
| No `"use server"` or secret APIs | ✅ |
| Uses shadcn primitives with proper states | ✅ |
| i18n present for EN + VI (9 namespaces) | ✅ |
| Accessible (focus, aria, contrast) | ✅ |
| Test coverage ≥ 80% | ✅ |
| HTTP interceptors configured | ✅ |
| Rate limit handling implemented | ✅ |
| Form validation with Zod | ✅ |
| Error boundaries and user feedback | ✅ |
| Custom hooks for reusable logic | ✅ |
| TypeScript interfaces defined | ✅ |
| Loading states implemented | ✅ |
| Animation components used (AnimatedSection/Grid/Header) | ✅ |
| Skeletonize with placeholder divs | ✅ |
| No animation conflicts with skeleton | ✅ |

---

## 🧾 Summary

This project exemplifies a **modern, modular, frontend-only Next.js 16+ application**, integrating **shadcn/ui**, **TailwindCSS**, **TipTap**, **Firebase Auth**, **TanStack Query**, and **Jotai** to deliver a premium editing and viewing experience.  

**Key Highlights:**
- **Advanced Theme System** — 12+ color variants with dark/light modes
- **Rich Text Editor** — TipTap with syntax highlighting, Mermaid diagrams, and Markdown support
- **Comprehensive Auth** — Firebase Auth with OAuth (Google, GitHub, Twitter) and custom state management
- **TanStack Query** — Advanced server state management with caching, background updates, and optimistic updates
- **Internationalization** — Full EN/VI support with 9 namespaces
- **Rate Limiting** — Client-side rate limit handling with event bus system
- **HTTP Management** — Axios interceptors with automatic token refresh
- **Testing** — Jest + RTL with 80% coverage threshold
- **Type Safety** — Strict TypeScript with Zod validation

Its codebase follows strict architecture, accessibility, and i18n standards — designed for scalability, developer experience, and user delight.
