"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { BadgeAssignmentForm } from "./badge-assignment-form";
import type { Badge } from "@/lib/types/badges";
import type { AssignBadgeFormData } from "@/lib/validators/badges";

interface BadgeAssignmentDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly badge?: Badge;
  readonly onSubmit: (data: AssignBadgeFormData) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Badge Assignment Dialog Component
 * Wraps BadgeAssignmentForm in a Dialog modal
 */
export function BadgeAssignmentDialog({
  open,
  onOpenChange,
  badge,
  onSubmit,
  isLoading = false,
}: BadgeAssignmentDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (data: AssignBadgeFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("badges.assignment.title", "admin")}</DialogTitle>
          <DialogDescription>
            {t("badges.assignment.description", "admin")}
          </DialogDescription>
        </DialogHeader>
        <BadgeAssignmentForm
          badge={badge}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
