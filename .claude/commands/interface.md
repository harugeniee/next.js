# Create TypeScript Interface

Create TypeScript interfaces for an entity with DTOs.

## Arguments
- `$ARGUMENTS`: Entity name (e.g., "Publisher")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Entity}` - PascalCase entity name (e.g., "Publisher")
- `{entity}` - kebab-case for file name (e.g., "publisher")

### 1. Create Interface File

File: `src/lib/interface/{entity}.interface.ts`

```typescript
import type {
  {Entity}Status,
  {Entity}Type,
} from "@/lib/constants/{entity}.constants";

/**
 * {Entity} entity interface
 * Represents a {entity} in the system
 */
export interface {Entity} {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** URL-friendly identifier */
  slug?: string;

  /** Description text */
  description?: string;

  /** Entity type */
  type?: {Entity}Type;

  /** Current status */
  status?: {Entity}Status;

  /** Sort order for display */
  sortOrder?: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * DTO for creating a new {entity}
 * Used in POST requests
 */
export interface Create{Entity}Dto {
  /** Display name (required) */
  name: string;

  /** URL-friendly identifier */
  slug?: string;

  /** Description text */
  description?: string;

  /** Entity type */
  type?: {Entity}Type;

  /** Current status */
  status?: {Entity}Status;

  /** Sort order for display */
  sortOrder?: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * DTO for updating an existing {entity}
 * All fields optional for partial updates
 * Used in PATCH requests
 */
export interface Update{Entity}Dto {
  /** Display name */
  name?: string;

  /** URL-friendly identifier */
  slug?: string;

  /** Description text */
  description?: string;

  /** Entity type */
  type?: {Entity}Type;

  /** Current status */
  status?: {Entity}Status;

  /** Sort order for display */
  sortOrder?: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Query parameters for fetching {entity}s
 * Used for filtering and pagination
 */
export interface {Entity}QueryDto {
  /** Page number (1-based) */
  page?: number;

  /** Items per page */
  limit?: number;

  /** Search query */
  query?: string;

  /** Sort field */
  sortBy?: string;

  /** Sort order */
  order?: "ASC" | "DESC";

  /** Filter by status */
  status?: {Entity}Status;

  /** Filter by type */
  type?: {Entity}Type;
}

/**
 * {Entity} with relations loaded
 * Extended interface for detail views
 */
export interface {Entity}WithRelations extends {Entity} {
  /** Related items count */
  _count?: {
    items?: number;
  };

  /** Related items */
  items?: Array<{
    id: string;
    name: string;
  }>;
}
```

### 2. Update Barrel Export

Add to `src/lib/interface/index.ts`:

```typescript
export * from "./{entity}.interface";
```

## Common Field Types

### Basic Fields
```typescript
id: string;
name: string;
description?: string;
slug?: string;
```

### Status & Type Fields
```typescript
import type { EntityStatus, EntityType } from "@/lib/constants/entity.constants";

status?: EntityStatus;
type?: EntityType;
```

### Metadata & JSON Fields
```typescript
metadata?: Record<string, unknown>;
config?: {
  key: string;
  value: string;
};
settings?: Array<{ name: string; enabled: boolean }>;
```

### Relationship Fields
```typescript
// Foreign key
userId: string;
categoryId?: string;

// Nested object
user?: {
  id: string;
  name: string;
  avatar?: string;
};

// Array of relations
tags?: Array<{
  id: string;
  name: string;
}>;

// Count relations
_count?: {
  comments?: number;
  likes?: number;
};
```

### Date Fields
```typescript
createdAt: string;
updatedAt: string;
publishedAt?: string;
deletedAt?: string | null;
```

### External IDs
```typescript
myAnimeListId?: string;
aniListId?: string;
externalId?: string;
```

### URL Fields
```typescript
siteUrl?: string;
imageUrl?: string;
thumbnailUrl?: string;
```

## DTO Patterns

### Create DTO
- Include all required fields
- Optional fields use `?`
- Exclude auto-generated fields (id, createdAt, updatedAt)

### Update DTO
- All fields optional with `?`
- Same fields as Create DTO
- Use for PATCH requests

### Query DTO
- Pagination: page, limit
- Sorting: sortBy, order
- Search: query, search
- Filters: status, type, category, etc.

## Reference

- Pattern: `src/lib/interface/studio.interface.ts`
- Constants: `src/lib/constants/`
- Rule: `.cursor/rules/13-naming-imports.mdc`
