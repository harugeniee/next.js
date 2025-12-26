"use client";

import { ExternalLink, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { BadgeDisplay } from "./badge-display";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { BadgeAssignment, BadgeAssignmentListResponse } from "@/lib/types/badges";

interface BadgeAssignmentsTableProps {
  readonly data?: BadgeAssignmentListResponse;
  readonly isLoading: boolean;
  readonly onRevoke?: (assignment: BadgeAssignment) => void;
}

/**
 * Badge Assignments Table Component
 * Displays badge assignments in a table view
 */
export function BadgeAssignmentsTable({
  data,
  isLoading,
  onRevoke,
}: BadgeAssignmentsTableProps) {
  const { t } = useI18n();

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("badges.assignments.title", "admin")}</CardTitle>
          <CardDescription>
            {t("badges.assignments.description", "admin")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data && data.result.length > 0 ? (
              <div className="space-y-2">
                {data.result.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {assignment.badge && (
                        <BadgeDisplay badge={assignment.badge} size="md" showName={false} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {assignment.badge && (
                            <span className="text-sm font-medium truncate">
                              {assignment.badge.name}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
                            {assignment.entityType}:{assignment.entityId.slice(0, 8)}...
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {t(`badges.assignments.status.${assignment.status}`, "admin")}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {t("badges.assignments.assignedAt", "admin")}: {formatDate(assignment.assignedAt)}
                          </span>
                          {assignment.expiresAt && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {t("badges.assignments.expiresAt", "admin")}: {formatDate(assignment.expiresAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${assignment.entityType}/${assignment.entityId}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      {onRevoke && assignment.status === "active" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onRevoke(assignment)}
                              className="text-destructive focus:text-destructive"
                            >
                              <X className="h-4 w-4 mr-2" />
                              {t("badges.assignments.revoke", "admin")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Placeholder for skeleton
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

