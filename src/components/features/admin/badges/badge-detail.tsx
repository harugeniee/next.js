"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  Award,
  Calendar,
  Copy,
  Edit,
  Info,
  Shield,
  Trash2,
  Users,
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
import { Skeleton } from "@/components/ui/core/skeleton";
import type {
  Badge,
  BadgeAssignment,
  UpdateBadgeDto,
} from "@/lib/types/badges";
import type {
  CreateBadgeFormData,
  UpdateBadgeFormData,
} from "@/lib/validators/badges";
import { BadgeAssignmentsTable } from "./badge-assignments-table";
import { BadgeDisplay } from "./badge-display";
import { BadgeFormDialog } from "./badge-form-dialog";

interface BadgeDetailProps {
  readonly badge?: Badge;
  readonly isLoading: boolean;
  readonly assignments?: BadgeAssignment[];
  readonly assignmentsLoading?: boolean;
  readonly onUpdate: (id: string, data: UpdateBadgeDto) => Promise<void>;
  readonly onDelete: (badge: Badge) => void;
  readonly onAssign?: (badge: Badge) => void;
  readonly onRevokeAssignment?: (assignment: BadgeAssignment) => void;
  readonly isUpdating?: boolean;
}

/**
 * Badge Detail Component
 * Displays detailed badge information with edit and delete functionality
 */
