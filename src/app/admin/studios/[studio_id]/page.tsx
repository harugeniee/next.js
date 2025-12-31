"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { StudioDetail } from "@/components/features/admin/studios/studio-detail";
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
import { useStudio, useStudios } from "@/hooks/admin/useStudios";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Studio, UpdateStudioDto } from "@/lib/interface/studio.interface";

/**
 * Admin Studio Detail Page
 * Displays detailed studio information and allows editing/deleting
 */
export default function StudioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const studioId = params.studio_id as string;

  const { data: studio, isLoading, error } = useStudio(studioId);
  const { update, remove } = useStudios();

  // Update page metadata
  usePageMetadata({
    title: studio
      ? t("studios.detail.title", "admin", { name: studio.name })
      : t("studios.detail.title", "admin"),
    description: t("studios.detail.description", "admin"),
  });

  // Show 404 if studio not found
  if (!isLoading && !error && !studio) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateStudioDto) => {
    try {
      await update.mutateAsync({ id, dto: data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (studio: Studio) => {
    if (
      !confirm(
        t("studios.list.deleteConfirm", "admin", { name: studio.name }),
      )
    ) {
      return;
    }

    try {
      await remove.mutateAsync(studio.id);
      // Redirect to studios list after deletion
      router.push("/admin/studios");
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
                {t("admin", "common")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/studios">
                {t("studios.pageTitle", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {studio ? studio.name : t("studios.detail.title", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={studio}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {studio
              ? t("studios.detail.title", "admin", { name: studio.name })
              : t("studios.detail.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("studios.detail.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("studios.detail.error", "admin")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Studio Detail Component */}
      {studio && (
        <StudioDetail
          studio={studio}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={update.isPending || remove.isPending}
        />
      )}
    </div>
  );
}

