---
alwaysApply: true
---

# Naming Conventions & Imports

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `studio-form.tsx` |
| Hooks | camelCase | `useStudios.ts` |
| Types/Interfaces | kebab-case | `studio.interface.ts` |
| Validators | kebab-case | `series-validator.ts` |
| API files | kebab-case | `series.ts` |
| Constants | kebab-case | `app-constants.ts` |
| Utils | kebab-case | `query-keys.ts` |

## Component Naming

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `StudioForm` |
| Props interface | `{Name}Props` | `StudioFormProps` |
| Event handlers | `handle{Event}` | `handleSubmit`, `handleClick` |

```tsx
// ✅ CORRECT
interface StudioFormProps {
  studio?: Studio;
  onSubmit: (data: StudioFormData) => void;
}

export function StudioForm({ studio, onSubmit }: StudioFormProps) {
  const handleSubmit = (data: StudioFormData) => {
    onSubmit(data);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Hook Naming

| Type | Convention | Example |
|------|------------|---------|
| Hook file | camelCase | `useStudios.ts` |
| Hook function | `use{Name}` | `useStudios` |
| Query key | SCREAMING_SNAKE | `STUDIOS_QUERY_KEY` |

```typescript
// ✅ CORRECT
export const STUDIOS_QUERY_KEY = ["admin", "studios"];

export function useStudios(query?: StudioQueryDto) {
  // ...
}

export function useStudio(id: string) {
  // ...
}
```

## Import Conventions

### Path Alias

Always use `@/` alias. Never use deep relative paths.

```typescript
// ✅ CORRECT
import { Button } from "@/components/ui";
import { useStudios } from "@/hooks/admin/useStudios";
import { http } from "@/lib/http/client";

// ❌ WRONG
import { Button } from "../../../components/ui/core/button";
import { useStudios } from "../../hooks/admin/useStudios";
```

### Import Order

1. React/Next.js
2. External libraries
3. Internal aliases (@/)
4. Relative imports (if any)
5. Types

```typescript
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// 3. Internal aliases
import { Button } from "@/components/ui";
import { useI18n } from "@/components/providers/i18n-provider";
import { http } from "@/lib/http/client";

// 4. Types (last)
import type { Studio } from "@/lib/interface/studio.interface";
```

### Barrel Exports

Use `index.ts` files for clean exports:

```typescript
// src/components/ui/index.ts
export * from "./core";
export * from "./layout";
export * from "./navigation";

// Usage
import { Button, Card, Input } from "@/components/ui";
```

## Export Conventions

| Type | Export Style |
|------|--------------|
| Pages/Layouts | `export default` |
| Components | Named export |
| Hooks | Named export |
| Types | Named export |
| Utils | Named export |

```typescript
// Page - default export
export default function StudiosPage() { ... }

// Component - named export
export function StudiosList() { ... }

// Hook - named export
export function useStudios() { ... }

// Type - named export
export interface Studio { ... }
```

## File Size Limits

| Type | Max Lines |
|------|-----------|
| Components | 200 lines |
| Files (general) | 300 lines |

If exceeding limits, split into smaller files.

## Type File Organization

```
src/lib/
├── interface/              # Entity interfaces
│   ├── base.interface.ts
│   ├── user.interface.ts
│   ├── series.interface.ts
│   └── studio.interface.ts
├── types/                  # Utility types
│   ├── response.ts         # API response types
│   ├── query.ts            # Query parameter types
│   └── index.ts
└── validators/             # Zod schemas
    ├── auth.ts
    ├── series.ts
    └── index.ts
```

## Naming Patterns

### Interface vs Type

```typescript
// Use interface for object shapes
interface User {
  id: string;
  name: string;
}

// Use type for unions, primitives, or computed types
type Status = "active" | "inactive";
type UserWithRole = User & { role: string };
```

### DTO Naming

```typescript
// Create/Update DTOs
interface CreateStudioDto { ... }
interface UpdateStudioDto { ... }

// Query DTOs
interface StudioQueryDto extends AdvancedQueryParams { ... }
```

### API Response Types

```typescript
// Generic responses
type ApiResponse<T> = { success: boolean; data: T; message: string };

// Paginated responses
type StudioListResponse = PaginationOffset<Studio>;
```

## Best Practices

1. **Use `@/` alias** - Never deep relative paths
2. **Follow naming conventions** - Consistent across codebase
3. **Use barrel exports** - Clean imports
4. **Keep files small** - ≤200 lines for components
5. **Group imports** - By category
6. **Type imports last** - After regular imports

## Anti-Patterns

```typescript
// ❌ WRONG: Deep relative import
import { Button } from "../../../components/ui/core/button";

// ❌ WRONG: Mixed naming conventions
export function studio_form() { ... }  // Should be StudioForm

// ❌ WRONG: Default export for non-page
export default function StudiosList() { ... }  // Should be named export

// ❌ WRONG: No Props suffix
interface StudioForm { ... }  // Should be StudioFormProps

// ❌ WRONG: File too large
// studio-form.tsx with 500 lines - split into smaller files
```
