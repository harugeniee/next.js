"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { BadgeForm } from "./badge-form";
import type { Badge } from "@/lib/types/badges";
import type {
  CreateBadgeFormData,
  UpdateBadgeFormData,
} from "@/lib/validators/badges";

interface BadgeFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly badge?: Badge;
  readonly onSubmit: (
    data: CreateBadgeFormData | UpdateBadgeFormData,
  ) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Badge Form Dialog Component
 * Wraps BadgeForm in a Dialog modal
 */
export function BadgeFormDialog({
  open,
  onOpenChange,
  badge,
  onSubmit,
  isLoading = false,
}: BadgeFormDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (
    data: CreateBadgeFormData | UpdateBadgeFormData,
  ) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {badge
              ? t("badges.form.editTitle", "admin")
              : t("badges.form.createTitle", "admin")}
          </DialogTitle>
          <DialogDescription>
            {badge
              ? t("badges.form.editDescription", "admin")
              : t("badges.form.createDescription", "admin")}
          </DialogDescription>
        </DialogHeader>
        <BadgeForm
          badge={badge}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

