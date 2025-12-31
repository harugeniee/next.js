"use client";

import React, { useState } from "react";
import { http } from "@/lib/http/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/components/providers/i18n-provider";

export const CreateStickerForm: React.FC<{ onCreated?: () => void }> = ({
  onCreated,
}) => {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [mediaId, setMediaId] = useState("");
  const [tags, setTags] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);

  const createMutation = useMutation({
    mutationFn: async () => {
      const dto = {
        name,
        mediaId,
        tags: tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        isAnimated,
      };
      const res = await http.post("/stickers", dto);
      return res.data;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["admin", "stickers"] });
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
        <label className="block text-sm font-medium">
          {t("stickers.form.name", "admin") ?? "Name"}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          {t("stickers.form.mediaId", "admin") ?? "Media ID"}
        </label>
        <input
          value={mediaId}
          onChange={(e) => setMediaId(e.target.value)}
          className="input w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          {t("stickers.form.tags", "admin") ?? "Tags"}
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isAnimated"
          type="checkbox"
          checked={isAnimated}
          onChange={(e) => setIsAnimated(e.target.checked)}
        />
        <label htmlFor="isAnimated" className="text-sm">
          {t("stickers.form.isAnimated", "admin") ?? "Is Animated?"}
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          {t("stickers.form.save", "admin") ?? "Save"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setName("");
            setMediaId("");
            setTags("");
            setIsAnimated(false);
          }}
        >
          {t("stickers.form.cancel", "admin") ?? "Cancel"}
        </button>
      </div>
    </form>
  );
};

export default CreateStickerForm;
