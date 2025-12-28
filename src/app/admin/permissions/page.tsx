"use client";

import { useCallback, useState } from "react";

import { RoleFilters, RoleList } from "@/components/features/admin/permissions";
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
  useRoleMutations,
  useRoles,
} from "@/hooks/admin/usePermissions";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type {
  CreateRoleDto,
  UpdateRoleDto,
  Role,
} from "@/lib/interface/permission.interface";

export default function PermissionsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  usePageMetadata({
    title: t("title", "permissions"),
    description: t("description", "permissions"),
  });

  const { data: rolesData, isLoading } = useRoles();
  const { createRole, updateRole, deleteRole } = useRoleMutations();

  // Filter roles based on search query
  const filteredRoles = rolesData?.filter((role) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      role.name.toLowerCase().includes(query) ||
      role.description?.toLowerCase().includes(query)
    );
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreate = async (data: CreateRoleDto) => {
    await createRole.mutateAsync(data);
  };

  const handleUpdate = async (id: string, data: UpdateRoleDto) => {
    await updateRole.mutateAsync({ id, data });
  };

  const handleDelete = async (role: Role) => {
    if (confirm(t("deleteConfirm", "permissions", { name: role.name }))) {
      await deleteRole.mutateAsync(role.id);
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
                {t("breadcrumb.admin", "permissions")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("breadcrumb.permissions", "permissions")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("title", "permissions")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("description", "permissions")}
          </p>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection loading={false} data={true}>
        <RoleFilters onSearch={handleSearch} />
      </AnimatedSection>

      {/* Role List */}
      <RoleList
        data={filteredRoles}
        isLoading={isLoading}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isCreating={createRole.isPending}
        isUpdating={updateRole.isPending || deleteRole.isPending}
      />
    </div>
  );
}

