"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import { Pagination } from "@/components/ui/pagination";
import type { CreateStickerDto, UpdateStickerDto } from "@/lib/interface";
import type { Sticker } from "@/lib/interface/sticker.interface";
import { CreateStickerFormDialog } from "./create-sticker-form-dialog";
import { EditStickerFormDialog } from "./edit-sticker-form-dialog";

interface StickersListProps {
  data?: {
    result: Sticker[];
    metaData: {
      currentPage?: number;
      totalPages?: number;
      totalRecords?: number;
    };
  };
  isLoading: boolean;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onCreate: (data: CreateStickerDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateStickerDto) => Promise<void>;
  onDelete: (sticker: Sticker) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function StickersList({
  data,
  isLoading,
  page = 1,
  limit: _limit = 20, // eslint-disable-line @typescript-eslint/no-unused-vars
  onPageChange,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: StickersListProps) {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSticker, setEditingSticker] = useState<Sticker | undefined>();

  const handleEdit = (sticker: Sticker) => {
    setEditingSticker(sticker);
  };

  const handleCreate = async (formData: CreateStickerDto) => {
    await onCreate(formData);
    setShowCreateDialog(false);
  };

  const handleUpdate = async (formData: UpdateStickerDto) => {
    if (editingSticker) {
      await onUpdate(editingSticker.id, formData);
      setEditingSticker(undefined);
    }
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const stickers = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={stickers} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("stickers.list.title", "admin")}</CardTitle>
              <CardDescription>
                {t("stickers.list.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("stickers.list.create", "admin")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {stickers && stickers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("stickers.list.name", "admin")}</TableHead>
                      <TableHead>
                        {t("stickers.list.format", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("stickers.list.animated", "admin")}
                      </TableHead>
                      <TableHead>{t("stickers.list.size", "admin")}</TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stickers.map((sticker) => (
                      <TableRow
                        key={sticker.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{sticker.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {sticker.format}
                          </span>
                        </TableCell>
                        <TableCell>
                          {sticker.isAnimated ? (
                            <span className="text-green-600 text-sm">✓</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {sticker.size} KB
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(sticker)}
                              disabled={isUpdating}
                            >
                              {t("common.edit", "common")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(sticker)}
                              disabled={isUpdating}
                            >
                              {t("common.delete", "common")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Placeholder for skeleton - must match table structure
              <div className="space-y-4">
                <div className="h-10 w-full bg-muted/10 rounded-md" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="h-10 w-10 rounded-full bg-muted/20" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[200px] bg-muted/20 rounded" />
                      <div className="h-3 w-[150px] bg-muted/20 rounded" />
                    </div>
                    <div className="h-8 w-16 bg-muted/20 rounded" />
                    <div className="h-8 w-16 bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination */}
          {stickers &&
            stickers.length > 0 &&
            onPageChange &&
            metaData?.totalPages &&
            metaData.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={metaData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
        </CardContent>
      </Card>

      <CreateStickerFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      <EditStickerFormDialog
        open={!!editingSticker}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSticker(undefined);
          }
        }}
        sticker={editingSticker}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </AnimatedSection>
  );
}

export default StickersList;
