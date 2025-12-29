"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { SeriesDetail } from "@/components/features/admin/series";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import {
  useSeriesDetail,
  useDeleteSeries,
  useUpdateSeries,
} from "@/hooks/admin/useSeries";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { BackendSeries } from "@/lib/interface/series.interface";
import type { UpdateSeriesFormData } from "@/lib/validators/series";

/**
 * Admin Series Detail Page
 * Displays detailed series information and allows editing/deleting
 */
export default function SeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const seriesId = params.series_id as string;

  const { data: series, isLoading, error } = useSeriesDetail(seriesId);
  const updateSeriesMutation = useUpdateSeries();
  const deleteSeriesMutation = useDeleteSeries();

  // Get series title for display
  const seriesTitle =
    series?.title?.userPreferred ||
    series?.title?.romaji ||
    series?.title?.english ||
    series?.title?.native ||
    "Unknown Series";

  // Update page metadata
  usePageMetadata({
    title: series
      ? t("detail.title", "series", { name: seriesTitle })
      : t("detail.title", "series"),
    description: t("detail.description", "series"),
  });

  // Show 404 if series not found
  if (!isLoading && !error && !series) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateSeriesFormData) => {
    try {
      await updateSeriesMutation.mutateAsync({ id, data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (series: BackendSeries) => {
    const seriesTitle =
      series.title?.userPreferred ||
      series.title?.romaji ||
      series.title?.english ||
      "Unknown Series";

    if (!confirm(t("list.deleteConfirm", "series", { name: seriesTitle }))) {
      return;
    }

    try {
      await deleteSeriesMutation.mutateAsync(series.id);
      // Redirect to series list after deletion
      router.push("/admin/series");
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">
                {t("admin", "common")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/series">
                {t("title", "series")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {series ? seriesTitle : t("detail.title", "series")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={series}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {series
              ? t("detail.title", "series", { name: seriesTitle })
              : t("detail.title", "series")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("detail.description", "series")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("detail.error", "series")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Series Detail Component */}
      {series && (
        <SeriesDetail
          series={series}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={
            updateSeriesMutation.isPending || deleteSeriesMutation.isPending
          }
        />
      )}
    </div>
  );
}
