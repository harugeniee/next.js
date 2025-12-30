"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import type {
  BackendGenre,
  UpdateGenreDto,
} from "@/lib/interface/genres.interface";
import { GenreForm } from "./genre-form";

interface GenreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre?: BackendGenre;
  onSubmit: (data: UpdateGenreDto) => Promise<void>;
  isLoading: boolean;
}

export function GenreFormDialog({
  open,
  onOpenChange,
  genre,
  onSubmit,
  isLoading,
}: GenreFormDialogProps) {
  const { t } = useI18n();
  const isEditing = !!genre;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t(
              isEditing ? "genres.form.editTitle" : "genres.form.createTitle",
              "admin",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              isEditing
                ? "genres.form.editDescription"
                : "genres.form.createDescription",
              "admin",
            )}
          </DialogDescription>
        </DialogHeader>
        <GenreForm
          genre={genre}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
