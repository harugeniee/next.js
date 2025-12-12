import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  SegmentsAPI,
  type QuerySegmentCursorDto,
  type QuerySegmentDto,
} from "@/lib/api/segments";
import { SeriesAPI, type QuerySeriesDto } from "@/lib/api/series";
import type { SeriesSeason } from "@/lib/constants/series.constants";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type {
  BackendSeries,
  CreateSegmentDto,
  LatestUpdateItem,
  PopularSeries,
  Series,
  SeriesSegment,
  UpdateSegmentDto,
} from "@/lib/interface/series.interface";
import type { AdvancedQueryParams } from "@/lib/types";
import { queryKeys } from "@/lib/utils/query-keys";
import {
  transformBackendSeries,
  transformBackendSeriesList,
  transformToPopularSeries,
} from "@/lib/utils/series-utils";

/**
 * Hook for fetching popular series titles
 * Sorted by popularity or trending
 * @param enabled - Optional flag to control when the query should run
 */
export function usePopularSeries(enabled?: boolean) {
  return useQuery<PopularSeries[]>({
    queryKey: queryKeys.series.popular(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 10,
        sortBy: "popularity",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA, // For homepage, show series
      });
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return backendSeries.map(transformToPopularSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching latest updates
 * Note: This is a placeholder - backend may need a separate endpoint for latest updates
 * @param enabled - Optional flag to control when the query should run
 */
export function useLatestUpdates(enabled?: boolean) {
  return useQuery<LatestUpdateItem[]>({
    queryKey: queryKeys.series.latestUpdates(),
    queryFn: async () => {
      // For now, use recently updated series
      // TODO: Replace with actual latest updates endpoint when available
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 10,
        sortBy: "updatedAt",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
      });
      const backendSeries = response.data.result as unknown as BackendSeries[];

      // Transform to LatestUpdateItem format
      // Note: This is a simplified transformation
      // Real implementation would need chapter/group data from backend
      return backendSeries.map((series) => {
        // Convert date string to Date object
        const timestampStr = series.updatedAt || series.createdAt;
        const timestamp = timestampStr ? new Date(timestampStr) : new Date();

        const transformedSeries = transformBackendSeries(series);
        return {
          id: series.id,
          title: transformedSeries.title,
          coverUrl: transformedSeries.coverUrl,
          chapter: {
            number: "1",
            title: "Chapter 1",
            language: "en",
            url: `/series/${series.id}`,
          },
          groups: [],
          timestamp,
          commentCount: 0,
          isNsfw: series.isNsfw || transformedSeries.isNsfw,
          genres: transformedSeries.genres || [],
          tags: transformedSeries.tags || [],
        };
      });
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching recommended series
 * Sorted by average score
 * @param enabled - Optional flag to control when the query should run
 */
export function useRecommendedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.recommended(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 12,
        sortBy: "averageScore",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
        minScore: 70, // Minimum score of 70
      });
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching self-published series
 * Filtered by isLicensed: false
 * @param enabled - Optional flag to control when the query should run
 */
export function useSelfPublishedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.selfPublished(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
        isLicensed: false,
      });
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching featured series
 * Sorted by trending
 * @param enabled - Optional flag to control when the query should run
 */
export function useFeaturedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.featured(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 3,
        sortBy: "trending",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
      });
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching seasonal series
 * Filtered by season and seasonYear
 * @param enabled - Optional flag to control when the query should run
 */
export function useSeasonalSeries(enabled?: boolean) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Determine current season
  let season: SeriesSeason;
  if (currentMonth >= 2 && currentMonth <= 4)
    season = SERIES_CONSTANTS.SEASON.SPRING;
  else if (currentMonth >= 5 && currentMonth <= 7)
    season = SERIES_CONSTANTS.SEASON.SUMMER;
  else if (currentMonth >= 8 && currentMonth <= 10)
    season = SERIES_CONSTANTS.SEASON.FALL;
  else season = SERIES_CONSTANTS.SEASON.WINTER;

  return useQuery<Series[]>({
    queryKey: queryKeys.series.seasonal(season, currentYear),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 20,
        sortBy: "popularity",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
        season,
        seasonYear: currentYear,
      });
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching recently added series
 * Sorted by creation date
 * @param enabled - Optional flag to control when the query should run
 */
export function useRecentlyAddedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.recentlyAdded(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
      });
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single series by ID
 */
export function useSeries(seriesId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.series.detail(seriesId),
    queryFn: async () => {
      const backendSeries = await SeriesAPI.getSeries(seriesId);
      return transformBackendSeries(backendSeries as unknown as BackendSeries);
    },
    enabled:
      enabled && !!seriesId && seriesId !== "undefined" && seriesId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single series by ID with full backend data
 * Returns BackendSeries instead of transformed Series
 */
export function useSeriesFull(seriesId: string) {
  return useQuery<BackendSeries>({
    queryKey: [...queryKeys.series.detail(seriesId), "full"],
    queryFn: async () => {
      const backendSeries = await SeriesAPI.getSeries(seriesId);
      return backendSeries as unknown as BackendSeries;
    },
    enabled: !!seriesId && seriesId !== "undefined" && seriesId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching series list with filters
 */
export function useSeriesList(params?: QuerySeriesDto) {
  return useQuery({
    queryKey: queryKeys.series.list(params),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset(params);
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return {
        series: transformBackendSeriesList(backendSeries),
        metaData: response.data.metaData,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for creating a series
 */
export function useCreateSeries() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: import("@/lib/api/series").CreateSeriesDto) => {
      const result = await SeriesAPI.createSeries(data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return result;
    },
    onSuccess: (series) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.all(),
      });
      queryClient.setQueryData(queryKeys.series.detail(series.id), series);
      toast.success(
        t("seriesCreated", "series") || "Series created successfully",
      );
    },
    onError: (error) => {
      console.error("Create series error:", error);
      toast.error(
        t("seriesCreateError", "series") || "Failed to create series",
      );
    },
  });
}

/**
 * Hook for updating a series
 */
export function useUpdateSeries() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: import("@/lib/api/series").UpdateSeriesDto;
    }) => {
      const result = await SeriesAPI.updateSeries(id, data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return result;
    },
    onSuccess: (series, variables) => {
      queryClient.setQueryData(queryKeys.series.detail(variables.id), series);
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.all(),
      });
      toast.success(
        t("seriesUpdated", "series") || "Series updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update series error:", error);
      toast.error(
        t("seriesUpdateError", "series") || "Failed to update series",
      );
    },
  });
}

