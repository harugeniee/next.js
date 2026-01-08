---
alwaysApply: true
---

# Components & UI System

## Component Organization

```
src/components/
├── ui/                     # shadcn/ui primitives + custom
│   ├── core/               # Basic components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/             # Layout components
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── navigation/         # Navigation components
│   │   ├── breadcrumb.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   ├── theme/              # Theme components
│   │   ├── theme-toggle.tsx
│   │   ├── theme-selector.tsx
│   │   └── ...
│   ├── utilities/          # Utility components
│   │   └── content-renderer.tsx
│   └── index.ts            # Barrel export
├── features/               # Domain components
│   ├── admin/              # Admin components (129 files)
│   │   ├── studios/
│   │   │   ├── studios-list.tsx
│   │   │   ├── studio-form.tsx
│   │   │   ├── studio-actions.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── series/
│   ├── auth/
│   ├── navigation/
│   └── ...
├── providers/              # Context providers
│   ├── auth-provider.tsx
│   ├── i18n-provider.tsx
│   ├── theme-provider.tsx
│   └── ...
├── shared/                 # Shared utilities
│   ├── animated-section.tsx
│   ├── animated-grid.tsx
│   ├── animated-header.tsx
│   ├── skeletonize.tsx
│   └── index.ts
└── animate-ui/             # Animated UI components
    └── components/
        └── radix/
            ├── tooltip.tsx
            └── tabs.tsx
```

## Import Patterns

```typescript
// ✅ CORRECT: Use barrel exports
import { Button, Input, Card } from "@/components/ui";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { StudiosList } from "@/components/features/admin/studios";

// ✅ CORRECT: Direct import for specific needs
import { Button, buttonVariants } from "@/components/ui/core/button";

// ❌ WRONG: Deep relative imports
import { Button } from "../../../components/ui/core/button";
```

## shadcn/ui Components

Located in `@/components/ui/`:

### Core Components

| Component | Path | Usage |
|-----------|------|-------|
| Button | `core/button.tsx` | Actions, links |
| Input | `core/input.tsx` | Text input |
| Card | `core/card.tsx` | Content containers |
| Badge | `core/badge.tsx` | Labels, status |
| Avatar | `core/avatar.tsx` | User images |
| Table | `core/table.tsx` | Data tables |
| Skeleton | `core/skeleton.tsx` | Loading states |

### Layout Components

| Component | Path | Usage |
|-----------|------|-------|
| Dialog | `layout/dialog.tsx` | Modals |
| DropdownMenu | `layout/dropdown-menu.tsx` | Menus |
| Form | `layout/form.tsx` | Form primitives |
| Popover | `layout/popover.tsx` | Floating content |
| Separator | `layout/separator.tsx` | Dividers |

### Navigation Components

| Component | Path | Usage |
|-----------|------|-------|
| Breadcrumb | `navigation/breadcrumb.tsx` | Page hierarchy |
| Sidebar | `navigation/sidebar.tsx` | Admin sidebar |

## Feature Component Pattern

```tsx
// src/components/features/admin/studios/studios-list.tsx
"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/core/table";
import { Pagination } from "@/components/ui/pagination";
import type { Studio } from "@/lib/interface/studio.interface";

interface StudiosListProps {
  data?: StudioListResponse;
  isLoading: boolean;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onCreate: (data: CreateStudioDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateStudioDto) => Promise<void>;
  onDelete: (studio: Studio) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function StudiosList({
  data,
  isLoading,
  page = 1,
  onPageChange,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: StudiosListProps) {
  const { t } = useI18n();
  const router = useRouter();
  
  const studios = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={studios} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("list.title", "admin")}</CardTitle>
            <Button size="sm" onClick={() => onCreate({})}>
              <Plus className="mr-2 h-4 w-4" />
              {t("actions.create", "common")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {studios.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("list.name", "admin")}</TableHead>
                    <TableHead className="text-right">
                      {t("common.actions", "common")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studios.map((studio) => (
                    <TableRow
                      key={studio.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/admin/studios/${studio.id}`)}
                    >
                      <TableCell>{studio.name}</TableCell>
                      <TableCell className="text-right">
                        {/* Actions */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // Placeholder for skeleton
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded border" />
                ))}
              </div>
            )}
          </Skeletonize>
          
          {metaData && metaData.totalPages > 1 && (
            <Pagination
              currentPage={metaData.page || page}
              totalPages={metaData.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
```

## Shared Components

### AnimatedSection

```tsx
import { AnimatedSection } from "@/components/shared";

<AnimatedSection loading={isLoading} data={data} className="py-8">
  {/* Content animates in when loading=false and data exists */}
</AnimatedSection>
```

### Skeletonize

```tsx
import { Skeletonize } from "@/components/shared";

<Skeletonize loading={isLoading}>
  {data ? (
    <Content data={data} />
  ) : (
    // Placeholder divs for skeleton
    <div className="h-40 rounded" />
  )}
</Skeletonize>
```

## MCP Tools for Components

**ALWAYS check MCP before creating custom components:**

```typescript
// 1. Search for existing component
mcp_shadcn_search_items_in_registries({ query: "hover-card" })

// 2. Get installation command
mcp_shadcn_get_add_command_for_items({ items: ["@shadcn/hover-card"] })

// 3. Get usage examples
mcp_shadcn_get_item_examples_from_registries({ query: "hover-card-demo" })
```

## Animated Components

Use animated Radix components from `@/components/animate-ui/`:

```tsx
// Animated tooltip
import { Tooltip } from "@/components/animate-ui/components/radix/tooltip";

// Animated tabs
import { Tabs } from "@/components/animate-ui/components/radix/tabs";
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component files | kebab-case | `studio-form.tsx` |
| Component names | PascalCase | `StudioForm` |
| Props interfaces | `{Name}Props` | `StudioFormProps` |
| Hook files | camelCase | `useStudios.ts` |
| Barrel exports | `index.ts` | Re-export all |

## Best Practices

1. **Use barrel exports** - Export from `index.ts`
2. **Keep components small** - ≤200 lines
3. **Use composition** - Break into smaller components
4. **Follow shadcn patterns** - Consistent with library
5. **Check MCP first** - Before creating custom components
6. **Use theme tokens** - No hardcoded colors
7. **Add loading states** - Use Skeletonize
8. **Add animations** - Use AnimatedSection

## Anti-Patterns

```tsx
// ❌ WRONG: Hardcoded colors
<div className="bg-gray-100 text-gray-900">

// ❌ WRONG: No loading state
{data && <Content data={data} />}

// ❌ WRONG: Deep relative imports
import { Button } from "../../../ui/core/button";

// ❌ WRONG: Component too large (>200 lines)
// Split into smaller components

// ❌ WRONG: Creating custom component without checking MCP
// Always search MCP first
```
