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
  MediaFilters,
  MediaFormDialog,
  MediaList,
  MediaStatisticsCards,
} from "@/components/features/admin/media";
import {
  useMedia,
  useMediaStatistics,
  useUpdateMedia,
  useDeleteMedia,
  useActivateMedia,
  useDeactivateMedia,
} from "@/hooks/admin/useMedia";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Media } from "@/lib/interface/media.interface";
import type { GetMediaDto, UpdateMediaDto } from "@/lib/types/media";

/**
 * Media Management Page
 * Displays media management interface with statistics, filters, and list
 */
export default function MediaPage() {
  const { t } = useI18n();
  const [mediaFilters, setMediaFilters] = useState<GetMediaDto>({
    page: 1,
    limit: 20,
  });

  // Dialog state
  const [mediaFormOpen, setMediaFormOpen] = useState(false);
  const [selectedMedia] = useState<Media | undefined>();

  const { data: mediaData, isLoading: mediaLoading } = useMedia(mediaFilters);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useMediaStatistics();

  const updateMediaMutation = useUpdateMedia();
  const deleteMediaMutation = useDeleteMedia();
  const activateMediaMutation = useActivateMedia();
  const deactivateMediaMutation = useDeactivateMedia();

  usePageMetadata({
    title: t("title", "media"),
    description: t("description", "media"),
  });

  const handleMediaFiltersChange = (newFilters: GetMediaDto) => {
    // Reset to page 1 when filters change
    setMediaFilters({
      ...newFilters,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setMediaFilters((prev) => ({ ...prev, page }));
  };

  const handleMediaSubmit = async (data: UpdateMediaDto) => {
    try {
      if (selectedMedia) {
        await updateMediaMutation.mutateAsync({
          id: selectedMedia.id,
          data,
        });
        setMediaFormOpen(false);
      }
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleMediaDelete = async (media: Media) => {
    const mediaName =
      media.name || media.originalName || media.title || "Unknown Media";

    if (!confirm(t("list.deleteConfirm", "media", { name: mediaName }))) {
      return;
    }

    try {
      await deleteMediaMutation.mutateAsync(media.id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleMediaActivate = async (id: string) => {
    try {
      await activateMediaMutation.mutateAsync(id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleMediaDeactivate = async (id: string) => {
    try {
      await deactivateMediaMutation.mutateAsync(id);
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
                {t("breadcrumb.admin", "media")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("breadcrumb.media", "media")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("title", "media")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("description", "media")}
          </p>
        </div>
      </AnimatedSection>

      {/* Statistics Cards */}
      <MediaStatisticsCards
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Media Filters */}
      <AnimatedSection loading={false} data={true}>
        <MediaFilters
          filters={mediaFilters}
          onFiltersChange={handleMediaFiltersChange}
        />
      </AnimatedSection>

      {/* Media List */}
      <MediaList
        data={mediaData}
        isLoading={mediaLoading}
        page={mediaFilters.page || 1}
        limit={mediaFilters.limit || 20}
        onPageChange={handlePageChange}
        onDelete={handleMediaDelete}
        onUpdate={async (id, data) => {
          await updateMediaMutation.mutateAsync({ id, data });
        }}
        onActivate={handleMediaActivate}
        onDeactivate={handleMediaDeactivate}
        isUpdating={updateMediaMutation.isPending}
        isActivating={
          activateMediaMutation.isPending || deactivateMediaMutation.isPending
        }
      />

      {/* Media Form Dialog */}
      <MediaFormDialog
        open={mediaFormOpen}
        onOpenChange={setMediaFormOpen}
        media={selectedMedia}
        onSubmit={handleMediaSubmit}
        isLoading={updateMediaMutation.isPending}
      />
    </div>
  );
}
