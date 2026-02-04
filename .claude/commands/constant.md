# Create Constants File

Create a constants file for an entity with TypeScript types.

## Arguments
- `$ARGUMENTS`: Entity name (e.g., "Publisher")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Entity}` - PascalCase entity name (e.g., "Publisher")
- `{ENTITY}` - SCREAMING_SNAKE_CASE (e.g., "PUBLISHER")
- `{entity}` - kebab-case for file name (e.g., "publisher")

### 1. Create Constants File

File: `src/lib/constants/{entity}.constants.ts`

```typescript
// {Entity} Entity Constants
export const {ENTITY}_CONSTANTS = {
  // Field length limits
  NAME_MAX_LENGTH: 255,
  SLUG_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  URL_MAX_LENGTH: 512,

  // Status values
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    ARCHIVED: "archived",
    DELETED: "deleted",
  },

  // Type values (customize based on entity)
  TYPES: {
    TYPE_A: "type_a",
    TYPE_B: "type_b",
    TYPE_C: "type_c",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Sort options
  SORT: {
    DEFAULT_FIELD: "createdAt",
    DEFAULT_ORDER: "DESC",
    ALLOWED_FIELDS: ["name", "createdAt", "updatedAt", "sortOrder"],
  },

  // Validation rules
  VALIDATION: {
    MIN_NAME_LENGTH: 1,
    MAX_NAME_LENGTH: 255,
    SLUG_PATTERN: /^[a-z0-9-]+$/,
  },
} as const;

// Type definitions derived from constants
export type {Entity}Status =
  (typeof {ENTITY}_CONSTANTS.STATUS)[keyof typeof {ENTITY}_CONSTANTS.STATUS];

export type {Entity}Type =
  (typeof {ENTITY}_CONSTANTS.TYPES)[keyof typeof {ENTITY}_CONSTANTS.TYPES];

export type {Entity}SortField =
  (typeof {ENTITY}_CONSTANTS.SORT.ALLOWED_FIELDS)[number];

// Select options for forms (with i18n keys)
export const {ENTITY}_STATUS_OPTIONS = [
  { value: {ENTITY}_CONSTANTS.STATUS.ACTIVE, labelKey: "{entities}.status.active" },
  { value: {ENTITY}_CONSTANTS.STATUS.INACTIVE, labelKey: "{entities}.status.inactive" },
  { value: {ENTITY}_CONSTANTS.STATUS.PENDING, labelKey: "{entities}.status.pending" },
  { value: {ENTITY}_CONSTANTS.STATUS.ARCHIVED, labelKey: "{entities}.status.archived" },
] as const;

export const {ENTITY}_TYPE_OPTIONS = [
  { value: {ENTITY}_CONSTANTS.TYPES.TYPE_A, labelKey: "{entities}.types.typeA" },
  { value: {ENTITY}_CONSTANTS.TYPES.TYPE_B, labelKey: "{entities}.types.typeB" },
  { value: {ENTITY}_CONSTANTS.TYPES.TYPE_C, labelKey: "{entities}.types.typeC" },
] as const;
```

### 2. Update Barrel Export

Add to `src/lib/constants/index.ts`:

```typescript
export * from "./{entity}.constants";
```

## Common Constant Patterns

### Status Constants
```typescript
STATUS: {
  DRAFT: "draft",
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
  DELETED: "deleted",
},
```

### Role Constants
```typescript
ROLES: {
  ADMIN: "admin",
  MODERATOR: "moderator",
  EDITOR: "editor",
  AUTHOR: "author",
  USER: "user",
  GUEST: "guest",
},
```

### Visibility Constants
```typescript
VISIBILITY: {
  PUBLIC: "public",
  PRIVATE: "private",
  UNLISTED: "unlisted",
  MEMBERS_ONLY: "members_only",
},
```

### Priority Constants
```typescript
PRIORITY: {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
  CRITICAL: 5,
},
```

### Rating Constants
```typescript
RATING: {
  G: "G",           // General
  PG: "PG",         // Parental Guidance
  PG13: "PG-13",    // Parents Strongly Cautioned
  R: "R",           // Restricted
  NC17: "NC-17",    // Adults Only
},
```

### Color Constants
```typescript
COLORS: {
  PRIMARY: "#3b82f6",
  SECONDARY: "#6b7280",
  SUCCESS: "#22c55e",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#06b6d4",
},
```

### Size Constants
```typescript
SIZES: {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
  XXL: "2xl",
},
```

### File Constants
```typescript
FILE: {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
},
```

### API Constants
```typescript
API: {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
},
```

## Usage Examples

### In Validators
```typescript
import { {ENTITY}_CONSTANTS } from "@/lib/constants/{entity}.constants";

const schema = z.object({
  name: z.string().max({ENTITY}_CONSTANTS.NAME_MAX_LENGTH),
  status: z.enum([
    {ENTITY}_CONSTANTS.STATUS.ACTIVE,
    {ENTITY}_CONSTANTS.STATUS.INACTIVE,
  ]),
});
```

### In Components
```typescript
import { {ENTITY}_STATUS_OPTIONS } from "@/lib/constants/{entity}.constants";

{ENTITY}_STATUS_OPTIONS.map((option) => (
  <SelectItem key={option.value} value={option.value}>
    {t(option.labelKey, "admin")}
  </SelectItem>
))}
```

### In Interfaces
```typescript
import type { {Entity}Status, {Entity}Type } from "@/lib/constants/{entity}.constants";

interface {Entity} {
  status: {Entity}Status;
  type: {Entity}Type;
}
```

## Reference

- Pattern: `src/lib/constants/studio.constants.ts`
- Pattern: `src/lib/constants/series.constants.ts`
- Rule: `.cursor/rules/13-naming-imports.mdc`
