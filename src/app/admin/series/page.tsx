"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  SeriesFilters,
  SeriesFormDialog,
  SeriesList,
} from "@/components/features/admin/series";
import {
  useSeries,
  useCreateSeries,
  useUpdateSeries,
  useDeleteSeries,
} from "@/hooks/admin/useSeries";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { BackendSeries } from "@/lib/interface/series.interface";
import type { CreateSeriesDto, QuerySeriesDto } from "@/lib/api/series";
import type { UpdateSeriesFormData } from "@/lib/validators/series";

/**
 * Series Management Page
 * Displays series management interface with filters, list, and CRUD operations
 */
export default function SeriesPage() {
  const { t } = useI18n();
  const [seriesFilters, setSeriesFilters] = useState<QuerySeriesDto>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    order: "DESC",
  });

  // Dialog state
  const [seriesFormOpen, setSeriesFormOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<
    BackendSeries | undefined
  >();

  const { data: seriesData, isLoading: seriesLoading } =
    useSeries(seriesFilters);

  const createSeriesMutation = useCreateSeries();
  const updateSeriesMutation = useUpdateSeries();
  const deleteSeriesMutation = useDeleteSeries();

  usePageMetadata({
    title: t("title", "series"),
    description: t("description", "series"),
  });

  const handleSeriesFiltersChange = (newFilters: QuerySeriesDto) => {
    // Reset to page 1 when filters change
    setSeriesFilters({
      ...newFilters,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setSeriesFilters((prev) => ({ ...prev, page }));
  };

  const handleCreateSeries = () => {
    setSelectedSeries(undefined);
    setSeriesFormOpen(true);
  };

  const handleSeriesEdit = (series: BackendSeries) => {
    setSelectedSeries(series);
    setSeriesFormOpen(true);
  };

  const handleSeriesSubmit = async (data: UpdateSeriesFormData) => {
    try {
      if (selectedSeries) {
        await updateSeriesMutation.mutateAsync({
          id: selectedSeries.id,
          data,
        });
      } else {
        // Convert UpdateSeriesFormData to CreateSeriesDto
        // type is required for creation
        if (!data.type) {
          throw new Error("Series type is required");
        }
        const createData: CreateSeriesDto = {
          ...data,
          type: data.type,
        };
        await createSeriesMutation.mutateAsync(createData);
      }
      setSeriesFormOpen(false);
      setSelectedSeries(undefined);
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleSeriesDelete = async (series: BackendSeries) => {
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
                {t("breadcrumb.admin", "series")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("breadcrumb.series", "series")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("title", "series")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("description", "series")}
          </p>
        </div>
      </AnimatedSection>

      {/* Series Filters */}
      <AnimatedSection loading={false} data={true}>
        <SeriesFilters
          filters={seriesFilters}
          onFiltersChange={handleSeriesFiltersChange}
        />
      </AnimatedSection>

      {/* Series List */}
      <SeriesList
        data={seriesData?.data}
        isLoading={seriesLoading}
        page={seriesFilters.page || 1}
        limit={seriesFilters.limit || 20}
        onPageChange={handlePageChange}
        onCreate={handleCreateSeries}
        onEdit={handleSeriesEdit}
        onDelete={handleSeriesDelete}
        onUpdate={async (id, data) => {
          await updateSeriesMutation.mutateAsync({ id, data });
        }}
        isUpdating={updateSeriesMutation.isPending}
      />

      {/* Series Form Dialog */}
      <SeriesFormDialog
        open={seriesFormOpen}
        onOpenChange={setSeriesFormOpen}
        series={selectedSeries}
        onSubmit={handleSeriesSubmit}
        isLoading={
          createSeriesMutation.isPending || updateSeriesMutation.isPending
        }
      />
    </div>
  );
}