export function BadgeDetail({
  badge,
  isLoading,
  assignments,
  assignmentsLoading = false,
  onUpdate,
  onDelete,
  onAssign,
  onRevokeAssignment,
  isUpdating,
}: BadgeDetailProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch {
      return "-";
    }
  };

  const handleSubmit = async (
    data: CreateBadgeFormData | UpdateBadgeFormData,
  ) => {
    if (badge) {
      // Convert form data to DTO format
      const updateData: UpdateBadgeDto = {
        ...data,
        description: data.description || undefined,
        iconUrl: data.iconUrl || undefined,
        color: data.color || undefined,
        requirements: data.requirements || undefined,
        expiresAt: data.expiresAt || undefined,
      };
      await onUpdate(badge.id, updateData);
      // Dialog will close automatically via BadgeFormDialog's handleSubmit
    }
  };

  const handleCopyId = async () => {
    if (!badge?.id) return;
    try {
      await navigator.clipboard.writeText(badge.id);
      toast.success(
        t("badges.detail.idCopied", "admin", {}, "ID copied to clipboard"),
      );
    } catch {
      toast.error(
        t("badges.detail.idCopyError", "admin", {}, "Failed to copy ID"),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <AnimatedSection loading={isLoading} data={badge}>
        <div className="flex items-center justify-between">
          <Link href="/admin/badges">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("actions.back", "common")}
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {onAssign && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => badge && onAssign(badge)}
                disabled={isUpdating || !badge}
              >
                <Award className="mr-2 h-4 w-4" />
                {t("badges.list.assign", "admin")}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              disabled={isUpdating || !badge}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("actions.edit", "common")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => badge && onDelete(badge)}
              disabled={isUpdating || !badge}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("actions.delete", "common")}
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      {badge ? (
        <Tabs defaultValue="detail" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detail">
              <Info className="mr-2 h-4 w-4" />
              {t("badges.detail.tabs.detail", "admin", {}, "Badge Information")}
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <Users className="mr-2 h-4 w-4" />
              {t("badges.detail.tabs.assignments", "admin", {}, "Assignments")}
            </TabsTrigger>
          </TabsList>

          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-6">
            <AnimatedSection loading={isLoading} data={badge}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <BadgeDisplay badge={badge} size="lg" />
                    <div className="flex-1">
                      <CardTitle>{badge.name}</CardTitle>
                      <CardDescription>
                        {badge.description ||
                          t(
                            "badges.detail.noDescription",
                            "admin",
                            {},
                            "No description",
                          )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeletonize loading={isLoading}>
                    {badge ? (
                      <div className="space-y-6">
                        {/* Badge ID */}
                        {badge.id && (
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">
                                {t(
                                  "badges.detail.badgeId",
                                  "admin",
                                  {},
                                  "Badge ID",
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="font-mono text-xs break-all">
                                  {badge.id}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={handleCopyId}
                                  aria-label={t(
                                    "badges.detail.copyId",
                                    "admin",
                                    {},
                                    "Copy ID",
                                  )}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Basic Information */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("badges.form.type", "admin")}
                            </label>
                            <div className="mt-1">
                              <BadgeUI variant="outline">{badge.type}</BadgeUI>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("badges.form.category", "admin")}
                            </label>
                            <div className="mt-1">
                              <BadgeUI variant="outline">
                                {t(
                                  `badges.categories.${badge.category}`,
                                  "admin",
                                  {},
                                  badge.category,
                                )}
                              </BadgeUI>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("badges.form.rarity", "admin")}
                            </label>
                            <div className="mt-1">
                              <BadgeUI variant="outline">
                                {t(
                                  `badges.rarities.${badge.rarity}`,
                                  "admin",
                                  {},
                                  badge.rarity,
                                )}
                              </BadgeUI>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("badges.form.status", "admin")}
                            </label>
                            <div className="mt-1">
                              <BadgeUI
                                variant={
                                  badge.status === "active"
                                    ? "default"
                                    : badge.status === "inactive"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {t(
                                  `badges.statuses.${badge.status}`,
                                  "admin",
                                  {},
                                  badge.status,
                                )}
                              </BadgeUI>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t(
                                "badges.detail.assignmentCount",
                                "admin",
                                {},
                                "Assignments",
                              )}
                            </label>
                            <p className="mt-1 text-lg font-semibold">
                              {badge.assignmentCount || 0}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("badges.form.displayOrder", "admin")}
                            </label>
                            <p className="mt-1 text-lg font-semibold">
                              {badge.displayOrder}
                            </p>
                          </div>
                        </div>

                        {/* Display Settings */}
                        <div className="border-t pt-4">
                          <h3 className="mb-4 text-sm font-medium">
                            {t(
                              "badges.form.displaySettings",
                              "admin",
                              {},
                              "Display Settings",
                            )}
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            {badge.iconUrl && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  {t("badges.form.iconUrl", "admin")}
                                </label>
                                <div className="mt-1">
                                  <a
                                    href={badge.iconUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                  >
                                    {badge.iconUrl}
                                  </a>
                                </div>
                              </div>
                            )}
                            {badge.color && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  {t("badges.form.color", "admin")}
                                </label>
                                <div className="mt-1 flex items-center gap-2">
                                  <div
                                    className="h-6 w-6 rounded border"
                                    style={{ backgroundColor: badge.color }}
                                  />
                                  <code className="text-xs">{badge.color}</code>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Behavior Settings */}
                        <div className="border-t pt-4">
                          <h3 className="mb-4 text-sm font-medium">
                            {t(
                              "badges.form.behaviorSettings",
                              "admin",
                              {},
                              "Behavior Settings",
                            )}
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("badges.form.isVisible", "admin")}
                              </label>
                              <div className="mt-1">
                                <BadgeUI
                                  variant={
                                    badge.isVisible ? "default" : "outline"
                                  }
                                >
                                  {badge.isVisible
                                    ? t("badges.filters.visible", "admin")
                                    : t("badges.filters.hidden", "admin")}
                                </BadgeUI>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("badges.form.isObtainable", "admin")}
                              </label>
                              <div className="mt-1">
                                <BadgeUI
                                  variant={
                                    badge.isObtainable ? "default" : "outline"
                                  }
                                >
                                  {badge.isObtainable
                                    ? t("badges.filters.obtainable", "admin")
                                    : t("badges.filters.unobtainable", "admin")}
                                </BadgeUI>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("badges.form.isAutoAssigned", "admin")}
                              </label>
                              <div className="mt-1">
                                <BadgeUI
                                  variant={
                                    badge.isAutoAssigned ? "default" : "outline"
                                  }
                                >
                                  {badge.isAutoAssigned ? "Yes" : "No"}
                                </BadgeUI>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("badges.form.isManuallyAssignable", "admin")}
                              </label>
                              <div className="mt-1">
                                <BadgeUI
                                  variant={
                                    badge.isManuallyAssignable
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {badge.isManuallyAssignable ? "Yes" : "No"}
                                </BadgeUI>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("badges.form.isRevokable", "admin")}
                              </label>
                              <div className="mt-1">
                                <BadgeUI
                                  variant={
                                    badge.isRevokable ? "default" : "outline"
                                  }
                                >
                                  {badge.isRevokable ? "Yes" : "No"}
                                </BadgeUI>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Requirements */}
                        {badge.requirements && (
                          <div className="border-t pt-4">
                            <h3 className="mb-4 text-sm font-medium">
                              {t(
                                "badges.detail.requirements",
                                "admin",
                                {},
                                "Requirements",
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {badge.requirements}
                            </p>
                          </div>
                        )}

                        {/* Metadata */}
                        {badge.metadata &&
                          Object.keys(badge.metadata).length > 0 && (
                            <div className="border-t pt-4">
                              <h3 className="mb-4 text-sm font-medium">
                                {t(
                                  "badges.detail.metadata",
                                  "admin",
                                  {},
                                  "Metadata",
                                )}
                              </h3>
                              <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                                {JSON.stringify(badge.metadata, null, 2)}
                              </pre>
                            </div>
                          )}

                        {/* Timestamps */}
                        <div className="border-t pt-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  {t(
                                    "badges.detail.createdAt",
                                    "admin",
                                    {},
                                    "Created At",
                                  )}
                                </label>
                                <p className="mt-1 text-sm">
                                  {formatDate(badge.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  {t(
                                    "badges.detail.updatedAt",
                                    "admin",
                                    {},
                                    "Updated At",
                                  )}
                                </label>
                                <p className="mt-1 text-sm">
                                  {formatDate(badge.updatedAt)}
                                </p>
                              </div>
                            </div>
                            {badge.expiresAt && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                      "badges.detail.expiresAt",
                                      "admin",
                                      {},
                                      "Expires At",
                                    )}
                                  </label>
                                  <p className="mt-1 text-sm">
                                    {formatDate(badge.expiresAt)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    )}
                  </Skeletonize>
                </CardContent>
              </Card>
            </AnimatedSection>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="mt-6">
            {assignments && assignments.length > 0 ? (
              <BadgeAssignmentsTable
                data={{
                  result: assignments,
                  metaData: {
                    total: assignments.length,
                    page: 1,
                    limit: assignments.length,
                    totalPages: 1,
                  },
                }}
                isLoading={assignmentsLoading}
                onRevoke={onRevokeAssignment}
              />
            ) : (
              <AnimatedSection
                loading={assignmentsLoading}
                data={!assignmentsLoading}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t(
                        "badges.assignments.title",
                        "admin",
                        {},
                        "Badge Assignments",
                      )}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "badges.detail.noAssignments",
                        "admin",
                        {},
                        "No assignments found for this badge",
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      {t(
                        "badges.detail.noAssignmentsMessage",
                        "admin",
                        {},
                        "This badge has not been assigned to any entity yet",
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <AnimatedSection loading={isLoading} data={badge}>
          <Card>
            <CardHeader>
              <CardTitle>
                {t(
                  "badges.detail.information",
                  "admin",
                  {},
                  "Badge Information",
                )}
              </CardTitle>
              <CardDescription>
                {t(
                  "badges.detail.informationDescription",
                  "admin",
                  {},
                  "Detailed badge information",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Edit Dialog */}
      <BadgeFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        badge={badge}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
