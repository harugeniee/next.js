"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { BackendSeries } from "@/lib/interface/series.interface";
import type { PaginationOffset } from "@/lib/types";
import type { UpdateSeriesFormData } from "@/lib/validators/series";
import { SeriesActions } from "./series-actions";

interface SeriesListProps {
  readonly data?: PaginationOffset<BackendSeries>;
  readonly isLoading: boolean;
  readonly page: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
  readonly onCreate?: () => void;
  readonly onEdit?: (series: BackendSeries) => void;
  readonly onDelete?: (series: BackendSeries) => void;
  readonly onUpdate?: (id: string, data: UpdateSeriesFormData) => Promise<void>;
  readonly isUpdating?: boolean;
}

/**
 * Series List Component
 * Displays series in a table view
 */
export function SeriesList({
  data,
  isLoading,
  page,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
  onUpdate,
  isUpdating,
}: SeriesListProps) {
  const { t } = useI18n();
  const router = useRouter();

  // Get series title from title object
  const getSeriesTitle = (series: BackendSeries): string => {
    if (!series.title) {
      return series.id;
    }
    return (
      series.title.userPreferred ||
      series.title.romaji ||
      series.title.english ||
      series.title.native ||
      series.id
    );
  };

  // Get cover image URL
  const getCoverImageUrl = (series: BackendSeries): string | null => {
    if (series.coverImage?.url) {
      return series.coverImage.url;
    }
    if (series.coverImageUrls?.large) {
      return series.coverImageUrls.large;
    }
    if (series.coverImageUrls?.medium) {
      return series.coverImageUrls.medium;
    }
    return null;
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

  // Truncate text
  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const totalPages = data?.metaData?.totalPages || 1;
  const currentPage = page;

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("list.title", "series")}</CardTitle>
              <CardDescription>
                {t("list.description", "series")}
              </CardDescription>
            </div>
            {onCreate && (
              <Button size="sm" onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                {t("list.create", "series")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data?.result && data.result.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("list.table.series", "series")}</TableHead>
                      <TableHead>{t("list.table.type", "series")}</TableHead>
                      <TableHead>{t("list.table.format", "series")}</TableHead>
                      <TableHead>{t("list.table.status", "series")}</TableHead>
                      <TableHead>
                        {t("list.table.episodesChapters", "series")}
                      </TableHead>
                      <TableHead>{t("list.table.score", "series")}</TableHead>
                      <TableHead>
                        {t("list.table.createdAt", "series")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("list.table.actions", "series")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.result.map((series) => {
                      const title = getSeriesTitle(series);
                      const coverUrl = getCoverImageUrl(series);
                      const isAnime =
                        series.type === SERIES_CONSTANTS.TYPE.ANIME;
                      const episodesChapters = isAnime
                        ? series.episodes
                          ? `${series.episodes} ${t("list.episodes", "series")}`
                          : "-"
                        : series.chapters
                          ? `${series.chapters} ${t("list.chapters", "series")}`
                          : "-";

                      return (
                        <TableRow
                          key={series.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() =>
                            router.push(`/admin/series/${series.id}`)
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {coverUrl ? (
                                <div className="relative h-12 w-8 flex-shrink-0 rounded overflow-hidden">
                                  <Image
                                    src={coverUrl}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                  />
                                </div>
                              ) : (
                                <div className="h-12 w-8 flex-shrink-0 rounded bg-muted" />
                              )}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate">
                                  {title}
                                </span>
                                {series.description && (
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {truncateText(series.description, 60)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {t(`types.${series.type}`, "series")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {series.format ? (
                              <Badge variant="secondary">
                                {t(`formats.${series.format}`, "series")}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {series.status ? (
                              <Badge variant="outline">
                                {t(`statuses.${series.status}`, "series")}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{episodesChapters}</span>
                          </TableCell>
                          <TableCell>
                            {series.averageScore ? (
                              <span className="text-sm font-medium">
                                {series.averageScore.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {formatDate(series.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell
                            className="text-right"
                            onClick={(e) => {
                              // Stop propagation to prevent row click when clicking actions
                              e.stopPropagation();
                            }}
                          >
                            {onUpdate && onDelete ? (
                              <SeriesActions
                                series={series}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                                isUpdating={isUpdating}
                              />
                            ) : (
                              <div className="flex justify-end">
                                {onEdit && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(series)}
                                  >
                                    {t("list.edit", "series")}
                                  </Button>
                                )}
                                {onDelete && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(series)}
                                  >
                                    {t("list.delete", "series")}
                                  </Button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t("list.empty", "series")}
                </p>
              </div>
            )}
          </Skeletonize>

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          onPageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                onPageChange(pageNum);
                              }}
                              isActive={pageNum === currentPage}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    },
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          onPageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
