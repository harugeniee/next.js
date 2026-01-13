"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge as BadgeUI } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Separator } from "@/components/ui/layout/separator";
import type {
  Contribution,
  ReviewContributionDto,
} from "@/lib/types/contributions";
import {
  ContributionAction,
  ContributionStatus,
} from "@/lib/types/contributions";
import { ContributionReviewDialog } from "./contribution-review-dialog";
import { JsonDiffViewer } from "@/components/shared/json-diff-viewer";

interface ContributionDetailProps {
  contribution?: Contribution;
  isLoading: boolean;
  onApprove?: (id: string, data?: ReviewContributionDto) => Promise<void>;
  onReject?: (id: string, data: ReviewContributionDto) => Promise<void>;
  isReviewing?: boolean;
}

export function ContributionDetail({
  contribution,
  isLoading,
  onApprove,
  onReject,
  isReviewing = false,
}: ContributionDetailProps) {
  const { t } = useI18n();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP p");
    } catch {
      return "-";
    }
  };

  const handleCopyId = async (text?: string) => {
    const textToCopy = text || contribution?.id;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(t("actions.copied", "common", {}, "Copied to clipboard"));
    } catch {
      toast.error(t("actions.copyError", "common", {}, "Failed to copy"));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ContributionStatus.PENDING:
        return (
          <BadgeUI
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
          >
            <Clock className="mr-1 h-3 w-3" />
            {t("contributions.status.pending", "admin")}
          </BadgeUI>
        );
      case ContributionStatus.APPROVED:
        return (
          <BadgeUI
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {t("contributions.status.approved", "admin")}
          </BadgeUI>
        );
      case ContributionStatus.REJECTED:
        return (
          <BadgeUI
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            <XCircle className="mr-1 h-3 w-3" />
            {t("contributions.status.rejected", "admin")}
          </BadgeUI>
        );
      default:
        return <BadgeUI variant="outline">{status}</BadgeUI>;
    }
  };

  const canReview =
    contribution?.status === ContributionStatus.PENDING &&
    (onApprove || onReject);

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <AnimatedSection loading={isLoading} data={contribution}>
        <div className="flex items-center justify-between">
          <Link href="/admin/contributions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("actions.back", "common")}
            </Button>
          </Link>
          {canReview && (
            <div className="flex items-center gap-2">
              {onApprove && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowApproveDialog(true)}
                  disabled={isReviewing || !contribution}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t("contributions.review.approve", "admin")}
                </Button>
              )}
              {onReject && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isReviewing || !contribution}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {t("contributions.review.reject", "admin")}
                </Button>
              )}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Main Content */}
      {contribution ? (
        <Tabs defaultValue="detail" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detail">
              <FileText className="mr-2 h-4 w-4" />
              {t("contributions.detail.tabs.detail", "admin", {}, "Details")}
            </TabsTrigger>
            <TabsTrigger value="data">
              <FileText className="mr-2 h-4 w-4" />
              {t("contributions.detail.tabs.data", "admin", {}, "Data")}
            </TabsTrigger>
          </TabsList>

          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-6">
            <AnimatedSection loading={isLoading} data={contribution}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {t(
                          `contributions.entityType.${contribution.entityType}`,
                          "admin",
                        )}{" "}
                        -{" "}
                        {t(
                          `contributions.action.${contribution.action}`,
                          "admin",
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {getStatusBadge(contribution.status)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeletonize loading={isLoading}>
                    {contribution ? (
                      <div className="space-y-6">
                        {/* Contribution ID */}
                        {contribution.id && (
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">
                                {t(
                                  "contributions.detail.id",
                                  "admin",
                                  {},
                                  "Contribution ID",
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="font-mono text-xs break-all">
                                  {contribution.id}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={handleCopyId}
                                  aria-label={t("actions.copy", "common")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Basic Information */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("contributions.list.entityType", "admin")}
                            </label>
                            <div className="mt-1">
                              <BadgeUI variant="outline">
                                {t(
                                  `contributions.entityType.${contribution.entityType}`,
                                  "admin",
                                )}
                              </BadgeUI>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("contributions.list.action", "admin")}
                            </label>
                            <div className="mt-1">
                              <BadgeUI variant="secondary">
                                {t(
                                  `contributions.action.${contribution.action}`,
                                  "admin",
                                )}
                              </BadgeUI>
                            </div>
                          </div>
                          {contribution.entityId && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t(
                                  "contributions.detail.entityId",
                                  "admin",
                                  {},
                                  "Entity ID",
                                )}
                              </label>
                              <div className="mt-1 flex items-center gap-2">
                                <code className="font-mono text-sm flex-1">
                                  {contribution.entityId}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    handleCopyId(contribution.entityId)
                                  }
                                  aria-label={t("actions.copy", "common")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("contributions.list.status", "admin")}
                            </label>
                            <div className="mt-1">
                              {getStatusBadge(contribution.status)}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Contributor Information */}
                        <div>
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            {t("contributions.list.contributor", "admin")}
                          </label>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {contribution.contributor?.name ||
                                contribution.contributor?.username ||
                                "-"}
                            </div>
                            {contribution.contributor?.email && (
                              <div className="text-sm text-muted-foreground">
                                {contribution.contributor.email}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reviewer Information */}
                        {contribution.reviewer && (
                          <>
                            <Separator />
                            <div>
                              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                <User className="h-4 w-4" />
                                {t("contributions.list.reviewer", "admin")}
                              </label>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {contribution.reviewer.name ||
                                    contribution.reviewer.username ||
                                    "-"}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Notes */}
                        {contribution.contributorNote && (
                          <>
                            <Separator />
                            <div>
                              <label className="text-sm font-medium text-muted-foreground mb-2">
                                {t(
                                  "contributions.detail.contributorNote",
                                  "admin",
                                  {},
                                  "Contributor Note",
                                )}
                              </label>
                              <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                {contribution.contributorNote}
                              </div>
                            </div>
                          </>
                        )}

                        {contribution.adminNotes && (
                          <>
                            <Separator />
                            <div>
                              <label className="text-sm font-medium text-muted-foreground mb-2">
                                {t(
                                  "contributions.detail.adminNotes",
                                  "admin",
                                  {},
                                  "Admin Notes",
                                )}
                              </label>
                              <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                {contribution.adminNotes}
                              </div>
                            </div>
                          </>
                        )}

                        {contribution.rejectionReason && (
                          <>
                            <Separator />
                            <div>
                              <label className="text-sm font-medium text-muted-foreground mb-2">
                                {t(
                                  "contributions.detail.rejectionReason",
                                  "admin",
                                  {},
                                  "Rejection Reason",
                                )}
                              </label>
                              <div className="mt-1 p-3 bg-red-50 dark:bg-red-950 rounded-md text-sm">
                                {contribution.rejectionReason}
                              </div>
                            </div>
                          </>
                        )}

                        <Separator />

                        {/* Timestamps */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("contributions.list.createdAt", "admin")}
                            </label>
                            <div className="mt-1 text-sm">
                              {formatDate(contribution.createdAt)}
                            </div>
                          </div>
                          {contribution.reviewedAt && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("contributions.list.reviewedAt", "admin")}
                              </label>
                              <div className="mt-1 text-sm">
                                {formatDate(contribution.reviewedAt)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-20 rounded bg-muted/20" />
                        ))}
                      </div>
                    )}
                  </Skeletonize>
                </CardContent>
              </Card>
            </AnimatedSection>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="mt-6">
            <AnimatedSection loading={isLoading} data={contribution}>
              <div className="space-y-6">
                {/* Show diff if original data exists, otherwise show proposed data only */}
                {contribution.originalData ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t(
                          "contributions.detail.dataComparison",
                          "admin",
                          {},
                          "Data Comparison",
                        )}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "contributions.detail.dataComparisonDesc",
                          "admin",
                          {},
                          "Compare original and proposed changes",
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <JsonDiffViewer
                        oldJson={
                          contribution.originalData as Record<string, unknown>
                        }
                        newJson={
                          contribution.proposedData as Record<string, unknown>
                        }
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Proposed Data (for create actions) */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {t(
                            "contributions.detail.proposedData",
                            "admin",
                            {},
                            "Proposed Data",
                          )}
                        </CardTitle>
                        <CardDescription>
                          {t(
                            "contributions.detail.proposedDataDesc",
                            "admin",
                            {},
                            "Data that will be applied if approved",
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-[600px]">
                          {JSON.stringify(contribution.proposedData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </AnimatedSection>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              {t(
                "contributions.detail.notFound",
                "admin",
                {},
                "Contribution not found",
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialogs */}
      {contribution && (
        <>
          <ContributionReviewDialog
            open={showApproveDialog}
            onOpenChange={setShowApproveDialog}
            mode="approve"
            contributionId={contribution.id}
            onSubmit={async (data) => {
              if (onApprove) {
                await onApprove(contribution.id, data);
                setShowApproveDialog(false);
              }
            }}
            isLoading={isReviewing}
          />
          <ContributionReviewDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            mode="reject"
            contributionId={contribution.id}
            onSubmit={async (data) => {
              if (onReject) {
                await onReject(contribution.id, data);
                setShowRejectDialog(false);
              }
            }}
            isLoading={isReviewing}
          />
        </>
      )}
    </div>
  );
}
