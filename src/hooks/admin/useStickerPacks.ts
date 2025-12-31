import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http/client";

export const STICKER_PACKS_QUERY_KEY = ["admin", "stickerPacks"];

export function useStickerPacks(query?: Record<string, any>) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...STICKER_PACKS_QUERY_KEY, query ?? {}],
    queryFn: async () => {
      const res = await http.get("/sticker-packs/admin", { params: query });
      return res.data;
    },
  });

  const create = useMutation({
    mutationFn: async (dto: any) => {
      const res = await http.post("/sticker-packs", dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STICKER_PACKS_QUERY_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: any }) => {
      const res = await http.patch(`/sticker-packs/${id}`, dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STICKER_PACKS_QUERY_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/sticker-packs/${id}`);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: STICKER_PACKS_QUERY_KEY });
    },
  });

  const addItem = useMutation({
    mutationFn: async ({ packId, dto }: { packId: string; dto: any }) => {
      const res = await http.post(`/sticker-packs/${packId}/items`, dto);
      return res.data;
    },
    onSuccess(_, vars) {
      qc.invalidateQueries({
        queryKey: ["admin", "stickerPack", (vars as any)?.packId],
      });
      qc.invalidateQueries({ queryKey: STICKER_PACKS_QUERY_KEY });
    },
  });

  const removeItem = useMutation({
    mutationFn: async ({
      packId,
      stickerId,
    }: {
      packId: string;
      stickerId: string;
    }) => {
      const res = await http.delete(
        `/sticker-packs/${packId}/items/${stickerId}`,
      );
      return res.data;
    },
    onSuccess(_, vars) {
      qc.invalidateQueries({
        queryKey: ["admin", "stickerPack", (vars as any)?.packId],
      });
      qc.invalidateQueries({ queryKey: STICKER_PACKS_QUERY_KEY });
    },
  });

  return {
    listQuery,
    create,
    update,
    remove,
    addItem,
    removeItem,
  };
}

export default useStickerPacks;
