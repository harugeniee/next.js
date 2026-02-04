# Create Zod Validator Schema

Create a new Zod validation schema for an entity.

## Arguments
- `$ARGUMENTS`: Entity name (e.g., "Publisher")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Entity}` - PascalCase entity name (e.g., "Publisher")
- `{entity}` - kebab-case for file name (e.g., "publisher")

### 1. Create Validator File

File: `src/lib/validators/{entity}.ts`

```typescript
import { z } from "zod";

/**
 * Zod schema for creating a new {entity}.
 * Matches the Create{Entity}Dto from the backend.
 */
export const create{Entity}Schema = z.object({
  name: z
    .string()
    .min(1, "{Entity} name is required")
    .max(255, "{Entity} name cannot exceed 255 characters"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug cannot exceed 255 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  status: z.enum(["active", "inactive", "pending", "archived"]).optional(),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be non-negative")
    .optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Zod schema for updating an existing {entity}.
 * All fields are optional since updates can be partial.
 * Matches the Update{Entity}Dto from the backend.
 */
export const update{Entity}Schema = z.object({
  name: z
    .string()
    .min(1, "{Entity} name is required")
    .max(255, "{Entity} name cannot exceed 255 characters")
    .optional(),

  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug cannot exceed 255 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  status: z.enum(["active", "inactive", "pending", "archived"]).optional(),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be non-negative")
    .optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Zod schema for querying {entity}s.
 * Used for search and filter parameters.
 */
export const query{Entity}Schema = z.object({
  page: z
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .optional(),

  limit: z
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional(),

  sortBy: z.string().optional(),

  order: z.enum(["ASC", "DESC"]).optional(),

  query: z
    .string()
    .max(255, "Search query cannot exceed 255 characters")
    .optional(),

  status: z.enum(["active", "inactive", "pending", "archived"]).optional(),
});

// Type exports using z.infer for type safety
export type Create{Entity}FormData = z.infer<typeof create{Entity}Schema>;
export type Update{Entity}FormData = z.infer<typeof update{Entity}Schema>;
export type Query{Entity}FormData = z.infer<typeof query{Entity}Schema>;
```

### 2. Update Barrel Export

Add to `src/lib/validators/index.ts`:

```typescript
export * from "./{entity}";
```

## Common Field Patterns

### String Fields
```typescript
name: z.string().min(1, "Required").max(255, "Too long"),
email: z.string().email("Invalid email"),
url: z.string().url("Invalid URL").optional().or(z.literal("")),
slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format"),
```

### Number Fields
```typescript
age: z.number().int().min(0).max(150),
price: z.number().positive("Must be positive"),
sortOrder: z.number().int().min(0).optional(),
```

### Boolean Fields
```typescript
isActive: z.boolean().default(false),
isNsfw: z.boolean().optional(),
```

### Enum Fields
```typescript
status: z.enum(["active", "inactive", "pending", "archived"]),
type: z.enum(["type1", "type2"]).optional(),
```

### Date Fields
```typescript
startDate: z.coerce.date(),
endDate: z.coerce.date().optional(),
```

### Array Fields
```typescript
tags: z.array(z.string()).min(1, "At least one tag required"),
ids: z.array(z.string().uuid()).optional(),
```

### Object Fields
```typescript
metadata: z.record(z.string(), z.unknown()).optional(),
config: z.object({
  key: z.string(),
  value: z.string(),
}).optional(),
```

### Conditional Validation
```typescript
// URL that can be empty or valid
url: z.string().url().optional().or(z.literal("")),

// Different schemas based on type
const schema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("a"), fieldA: z.string() }),
  z.object({ type: z.literal("b"), fieldB: z.number() }),
]);
```

## Usage in Forms

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { create{Entity}Schema, type Create{Entity}FormData } from "@/lib/validators/{entity}";

const form = useForm<Create{Entity}FormData>({
  resolver: zodResolver(create{Entity}Schema),
  defaultValues: {
    name: "",
    status: "active",
  },
});
```

## Reference

- Pattern: `src/lib/validators/genres.ts`
- Zod docs: https://zod.dev
- Rule: `.cursor/rules/06-forms-validation.mdc`
