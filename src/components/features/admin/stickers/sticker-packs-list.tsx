"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import type {
  CreateStickerPackDto,
  UpdateStickerPackDto,
} from "@/lib/interface";
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
import type { StickerPack } from "@/lib/interface/sticker.interface";
import { CreateStickerPackFormDialog } from "./create-sticker-pack-form-dialog";
import { EditStickerPackFormDialog } from "./edit-sticker-pack-form-dialog";

interface StickerPacksListProps {
  data?: {
    result: StickerPack[];
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
  onCreate: (data: CreateStickerPackDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateStickerPackDto) => Promise<void>;
  onDelete: (pack: StickerPack) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function StickerPacksList({
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
}: StickerPacksListProps) {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPack, setEditingPack] = useState<StickerPack | undefined>();

  const handleEdit = (pack: StickerPack) => {
    setEditingPack(pack);
  };

  const handleCreate = async (formData: CreateStickerPackDto) => {
    await onCreate(formData);
    setShowCreateDialog(false);
  };

  const handleUpdate = async (formData: UpdateStickerPackDto) => {
    if (editingPack) {
      await onUpdate(editingPack.id, formData);
      setEditingPack(undefined);
    }
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const packs = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={packs} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("stickers.list.packListTitle", "admin")}</CardTitle>
              <CardDescription>
                {t("stickers.list.packListDescription", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("stickers.list.createPack", "admin")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {packs && packs.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("stickers.list.packName", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("stickers.list.description", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("stickers.list.stickerCount", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("stickers.list.createdAt", "admin")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packs.map((pack) => (
                      <TableRow
                        key={pack.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{pack.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-sm text-muted-foreground max-w-xs truncate"
                            title={pack.description}
                          >
                            {pack.description || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {pack.stickers?.length || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(pack.createdAt).toLocaleDateString()}
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
                              onClick={() => handleEdit(pack)}
                              disabled={isUpdating}
                            >
                              {t("common.edit", "common")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(pack)}
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
          {packs &&
            packs.length > 0 &&
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

      <CreateStickerPackFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      <EditStickerPackFormDialog
        open={!!editingPack}
        onOpenChange={(open) => {
          if (!open) {
            setEditingPack(undefined);
          }
        }}
        pack={editingPack}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </AnimatedSection>
  );
}

export default StickerPacksList;
