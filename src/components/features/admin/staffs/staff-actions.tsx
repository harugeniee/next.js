"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { Staff } from "@/lib/interface/staff.interface";

interface StaffActionsProps {
  readonly staff: Staff;
  readonly onEdit: (staff: Staff) => void;
  readonly onDelete: (staff: Staff) => void;
  readonly isUpdating?: boolean;
}

export function StaffActions({
  staff,
  onEdit,
  onDelete,
  isUpdating,
}: Readonly<StaffActionsProps>) {
  const { t } = useI18n();

  return (
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
        <DropdownMenuItem onClick={() => onEdit(staff)}>
          <Edit className="mr-2 h-4 w-4" />
          {t("actions.edit", "common")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(staff)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("actions.delete", "common")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
