"use client";

import React, { useState } from "react";
import { http } from "@/lib/http/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/components/providers/i18n-provider";

export const EditStickerPackForm: React.FC<{
  pack: StickerPack;
  onSaved?: () => void;
}> = ({ pack, onSaved }) => {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [name, setName] = useState(pack.name);
  const [description, setDescription] = useState(pack.description ?? "");
  const [coverMediaId, setCoverMediaId] = useState(pack.coverMediaId ?? "");

  const updateMutation = useMutation({
    mutationFn: async () => {
      const dto = { name, description, coverMediaId };
      const res = await http.patch(`/sticker-packs/${pack.id}`, dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["admin", "stickerPacks"] });
      onSaved?.();
    },
  });

  if (!pack) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateMutation.mutate();
      }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium">
          {t("stickers.form.packName", "admin") ?? "Pack Name"}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          {t("stickers.form.packDescription", "admin") ?? "Description"}
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          {t("stickers.form.packCoverMediaId", "admin") ?? "Cover Media ID"}
        </label>
        <input
          value={coverMediaId}
          onChange={(e) => setCoverMediaId(e.target.value)}
          className="input w-full"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          {t("stickers.form.save", "admin") ?? "Save"}
        </button>
        <button type="button" className="btn btn-ghost">
          {t("stickers.form.cancel", "admin") ?? "Cancel"}
        </button>
      </div>
    </form>
  );
};

export default EditStickerPackForm;
