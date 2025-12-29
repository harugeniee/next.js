import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { CharactersAPI } from "@/lib/api/characters";
import type { Character } from "@/lib/interface/character.interface";
import type {
  CharacterListResponse,
  CharacterStatistics,
  CreateCharacterDto,
  GetCharacterDto,
  UpdateCharacterDto,
} from "@/lib/types/characters";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching characters list with filters
 */
export function useCharacters(params?: GetCharacterDto) {
  return useQuery<CharacterListResponse, Error>({
    queryKey: queryKeys.characters.admin.lists(params),
    queryFn: () => CharactersAPI.getCharacters(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single character by ID
 */
export function useCharacter(id: string) {
  return useQuery<Character, Error>({
    queryKey: queryKeys.characters.admin.detail(id),
    queryFn: () => CharactersAPI.getCharacterById(id),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching character statistics
 */
export function useCharacterStatistics() {
  return useQuery<CharacterStatistics, Error>({
    queryKey: queryKeys.characters.admin.statistics(),
    queryFn: () => CharactersAPI.getCharacterStatistics(),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for creating a new character
 */
export function useCreateCharacter() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<Character, Error, CreateCharacterDto>({
    mutationFn: (data) => CharactersAPI.createCharacter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.admin.all(),
      });
      toast.success(t("createSuccess", "characters"));
    },
    onError: (error) => {
      toast.error(error.message || t("createError", "characters"));
    },
  });
}

/**
 * Hook for updating a character
 */
export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<
    Character,
    Error,
    { id: string; data: UpdateCharacterDto }
  >({
    mutationFn: ({ id, data }) => CharactersAPI.updateCharacter(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.admin.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.admin.detail(data.id),
      });
      toast.success(t("updateSuccess", "characters"));
    },
    onError: (error) => {
      toast.error(error.message || t("updateError", "characters"));
    },
  });
}

/**
 * Hook for deleting a character
 */
export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, Error, string>({
    mutationFn: (id) => CharactersAPI.deleteCharacter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.admin.all(),
      });
      toast.success(t("deleteSuccess", "characters"));
    },
    onError: (error) => {
      toast.error(error.message || t("deleteError", "characters"));
    },
  });
}

/**
 * Hook for fetching characters of a specific series
 */
export function useSeriesCharacters(
  seriesId: string,
  params?: Partial<GetCharacterDto>,
) {
  return useQuery<CharacterListResponse, Error>({
    queryKey: queryKeys.series.admin.characters(seriesId, params),
    queryFn: () => CharactersAPI.getCharacters({ ...params, seriesId }),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!seriesId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
