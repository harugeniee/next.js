"use client";

import { BookOpen, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
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
import type { Studio } from "@/lib/interface/studio.interface";

interface StudioSeriesListProps {
  readonly studio?: Studio;
  readonly isLoading: boolean;
}

/**
 * Studio Series List Component
 * Displays series that the studio has worked on
 */
export function StudioSeriesList({ studio, isLoading }: StudioSeriesListProps) {
  const { t } = useI18n();
  const router = useRouter();

  // Get series from seriesRoles
  const seriesList =
    studio?.seriesRoles
      ?.filter((sr) => sr.series) // Filter out entries without series data
      .map((sr) => ({
        id: sr.seriesId,
        seriesRoleId: sr.id,
        role: sr.role,
        ...sr.series,
      })) || [];

  // Get series title for display
  const getSeriesTitle = (series: {
    title?: {
      userPreferred?: string;
      romaji?: string;
      english?: string;
      native?: string;
    };
  }): string => {
    if (!series.title) return "-";
    return (
      series.title.userPreferred ||
      series.title.romaji ||
      series.title.english ||
      series.title.native ||
      "-"
    );
  };

  return (
    <AnimatedSection loading={isLoading} data={seriesList}>
      <Card>
        <CardHeader>
          <CardTitle>{t("studios.detail.series.title", "admin")}</CardTitle>
          <CardDescription>
            {t("studios.detail.series.description", "admin")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {seriesList && seriesList.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("studios.detail.series.seriesName", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("studios.detail.series.role", "admin")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seriesList.map((series) => (
                      <TableRow
                        key={series.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          router.push(`/admin/series/${series.id}`)
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {getSeriesTitle({
                                title: series.title
                                  ? {
                                      ...series.title,
                                      english:
                                        series.title.english || undefined,
                                    }
                                  : undefined,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {series.role || "-"}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <Link
                            href={`/admin/series/${series.id}`}
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t("actions.view", "common")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t("studios.detail.series.noSeries", "admin")}
                </p>
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
