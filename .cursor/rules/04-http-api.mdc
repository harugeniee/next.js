---
alwaysApply: true
---

# HTTP Client & API Layer

## HTTP Client

All API requests MUST go through the HTTP client at `@/lib/http/client.ts`:

```typescript
import axios from "axios";
import { requestInterceptor, responseErrorInterceptor } from "./interceptors";

// Main HTTP client with authentication
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  withCredentials: false,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Public HTTP client without authentication
export const publicHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: false,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Apply interceptors
http.interceptors.request.use(requestInterceptor);
http.interceptors.response.use((r) => r, responseErrorInterceptor);
```

## Interceptors

Located in `@/lib/http/interceptors.ts`:

### Request Interceptor

- Checks for rate limit cooldown
- Attaches access token to headers

### Response Error Interceptor

- Handles 429 (rate limit) - emits event, shows dialog
- Handles 401 (unauthorized) - automatic token refresh with queue

```typescript
// Token refresh flow
if (status === 401 && !req._retry) {
  if (getIsRefreshing()) {
    // Queue request, wait for refresh
    const token = await addToQueue();
    req.headers.Authorization = `Bearer ${token}`;
    return http(req);
  }
  
  // Start refresh
  req._retry = true;
  setIsRefreshing(true);
  const newToken = await refreshAccessToken();
  processQueue(null, newToken);
  req.headers.Authorization = `Bearer ${newToken}`;
  return http(req);
}
```

## API Layer Patterns

This codebase uses **two patterns** for API calls:

### Pattern 1: Class-based API (for complex domains)

Use when:
- Domain has many endpoints
- Complex request/response transformations
- Shared logic across endpoints

```typescript
// src/lib/api/series.ts
export class SeriesAPI {
  private static readonly BASE_URL = "/series";

  static async getSeries(id: string): Promise<BackendSeries> {
    const response = await http.get<ApiResponse<BackendSeries>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  static async createSeries(data: CreateSeriesDto): Promise<BackendSeries> {
    const response = await http.post<ApiResponse<BackendSeries>>(
      this.BASE_URL,
      data
    );
    return response.data.data;
  }

  static async getSeriesOffset(
    params?: Partial<QuerySeriesDto>
  ): Promise<ApiResponseOffset<BackendSeries>> {
    const response = await http.get<ApiResponseOffset<BackendSeries>>(
      this.BASE_URL,
      { params }
    );
    return response.data;
  }
}
```

**Usage in hooks:**

```typescript
// src/hooks/series/useSeriesQuery.ts
export function useSeries(seriesId: string) {
  return useQuery({
    queryKey: queryKeys.series.detail(seriesId),
    queryFn: () => SeriesAPI.getSeries(seriesId),
  });
}
```

### Pattern 2: Hook-based API (for admin CRUD)

Use when:
- Simple CRUD operations
- Admin management pages
- Less abstraction needed

```typescript
// src/hooks/admin/useStudios.ts
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
    onSuccess: () => qc.invalidateQueries({ queryKey: STUDIOS_QUERY_KEY }),
  });

  // ... update, remove

  return { listQuery, create, update, remove };
}
```

## Response Handling

API responses follow this structure:

```typescript
// Standard response
{
  success: true,
  message: "Success message",
  data: { ... },
  metadata: { messageKey: "...", messageArgs: {} }
}

// Nested data (common pattern)
{
  success: true,
  data: {
    result: [...],
    metaData: { page: 1, totalPages: 10, ... }
  }
}
```

**Extracting data:**

```typescript
// Class-based API - return inner data
static async getSeries(id: string): Promise<BackendSeries> {
  const response = await http.get<ApiResponse<BackendSeries>>(`/series/${id}`);
  return response.data.data;  // Extract nested data
}

// Hook-based API - handle both formats
const res = await http.get("/studios", { params: query });
return res.data?.data || res.data;  // Handle nested or flat
```

## Error Handling

```typescript
// In mutations
useMutation({
  mutationFn: async (data) => { ... },
  onSuccess: () => {
    toast.success(t("success.created", "namespace"));
  },
  onError: (error) => {
    console.error("Operation failed:", error);
    toast.error(t("error.failed", "namespace"));
  },
});
```

## Rate Limiting

The HTTP client handles 429 responses automatically:

1. Interceptor catches 429
2. Emits rate limit event via event bus
3. `RateLimitProvider` shows dialog
4. Requests are blocked during cooldown

```typescript
// src/lib/http/rate-limit-handler.ts
export function handleRateLimitError(error: AxiosError) {
  const retryAfter = error.response?.headers["retry-after"];
  setRateLimitCooldown(retryAfter || 60);
  emitRateLimitEvent();
}
```

## Token Management

Located in `@/lib/http/token-manager.ts`:

```typescript
// Get access token (from memory)
export function getAccessToken(): string | null;

// Set access token (in memory)
export function setAccessToken(token: string): void;

// Clear all tokens
export function clearTokens(): void;
```

## Best Practices

1. **Always use `http` client** - Never use `fetch` or raw `axios`
2. **Type responses** - Use generics with `ApiResponse<T>`
3. **Handle nested data** - API often returns `{ data: { data: ... } }`
4. **Log errors** - Always log to console before showing toast
5. **Use appropriate pattern** - Class-based for complex, hook-based for simple CRUD

## Anti-Patterns

```typescript
// ❌ WRONG: Using fetch directly
const res = await fetch("/api/series");

// ❌ WRONG: Creating new axios instance
const client = axios.create({ baseURL: "..." });

// ❌ WRONG: Not handling nested response
const res = await http.get("/series/123");
return res.data;  // Missing .data.data

// ❌ WRONG: Not typing response
const res = await http.get("/series/123");  // Missing type parameter
```
