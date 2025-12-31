"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { TagDetail } from "@/components/features/admin/tags/tag-detail";
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
import { useTag, useTags } from "@/hooks/admin/useTags";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Tag, UpdateTagDto } from "@/lib/api/tags";

/**
 * Admin Tag Detail Page
 * Displays detailed tag information and allows editing/deleting
 */
export default function TagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const tagId = params.tag_id as string;

  const { data: tag, isLoading, error } = useTag(tagId);
  const { update, remove } = useTags();

  // Update page metadata
  usePageMetadata({
    title: tag
      ? t("detail.title", "tags", { name: tag.name })
      : t("detail.title", "tags"),
    description: t("detail.description", "tags"),
  });

  // Show 404 if tag not found
  if (!isLoading && !error && !tag) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateTagDto) => {
    try {
      await update.mutateAsync({ id, dto: data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (
      !confirm(t("list.deleteConfirm", "tags", { name: tag.name }))
    ) {
      return;
    }

    try {
      await remove.mutateAsync(tag.id);
      // Redirect to tags list after deletion
      router.push("/admin/tags");
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
              <BreadcrumbLink href="/admin/tags">
                {t("pageTitle", "tags")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {tag ? tag.name : t("detail.title", "tags")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={tag}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tag
              ? t("detail.title", "tags", { name: tag.name })
              : t("detail.title", "tags")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("detail.description", "tags")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("detail.error", "tags")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Tag Detail Component */}
      {tag && (
        <TagDetail
          tag={tag}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={update.isPending || remove.isPending}
        />
      )}
    </div>
  );
}

