"use client";

import { KeyValueCreateForm } from "@/components/features/admin/key-value";
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
import { useKeyValueMutations } from "@/hooks/admin/useKeyValue";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { CreateKeyValueDto } from "@/lib/interface/key-value.interface";

/**
 * Key-Value Create Page
 * Page for creating a new key-value pair
 */
export default function KeyValueCreatePage() {
  const { t } = useI18n();

  // Page metadata
  usePageMetadata({
    title: t("keyValue.form.createTitle", "admin"),
    description: t("keyValue.form.createDescription", "admin"),
  });

  // Mutations
  const { createKeyValue } = useKeyValueMutations();

  // Handle form submission
  const handleCreate = async (data: CreateKeyValueDto) => {
    await createKeyValue.mutateAsync(data);
    // Navigation will be handled by the form component after success
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
                {t("keyValue.form.createTitle", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("keyValue.form.createTitle", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("keyValue.form.createDescription", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Create Form */}
      <AnimatedSection loading={false} data={true}>
        <KeyValueCreateForm
          onSubmit={handleCreate}
          isLoading={createKeyValue.isPending}
        />
      </AnimatedSection>
    </div>
  );
}
