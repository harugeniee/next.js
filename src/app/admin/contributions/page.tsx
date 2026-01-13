"use client";

import { useState } from "react";
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
  ContributionsFilters,
  ContributionsList,
  ContributionReviewDialog,
} from "@/components/features/admin/contributions";
import {
  useContributions,
  useApproveContribution,
  useRejectContribution,
} from "@/hooks/admin/useContributions";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type {
  Contribution,
  QueryContributionDto,
  ReviewContributionDto,
} from "@/lib/types/contributions";

/**
 * Contributions Management Page
 * Displays contributions management interface with filters, list, and review actions
 */
export default function ContributionsPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<QueryContributionDto>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    order: "DESC",
  });

  // Update page metadata
  usePageMetadata({
    title: t("contributions.pageTitle", "admin"),
    description: t("contributions.pageDescription", "admin"),
  });

  // Dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState<"approve" | "reject">("approve");
  const [selectedContribution, setSelectedContribution] = useState<
    Contribution | undefined
  >();

  const { data: contributionsData, isLoading: contributionsLoading } =
    useContributions(filters);

  const approveContributionMutation = useApproveContribution();
  const rejectContributionMutation = useRejectContribution();

  const handleFiltersChange = (newFilters: QueryContributionDto) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleApprove = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setReviewMode("approve");
    setReviewDialogOpen(true);
  };

  const handleReject = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setReviewMode("reject");
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = async (data: ReviewContributionDto) => {
    if (!selectedContribution) return;

    try {
      if (reviewMode === "approve") {
        await approveContributionMutation.mutateAsync({
          id: selectedContribution.id,
          data,
        });
      } else {
        await rejectContributionMutation.mutateAsync({
          id: selectedContribution.id,
          data,
        });
      }
      setReviewDialogOpen(false);
      setSelectedContribution(undefined);
    } catch (error) {
      // Error handled by mutation
      throw error;
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
                {t("contributions.breadcrumb.admin", "admin", {}, "Admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t(
                  "contributions.breadcrumb.contributions",
                  "admin",
                  {},
                  "Contributions",
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("contributions.pageTitle", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("contributions.pageDescription", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Contributions Filters */}
      <AnimatedSection loading={false} data={true}>
        <ContributionsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </AnimatedSection>

      {/* Contributions List */}
      <ContributionsList
        data={contributionsData}
        isLoading={contributionsLoading}
        page={filters.page}
        onPageChange={handlePageChange}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Review Dialog */}
      <ContributionReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        mode={reviewMode}
        contributionId={selectedContribution?.id}
        onSubmit={handleReviewSubmit}
        isLoading={
          approveContributionMutation.isPending ||
          rejectContributionMutation.isPending
        }
      />
    </div>
  );
}
