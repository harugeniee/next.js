"use client";

import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { UpdateUserDto, User } from "@/lib/interface/user.interface";
import { UserFormDialog } from "./user-form-dialog";

interface UserActionsProps {
  readonly user: User;
  readonly onDelete: (user: User) => void;
  readonly onUpdate: (id: string, data: UpdateUserDto) => Promise<void>;
  readonly isUpdating?: boolean;
}

export function UserActions({
  user,
  onDelete,
  onUpdate,
  isUpdating,
}: Readonly<UserActionsProps>) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

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
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              {t("viewDetails", "common")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("actions.edit", "common")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(user)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("actions.delete", "common")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={user}
        onSubmit={(data) => onUpdate(user.id, data)}
        isLoading={isUpdating}
      />
    </>
  );
}
