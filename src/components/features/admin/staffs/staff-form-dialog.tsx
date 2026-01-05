"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { StaffForm } from "./staff-form";
import type { Staff } from "@/lib/interface/staff.interface";
import type {
  CreateStaffFormData,
  UpdateStaffFormData,
} from "@/lib/validators/staffs";

interface StaffFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly staff?: Staff;
  readonly onSubmit: (
    data: CreateStaffFormData | UpdateStaffFormData,
  ) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Staff Form Dialog Component
 * Wraps StaffForm in a Dialog modal
 */
export function StaffFormDialog({
  open,
  onOpenChange,
  staff,
  onSubmit,
  isLoading = false,
}: StaffFormDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (
    data: CreateStaffFormData | UpdateStaffFormData,
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
            {staff
              ? t("form.editTitle", "staff")
              : t("form.createTitle", "staff")}
          </DialogTitle>
          <DialogDescription>
            {staff
              ? t("form.editDescription", "staff")
              : t("form.createDescription", "staff")}
          </DialogDescription>
        </DialogHeader>
        <StaffForm
          staff={staff}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
