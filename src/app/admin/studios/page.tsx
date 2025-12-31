"use client";

import { useState } from "react";

import { StudiosList } from "@/components/features/admin/studios/studios-list";
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
import { useStudios } from "@/hooks/admin/useStudios";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Studio } from "@/lib/interface/studio.interface";
import type { CreateStudioDto, UpdateStudioDto } from "@/lib/interface";

/**
 * Studios Management Page
 * Displays studio management interface
 */
export default function AdminStudiosPage() {
  const { t } = useI18n();

  // State for filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    query: "",
  });

  usePageMetadata({
    title: t("studios.pageTitle", "admin"),
    description: t("studios.pageDescription", "admin"),
  });

  // Fetch studios data
  const { listQuery: studiosQuery } = useStudios(filters);
  const studiosData = studiosQuery.data;
  const studiosLoading = studiosQuery.isLoading;

  // Mutations
  const {
    create: createStudio,
    update: updateStudio,
    remove: removeStudio,
  } = useStudios(filters);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // CRUD handlers
  const handleCreateStudio = async (
    data: Parameters<typeof createStudio.mutateAsync>[0],
  ) => {
    await createStudio.mutateAsync(data);
  };

  const handleUpdateStudio = async (
    id: string,
    data: Parameters<typeof updateStudio.mutateAsync>[0]["dto"],
  ) => {
    await updateStudio.mutateAsync({ id, dto: data });
  };

  const handleDeleteStudio = async (studio: Studio) => {
    if (
      confirm(t("studios.list.deleteConfirm", "admin", { name: studio.name }))
    ) {
      await removeStudio.mutateAsync(studio.id);
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
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("studios.pageTitle", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("studios.pageTitle", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("studios.pageDescription", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Studios List */}
      <StudiosList
        data={studiosData}
        isLoading={studiosLoading}
        page={filters.page}
        limit={filters.limit}
        onPageChange={handlePageChange}
        onCreate={handleCreateStudio}
        onUpdate={handleUpdateStudio}
        onDelete={handleDeleteStudio}
        isCreating={createStudio.isPending}
        isUpdating={updateStudio.isPending || removeStudio.isPending}
      />
    </div>
  );
}

