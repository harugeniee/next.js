# Scaffold Admin CRUD Module

Create a complete admin CRUD module with page, components, hooks, interface, validator, and i18n keys.

## Arguments
- `$ARGUMENTS`: Module name and endpoint (e.g., "Publisher /publishers")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Entity}` - PascalCase entity name (e.g., "Publisher")
- `{entity}` - camelCase (e.g., "publisher")
- `{entities}` - plural camelCase (e.g., "publishers")
- `{endpoint}` - API endpoint (e.g., "/publishers")

### 1. Create Interface

File: `src/lib/interface/{entity}.interface.ts`

```typescript
import type { {Entity}Status, {Entity}Type } from "@/lib/constants/{entity}.constants";

export interface {Entity} {
  id: string;
  name: string;
  // Add entity-specific fields
  status?: {Entity}Status;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Create{Entity}Dto {
  name: string;
  // Add required fields for creation
  status?: {Entity}Status;
  metadata?: Record<string, unknown>;
}

export interface Update{Entity}Dto {
  name?: string;
  // Add optional fields for update
  status?: {Entity}Status;
  metadata?: Record<string, unknown>;
}

export interface {Entity}QueryDto {
  page?: number;
  limit?: number;
  query?: string;
  // Add filter fields
  status?: {Entity}Status;
}
```

**Update barrel export**: `src/lib/interface/index.ts`

### 2. Create Constants

File: `src/lib/constants/{entity}.constants.ts`

```typescript
// {Entity} Entity Constants
export const {ENTITY}_CONSTANTS = {
  // Field lengths
  NAME_MAX_LENGTH: 255,

  // Status values
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    ARCHIVED: "archived",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
} as const;

// Type definitions
export type {Entity}Status =
  (typeof {ENTITY}_CONSTANTS.STATUS)[keyof typeof {ENTITY}_CONSTANTS.STATUS];
```

**Update barrel export**: `src/lib/constants/index.ts`

### 3. Create Validator

File: `src/lib/validators/{entity}.ts`

```typescript
import { z } from "zod";

export const create{Entity}Schema = z.object({
  name: z
    .string()
    .min(1, "{Entity} name is required")
    .max(255, "{Entity} name cannot exceed 255 characters"),
  status: z.enum(["active", "inactive", "pending", "archived"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const update{Entity}Schema = z.object({
  name: z
    .string()
    .min(1, "{Entity} name is required")
    .max(255, "{Entity} name cannot exceed 255 characters")
    .optional(),
  status: z.enum(["active", "inactive", "pending", "archived"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const query{Entity}Schema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  query: z.string().optional(),
  status: z.enum(["active", "inactive", "pending", "archived"]).optional(),
});

export type Create{Entity}FormData = z.infer<typeof create{Entity}Schema>;
export type Update{Entity}FormData = z.infer<typeof update{Entity}Schema>;
export type Query{Entity}FormData = z.infer<typeof query{Entity}Schema>;
```

**Update barrel export**: `src/lib/validators/index.ts`

### 4. Create Admin Hook

File: `src/hooks/admin/use{Entities}.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http/client";
import type {
  Create{Entity}Dto,
  Update{Entity}Dto,
  {Entity}QueryDto,
} from "@/lib/interface";

export const {ENTITIES}_QUERY_KEY = ["admin", "{entities}"];

export function use{Entities}(query?: {Entity}QueryDto) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...{ENTITIES}_QUERY_KEY, query ?? {}],
    queryFn: async () => {
      const res = await http.get("{endpoint}", { params: query });
      return res.data?.data || res.data;
    },
  });

  const create = useMutation({
    mutationFn: async (dto: Create{Entity}Dto) => {
      const res = await http.post("{endpoint}", dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: {ENTITIES}_QUERY_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Update{Entity}Dto }) => {
      const res = await http.patch(`{endpoint}/${id}`, dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: {ENTITIES}_QUERY_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`{endpoint}/${id}`);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: {ENTITIES}_QUERY_KEY });
    },
  });

  return { listQuery, create, update, remove };
}

export function use{Entity}(id: string) {
  return useQuery({
    queryKey: [...{ENTITIES}_QUERY_KEY, id],
    queryFn: async () => {
      const res = await http.get(`{endpoint}/${id}`);
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });
}

export default use{Entities};
```

**Update barrel export**: `src/hooks/admin/index.ts`

### 5. Create Admin Page

File: `src/app/admin/{entities}/page.tsx`

```typescript
"use client";

import { useState } from "react";

import { {Entities}List } from "@/components/features/admin/{entities}/{entities}-list";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { use{Entities} } from "@/hooks/admin/use{Entities}";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { {Entity} } from "@/lib/interface/{entity}.interface";

export default function Admin{Entities}Page() {
  const { t } = useI18n();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    query: "",
  });

