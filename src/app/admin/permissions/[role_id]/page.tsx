"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { RoleDetail } from "@/components/features/admin/permissions";
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
  useRole,
  useRoleMutations,
} from "@/hooks/admin/usePermissions";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type {
  UpdateRoleDto,
  Role,
} from "@/lib/interface/permission.interface";

/**
 * Admin Role Detail Page
 * Displays detailed role information and allows editing/deleting
 */
export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const roleId = params.role_id as string;

  const { data: role, isLoading, error } = useRole(roleId);
  const { updateRole, deleteRole } = useRoleMutations();

  // Update page metadata
  usePageMetadata({
    title: role
      ? t("detail.title", "permissions", { name: role.name })
      : t("detail.title", "permissions"),
    description: t("detail.description", "permissions"),
  });

  // Show 404 if role not found
  if (!isLoading && !error && !role) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateRoleDto) => {
    try {
      await updateRole.mutateAsync({ id, data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (role: Role) => {
    if (
      confirm(
        t("deleteConfirm", "permissions", {
          name: role.name,
        }),
      )
    ) {
      try {
        await deleteRole.mutateAsync(role.id);
        // Redirect to permissions list after deletion
        router.push("/admin/permissions");
      } catch {
        // Error handled by mutation
      }
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
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/permissions">
                {t("breadcrumb.permissions", "permissions")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {role
                  ? role.name
                  : t("detail.title", "permissions")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={role}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {role
              ? t("detail.title", "permissions", {
                  name: role.name,
                })
              : t("detail.title", "permissions")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("detail.description", "permissions")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("detail.error", "permissions")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Role Detail Component */}
      {role && (
        <RoleDetail
          role={role}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={updateRole.isPending || deleteRole.isPending}
        />
      )}
    </div>
  );
}

