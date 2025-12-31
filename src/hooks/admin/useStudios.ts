import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http/client";
import type {
  CreateStudioDto,
  UpdateStudioDto,
  StudioQueryDto,
} from "@/lib/interface";

export const STUDIOS_QUERY_KEY = ["admin", "studios"];

export function useStudios(query?: StudioQueryDto) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...STUDIOS_QUERY_KEY, query ?? {}],
    queryFn: async () => {
      const res = await http.get("/studios", { params: query });
      // API returns { success: true, data: { result, metaData }, message, metadata }
      // Extract the nested data property
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

  return {
    listQuery,
    create,
    update,
    remove,
  };
}

/**
 * Hook for fetching a single studio by ID
 */
export function useStudio(id: string) {
  return useQuery({
    queryKey: [...STUDIOS_QUERY_KEY, id],
    queryFn: async () => {
      const res = await http.get(`/studios/${id}`);
      // API returns { success: true, data: Studio, message, metadata }
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });
}

export default useStudios;

