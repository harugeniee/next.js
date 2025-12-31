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
import type { Studio, UpdateStudioDto } from "@/lib/interface/studio.interface";
import { EditStudioFormDialog } from "./edit-studio-form-dialog";

interface StudioActionsProps {
  readonly studio: Studio;
  readonly onDelete: (studio: Studio) => void;
  readonly onUpdate: (id: string, data: UpdateStudioDto) => Promise<void>;
  readonly isUpdating?: boolean;
}

export function StudioActions({
  studio,
  onDelete,
  onUpdate,
  isUpdating,
}: Readonly<StudioActionsProps>) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSubmit = async (data: UpdateStudioDto) => {
    await onUpdate(studio.id, data);
    setShowEditDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isUpdating}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("common.actions", "common")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("actions.edit", "common")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(studio)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("actions.delete", "common")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditStudioFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        studio={studio}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </>
  );
}
