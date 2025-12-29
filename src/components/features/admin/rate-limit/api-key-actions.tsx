"use client";

import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { toast } from "sonner";
import type {
  ApiKey,
  UpdateApiKeyDto,
} from "@/lib/interface/rate-limit.interface";
import { ApiKeyFormDialog } from "./api-key-form-dialog";

interface ApiKeyActionsProps {
  readonly apiKey: ApiKey;
  readonly onUpdate: (id: string, data: UpdateApiKeyDto) => Promise<void>;
  readonly onDelete: (id: string) => void;
  readonly isUpdating?: boolean;
}

export function ApiKeyActions({
  apiKey,
  onUpdate,
  onDelete,
  isUpdating,
}: Readonly<ApiKeyActionsProps>) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.key);
      toast.success(t("rateLimit.apiKeys.copySuccess", "admin"));
    } catch {
      toast.error(t("rateLimit.apiKeys.copyError", "admin"));
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        t("rateLimit.apiKeys.deleteConfirm", "admin", {
          name: apiKey.name || apiKey.key,
        }),
      )
    ) {
      onDelete(apiKey.id);
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
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {t("rateLimit.apiKeys.copy", "admin")}
          </DropdownMenuItem>
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

      <ApiKeyFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        apiKey={apiKey}
        onSubmit={(data) => onUpdate(apiKey.id, data as UpdateApiKeyDto)}
        isLoading={isUpdating}
      />
    </>
  );
}
