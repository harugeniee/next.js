"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { UserDetail } from "@/components/features/admin/users";
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
import { useUser, useUserMutations } from "@/hooks/admin/useUsers";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { UpdateUserDto, User } from "@/lib/interface/user.interface";

/**
 * Admin User Detail Page
 * Displays detailed user information and allows editing/deleting
 */
export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const userId = params.user_id as string;

  const { data: user, isLoading, error } = useUser(userId);
  const { updateUser, deleteUser } = useUserMutations();

  // Update page metadata
  usePageMetadata({
    title: user
      ? t("users.detail.title", "admin", { name: user.name || user.username })
      : t("users.detail.title", "admin"),
    description: t("users.detail.description", "admin"),
  });

  // Show 404 if user not found
  if (!isLoading && !error && !user) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateUserDto) => {
    try {
      await updateUser.mutateAsync({ id, data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (user: User) => {
    if (
      confirm(
        t("users.deleteConfirm", "admin", {
          name: user.name || user.username,
        }),
      )
    ) {
      try {
        await deleteUser.mutateAsync(user.id);
        // Redirect to users list after deletion
        router.push("/admin/users");
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
                {t("admin", "common")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/users">
                {t("users.title", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {user
                  ? user.name || user.username
                  : t("users.detail.title", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={user}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user
              ? t("users.detail.title", "admin", {
                  name: user.name || user.username,
                })
              : t("users.detail.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("users.detail.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("users.detail.error", "admin")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* User Detail Component */}
      {user && (
        <UserDetail
          user={user}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={updateUser.isPending || deleteUser.isPending}
        />
      )}
    </div>
  );
}
