import { useInfiniteQuery } from "@tanstack/react-query";

import {
  CharactersAPI,
  type QueryCharacterCursorDto,
} from "@/lib/api/characters";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching characters with cursor-based infinite scroll
 * Only loads when enabled prop is true (when Characters tab is active)
 * @param seriesId - Series ID to fetch characters for
 * @param enabled - Whether to enable the query (should be true only when Characters tab is active)
 */
export function useCharactersInfinite(
  seriesId: string,
  enabled: boolean = true,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.characters.cursor(seriesId, undefined),
    queryFn: async ({ pageParam }) => {
      const params: QueryCharacterCursorDto = {
        seriesId,
        cursor: pageParam as string | undefined,
        limit: 20, // Number of items per page
        sortBy: "createdAt",
        order: "DESC", // Sort by creation date descending (newest first)
      };
      const response = await CharactersAPI.getCharactersCursor(params);
      return response.data;
    },
    enabled:
      enabled && !!seriesId && seriesId !== "undefined" && seriesId !== "null",
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // Return next cursor if available, otherwise undefined to stop pagination
      return lastPage.metaData.nextCursor ?? undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
