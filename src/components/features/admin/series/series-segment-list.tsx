"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/core/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { SeriesSegment } from "@/lib/interface/series.interface";
import type { ApiResponseOffset } from "@/lib/types";
import { format } from "date-fns";

interface SeriesSegmentListProps {
  readonly data?: ApiResponseOffset<SeriesSegment>;
  readonly isLoading: boolean;
  readonly page: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
  readonly onCreate?: () => void;
}

/**
 * Series Segment List Component
 * Displays segments (episodes/chapters) of a series in a table view
 */
export function SeriesSegmentList({
  data,
  isLoading,
  page,
  limit,
  onPageChange,
  onCreate,
}: SeriesSegmentListProps) {
  const { t } = useI18n();
  const router = useRouter();

  // Format segment number with sub-number
  const formatSegmentNumber = (segment: SeriesSegment): string => {
    if (segment.subNumber) {
      return `${segment.number}.${segment.subNumber}`;
    }
    return segment.number.toString();
  };

  // Format date for display
  const formatDate = (date?: Date | string | null): string => {
    if (!date) return "-";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return format(d, "PPP");
    } catch {
      return "-";
    }
  };

  // Get total pages
  const totalPages = data?.data?.metaData?.totalPages ?? 1;
  const currentPage = page;

  // Generate page numbers to display
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("detail.segments.title", "series")}</CardTitle>
              <CardDescription>
                {t("detail.segments.description", "series")}
              </CardDescription>
            </div>
            {onCreate && (
              <Button size="sm" onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                {t("detail.segments.create", "series")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data?.data?.result && data.data.result.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("detail.segments.table.number", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.segments.table.title", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.segments.table.type", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.segments.table.status", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.segments.table.language", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.segments.table.publishedAt", "series")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.result.map((segment) => (
                        <TableRow
                          key={segment.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() =>
                            router.push(`/admin/segments/${segment.id}`)
                          }
                        >
                          <TableCell className="font-medium">
                            {formatSegmentNumber(segment)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {segment.title || "-"}
                              </span>
                              {segment.description && (
                                <span className="text-xs text-muted-foreground truncate max-w-md">
                                  {segment.description}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {segment.type
                                ? t(
                                    `detail.segments.type.${segment.type}`,
                                    "series",
                                  )
                                : "-"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                segment.status === "active"
                                  ? "default"
                                  : segment.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {segment.status
                                ? t(
                                    `detail.segments.status.${segment.status}`,
                                    "series",
                                  )
                                : "-"}
                            </Badge>
                          </TableCell>
                          <TableCell>{segment.languageCode || "-"}</TableCell>
                          <TableCell>
                            {formatDate(segment.publishedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-4">
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
                              : ""
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((pageNum) => (
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
                      ))}

                      {totalPages >
                        getPageNumbers()[getPageNumbers().length - 1] && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
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
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t("detail.segments.empty", "series")}
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
