"use client";

import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { Role } from "@/lib/interface/permission.interface";

interface RoleActionsProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onViewUsers?: (role: Role) => void;
  isUpdating?: boolean;
}

export function RoleActions({
  role,
  onEdit,
  onDelete,
  onViewUsers,
  isUpdating,
}: RoleActionsProps) {
  const { t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
          <span className="sr-only">{t("actions.menu", "common")}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onViewUsers && (
          <>
            <DropdownMenuItem onClick={() => onViewUsers(role)}>
              <Users className="mr-2 h-4 w-4" />
              {t("list.viewUsers", "permissions")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => onEdit(role)}>
          <Pencil className="mr-2 h-4 w-4" />
          {t("actions.edit", "common")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(role)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("actions.delete", "common")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
