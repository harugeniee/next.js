"use client";

import { useCallback, useState } from "react";

import {
  OrganizationFilters,
  OrganizationList,
} from "@/components/features/admin/organizations";
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
  useOrganizationMutations,
  useOrganizations,
} from "@/hooks/admin/useOrganizations";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type {
  CreateOrganizationDto,
  Organization,
  UpdateOrganizationDto,
} from "@/lib/interface/organization.interface";
import type { AdvancedQueryParams } from "@/lib/types";

export default function OrganizationsPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<AdvancedQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "DESC",
  });

  usePageMetadata({
    title: t("organizations.title", "admin"),
    description: t("organizations.description", "admin"),
  });

  const { data: organizationsData, isLoading } = useOrganizations(filters);
  const { createOrganization, updateOrganization, deleteOrganization } =
    useOrganizationMutations();

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : status,
      page: 1,
    }));
  }, []);

  const handleVisibilityChange = useCallback((visibility: string) => {
    setFilters((prev) => ({
      ...prev,
      visibility: visibility === "all" ? undefined : visibility,
      page: 1,
    }));
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleCreate = async (data: CreateOrganizationDto) => {
    await createOrganization.mutateAsync(data);
  };

  const handleUpdate = async (id: string, data: UpdateOrganizationDto) => {
    await updateOrganization.mutateAsync({ id, data });
  };

  const handleDelete = async (organization: Organization) => {
    if (
      confirm(
        t("organizations.deleteConfirm", "admin", {
          name: organization.name,
        }),
      )
    ) {
      await deleteOrganization.mutateAsync(organization.id);
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
                {t("organizations.title", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("organizations.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("organizations.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection loading={false} data={true}>
        <OrganizationFilters
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onVisibilityChange={handleVisibilityChange}
          status={filters.status}
          visibility={filters.visibility}
        />
      </AnimatedSection>

      {/* Organization List */}
      <OrganizationList
        data={organizationsData}
        isLoading={isLoading}
        page={filters.page || 1}
        limit={filters.limit || 10}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isCreating={createOrganization.isPending}
        isUpdating={
          updateOrganization.isPending || deleteOrganization.isPending
        }
      />
    </div>
  );
}
