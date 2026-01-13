"use client";

import { CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge as BadgeUI } from "@/components/ui/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import { Pagination } from "@/components/ui/pagination";
import type { Contribution } from "@/lib/types/contributions";
import {
  ContributionAction,
  ContributionEntityType,
  ContributionStatus,
} from "@/lib/types/contributions";

interface ContributionsListProps {
  data?: {
    result: Contribution[];
    metaData: {
      currentPage?: number;
      totalPages?: number;
      totalRecords?: number;
    };
  };
  isLoading: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
  onView?: (contribution: Contribution) => void;
  onApprove?: (contribution: Contribution) => void;
  onReject?: (contribution: Contribution) => void;
}

export function ContributionsList({
  data,
  isLoading,
  page = 1,
  onPageChange,
  onView,
  onApprove,
  onReject,
}: ContributionsListProps) {
  const { t } = useI18n();
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const contributions = data?.result ?? [];
  const metaData = data?.metaData;

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

  const getEntityTypeLabel = (entityType: string) => {
    return t(`contributions.entityType.${entityType}`, "admin", {}, entityType);
  };

  const getActionLabel = (action: string) => {
    return t(`contributions.action.${action}`, "admin", {}, action);
  };

  return (
    <AnimatedSection
      loading={isLoading}
      data={contributions}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{t("contributions.list.title", "admin")}</CardTitle>
            <CardDescription>
              {t("contributions.list.description", "admin")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {contributions && contributions.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("contributions.list.entityType", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("contributions.list.action", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("contributions.list.status", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("contributions.list.contributor", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("contributions.list.createdAt", "admin")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("contributions.list.actions", "admin")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.map((contribution) => (
                      <TableRow
                        key={contribution.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          if (onView) {
                            onView(contribution);
                          } else {
                            router.push(
                              `/admin/contributions/${contribution.id}`,
                            );
                          }
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {getEntityTypeLabel(contribution.entityType)}
                            </span>
                            {contribution.entityId && (
                              <span className="text-xs text-muted-foreground">
                                ({contribution.entityId})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <BadgeUI variant="secondary">
                            {getActionLabel(contribution.action)}
                          </BadgeUI>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contribution.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {contribution.contributor?.name ||
                                contribution.contributor?.username ||
                                "-"}
                            </span>
                            {contribution.contributor?.email && (
                              <span className="text-xs text-muted-foreground">
                                {contribution.contributor.email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(
                              contribution.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center justify-end gap-2">
                            {onView && (
                              <button
                                onClick={() => onView(contribution)}
                                className="p-1 hover:bg-muted rounded"
                                title={t("actions.view", "common")}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            {contribution.status ===
                              ContributionStatus.PENDING && (
                              <>
                                {onApprove && (
                                  <button
                                    onClick={() => onApprove(contribution)}
                                    className="p-1 hover:bg-green-50 dark:hover:bg-green-950 rounded text-green-600 dark:text-green-400"
                                    title={t(
                                      "contributions.review.approve",
                                      "admin",
                                    )}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                )}
                                {onReject && (
                                  <button
                                    onClick={() => onReject(contribution)}
                                    className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded text-red-600 dark:text-red-400"
                                    title={t(
                                      "contributions.review.reject",
                                      "admin",
                                    )}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Placeholder for skeleton - must match table structure
              <div className="space-y-4">
                <div className="h-10 w-full bg-muted/10 rounded-md" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="h-10 w-10 rounded-full bg-muted/20" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[200px] bg-muted/20 rounded" />
                      <div className="h-3 w-[150px] bg-muted/20 rounded" />
                    </div>
                    <div className="h-8 w-16 bg-muted/20 rounded" />
                    <div className="h-8 w-16 bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination */}
          {contributions &&
            contributions.length > 0 &&
            onPageChange &&
            metaData?.totalPages &&
            metaData.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={metaData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
