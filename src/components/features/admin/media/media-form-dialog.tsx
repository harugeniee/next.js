"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Media } from "@/lib/interface/media.interface";
import type { UpdateMediaDto } from "@/lib/types/media";
import { MediaForm } from "./media-form";
import type { UpdateMediaFormData } from "@/lib/validators/media";

interface MediaFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly media?: Media;
  readonly onSubmit: (data: UpdateMediaDto) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Media Form Dialog Component
 * Wraps MediaForm in a Dialog modal
 */
export function MediaFormDialog({
  open,
  onOpenChange,
  media,
  onSubmit,
  isLoading = false,
}: MediaFormDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (data: UpdateMediaFormData) => {
    // Convert tags array to string if needed
    const submitData: UpdateMediaDto = {
      ...data,
      tags: Array.isArray(data.tags) ? data.tags : data.tags,
    };
    await onSubmit(submitData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("form.editTitle", "media")}</DialogTitle>
          <DialogDescription>
            {t("form.editDescription", "media")}
          </DialogDescription>
        </DialogHeader>
        <MediaForm
          media={media}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
