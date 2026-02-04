# Create TanStack Query Hook

Create a new TanStack Query hook following project conventions.

## Arguments
- `$ARGUMENTS`: Hook name and entity (e.g., "useArticle articles")

## Instructions

1. **Parse arguments**: Extract hook name and entity from `$ARGUMENTS`

2. **Add query key** to `src/lib/utils/query-keys.ts`:
   ```typescript
   entity: {
     all: () => ["entity"] as const,
     lists: () => ["entity", "list"] as const,
     list: (params?: QueryParams) => ["entity", "list", params] as const,
     detail: (id: string) => ["entity", "detail", id] as const,
   },
   ```

3. **Create hook file** at `src/hooks/{entity}/use{Entity}Query.ts`:
   ```typescript
   import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
   import { toast } from "sonner";
   import { useI18n } from "@/components/providers/i18n-provider";
   import { EntityAPI } from "@/lib/api/entity";
   import { queryKeys } from "@/lib/utils/query-keys";

   export function useEntity(entityId: string, enabled: boolean = true) {
     return useQuery({
       queryKey: queryKeys.entity.detail(entityId),
       queryFn: async () => {
         return EntityAPI.getEntity(entityId);
       },
       enabled: enabled && !!entityId && entityId !== "undefined",
       staleTime: 5 * 60 * 1000,
       retry: 3,
       retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
     });
   }

   export function useCreateEntity() {
     const { t } = useI18n();
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: async (data: CreateEntityDto) => {
         return EntityAPI.createEntity(data);
       },
       onSuccess: (entity) => {
         queryClient.invalidateQueries({ queryKey: queryKeys.entity.all() });
         queryClient.setQueryData(queryKeys.entity.detail(entity.id), entity);
         toast.success(t("entityCreated", "entity"));
       },
       onError: (error) => {
         console.error("Create entity error:", error);
         toast.error(t("entityCreateError", "entity"));
       },
     });
   }
   ```

4. **Create barrel export** at `src/hooks/{entity}/index.ts`

5. **Update hooks index** at `src/hooks/index.ts`

## Patterns to Follow
- ALWAYS use query key factory from `@/lib/utils/query-keys`
- ALWAYS include `enabled` check for conditional queries
- ALWAYS show toast on mutation success/error
- ALWAYS invalidate queries after mutations
- ALWAYS log errors to console

## Reference
- Pattern: `src/hooks/series/useSeriesQuery.ts`
- Query keys: `src/lib/utils/query-keys.ts`
- Rule: `.cursor/rules/03-data-fetching.mdc`
