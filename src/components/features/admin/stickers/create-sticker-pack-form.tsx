"use client";

import React, { useState } from "react";
import { http } from "@/lib/http/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/components/providers/i18n-provider";

export const CreateStickerPackForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverMediaId, setCoverMediaId] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const dto = {
        name,
        description,
        coverMediaId,
      };
      const res = await http.post("/sticker-packs", dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["admin", "stickerPacks"] });
      onCreated?.();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createMutation.mutate();
      }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium">{t("stickers.form.packName", "admin") ?? "Pack Name"}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">{t("stickers.form.packDescription", "admin") ?? "Description"}</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">{t("stickers.form.packCoverMediaId", "admin") ?? "Cover Media ID"}</label>
        <input value={coverMediaId} onChange={(e) => setCoverMediaId(e.target.value)} className="input w-full" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          {t("stickers.form.save", "admin") ?? "Save"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => { setName(""); setDescription(""); setCoverMediaId(""); }}>
          {t("stickers.form.cancel", "admin") ?? "Cancel"}
        </button>
      </div>
    </form>
  );
};

export default CreateStickerPackForm;


