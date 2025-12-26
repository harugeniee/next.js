"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { CharacterForm } from "./character-form";
import type { Character } from "@/lib/interface/character.interface";
import type {
  CreateCharacterFormData,
  UpdateCharacterFormData,
} from "@/lib/validators/characters";

interface CharacterFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly character?: Character;
  readonly onSubmit: (
    data: CreateCharacterFormData | UpdateCharacterFormData,
  ) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Character Form Dialog Component
 * Wraps CharacterForm in a Dialog modal
 */
export function CharacterFormDialog({
  open,
  onOpenChange,
  character,
  onSubmit,
  isLoading = false,
}: CharacterFormDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (
    data: CreateCharacterFormData | UpdateCharacterFormData,
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
            {character
              ? t("form.editTitle", "characters")
              : t("form.createTitle", "characters")}
          </DialogTitle>
          <DialogDescription>
            {character
              ? t("form.editDescription", "characters")
              : t("form.createDescription", "characters")}
          </DialogDescription>
        </DialogHeader>
        <CharacterForm
          character={character}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
