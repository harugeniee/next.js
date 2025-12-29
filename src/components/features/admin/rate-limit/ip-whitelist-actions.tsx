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
import type {
  IpWhitelist,
  UpdateIpWhitelistDto,
} from "@/lib/interface/rate-limit.interface";
import { IpWhitelistFormDialog } from "./ip-whitelist-form-dialog";

interface IpWhitelistActionsProps {
  readonly entry: IpWhitelist;
  readonly onUpdate: (id: string, data: UpdateIpWhitelistDto) => Promise<void>;
  readonly onDelete: (id: string) => void;
  readonly isUpdating?: boolean;
}

export function IpWhitelistActions({
  entry,
  onUpdate,
  onDelete,
  isUpdating,
}: Readonly<IpWhitelistActionsProps>) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = () => {
    if (
      confirm(
        t("rateLimit.ipWhitelist.deleteConfirm", "admin", { ip: entry.ip }),
      )
    ) {
      onDelete(entry.id);
    }
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
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("actions.edit", "common")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("actions.delete", "common")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <IpWhitelistFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        entry={entry}
        onSubmit={(data) => onUpdate(entry.id, data as UpdateIpWhitelistDto)}
        isLoading={isUpdating}
      />
    </>
  );
}

