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
  BadgeAssignmentsTable,
  BadgeAssignmentDialog,
  BadgeFilters,
  BadgeFormDialog,
  BadgeList,
  BadgeStatisticsCards,
} from "@/components/features/admin/badges";
import {
  useBadgeAssignments,
  useBadgeStatistics,
  useBadges,
  useAssignBadge,
  useCreateBadge,
  useDeleteBadge,
  useRevokeBadge,
  useUpdateBadge,
} from "@/hooks/admin/useBadges";
import type {
  Badge,
  BadgeAssignment,
  GetBadgeDto,
  GetBadgeAssignmentDto,
} from "@/lib/types/badges";
import type {
  AssignBadgeFormData,
  CreateBadgeFormData,
  UpdateBadgeFormData,
} from "@/lib/validators/badges";

/**
 * Badges Management Page
 * Displays badge management interface with statistics, filters, list, and assignments
 */
export default function BadgesPage() {
  const { t } = useI18n();
  const [badgeFilters, setBadgeFilters] = useState<GetBadgeDto>({
    page: 1,
    limit: 20,
  });
  const [assignmentFilters, setAssignmentFilters] = useState<GetBadgeAssignmentDto>({
    page: 1,
    limit: 20,
  });

  // Dialog state
  const [badgeFormOpen, setBadgeFormOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | undefined>();

  const { data: badgesData, isLoading: badgesLoading } = useBadges(badgeFilters);
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useBadgeAssignments(assignmentFilters);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useBadgeStatistics();

  const createBadgeMutation = useCreateBadge();
  const updateBadgeMutation = useUpdateBadge();
  const deleteBadgeMutation = useDeleteBadge();
  const assignBadgeMutation = useAssignBadge();
  const revokeBadgeMutation = useRevokeBadge();

  const handleBadgeFiltersChange = (newFilters: GetBadgeDto) => {
    setBadgeFilters(newFilters);
  };

  const handleCreateBadge = () => {
    setSelectedBadge(undefined);
    setBadgeFormOpen(true);
  };

  const handleBadgeEdit = (badge: Badge) => {
    setSelectedBadge(badge);
    setBadgeFormOpen(true);
  };

  const handleBadgeSubmit = async (
    data: CreateBadgeFormData | UpdateBadgeFormData,
  ) => {
    try {
      if (selectedBadge) {
        await updateBadgeMutation.mutateAsync({
          id: selectedBadge.id,
          data: data as UpdateBadgeFormData,
        });
      } else {
        await createBadgeMutation.mutateAsync(data as CreateBadgeFormData);
      }
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleBadgeDelete = async (badge: Badge) => {
    if (
      !confirm(
        t("badges.list.deleteConfirm", "admin", { name: badge.name }),
      )
    ) {
      return;
    }

    try {
      await deleteBadgeMutation.mutateAsync(badge.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleBadgeAssign = (badge: Badge) => {
    setSelectedBadge(badge);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentSubmit = async (data: AssignBadgeFormData) => {
    try {
      await assignBadgeMutation.mutateAsync(data);
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleAssignmentRevoke = async (assignment: BadgeAssignment) => {
    if (
      !confirm(
        t("badges.assignments.revokeConfirm", "admin"),
      )
    ) {
      return;
    }

    try {
      await revokeBadgeMutation.mutateAsync({
        assignmentId: assignment.id,
        data: {
          revocationReason: t("badges.assignments.revokedByAdmin", "admin"),
        },
      });
    } catch (error) {
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
                {t("badges.breadcrumb.admin", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("badges.breadcrumb.badges", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("badges.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("badges.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Statistics Cards */}
      <BadgeStatisticsCards
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Badge Filters */}
      <AnimatedSection loading={false} data={true}>
        <BadgeFilters
          filters={badgeFilters}
          onFiltersChange={handleBadgeFiltersChange}
        />
      </AnimatedSection>

      {/* Badges List */}
      <BadgeList
        data={badgesData}
        isLoading={badgesLoading}
        onCreate={handleCreateBadge}
        onEdit={handleBadgeEdit}
        onDelete={handleBadgeDelete}
        onAssign={handleBadgeAssign}
      />

      {/* Badge Assignments Table */}
      <BadgeAssignmentsTable
        data={assignmentsData}
        isLoading={assignmentsLoading}
        onRevoke={handleAssignmentRevoke}
      />

      {/* Badge Form Dialog */}
      <BadgeFormDialog
        open={badgeFormOpen}
        onOpenChange={setBadgeFormOpen}
        badge={selectedBadge}
        onSubmit={handleBadgeSubmit}
        isLoading={
          createBadgeMutation.isPending || updateBadgeMutation.isPending
        }
      />

      {/* Badge Assignment Dialog */}
      <BadgeAssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        badge={selectedBadge}
        onSubmit={handleAssignmentSubmit}
        isLoading={assignBadgeMutation.isPending}
      />
    </div>
  );
}