  usePageMetadata({
    title: t("{entities}.pageTitle", "admin"),
    description: t("{entities}.pageDescription", "admin"),
  });

  const { listQuery, create, update, remove } = use{Entities}(filters);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreate = async (data: Parameters<typeof create.mutateAsync>[0]) => {
    await create.mutateAsync(data);
  };

  const handleUpdate = async (id: string, data: Parameters<typeof update.mutateAsync>[0]["dto"]) => {
    await update.mutateAsync({ id, dto: data });
  };

  const handleDelete = async ({entity}: {Entity}) => {
    if (confirm(t("{entities}.list.deleteConfirm", "admin", { name: {entity}.name }))) {
      await remove.mutateAsync({entity}.id);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">{t("admin", "common")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("{entities}.pageTitle", "admin")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("{entities}.pageTitle", "admin")}</h1>
          <p className="text-muted-foreground mt-2">{t("{entities}.pageDescription", "admin")}</p>
        </div>
      </AnimatedSection>

      <{Entities}List
        data={listQuery.data}
        isLoading={listQuery.isLoading}
        page={filters.page}
        limit={filters.limit}
        onPageChange={handlePageChange}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isCreating={create.isPending}
        isUpdating={update.isPending || remove.isPending}
      />
    </div>
  );
}
```

### 6. Create List Component

File: `src/components/features/admin/{entities}/{entities}-list.tsx`

Follow pattern from `src/components/features/admin/studios/studios-list.tsx`:
- AnimatedSection wrapper
- Card with CardHeader and CardContent
- Table with columns for entity fields
- Pagination component
- Create button with dialog trigger

### 7. Create Form Dialogs

Files:
- `src/components/features/admin/{entities}/create-{entity}-form-dialog.tsx`
- `src/components/features/admin/{entities}/edit-{entity}-form-dialog.tsx`

Follow pattern from `src/components/features/admin/studios/create-studio-form-dialog.tsx`:
- Dialog with DialogHeader, DialogContent, DialogFooter
- Form with zodResolver
- FormField components
- Submit and Cancel buttons

### 8. Create Actions Component

File: `src/components/features/admin/{entities}/{entity}-actions.tsx`

- DropdownMenu for row actions
- Edit, View, Delete options

### 9. Create Barrel Export

File: `src/components/features/admin/{entities}/index.ts`

```typescript
export * from "./{entities}-list";
export * from "./create-{entity}-form-dialog";
export * from "./edit-{entity}-form-dialog";
export * from "./{entity}-actions";
```

### 10. Add i18n Keys

Add to `src/i18n/locales/en/admin.json`:

```json
"{entities}": {
  "pageTitle": "{Entities} Management",
  "pageDescription": "Manage {entities} in the system",
  "list": {
    "title": "{Entities} List",
    "description": "View and manage all {entities}",
    "create": "Create {Entity}",
    "name": "Name",
    "status": "Status",
    "createdAt": "Created At",
    "deleteConfirm": "Are you sure you want to delete {name}?"
  },
  "form": {
    "createTitle": "Create {Entity}",
    "createDescription": "Fill in the details to create a new {entity}",
    "editTitle": "Edit {Entity}",
    "editDescription": "Update the {entity} details",
    "name": "Name",
    "status": "Status",
    "save": "Save {Entity}",
    "selectStatus": "Select status"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "pending": "Pending",
    "archived": "Archived"
  }
}
```

Add corresponding Vietnamese translations to `src/i18n/locales/vi/admin.json`.

## Checklist

- [ ] Interface created with DTOs
- [ ] Constants created with types
- [ ] Validator created with schemas
- [ ] Admin hook created
- [ ] Admin page created
- [ ] List component created
- [ ] Create dialog created
- [ ] Edit dialog created
- [ ] Actions component created
- [ ] Barrel exports updated
- [ ] i18n keys added (EN + VI)

## Reference

- Pattern: `src/app/admin/studios/`
- Components: `src/components/features/admin/studios/`
- Hook: `src/hooks/admin/useStudios.ts`
- Interface: `src/lib/interface/studio.interface.ts`
- Constants: `src/lib/constants/studio.constants.ts`
