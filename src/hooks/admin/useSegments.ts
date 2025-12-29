import { useQuery } from "@tanstack/react-query";

import { SegmentsAPI, type QuerySegmentDto } from "@/lib/api/segments";
import type { SeriesSegment } from "@/lib/interface/series.interface";
import type { ApiResponseOffset } from "@/lib/types";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching segments list with filters
 * Supports filtering by seriesId
 */
export function useSeriesSegments(
  seriesId: string,
  params?: Partial<QuerySegmentDto>,
) {
  return useQuery<ApiResponseOffset<SeriesSegment>, Error>({
    queryKey: queryKeys.series.admin.segments(seriesId, params),
    queryFn: () => SegmentsAPI.getSegments({ ...params, seriesId }),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!seriesId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
