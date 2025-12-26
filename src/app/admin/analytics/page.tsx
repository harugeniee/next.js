"use client";

import { useState, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  AnalyticsFilters,
  EventTypesChart,
  OverviewCards,
  TimeSeriesChart,
  TopContentTable,
  TopUsersTable,
} from "@/components/features/admin/analytics";
import { useDashboardOverview } from "@/hooks/admin/useAnalytics";
import type { DashboardQueryParams } from "@/lib/api/analytics";

/**
 * Analytics Dashboard Page
 * Displays comprehensive analytics data with filtering capabilities
 */
export default function AnalyticsDashboardPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<DashboardQueryParams>({
    granularity: "day",
  });

  const { data, isLoading, error } = useDashboardOverview(filters);

  const handleFiltersChange = (newFilters: DashboardQueryParams) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">
                {t("dashboard.breadcrumb.admin", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("dashboard.breadcrumb.analytics", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("dashboard.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Filters Section */}
      <AnimatedSection loading={false} data={true}>
        <AnalyticsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("dashboard.error", "admin")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Overview Cards */}
      <OverviewCards data={data} isLoading={isLoading} />

      {/* Time Series Chart */}
      <TimeSeriesChart
        data={data}
        isLoading={isLoading}
        granularity={filters.granularity || "day"}
      />

      {/* Two-Column Layout: Top Content and Top Users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopContentTable data={data} isLoading={isLoading} />
        <TopUsersTable data={data} isLoading={isLoading} />
      </div>

      {/* Event Types Distribution */}
      <EventTypesChart data={data} isLoading={isLoading} />
    </div>
  );
}

