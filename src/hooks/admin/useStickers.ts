import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http/client";

export const STICKERS_QUERY_KEY = ["admin", "stickers"];

export function useStickers(query?: StickerQueryDto) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...STICKERS_QUERY_KEY, query ?? {}],
    queryFn: async () => {
      const res = await http.get("/stickers/admin", { params: query });
      return res.data;
    },
  });

  const create = useMutation({
    mutationFn: async (dto: CreateStickerDto) => {
      const res = await http.post("/stickers", dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STICKERS_QUERY_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateStickerDto }) => {
      const res = await http.patch(`/stickers/${id}`, dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STICKERS_QUERY_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/stickers/${id}`);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STICKERS_QUERY_KEY });
    },
  });

  return {
    listQuery,
    create,
    update,
    remove,
  };
}

export default useStickers;
