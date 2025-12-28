"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import type { Role } from "@/lib/interface/permission.interface";
import type { AssignRoleFormData } from "@/lib/validators/permissions";
import { AssignRoleForm } from "./assign-role-form";

interface AssignRoleDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly role?: Role;
  readonly onSubmit: (data: AssignRoleFormData) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * AssignRoleDialog Component
 * Wraps AssignRoleForm in a Dialog modal
 */
export function AssignRoleDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  isLoading = false,
}: AssignRoleDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (data: AssignRoleFormData) => {
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
          <DialogTitle>{t("assignRole.title", "permissions")}</DialogTitle>
          <DialogDescription>
            {t("assignRole.description", "permissions")}
          </DialogDescription>
        </DialogHeader>
        <AssignRoleForm
          role={role}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
