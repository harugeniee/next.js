"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  BadgeAssignmentDialog,
  BadgeDetail,
} from "@/components/features/admin/badges";
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
  useAssignBadge,
  useBadge,
  useBadgeAssignments,
  useDeleteBadge,
  useRevokeBadge,
  useUpdateBadge,
} from "@/hooks/admin/useBadges";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type {
  Badge,
  BadgeAssignment,
  UpdateBadgeDto,
} from "@/lib/types/badges";
import type { AssignBadgeFormData } from "@/lib/validators/badges";

/**
 * Admin Badge Detail Page
 * Displays detailed badge information and allows editing/deleting
 */
export default function BadgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const badgeId = params.badge_id as string;

  // Dialog state
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  const { data: badge, isLoading, error } = useBadge(badgeId);
  const updateBadgeMutation = useUpdateBadge();
  const deleteBadgeMutation = useDeleteBadge();
  const assignBadgeMutation = useAssignBadge();
  const revokeBadgeMutation = useRevokeBadge();

  // Fetch assignments for this badge
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useBadgeAssignments({
      badgeId,
      page: 1,
      limit: 50,
    });

  // Update page metadata
  usePageMetadata({
    title: badge
      ? t("badges.detail.title", "admin", { name: badge.name }, badge.name)
      : t("badges.detail.title", "admin", {}, "Badge Detail"),
    description: t(
      "badges.detail.description",
      "admin",
      {},
      "Detailed badge information and management",
    ),
  });

  // Show 404 if badge not found
  if (!isLoading && !error && !badge) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateBadgeDto) => {
    try {
      await updateBadgeMutation.mutateAsync({ id, data });
    } catch {
      // Error handled by mutation
      throw new Error("Failed to update badge");
    }
  };

  const handleDelete = async (badge: Badge) => {
    if (
      !confirm(t("badges.list.deleteConfirm", "admin", { name: badge.name }))
    ) {
      return;
    }

    try {
      await deleteBadgeMutation.mutateAsync(badge.id);
      // Redirect to badges list after deletion
      router.push("/admin/badges");
    } catch {
      // Error handled by mutation
    }
  };

  const handleAssign = (badgeParam: Badge) => {
    // Open assignment dialog
    // Badge parameter is required by BadgeDetail interface but we use badge from page state
    // Verify badge matches (safety check)
    if (badge && badge.id !== badgeParam.id) {
      console.warn("Badge mismatch in handleAssign");
    }
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentSubmit = async (data: AssignBadgeFormData) => {
    try {
      await assignBadgeMutation.mutateAsync(data);
      // Dialog will close automatically via BadgeAssignmentDialog's handleSubmit
    } catch {
      // Error handled by mutation
      throw new Error("Failed to assign badge");
    }
  };

  const handleRevokeAssignment = async (assignment: BadgeAssignment) => {
    if (!confirm(t("badges.assignments.revokeConfirm", "admin"))) {
      return;
    }

    try {
      await revokeBadgeMutation.mutateAsync({
        assignmentId: assignment.id,
        data: {
          revocationReason: t(
            "badges.assignments.revokedByAdmin",
            "admin",
            {},
            "Revoked by admin",
          ),
        },
      });
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
                {t("admin", "common")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/badges">
                {t("badges.title", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {badge
                  ? badge.name
                  : t("badges.detail.title", "admin", {}, "Badge Detail")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={badge}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {badge
              ? t(
                  "badges.detail.title",
                  "admin",
                  { name: badge.name },
                  badge.name,
                )
              : t("badges.detail.title", "admin", {}, "Badge Detail")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t(
              "badges.detail.description",
              "admin",
              {},
              "Detailed badge information and management",
            )}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("badges.detail.error", "admin", {}, "Error")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Badge Detail Component */}
      {badge && (
        <BadgeDetail
          badge={badge}
          isLoading={isLoading}
          assignments={assignmentsData?.result}
          assignmentsLoading={assignmentsLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAssign={handleAssign}
          onRevokeAssignment={handleRevokeAssignment}
          isUpdating={
            updateBadgeMutation.isPending || deleteBadgeMutation.isPending
          }
        />
      )}

      {/* Badge Assignment Dialog */}
      {badge && (
        <BadgeAssignmentDialog
          open={assignmentDialogOpen}
          onOpenChange={setAssignmentDialogOpen}
          badge={badge}
          onSubmit={handleAssignmentSubmit}
          isLoading={assignBadgeMutation.isPending}
        />
      )}
    </div>
  );
}
