import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { genresApi } from "@/lib/api/genres";
import type {
  QueryGenreDto,
  UpdateGenreDto,
} from "@/lib/interface/genres.interface";

/**
 * Hook for fetching a list of genres.
 * @param query - Query parameters for filtering and pagination.
 */
export function useGenres(query?: QueryGenreDto) {
  return useQuery({
    queryKey: ["genres", query],
    queryFn: async () => {
      const response = await genresApi.getGenres(query);
      return response.data; // Extract the actual data from the API response wrapper
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });
}

/**
 * Hook for creating a new genre.
 */
export function useCreateGenre() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: genresApi.createGenre,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success(t("genres.createSuccess", "admin"));
    },
    onError: (error: Error) => {
      toast.error(t("genres.createError", "admin"), {
        description: error?.message || "An unexpected error occurred",
      });
    },
  });
}

/**
 * Hook for updating an existing genre.
 */
export function useUpdateGenre() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGenreDto }) =>
      genresApi.updateGenre(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success(t("genres.updateSuccess", "admin"));
    },
    onError: (error: Error) => {
      toast.error(t("genres.updateError", "admin"), {
        description: error?.message || "An unexpected error occurred",
      });
    },
  });
}

/**
 * Hook for deleting a genre.
 */
export function useDeleteGenre() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: genresApi.deleteGenre,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success(t("genres.deleteSuccess", "admin"));
    },
    onError: (error: Error) => {
      toast.error(t("genres.deleteError", "admin"), {
        description: error?.message || "An unexpected error occurred",
      });
    },
  });
}
