"use client";

import { useCallback, useState } from "react";

import { UserFilters, UserList } from "@/components/features/admin/users";
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
import { useUserMutations, useUsers } from "@/hooks/admin/useUsers";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { User } from "@/lib/interface/user.interface";
import type { AdvancedQueryParams } from "@/lib/types";

export default function UsersPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<AdvancedQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "DESC",
  });

  usePageMetadata({
    title: t("users.title", "admin"),
    description: t("users.description", "admin"),
  });

  const { data: usersData, isLoading } = useUsers(filters);
  const { createUser, updateUser, deleteUser } = useUserMutations();

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query, page: 1 }));
  }, []);

  const handleRoleChange = useCallback((role: string) => {
    setFilters((prev) => ({
      ...prev,
      role: role === "all" ? undefined : role,
      page: 1,
    }));
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : status,
      page: 1,
    }));
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleCreate = async (data: any) => {
    await createUser.mutateAsync(data);
  };

  const handleUpdate = async (id: string, data: any) => {
    await updateUser.mutateAsync({ id, data });
  };

  const handleDelete = async (user: User) => {
    if (confirm(t("users.deleteConfirm", "admin", { name: user.name || user.username }))) {
      await deleteUser.mutateAsync(user.id);
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
              <BreadcrumbPage>{t("users.title", "admin")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("users.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("users.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection loading={false} data={true}>
        <UserFilters
          onSearch={handleSearch}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
          role={filters.role}
          status={filters.status}
        />
      </AnimatedSection>

      {/* User List */}
      <UserList
        data={usersData}
        isLoading={isLoading}
        page={filters.page || 1}
        limit={filters.limit || 10}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isCreating={createUser.isPending}
        isUpdating={updateUser.isPending || deleteUser.isPending}
      />
    </div>
  );
}

