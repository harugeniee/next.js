"use client";

import { useState } from "react";

import { TagFilters, TagsList } from "@/components/features/admin/tags";
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
import { useTags } from "@/hooks/admin/useTags";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { QueryTagsDto, Tag } from "@/lib/api/tags";

/**
 * Tags Management Page
 * Displays tag management interface
 */
export default function AdminTagsPage() {
  const { t } = useI18n();

  // State for filters
  const [filters, setFilters] = useState<QueryTagsDto>({
    page: 1,
    limit: 20,
    query: "",
  });

  usePageMetadata({
    title: t("pageTitle", "tags"),
    description: t("pageDescription", "tags"),
  });

  // Fetch tags data
  const { listQuery: tagsQuery } = useTags(filters);
  const tagsData = tagsQuery.data;
  const tagsLoading = tagsQuery.isLoading;

  // Mutations
  const {
    create: createTag,
    update: updateTag,
    remove: removeTag,
  } = useTags(filters);

  // Filter handlers
  const handleFiltersChange = (newFilters: QueryTagsDto) => {
    // Reset to page 1 when filters change
    setFilters({
      ...newFilters,
      page: 1,
    });
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // CRUD handlers
  const handleCreateTag = async (
    data: Parameters<typeof createTag.mutateAsync>[0],
  ) => {
    await createTag.mutateAsync(data);
  };

  const handleUpdateTag = async (
    id: string,
    data: Parameters<typeof updateTag.mutateAsync>[0]["dto"],
  ) => {
    await updateTag.mutateAsync({ id, dto: data });
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (confirm(t("list.deleteConfirm", "tags", { name: tag.name }))) {
      await removeTag.mutateAsync(tag.id);
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
              <BreadcrumbPage>{t("pageTitle", "tags")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("pageTitle", "tags")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("pageDescription", "tags")}
          </p>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection loading={false} data={true}>
        <TagFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </AnimatedSection>

      {/* Tags List */}
      <TagsList
        data={tagsData}
        isLoading={tagsLoading}
        page={filters.page}
        limit={filters.limit}
        onPageChange={handlePageChange}
        onCreate={handleCreateTag}
        onUpdate={handleUpdateTag}
        onDelete={handleDeleteTag}
        isCreating={createTag.isPending}
        isUpdating={updateTag.isPending || removeTag.isPending}
      />
    </div>
  );
}
