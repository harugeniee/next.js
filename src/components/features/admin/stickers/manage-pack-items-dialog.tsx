"use client";

import React, { useState } from "react";
import { http } from "@/lib/http/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/components/providers/i18n-provider";

export const ManagePackItemsDialog: React.FC<{ packId: string }> = ({
  packId,
}) => {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stickerPack", packId],
    queryFn: async () => {
      const res = await http.get(`/sticker-packs/${packId}`);
      return res.data;
    },
    enabled: !!packId,
  });

  const addMutation = useMutation({
    mutationFn: async (stickerId: string) => {
      await http.post(`/sticker-packs/${packId}/items`, { stickerId });
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["admin", "stickerPack", packId] });
      qc.invalidateQueries({ queryKey: ["admin", "stickerPacks"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (stickerId: string) => {
      await http.delete(`/sticker-packs/${packId}/items/${stickerId}`);
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["admin", "stickerPack", packId] });
      qc.invalidateQueries({ queryKey: ["admin", "stickerPacks"] });
    },
  });

  const [newStickerId, setNewStickerId] = useState("");

  if (isLoading)
    return <div>{t("stickers.list.loading", "admin") ?? "Loading..."}</div>;

  const items = data?.items ?? [];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">
        {t("stickers.list.managePackItems", "admin") ?? "Manage Pack Items"}
      </h3>
      <div>
        <input
          placeholder={t("stickers.form.mediaId", "admin") ?? "Sticker ID"}
          value={newStickerId}
          onChange={(e) => setNewStickerId(e.target.value)}
          className="input w-full"
        />
        <div className="mt-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!newStickerId) return;
              addMutation.mutate(newStickerId);
              setNewStickerId("");
            }}
          >
            {t("stickers.list.addToPack", "admin") ?? "Add"}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">
          {t("stickers.list.packItems", "admin") ?? "Pack Items"}
        </h4>
        <ul className="mt-2 space-y-2">
          {items.length === 0 ? (
            <li className="text-muted-foreground">
              {t("stickers.list.noPackItems", "admin") ?? "No items in pack."}
            </li>
          ) : (
            items.map((it: any) => (
              <li key={it.id} className="flex items-center justify-between">
                <span>{it.name ?? it.id}</span>
                <button
                  className="text-rose-600 text-sm"
                  onClick={() => {
                    if (!confirm("Remove sticker from pack?")) return;
                    removeMutation.mutate(String(it.id));
                  }}
                >
                  {t("stickers.list.remove", "admin") ?? "Remove"}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManagePackItemsDialog;
