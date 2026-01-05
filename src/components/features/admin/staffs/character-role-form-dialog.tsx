"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import type { CharacterStaff } from "@/lib/interface/staff.interface";
import type { UpdateCharacterRoleFormData } from "@/lib/validators/staffs";
import { CharacterRoleForm } from "./character-role-form";

interface CharacterRoleFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly characterRole?: CharacterStaff;
  readonly onSubmit: (data: UpdateCharacterRoleFormData) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Character Role Form Dialog Component
 * Dialog wrapper for editing character roles
 */
export function CharacterRoleFormDialog({
  open,
  onOpenChange,
  characterRole,
  onSubmit,
  isLoading,
}: CharacterRoleFormDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (data: UpdateCharacterRoleFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  if (!characterRole) return null;

  const characterName =
    characterRole.character?.name?.full ||
    characterRole.character?.name?.userPreferred ||
    "Unknown Character";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("detail.editCharacterRole", "staff")}</DialogTitle>
          <DialogDescription>
            Edit role information for {characterName}
          </DialogDescription>
        </DialogHeader>
        <CharacterRoleForm
          characterRole={characterRole}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
