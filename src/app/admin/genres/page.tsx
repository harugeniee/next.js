"use client";

import { GenresPage } from "@/components/features/genres/genres-page";
import { BreadcrumbNav } from "@/components/features/navigation/breadcrumb-nav";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import { useBreadcrumb } from "@/hooks/ui/useBreadcrumb";
import { usePathname } from "next/navigation";

/**
 * Genres Admin Page
 * Displays genres management interface
 */
export default function GenresAdminPage() {
  const { t } = useI18n();
  const pathname = usePathname();

  usePageMetadata({
    title: t("genres.title", "admin"),
    description: t("genres.description", "admin"),
    url: `https://example.com${pathname}`, // Replace with actual domain
  });

  const breadcrumbItems = useBreadcrumb();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <AnimatedSection loading={false} data={true}>
        <BreadcrumbNav items={breadcrumbItems} />
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("genres.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("genres.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Genres Management Component */}
      <GenresPage />
    </div>
  );
}
