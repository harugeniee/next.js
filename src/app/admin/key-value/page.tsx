"use client";

import { useState } from "react";

import {
  KeyValueFilters,
  KeyValueList,
} from "@/components/features/admin/key-value";
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
import { useKeyValues } from "@/hooks/admin/useKeyValue";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type {
  QueryKeyValueDto,
  KeyValue,
} from "@/lib/interface/key-value.interface";

/**
 * Key-Value Management Page
 * Displays key-value store management interface
 */
export default function KeyValuePage() {
  const { t } = useI18n();

  // State for filters
  const [filters, setFilters] = useState<QueryKeyValueDto>({
    page: 1,
    limit: 20,
    query: "",
  });

  usePageMetadata({
    title: t("keyValue.title", "admin"),
    description: t("keyValue.description", "admin"),
  });

  // Fetch key-value data
  const { listQuery: keyValuesQuery } = useKeyValues(filters);
  const keyValuesData = keyValuesQuery.data;
  const keyValuesLoading = keyValuesQuery.isLoading;

  // Mutations
  const { update: updateKeyValue, remove: removeKeyValue } =
    useKeyValues(filters);

  // Filter handlers
  const handleFiltersChange = (newFilters: QueryKeyValueDto) => {
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
  const handleUpdateKeyValue = async (
    id: string,
    data: Parameters<typeof updateKeyValue.mutateAsync>[0]["dto"],
  ) => {
    await updateKeyValue.mutateAsync({ id, dto: data });
  };

  const handleDeleteKeyValue = async (keyValue: KeyValue) => {
    if (
      confirm(t("keyValue.list.deleteConfirm", "admin", { key: keyValue.key }))
    ) {
      await removeKeyValue.mutateAsync(keyValue.id);
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
              <BreadcrumbPage>{t("keyValue.title", "admin")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("keyValue.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("keyValue.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection loading={false} data={true}>
        <KeyValueFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </AnimatedSection>

      {/* Key-Value List */}
      <KeyValueList
        data={keyValuesData}
        isLoading={keyValuesLoading}
        page={filters.page}
        limit={filters.limit}
        onPageChange={handlePageChange}
        onUpdate={handleUpdateKeyValue}
        onDelete={handleDeleteKeyValue}
        isUpdating={updateKeyValue.isPending || removeKeyValue.isPending}
      />
    </div>
  );
}
