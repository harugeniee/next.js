"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import type { BackendSeries } from "@/lib/interface/series.interface";
import type {
  CreateSeriesFormData,
  UpdateSeriesFormData,
} from "@/lib/validators/series";
import { SeriesForm } from "./series-form";

interface SeriesFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly series?: BackendSeries;
  readonly onSubmit: (
    data: CreateSeriesFormData | UpdateSeriesFormData,
  ) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Series Form Dialog Component
 * Wraps SeriesForm in a Dialog modal
 */
export function SeriesFormDialog({
  open,
  onOpenChange,
  series,
  onSubmit,
  isLoading = false,
}: SeriesFormDialogProps) {
  const { t } = useI18n();

  const handleSubmit = async (
    data: CreateSeriesFormData | UpdateSeriesFormData,
  ) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {series
              ? t("form.editTitle", "series")
              : t("form.createTitle", "series")}
          </DialogTitle>
          <DialogDescription>
            {series
              ? t("form.editDescription", "series")
              : t("form.createDescription", "series")}
          </DialogDescription>
        </DialogHeader>
        <SeriesForm
          series={series}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
