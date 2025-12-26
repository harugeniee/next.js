"use client";

import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge } from "@/components/ui/core/badge";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MEDIA_CONSTANTS } from "@/lib/constants/media.constants";
import type { Media } from "@/lib/interface/media.interface";
import type { MediaListResponse } from "@/lib/types/media";
import type { UpdateMediaDto } from "@/lib/types/media";
import { MediaActions } from "./media-actions";
import { MediaDetailDialog } from "./media-detail-dialog";
import { MediaDisplay } from "./media-display";
import { UserPreviewCard } from "./user-preview-card";

interface MediaListProps {
  readonly data?: MediaListResponse;
  readonly isLoading: boolean;
  readonly page: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
  readonly onDelete?: (media: Media) => void;
  readonly onUpdate?: (id: string, data: UpdateMediaDto) => Promise<void>;
  readonly onActivate?: (id: string) => Promise<void>;
  readonly onDeactivate?: (id: string) => Promise<void>;
  readonly isUpdating?: boolean;
  readonly isActivating?: boolean;
}

/**
 * Format file size in bytes to human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Media List Component
 * Displays media in a table view
 */
export function MediaList({
  data,
  isLoading,
  page,
  limit,
  onPageChange,
  onDelete,
  onUpdate,
  onActivate,
  onDeactivate,
  isUpdating,
  isActivating,
}: MediaListProps) {
  const { t } = useI18n();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const MAX_DESCRIPTION_LENGTH = 30;

  // Get media display name
  const getMediaName = (media: Media): string => {
    return media.name || media.originalName || media.title || "Unknown Media";
  };

  // Format date for display
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "-";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("list.title", "media")}</CardTitle>
              <CardDescription>
                {t("list.description", "media")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data?.result && data.result.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("list.table.media", "media")}</TableHead>
                      <TableHead>{t("list.table.type", "media")}</TableHead>
                      <TableHead>{t("list.table.size", "media")}</TableHead>
                      <TableHead>{t("list.table.user", "media")}</TableHead>
                      <TableHead>{t("list.table.status", "media")}</TableHead>
                      <TableHead>
                        {t("list.table.createdAt", "media")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("list.table.actions", "media")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.result.map((media) => {
                      const mediaName = getMediaName(media);
                      const isActive =
                        media.status === MEDIA_CONSTANTS.STATUS.ACTIVE;

                      return (
                        <TableRow
                          key={media.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            setSelectedMedia(media);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <MediaDisplay
                                media={media}
                                size="sm"
                                showName={false}
                              />
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate">
                                  {mediaName}
                                </span>
                                {media.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {media.description.length >
                                    MAX_DESCRIPTION_LENGTH ? (
                                      <span>
                                        {media.description.substring(
                                          0,
                                          MAX_DESCRIPTION_LENGTH,
                                        )}
                                        {"... "}
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedMedia(media);
                                            setIsDetailDialogOpen(true);
                                          }}
                                          className="text-primary hover:underline"
                                        >
                                          {t("list.showMore", "media")}
                                        </button>
                                      </span>
                                    ) : (
                                      <span className="line-clamp-1">
                                        {media.description}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {media.type ? (
                              <Badge variant="outline">
                                {t(
                                  `types.${media.type.toLowerCase()}`,
                                  "media",
                                ) || media.type}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {formatFileSize(media.size)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {media.user || media.userId ? (
                              <UserPreviewCard user={media.user}>
                                <Link
                                  href={`/admin/users/${media.userId || media.user?.id}`}
                                  className="text-sm text-primary hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  {media.user?.name ||
                                    media.user?.email ||
                                    media.user?.username ||
                                    media.userId ||
                                    "-"}
                                </Link>
                              </UserPreviewCard>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {media.status
                                ? t(
                                    `statuses.${media.status.toLowerCase()}`,
                                    "media",
                                  ) || media.status
                                : "-"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {formatDate(media.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell
                            className="text-right"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {onUpdate && onDelete ? (
                              <MediaActions
                                media={media}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                                onActivate={onActivate}
                                onDeactivate={onDeactivate}
                                isUpdating={isUpdating}
                                isActivating={isActivating}
                              />
                            ) : null}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Placeholder for skeleton - must match table structure
              <div className="rounded-md border">
                <div className="h-10 w-full bg-muted/10" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 py-2 px-2 border-b last:border-b-0"
                  >
                    <div className="h-10 w-10 rounded-md bg-muted/20" />
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <div className="h-4 w-[200px] bg-muted/20 rounded" />
                      <div className="h-3 w-[150px] bg-muted/20 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-muted/20 rounded" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                    <div className="h-4 w-24 bg-muted/20 rounded" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination Info */}
          {data && data.metaData.total > 0 && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {t("list.pagination.showing", "media", {
                from: (page - 1) * limit + 1,
                to: Math.min(page * limit, data.metaData.total),
                total: data.metaData.total,
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {data?.metaData.totalPages && data.metaData.totalPages > 1 ? (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) {
                          onPageChange(page - 1);
                        }
                      }}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: data.metaData.totalPages },
                    (_, i) => i + 1,
                  ).map((pageNum) => {
                    const showPage =
                      pageNum === 1 ||
                      pageNum === data.metaData.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    if (!showPage) {
                      if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNum);
                          }}
                          isActive={pageNum === page}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < (data.metaData.totalPages || 1)) {
                          onPageChange(page + 1);
                        }
                      }}
                      className={
                        page >= (data.metaData.totalPages || 1)
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Media Detail Dialog */}
      <MediaDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        media={selectedMedia}
      />
    </AnimatedSection>
  );
}
