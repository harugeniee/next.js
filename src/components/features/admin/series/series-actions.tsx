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
import type { BackendSeries } from "@/lib/interface/series.interface";
import type { UpdateSeriesFormData } from "@/lib/validators/series";
import { SeriesFormDialog } from "./series-form-dialog";

interface SeriesActionsProps {
  series: BackendSeries;
  onDelete: (series: BackendSeries) => void;
  onUpdate: (id: string, data: UpdateSeriesFormData) => Promise<void>;
  isUpdating?: boolean;
}

/**
 * Series Actions Component
 * Provides dropdown menu with Edit and Delete actions
 */
export function SeriesActions({
  series,
  onDelete,
  onUpdate,
  isUpdating,
}: SeriesActionsProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleSubmit = async (data: UpdateSeriesFormData) => {
    await onUpdate(series.id, data);
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
            {t("list.edit", "series")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(series)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("list.delete", "series")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SeriesFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        series={series}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </>
  );
}
