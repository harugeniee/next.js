---
alwaysApply: true
---

# Data Fetching (TanStack Query)

## Query Client Configuration

Located in `@/lib/utils/query-client.ts`:

```typescript
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,      // 5 minutes
        gcTime: 10 * 60 * 1000,        // 10 minutes (garbage collection)
        retry: 3,                       // Retry 3 times
        retryDelay: (attemptIndex) =>   // Exponential backoff
          Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,    // Disabled to prevent double queries
        refetchOnReconnect: true,
        refetchOnMount: "always",
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
```

## Query Key Factory (MUST USE)

All query keys MUST use the factory from `@/lib/utils/query-keys.ts`:

```typescript
// ✅ CORRECT: Use query key factory
import { queryKeys } from "@/lib/utils/query-keys";

useQuery({
  queryKey: queryKeys.series.detail(seriesId),
  queryFn: () => SeriesAPI.getSeries(seriesId),
});

// ❌ WRONG: Inline query keys
useQuery({
  queryKey: ["series", seriesId],  // Don't do this
  queryFn: () => SeriesAPI.getSeries(seriesId),
});
```

### Query Key Structure

```typescript
// src/lib/utils/query-keys.ts
export const queryKeys = {
  // Simple entity
  auth: {
    currentUser: () => ["currentUser"] as const,
    userProfile: (userId: string) => ["user", userId] as const,
  },

  // Entity with list/detail pattern
  series: {
    all: () => ["series"] as const,
    lists: () => ["series", "list"] as const,
    list: (params?: AdvancedQueryParams) => ["series", "list", params] as const,
    detail: (id: string) => ["series", "detail", id] as const,
    search: (query: string) => ["series", "search", query] as const,
    
    // Nested entity
    segments: {
      all: (seriesId: string) => ["series", seriesId, "segments"] as const,
      list: (seriesId: string, params?: AdvancedQueryParams) =>
        ["series", seriesId, "segments", "list", params] as const,
      detail: (seriesId: string, segmentId: string) =>
        ["series", seriesId, "segments", segmentId] as const,
    },
    
    // Admin-specific
    admin: {
      all: () => ["series", "admin"] as const,
      lists: (params?: unknown) => ["series", "admin", "lists", params] as const,
    },
  },
  
  // ... other entities
} as const;
```

## Query Hook Patterns

### Pattern 1: Domain Hooks (for public/user-facing features)

```typescript
// src/hooks/series/useSeriesQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { SeriesAPI } from "@/lib/api/series";
import { queryKeys } from "@/lib/utils/query-keys";

export function useSeries(seriesId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.series.detail(seriesId),
    queryFn: async () => {
      const backendSeries = await SeriesAPI.getSeries(seriesId);
      return transformBackendSeries(backendSeries);
    },
    enabled: enabled && !!seriesId && seriesId !== "undefined",
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCreateSeries() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSeriesDto) => {
      return SeriesAPI.createSeries(data);
    },
    onSuccess: (series) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.series.all() });
      queryClient.setQueryData(queryKeys.series.detail(series.id), series);
      toast.success(t("seriesCreated", "series"));
    },
    onError: (error) => {
      console.error("Create series error:", error);
      toast.error(t("seriesCreateError", "series"));
    },
  });
}
```

### Pattern 2: Admin Hooks (combined CRUD)

```typescript
// src/hooks/admin/useStudios.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http/client";

export const STUDIOS_QUERY_KEY = ["admin", "studios"];

export function useStudios(query?: StudioQueryDto) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...STUDIOS_QUERY_KEY, query ?? {}],
    queryFn: async () => {
      const res = await http.get("/studios", { params: query });
      return res.data?.data || res.data;
    },
  });

  const create = useMutation({
    mutationFn: async (dto: CreateStudioDto) => {
      const res = await http.post("/studios", dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STUDIOS_QUERY_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateStudioDto }) => {
      const res = await http.patch(`/studios/${id}`, dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STUDIOS_QUERY_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/studios/${id}`);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STUDIOS_QUERY_KEY });
    },
  });

  return { listQuery, create, update, remove };
}
```

## Infinite Queries

For cursor-based pagination:

```typescript
export function useSeriesSegmentsInfinite(
  seriesId: string,
  enabled: boolean = true,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.series.segments.cursor(seriesId),
    queryFn: async ({ pageParam }) => {
      const params = {
        seriesId,
        cursor: pageParam as string | undefined,
        limit: 20,
        sortBy: "number",
        order: "DESC",
      };
      const response = await SegmentsAPI.getSegmentsCursor(params);
      return response.data;
    },
    enabled: enabled && !!seriesId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.metaData.nextCursor ?? undefined,
    staleTime: 2 * 60 * 1000,
  });
}
```

## Response Types

Located in `@/lib/types/response.ts`:

```typescript
// Base response
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  metadata: ApiResponseMetadata;
}

// Offset pagination
interface ApiResponseOffset<T = unknown> {
  success: boolean;
  message: string;
  data: PaginationOffset<T>;
  metadata: ApiResponseMetadata;
}

interface PaginationOffset<T = unknown> {
  result: T[];
  metaData: {
    currentPage?: number;
    pageSize: number;
    totalRecords?: number;
    totalPages?: number;
    hasNextPage?: boolean;
  };
}

// Cursor pagination
interface ApiResponseCursor<T = unknown> {
  success: boolean;
  message: string;
  data: PaginationCursor<T>;
  metadata: ApiResponseMetadata;
}

interface PaginationCursor<T = unknown> {
  result: T[];
  metaData: {
    nextCursor?: string | null;
    prevCursor?: string | null;
    take: number;
    sortBy: string;
    order: "ASC" | "DESC";
  };
}
```

## Best Practices

1. **Always use query key factory** - Never inline query keys
2. **Use `enabled` flag** - Prevent queries from running with invalid params
3. **Handle loading states** - Use `isLoading` for initial load, `isFetching` for refetches
4. **Invalidate on mutations** - Use `queryClient.invalidateQueries()` after mutations
5. **Set query data optimistically** - Use `queryClient.setQueryData()` for immediate UI updates
6. **Show toast on success/error** - Use Sonner for user feedback
7. **Log errors** - Always log errors to console for debugging

## Anti-Patterns

```typescript
// ❌ WRONG: Inline query keys
useQuery({ queryKey: ["series", id], ... });

// ❌ WRONG: Missing enabled check
useQuery({
  queryKey: queryKeys.series.detail(seriesId), // seriesId could be undefined
  queryFn: () => SeriesAPI.getSeries(seriesId),
});

// ❌ WRONG: Not invalidating after mutation
useMutation({
  mutationFn: createSeries,
  // Missing onSuccess with invalidateQueries
});

// ❌ WRONG: Not handling errors
useMutation({
  mutationFn: createSeries,
  onSuccess: () => toast.success("Created"),
  // Missing onError
});
```