/**
 * Hook for deleting a series
 */
export function useDeleteSeries() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await SeriesAPI.deleteSeries(id);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.series.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.all(),
      });
      toast.success(
        t("seriesDeleted", "series") || "Series deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete series error:", error);
      toast.error(
        t("seriesDeleteError", "series") || "Failed to delete series",
      );
    },
  });
}

/**
 * Hook for searching series by query string
 * Uses debounced query to avoid excessive API calls
 * @param query - Search query string
 * @param enabled - Whether to enable the query (default: true if query is not empty)
 */
export function useSeriesSearch(query: string, enabled?: boolean) {
  return useQuery({
    queryKey: queryKeys.series.search(query),
    queryFn: async () => {
      const response = await SeriesAPI.searchSeries(query, "title:jsonb", 10);
      // ApiResponseCursor structure: response.data = { data: { result: T[], metaData: {...} } }
      // So we access: response.data.data.result
      const backendSeries = response.data.result as unknown as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled:
      enabled !== undefined
        ? enabled && query.trim().length > 0
        : query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once for search queries
  });
}

/**
 * Hook for fetching AniList media list
 */
export function useAniListMediaList(page?: number, perPage?: number) {
  return useQuery({
    queryKey: ["anilist", "media", "list", page, perPage],
    queryFn: () => SeriesAPI.getAniListMediaList(page, perPage),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching AniList media by ID
 */
export function useAniListMediaById(anilistId: number) {
  return useQuery({
    queryKey: ["anilist", "media", anilistId],
    queryFn: () => SeriesAPI.getAniListMediaById(anilistId),
    enabled: !!anilistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for saving AniList media by ID
 */
export function useSaveAniListMedia() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (anilistId: number) => {
      const result = await SeriesAPI.saveAniListMediaById(anilistId);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return result;
    },
    onSuccess: (response) => {
      if (response.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.series.all(),
        });
        queryClient.setQueryData(
          queryKeys.series.detail(response.data.id),
          response.data,
        );
      }
      toast.success(
        t("anilistMediaSaved", "series") || "AniList media saved successfully",
      );
    },
    onError: (error) => {
      console.error("Save AniList media error:", error);
      toast.error(
        t("anilistMediaSaveError", "series") || "Failed to save AniList media",
      );
    },
  });
}

/**
 * Hook for triggering AniList crawl job
 */
export function useAniListCrawl() {
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (
      type?: import("@/lib/constants/series.constants").SeriesType,
    ) => {
      const result = await SeriesAPI.triggerAniListCrawl(type);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return result;
    },
    onSuccess: (response) => {
      toast.success(
        t("anilistCrawlTriggered", "series") ||
          `Crawl job queued successfully. Job ID: ${response.data.jobId}`,
      );
    },
    onError: (error) => {
      console.error("Trigger AniList crawl error:", error);
      toast.error(
        t("anilistCrawlError", "series") || "Failed to trigger AniList crawl",
      );
    },
  });
}

