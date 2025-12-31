import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http/client";
import type { CreateTagDto, UpdateTagDto, QueryTagsDto } from "@/lib/api/tags";

export const TAGS_QUERY_KEY = ["admin", "tags"];

export function useTags(query?: QueryTagsDto) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...TAGS_QUERY_KEY, query ?? {}],
    queryFn: async () => {
      const res = await http.get("/tags", { params: query });
      // API returns { success: true, data: { result, metaData }, message, metadata }
      // Extract the nested data property
      return res.data?.data || res.data;
    },
  });

  const create = useMutation({
    mutationFn: async (dto: CreateTagDto) => {
      const res = await http.post("/tags", dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateTagDto }) => {
      const res = await http.patch(`/tags/${id}`, dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/tags/${id}`);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
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
 * Hook for fetching a single tag by ID
 */
export function useTag(id: string) {
  return useQuery({
    queryKey: [...TAGS_QUERY_KEY, id],
    queryFn: async () => {
      const res = await http.get(`/tags/${id}`);
      // API returns { success: true, data: Tag, message, metadata }
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });
}

export default useTags;

