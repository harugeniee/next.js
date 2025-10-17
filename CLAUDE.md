---
alwaysApply: true
---

# CLAUDE.md — Next.js 15+ Frontend-Only Project Specification

## 📋 Project Overview

This repository contains a **Next.js 15+ frontend-only application**, built as a modern blogging and article publishing platform.  
It leverages the latest ecosystem tools to deliver **a beautiful UI, responsive experience, and strong maintainability**.

---

## 🤖 AI Development Assistant Guidelines

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

#### Next.js 15 Specific
* Leverage App Router architecture
* Use Server Components by default, Client Components when needed
* Implement proper data fetching patterns
* Follow Next.js 15 caching and optimization strategies

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
When working with Next.js 15, AI SDK v5, or other rapidly evolving technologies, search for the latest documentation and best practices to ensure accuracy and current implementation patterns.

---

## 🛠️ Core Technologies

### 🧱 Framework & Core
- **Next.js 15.5.4** — React framework with App Router
- **React 19.2.0** — Core UI library
- **TypeScript 5** — Full type safety
- **Yarn v3+ (Berry)** — Package manager
- **AI SDK v5** — Latest AI integration patterns and APIs

### 🎨 UI & Styling
- **shadcn/ui** — New York–style component system with custom theme variants
- **TailwindCSS 4** — Utility-first CSS
- **Radix UI** — Accessible primitives
- **Lucide React** — Icon library
- **next-themes** — Dark/light theme management
- **tw-animate-css** — Animation utilities

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
│   └── shared/            # Reusable utilities (skeletons, helpers)
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
│   ├── utils/             # Utility functions
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
9. ⌛ **Skeleton Loading** — Placeholder states for async content with Skeletonize component.  
10. 🔔 **Toast Notifications** — Rich toast system with Sonner integration.  
11. 📝 **Form Validation** — Real-time Zod schema validation with React Hook Form.  
12. 🎯 **Middleware Protection** — Route-based authentication middleware.

---

## 🎨 UI/UX Features

| Feature | Description |
|----------|--------------|
| 🌗 Dark/Light Mode | Theme toggle with `next-themes` + multiple color variants |
| 📱 Responsive Design | Mobile-first + adaptive layouts with TailwindCSS |
| ♿ Accessibility | WCAG 2.1 compliance via Radix primitives |
| ⏳ Skeleton Loading | Smooth loading transitions with Skeletonize component |
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
- **Custom Hooks** — Reusable logic for auth, content, media, reactions  
- **Theme Testing** — Multiple theme testing pages for development  

---

## 🧭 Development Guidelines

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

---

## ✅ Definition of Done

| Checkpoint | Required |
|-------------|-----------|
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

---

## 🧾 Summary

This project exemplifies a **modern, modular, frontend-only Next.js 15+ application**, integrating **shadcn/ui**, **TailwindCSS**, **TipTap**, **Firebase Auth**, and **Jotai** to deliver a premium editing and viewing experience.  

**Key Highlights:**
- **Advanced Theme System** — 12+ color variants with dark/light modes
- **Rich Text Editor** — TipTap with syntax highlighting, Mermaid diagrams, and Markdown support
- **Comprehensive Auth** — Firebase Auth with OAuth (Google, GitHub, Twitter) and custom state management
- **Internationalization** — Full EN/VI support with 9 namespaces
- **Rate Limiting** — Client-side rate limit handling with event bus system
- **HTTP Management** — Axios interceptors with automatic token refresh
- **Testing** — Jest + RTL with 80% coverage threshold
- **Type Safety** — Strict TypeScript with Zod validation

Its codebase follows strict architecture, accessibility, and i18n standards — designed for scalability, developer experience, and user delight.
