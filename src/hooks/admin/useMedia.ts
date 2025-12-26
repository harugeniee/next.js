import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { MediaAPI } from "@/lib/api/media";
import type { Media } from "@/lib/interface/media.interface";
import type {
  GetMediaDto,
  MediaListResponse,
  MediaStatistics,
  UpdateMediaDto,
} from "@/lib/types/media";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching media list with filters
 */
export function useMedia(params?: GetMediaDto) {
  return useQuery<MediaListResponse, Error>({
    queryKey: queryKeys.media.admin.lists(params),
    queryFn: () => MediaAPI.getMedia(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single media by ID
 */
export function useMediaById(id: string) {
  return useQuery<Media, Error>({
    queryKey: queryKeys.media.admin.detail(id),
    queryFn: async () => {
      const response = await MediaAPI.getMediaById(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch media");
      }
      return response.data as unknown as Media;
    },
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching media statistics
 */
export function useMediaStatistics() {
  return useQuery<MediaStatistics, Error>({
    queryKey: queryKeys.media.admin.statistics(),
    queryFn: async () => {
      const response = await MediaAPI.getMediaStatistics();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch media statistics");
      }
      return response.data;
    },
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for updating media
 */
export function useUpdateMedia() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<Media, Error, { id: string; data: UpdateMediaDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await MediaAPI.updateMedia(id, data);
      if (!response.success) {
        throw new Error(response.message || "Failed to update media");
      }
      return response.data as unknown as Media;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.admin.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.admin.detail(data.id),
      });
      toast.success(t("updateSuccess", "media"));
    },
    onError: (error) => {
      toast.error(error.message || t("updateError", "media"));
    },
  });
}

/**
 * Hook for deleting media
 */
export function useDeleteMedia() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const response = await MediaAPI.delete(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete media");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.admin.all(),
      });
      toast.success(t("deleteSuccess", "media"));
    },
    onError: (error) => {
      toast.error(error.message || t("deleteError", "media"));
    },
  });
}

/**
 * Hook for activating media
 */
export function useActivateMedia() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<Media, Error, string>({
    mutationFn: async (id) => {
      const response = await MediaAPI.activateMedia(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to activate media");
      }
      return response.data as unknown as Media;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.admin.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.admin.detail(data.id),
      });
      toast.success(t("activateSuccess", "media"));
    },
    onError: (error) => {
      toast.error(error.message || t("activateError", "media"));
    },
  });
}

/**
 * Hook for deactivating media
 */
export function useDeactivateMedia() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<Media, Error, string>({
    mutationFn: async (id) => {
      const response = await MediaAPI.deactivateMedia(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to deactivate media");
      }
      return response.data as unknown as Media;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.admin.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.admin.detail(data.id),
      });
      toast.success(t("deactivateSuccess", "media"));
    },
    onError: (error) => {
      toast.error(error.message || t("deactivateError", "media"));
    },
  });
}
