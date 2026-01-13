"use client";

import { notFound, useParams } from "next/navigation";

import { ContributionDetail } from "@/components/features/admin/contributions";
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
  useContribution,
  useApproveContribution,
  useRejectContribution,
} from "@/hooks/admin/useContributions";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { ReviewContributionDto } from "@/lib/types/contributions";

/**
 * Admin Contribution Detail Page
 * Displays detailed contribution information and allows reviewing (approve/reject)
 */
export default function ContributionDetailPage() {
  const params = useParams();
  const { t } = useI18n();
  const contributionId = params.id as string;

  const {
    data: contribution,
    isLoading,
    error,
  } = useContribution(contributionId);
  const approveContributionMutation = useApproveContribution();
  const rejectContributionMutation = useRejectContribution();

  // Get contribution title for display
  const contributionTitle = contribution
    ? `${t(`contributions.entityType.${contribution.entityType}`, "admin", {}, contribution.entityType)} - ${t(`contributions.action.${contribution.action}`, "admin", {}, contribution.action)}`
    : t("contributions.detail.title", "admin", {}, "Contribution Detail");

  // Update page metadata
  usePageMetadata({
    title: contributionTitle,
    description: t(
      "contributions.detail.description",
      "admin",
      {},
      "View and review contribution details",
    ),
  });

  // Show 404 if contribution not found
  if (!isLoading && !error && !contribution) {
    notFound();
  }

  const handleApprove = async (id: string, data?: ReviewContributionDto) => {
    try {
      await approveContributionMutation.mutateAsync({ id, data });
    } catch {
      // Error handled by mutation
    }
  };

  const handleReject = async (id: string, data: ReviewContributionDto) => {
    try {
      await rejectContributionMutation.mutateAsync({ id, data });
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
                {t("contributions.breadcrumb.admin", "admin", {}, "Admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/contributions">
                {t(
                  "contributions.breadcrumb.contributions",
                  "admin",
                  {},
                  "Contributions",
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {contribution
                  ? contributionTitle
                  : t(
                      "contributions.detail.title",
                      "admin",
                      {},
                      "Contribution Detail",
                    )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={contribution}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {contributionTitle}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t(
              "contributions.detail.description",
              "admin",
              {},
              "View and review contribution details",
            )}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t(
                "contributions.detail.error",
                "admin",
                {},
                "Error loading contribution",
              )}
              : {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Contribution Detail Component */}
      {contribution && (
        <ContributionDetail
          contribution={contribution}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          isReviewing={
            approveContributionMutation.isPending ||
            rejectContributionMutation.isPending
          }
        />
      )}
    </div>
  );
}
