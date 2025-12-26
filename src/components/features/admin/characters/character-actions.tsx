"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { Character } from "@/lib/interface/character.interface";
import { CharacterFormDialog } from "./character-form-dialog";
import type {
  CreateCharacterFormData,
  UpdateCharacterFormData,
} from "@/lib/validators/characters";

interface CharacterActionsProps {
  character: Character;
  onDelete: (character: Character) => void;
  onUpdate: (id: string, data: UpdateCharacterFormData) => Promise<void>;
  isUpdating?: boolean;
}

export function CharacterActions({
  character,
  onDelete,
  onUpdate,
  isUpdating,
}: CharacterActionsProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleSubmit = async (
    data: CreateCharacterFormData | UpdateCharacterFormData,
  ) => {
    await onUpdate(character.id, data as UpdateCharacterFormData);
    setShowEditDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("common.actions", "common")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t("list.edit", "characters")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(character)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("list.delete", "characters")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CharacterFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        character={character}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </>
  );
}

