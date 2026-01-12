"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { KeyValueDetail } from "@/components/features/admin/key-value";
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
import { useKeyValue, useKeyValueMutations } from "@/hooks/admin/useKeyValue";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type {
  KeyValue,
  UpdateKeyValueDto,
} from "@/lib/interface/key-value.interface";

/**
 * Key-Value Detail Page
 * Displays detailed key-value information and allows editing/deleting
 */
export default function KeyValueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const id = params.id as string;

  const { data: keyValue, isLoading, error } = useKeyValue(id);
  const { updateKeyValue, deleteKeyValue } = useKeyValueMutations();

  // Update page metadata
  usePageMetadata({
    title: keyValue
      ? t("keyValue.detail.title", "admin", { key: keyValue.key })
      : t("keyValue.detail.title", "admin"),
    description: t("keyValue.detail.description", "admin"),
  });

  // Show 404 if not found
  if (!isLoading && !error && !keyValue) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateKeyValueDto) => {
    try {
      await updateKeyValue.mutateAsync({ id, dto: data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (kv: KeyValue) => {
    if (
      confirm(
        t("keyValue.list.deleteConfirm", "admin", {
          key: kv.key,
        }),
      )
    ) {
      try {
        await deleteKeyValue.mutateAsync(kv.id);
        // Redirect to list after deletion
        router.push("/admin/key-value");
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
              <BreadcrumbLink href="/admin/key-value">
                {t("keyValue.title", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {keyValue ? keyValue.key : t("keyValue.detail.title", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={keyValue}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {keyValue
              ? t("keyValue.detail.title", "admin", {
                  key: keyValue.key,
                })
              : t("keyValue.detail.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("keyValue.detail.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("keyValue.detail.error", "admin")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Key-Value Detail Component */}
      {keyValue && (
        <KeyValueDetail
          keyValue={keyValue}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={updateKeyValue.isPending || deleteKeyValue.isPending}
        />
      )}
    </div>
  );
}