// ==================== Segments (Chapters/Episodes) Hooks ====================

/**
 * Hook for fetching segments for a series
 */
export function useSeriesSegments(
  seriesId: string,
  params?: Partial<AdvancedQueryParams>,
) {
  return useQuery({
    queryKey: queryKeys.series.segments.list(
      seriesId,
      params as AdvancedQueryParams | undefined,
    ),
    queryFn: async () => {
      const queryParams: Partial<QuerySegmentDto> = {
        ...params,
        seriesId, // Add seriesId to query params
      };
      const response = await SegmentsAPI.getSegments(queryParams);
      return response.data;
    },
    enabled: !!seriesId && seriesId !== "undefined" && seriesId !== "null",
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching series segments with cursor-based infinite scroll
 * Only loads after series data is available (enabled prop)
 * @param seriesId - Series ID to fetch segments for
 * @param enabled - Whether to enable the query (should be true only after series data is loaded)
 * @param languageCode - Optional language code to filter segments by language
 */
export function useSeriesSegmentsInfinite(
  seriesId: string,
  enabled: boolean = true,
  languageCode?: string,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.series.segments.cursor(
      seriesId,
      undefined,
      languageCode,
    ),
    queryFn: async ({ pageParam }) => {
      const params: QuerySegmentCursorDto = {
        seriesId,
        cursor: pageParam as string | undefined,
        limit: 20, // Number of items per page
        sortBy: "number",
        order: "DESC", // Sort chapters by number descending (newest/largest first: ..., 5, 4, 3, 2, 1)
        languageCode: languageCode || undefined, // Filter by language if provided
      };
      const response = await SegmentsAPI.getSegmentsCursor(params);
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

/**
 * Hook for fetching a single segment
 * Note: Now uses segmentId only, seriesId is optional for query key organization
 */
export function useSeriesSegment(seriesId: string, segmentId: string) {
  return useQuery<SeriesSegment>({
    queryKey: queryKeys.series.segments.detail(seriesId, segmentId),
    queryFn: async () => {
      return await SegmentsAPI.getSegmentById(segmentId);
    },
    enabled: !!segmentId && segmentId !== "undefined" && segmentId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a segment by segmentId only (without seriesId)
 * Useful for routes like /segments/:segmentId
 * After fetching, you can get seriesId from segment.seriesId
 */
export function useSegment(segmentId: string) {
  return useQuery<SeriesSegment>({
    queryKey: ["segments", "detail", segmentId],
    queryFn: async () => {
      return await SegmentsAPI.getSegmentById(segmentId);
    },
    enabled: !!segmentId && segmentId !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching segments uploaded by a specific user with cursor-based infinite scroll
 * Supports filtering by segment type and status
 * @param userId - User ID to fetch segments for
 * @param enabled - Whether to enable the query
 * @param type - Optional segment type filter (chapter/episode/trailer)
 * @param status - Optional status filter (active/pending/inactive/archived)
 */
export function useUserSegmentsInfinite(
  userId: string,
  enabled: boolean = true,
  type?: string,
  status?: string,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.segments.byUserCursor(userId, undefined, type, status),
    queryFn: async ({ pageParam }) => {
      const params: QuerySegmentCursorDto = {
        userId,
        cursor: pageParam as string | undefined,
        limit: 20, // Number of items per page
        sortBy: "createdAt",
        order: "DESC", // Sort by creation date descending (newest first)
        type: type && type !== "all" ? type : undefined,
        // Note: status filter may need to be added to QuerySegmentCursorDto if backend supports it
      };
      const response = await SegmentsAPI.getSegmentsCursor(params);
      return response.data;
    },
    enabled: enabled && !!userId && userId !== "undefined" && userId !== "null",
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

/**
 * Hook for creating a segment
 */
export function useCreateSegment() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seriesId,
      data,
    }: {
      seriesId: string;
      data: CreateSegmentDto;
    }) => {
      // Include seriesId in the data payload (required by backend)
      const segmentData: CreateSegmentDto = {
        ...data,
        seriesId,
      };
      const result = await SegmentsAPI.createSegment(segmentData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { ...result, seriesId };
    },
    onSuccess: (segment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.segments.all(segment.seriesId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.detail(segment.seriesId),
      });
      toast.success(
        t("segments.toast.created", "series") ||
          t("segments.success.created", "series") ||
          "Segment created successfully",
      );
    },
    onError: (error) => {
      console.error("Create segment error:", error);
      toast.error(
        t("segments.toast.createError", "series") ||
          t("segments.errors.create", "series") ||
          "Failed to create segment",
      );
    },
  });
}

/**
 * Hook for updating a segment
 */
export function useUpdateSegment() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seriesId,
      segmentId,
      data,
    }: {
      seriesId: string;
      segmentId: string;
      data: UpdateSegmentDto;
    }) => {
      // Note: seriesId is not needed in the API call anymore, but kept for query key organization
      const result = await SegmentsAPI.updateSegment(segmentId, data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { ...result, seriesId };
    },
    onSuccess: (segment) => {
      queryClient.setQueryData(
        queryKeys.series.segments.detail(segment.seriesId, segment.id),
        segment,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.segments.all(segment.seriesId),
      });
      toast.success(
        t("segments.toast.updated", "series") ||
          t("segments.success.updated", "series") ||
          "Segment updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update segment error:", error);
      toast.error(
        t("segments.toast.updateError", "series") ||
          t("segments.errors.update", "series") ||
          "Failed to update segment",
      );
    },
  });
}

/**
 * Hook for deleting a segment
 */
export function useDeleteSegment() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seriesId,
      segmentId,
    }: {
      seriesId: string;
      segmentId: string;
    }) => {
      // Note: seriesId is not needed in the API call anymore, but kept for query key organization
      await SegmentsAPI.deleteSegment(segmentId);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { seriesId, segmentId };
    },
    onSuccess: ({ seriesId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.segments.all(seriesId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.detail(seriesId),
      });
      toast.success(
        t("segments.toast.deleted", "series") ||
          t("segments.success.deleted", "series") ||
          "Segment deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete segment error:", error);
      toast.error(
        t("segments.toast.deleteError", "series") ||
          t("segments.errors.delete", "series") ||
          "Failed to delete segment",
      );
    },
  });
}
