"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
import type { CreateStudioDto, UpdateStudioDto } from "@/lib/interface";
import type { Studio } from "@/lib/interface/studio.interface";
import { CreateStudioFormDialog } from "./create-studio-form-dialog";
import { StudioActions } from "./studio-actions";

interface StudiosListProps {
  data?: {
    result: Studio[];
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
  onCreate: (data: CreateStudioDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateStudioDto) => Promise<void>;
  onDelete: (studio: Studio) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function StudiosList({
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
}: StudiosListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreate = async (formData: CreateStudioDto) => {
    await onCreate(formData);
    setShowCreateDialog(false);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const studios = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={studios} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("studios.list.title", "admin")}</CardTitle>
              <CardDescription>
                {t("studios.list.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("studios.list.create", "admin")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {studios && studios.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("studios.list.name", "admin")}</TableHead>
                      <TableHead>{t("studios.list.type", "admin")}</TableHead>
                      <TableHead>
                        {t("studios.list.status", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("studios.list.siteUrl", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("studios.list.createdAt", "admin")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studios.map((studio) => (
                      <TableRow
                        key={studio.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/admin/studios/${studio.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{studio.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {studio.type
                              ? t(
                                  `studios.types.${studio.type}`,
                                  "admin",
                                  {},
                                  studio.type,
                                )
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {studio.status
                              ? t(
                                  `studios.status.${studio.status}`,
                                  "admin",
                                  {},
                                  studio.status,
                                )
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {studio.siteUrl ? (
                            <a
                              href={studio.siteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {studio.siteUrl}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(studio.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center justify-end">
                            <StudioActions
                              studio={studio}
                              onDelete={onDelete}
                              onUpdate={onUpdate}
                              isUpdating={isUpdating}
                            />
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
          {studios &&
            studios.length > 0 &&
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

      <CreateStudioFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}

export default StudiosList;

