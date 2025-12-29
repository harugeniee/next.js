import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { SeriesAPI } from "@/lib/api/series";
import type { BackendSeries } from "@/lib/interface/series.interface";
import type { ApiResponseOffset, AdvancedQueryParams } from "@/lib/types";
import type {
  CreateSeriesDto,
  UpdateSeriesDto,
  QuerySeriesDto,
} from "@/lib/api/series";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching series list with filters
 */
export function useSeries(params?: QuerySeriesDto) {
  return useQuery<ApiResponseOffset<BackendSeries>, Error>({
    queryKey: queryKeys.series.admin.lists(params),
    queryFn: () => SeriesAPI.getSeriesOffset(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single series by ID
 */
export function useSeriesDetail(id: string) {
  return useQuery<BackendSeries, Error>({
    queryKey: queryKeys.series.admin.detail(id),
    queryFn: () => SeriesAPI.getSeries(id),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for creating a new series
 */
export function useCreateSeries() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<BackendSeries, Error, CreateSeriesDto>({
    mutationFn: (data) => SeriesAPI.createSeries(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.admin.all(),
      });
      toast.success(t("createSuccess", "series"));
    },
    onError: (error) => {
      toast.error(error.message || t("createError", "series"));
    },
  });
}

/**
 * Hook for updating a series
 */
export function useUpdateSeries() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<
    BackendSeries,
    Error,
    { id: string; data: UpdateSeriesDto }
  >({
    mutationFn: ({ id, data }) => SeriesAPI.updateSeries(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.admin.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.admin.detail(data.id),
      });
      toast.success(t("updateSuccess", "series"));
    },
    onError: (error) => {
      toast.error(error.message || t("updateError", "series"));
    },
  });
}

/**
 * Hook for deleting a series
 */
export function useDeleteSeries() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, Error, string>({
    mutationFn: (id) => SeriesAPI.deleteSeries(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.series.admin.all(),
      });
      toast.success(t("deleteSuccess", "series"));
    },
    onError: (error) => {
      toast.error(error.message || t("deleteError", "series"));
    },
  });
}
