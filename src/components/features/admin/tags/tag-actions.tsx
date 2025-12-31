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
import type { Tag, UpdateTagDto } from "@/lib/api/tags";
import { EditTagFormDialog } from "./edit-tag-form-dialog";

interface TagActionsProps {
  readonly tag: Tag;
  readonly onDelete: (tag: Tag) => void;
  readonly onUpdate: (id: string, data: UpdateTagDto) => Promise<void>;
  readonly isUpdating?: boolean;
}

export function TagActions({
  tag,
  onDelete,
  onUpdate,
  isUpdating,
}: Readonly<TagActionsProps>) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSubmit = async (data: UpdateTagDto) => {
    await onUpdate(tag.id, data);
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
            onClick={() => onDelete(tag)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("actions.delete", "common")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTagFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        tag={tag}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </>
  );
}

