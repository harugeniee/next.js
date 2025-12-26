"use client";

import {
  Edit,
  MoreHorizontal,
  Trash2,
  Eye,
  Power,
  PowerOff,
} from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { MEDIA_CONSTANTS } from "@/lib/constants/media.constants";
import type { Media } from "@/lib/interface/media.interface";
import type { UpdateMediaDto } from "@/lib/types/media";
import { MediaDetailDialog } from "./media-detail-dialog";
import { MediaFormDialog } from "./media-form-dialog";

interface MediaActionsProps {
  readonly media: Media;
  readonly onDelete: (media: Media) => void;
  readonly onUpdate: (id: string, data: UpdateMediaDto) => Promise<void>;
  readonly onActivate?: (id: string) => Promise<void>;
  readonly onDeactivate?: (id: string) => Promise<void>;
  readonly isUpdating?: boolean;
  readonly isActivating?: boolean;
}

export function MediaActions({
  media,
  onDelete,
  onUpdate,
  onActivate,
  onDeactivate,
  isUpdating,
  isActivating,
}: MediaActionsProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const isActive = media.status === MEDIA_CONSTANTS.STATUS.ACTIVE;
  const canActivate = onActivate && !isActive;
  const canDeactivate = onDeactivate && isActive;

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleViewDetails = () => {
    setShowDetailDialog(true);
  };

  const handleActivate = async () => {
    if (onActivate) {
      await onActivate(media.id);
    }
  };

  const handleDeactivate = async () => {
    if (onDeactivate) {
      await onDeactivate(media.id);
    }
  };

  const handleSubmit = async (data: UpdateMediaDto) => {
    await onUpdate(media.id, data);
    setShowEditDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("actions.menu", "media")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            {t("actions.viewDetails", "media")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t("actions.edit", "media")}
          </DropdownMenuItem>
          {canActivate && (
            <DropdownMenuItem
              onClick={handleActivate}
              disabled={isActivating}
            >
              <Power className="mr-2 h-4 w-4" />
              {t("actions.activate", "media")}
            </DropdownMenuItem>
          )}
          {canDeactivate && (
            <DropdownMenuItem
              onClick={handleDeactivate}
              disabled={isActivating}
            >
              <PowerOff className="mr-2 h-4 w-4" />
              {t("actions.deactivate", "media")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(media)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("actions.delete", "media")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MediaFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        media={media}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />

      <MediaDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        media={media}
      />
    </>
  );
}

